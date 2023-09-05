/*
This file contains the Lead model and schema.
Author(s): David Morales
Last Modified: 09/03/2023
 */

const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      index: true,
    },
    name: String,
    status: String,
    email: String,
    estimatedSaleAmount: Number,
    estimatedCommission: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema, "Lead");
