/*
This file contains controller (CRUD) functions for the Lead model.
Author(s): David Morales
Last Modified: 09/05/2023
 */

const { checkEmail, isNumber } = require("../utilities/validators");
const { getNextSequence } = require("../utilities/counters");
const Lead = require("../models/Lead");

/**
 * This function creates a Lead document.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.createLead = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.estimatedSaleAmount ||
    !req.body.status
  ) {
    return res.status(400).send("There's something wrong with this request.");
  }
  try {
    const name = req.body.name;
    const email = req.body.email;
    const estimatedSaleAmount = req.body.estimatedSaleAmount;
    const status = req.body.status;
    const commissionRate = 0.05; //Defining commission rate

    if (!checkEmail(email)) {
      //Checks if email is a valid email string
      return res.status(400).send("Email is not a valid email.");
    }

    if (!isNumber(estimatedSaleAmount)) {
      //Checks if estimated sales amount is a valid number
      return res.send(400).send("Estimated sale amount is not a valid number.");
    }

    let estimatedSalesCommission = 0;

    if (status !== "unqualified") {
      //Calculates estimated sales commission if status is not qualified
      estimatedSalesCommission = Math.round(
        parseInt(estimatedSaleAmount) * commissionRate
      );
    }

    const id = await getNextSequence("lead"); //Gets next incremental id since MongoDB does not support it out of the box.

    const newLead = await Lead.create({
      //Creates Lead document in the database
      id: id,
      name: name,
      email: email,
      status: status,
      estimatedSaleAmount: parseInt(estimatedSaleAmount),
      estimatedCommission: estimatedSalesCommission,
    });

    return res.status(201).send("New lead successfully created!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("There was a server error.");
  }
};

/**
 * This function gets a Lead document by using its ID.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.getLeadById = async (req, res) => {
  if (!req.params["id"]) {
    return res.status(400).send({
      result: false,
      msg: "Error. Something is wrong with this request.",
    });
  }

  try {
    const id = req.params["id"];

    if (!isNumber(id)) {
      //Checks if ID is number
      return res.status(400).send("Invalid ID.");
    }

    const filter = {
      id: id,
    };
    const lead = await Lead.findOne(filter);

    if (!lead) {
      //Checks if lead exists in DB.
      return res.status(404).send("Lead not found!");
    }

    return res.send(lead);
  } catch (err) {
    console.error(err);
    return res.status(500).send("There was a server error.");
  }
};

/**
 * This function gets all Lead documents in the database.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @returns {Promise<void>}
 * @author David Morales
 */
exports.getLeads = async (req, res) => {
  try {
    const filter = {};
    const leads = await Lead.find(filter);

    return res.send(leads);
  } catch (err) {
    console.error(err);
    return res.status(500).send("There was a server error.");
  }
};

/**
 * TODO: This function gets Leads from the database using pagination and sorting
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @returns {Promise<void>}
 * @author David Morales
 */
exports.getLeadsByPagination = async (req, res) => {
  try {
    const chunk_index = req.body.chunk_index; //The index of current chunk of entries
    const limit = req.body.limit || 10; //Limits the number of entries
    const sort = req.body.sort || "0"; //Sets sort settings
    const filter = {};
    let sort_query = {};

    switch (
      sort //Checks query code and assigns different kinds of sort
    ) {
      case "0":
        sort_query = { createdAt: 1 };
        break;
      case "1":
        sort_query = { createdAt: -1 }; //Descending order
        break;
      default:
        sort_query = { createdAt: 1 };
    }

    const query_count = await Lead.countDocuments(filter); //Gets total count of Leads in DB

    const leads = await Lead.find(filter)
      .skip(chunk_index)
      .limit(limit) //For pagination purposes
      .sort(sort_query);

    return res.send({ count: query_count, data: leads });
  } catch (err) {
    console.error(err);
    return res.status(500).send("There was a server error.");
  }
};

/**
 * This function updates a Lead document and validates inputs.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.updateLeadById = async (req, res) => {
  if (!req.params["id"] || !req.body.update_obj) {
    return res.status(400).send({
      result: false,
      msg: "Error. Something is wrong with this request.",
    });
  }

  try {
    const id = req.params["id"];

    if (!isNumber(id)) {
      //Checks if ID is number
      return res.status(400).send("Invalid ID.");
    }

    const filter = {
      id: id,
    };
    const updateObj = req.body.update_obj;

    if (updateObj?.email && !checkEmail(updateObj?.email)) {
      //Checks if email is a valid email string
      return res.status(400).send("Email is not a valid email.");
    }

    if (
      updateObj?.estimatedSaleAmount &&
      !isNumber(updateObj?.estimatedSaleAmount)
    ) {
      //Checks if estimated sale amount is an actual number
      return res.status(400).send("Sales amount is not a valid number.");
    }

    if (updateObj?.estimatedSaleAmount || updateObj?.status) {
      //Checks if status or sale amount changed to recalculate commission
      const commissionRate = 0.05; //Defining commission rate
      const lead = await Lead.findOne({ id: id });
      const estimatedSaleAmount =
        updateObj?.estimatedSaleAmount || lead?.estimatedSaleAmount;
      const status = updateObj?.status || lead?.status;
      let estimatedSaleCommission = 0;

      if (status === "unqualified") {
        updateObj.estimatedCommission = 0;
      } else {
        //Calculates estimated sales commission if status is qualified
        estimatedSaleCommission = Math.round(
          parseInt(estimatedSaleAmount) * commissionRate
        );
        updateObj.estimatedCommission = estimatedSaleCommission;
      }
    }

    await Lead.updateOne(filter, updateObj);

    return res.send("Lead successfully updated!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("There was a server error.");
  }
};

/**
 * This function deletes a Lead document from the database
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.deleteLeadById = async (req, res) => {
  if (!req.params["id"]) {
    return res.status(400).send({
      result: false,
      msg: "Error. Something is wrong with this request.",
    });
  }

  try {
    const id = req.params["id"];

    if (!isNumber(id)) {
      //Checks if ID is number
      return res.status(400).send("Invalid ID.");
    }

    const filter = {
      id: parseInt(id),
    };

    await Lead.deleteOne(filter);

    return res.send("Lead has been deleted!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("There was a server error.");
  }
};
