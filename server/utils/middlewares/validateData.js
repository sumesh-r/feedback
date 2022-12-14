// it is a middleware that takes schema and the req.body to validata the data
function validateData(ajvValidate) {
  return (req, res, next) => {
    const valid = ajvValidate(req.body);
    if (!valid) {
      // it is imperative that the reference to the errors is copied
      // the next time ajv runs the errors object could be overridden
      // because under the hood it is just a pointer
      // that's why the reference needs to be copied in the same execution
      // block. Note that Node is single-threaded and you do not have
      // concurrency
      // in this simple example it would work without copying
      // simply because we are directly terminating the request with
      // res.status(400).json(...)
      // but in general copying the errors reference is crucial
      const errors = ajvValidate.errors;
      return res.status(400).json(errors);
    }
    next();
  };
}

module.exports = validateData