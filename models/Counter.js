/*
This file contains the Counter model and schema.
Author(s): David Morales
Last Modified: 09/03/2023
 */

const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      index: true,
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Counter", CounterSchema, "Counter");
