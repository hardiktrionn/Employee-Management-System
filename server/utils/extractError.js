const extractError = (error) => {
  const formattedErrors = {};
  error.forEach((err) => {

    if (!formattedErrors[err.path]) {
      formattedErrors[err.path] = err.msg;
    }
  });

  return formattedErrors;
};
module.exports = extractError;
