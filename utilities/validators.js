/*
This file contains helper functions used for validation and checks.
Author(s): David Morales
Last Modified: 09/03/2023
 */

/**
 * This function checks if string is a valid email string.
 * @param {string} email
 * @returns {boolean}
 * @author David Morales
 */
function checkEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

/**
 * This function checks if string is a valid number.
 * @param {string} str
 * @returns {boolean}
 * @author David Morales
 */
function isNumber(str) {
  return !isNaN(str);
}

module.exports = {
  checkEmail,
  isNumber,
};
