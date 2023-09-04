/*
This file contains controller (CRUD) functions for the Lead model.
Author(s): David Morales
Last Modified: 09/04/2023
 */

const { checkEmail, isNumber } = require("../utilities/validators");
const Lead = require("../models/Lead");

/**
 *
 * @param req
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
    let estimatedSalesCommission = 0;
    const commissionRate = 0.05; //Defining commission rate

    if (checkEmail(email)) {
      //Checks if email is a valid email string
      return res.send(400).send("Email is not a valid email.");
    }

    if (isNumber(estimatedSaleAmount)) {
      //Checks if estimated sales amount is a valid number
      return res.send(400).send("Estimated sale amount is not a valid number.");
    }

    if (status !== "unqualified") {
      //Calculates estimated sales commission if status is qualified
      estimatedSalesCommission = Math.round(
        parseInt(estimatedSaleAmount) * commissionRate
      );
    }

    const newLead = await Lead.create({
      name: name,
      email: email,
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
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.getLeadById = async (req, res) => {
  if (!req.body.id) {
    return res.status(400).send({
      result: false,
      msg: "Error. Something is wrong with this request.",
    });
  }

  try {
    const id = req.body.id;
    const filter = {
      id: id,
    };
    const lead = await Lead.findOne(filter);

    if (!lead) {
      return res.status(404).send("Lead not found!");
    }

    return res.send(lead);
  } catch (err) {
    console.error(err);
    return res.status(500).send("There was a server error.");
  }
};

/**
 * This function gets all contacts in the database
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
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.updateLeadById = async (req, res) => {
  if (!req.body.id || !req.body.update_obj) {
    return res.status(400).send({
      result: false,
      msg: "Error. Something is wrong with this request.",
    });
  }

  try {
    const id = req.body.id;
    const update_obj = req.body.update_obj;
  } catch (err) {
    console.error(err);
    return res.status(500).send("There was a server error.");
  }
};

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.deleteLeadById = async (req, res) => {
  if (!req.body.id) {
    return res.status(400).send({
      result: false,
      msg: "Error. Something is wrong with this request.",
    });
  }

  try {
    const id = req.body.id;
    const filter = {
      id: id,
    };

    const result = await Lead.deleteOne(filter);

    return res.send("Lead has been deleted!");
  } catch (err) {
    console.error(err);
    return res.status(500).send("There was a server error.");
  }
};
