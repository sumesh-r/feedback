//  this method will run a give function within
// a try catch block and will return the appropriate value

// mostly used to handle queries to the db
const tryCatch = async (someFunction) => {
  let returnValue;
  try {
    returnValue = await someFunction;
  } catch (error) {
    console.log(error);
    returnValue =  {
      notOkay: "error",
      value: error,
    };
  }
  return returnValue
};

module.exports = { tryCatch };
