/*
This file contains controller (CRUD) functions for the Lead model.
Author(s): David Morales
Last Modified: 09/03/2023
 */

const { checkEmail, isNumber } = require("../utilities/validators");
const { getNextSequence } = require("../utilities/counters");
const Lead = require("../models/Lead");

/**
 * This function creates a Lead document.
 * @param {string} req.body.name
 * @param {string} req.body.email
 * @param {string} req.body.estimatedSalesAmount
 * @param {string} req.body.status
 * @param res
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
 * This function gets a lead document by using its ID.
 * @param req
 * @param res
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
 * This function gets all leads in the database.
 * @param req
 * @param res
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
 * This function updates a Lead document.
 * @param req
 * @param res
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
 * @param req
 * @param res
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

    const result = await Lead.deleteOne(filter);

    return res.send("Lead has been deleted!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("There was a server error.");
  }
};
