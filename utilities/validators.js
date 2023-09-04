function checkEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

function isNumber(str) {
  return !isNaN(str);
}

module.exports = {
  checkEmail,
  isNumber,
};
