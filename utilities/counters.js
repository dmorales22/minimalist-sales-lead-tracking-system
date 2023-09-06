/*
This file contains helper functions used for counters.
Author(s): David Morales
Last Modified: 09/05/2023
 */
const Counter = require("../models/Counter");

/**
 * This function gets the index of collection by looking up the counter in the DB.
 * @param name - Name of the collection to get the next sequential index of
 * @returns {Promise<*>}
 */
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
  } catch (err) {
    console.error(err)
    return null
  }
}

module.exports = {
  getNextSequence,
};
