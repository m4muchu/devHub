const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.filedOfStudy = !isEmpty(data.filedOfStudy) ? data.filedOfStudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (Validator.isEmpty(data.school)) {
    errors.school = "School field is required";
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Degree field is required";
  }

  if (Validator.isEmpty(data.filedOfStudy)) {
    errors.filedOfStudy = "Field of study field is required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "from field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
