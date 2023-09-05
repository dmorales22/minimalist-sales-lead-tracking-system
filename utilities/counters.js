/*
This file contains helper functions used for counters.
Author(s): David Morales
Last Modified: 09/03/2023
 */
const Counter = require("../models/Counter");

async function getNextSequence(name) {
  try {
    const filter = {
      name: name,
    };
    const counter = await Counter.findOneAndUpdate(
      filter,
      {
        $inc: { seq: 1 },
      },
      { new: true, upsert: true }
    );

    return counter.seq;
  } catch (err) {}
}

module.exports = {
  getNextSequence,
};
