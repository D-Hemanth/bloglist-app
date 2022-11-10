// next - next function yields control to the next middleware or function or route
const errorHandler = (error, request, response, next) => {
  // console.error(error.message);
  // console.error('ERROR NAME:', error.name);
  // console.error('ERROR FULL', error);

  // error handler checks if the error is a CastError exception
  if (error.name === 'SequelizeDatabaseError') {
    // console.log(error);
    return response
      .status(400)
      .send({ error: 'malformatted id in the address url' });
  }
  // error handler checks if the error is a ValidationError exception from the note schema
  else if (error.name === 'SyntaxError') {
    return response.status(400).json({
      error:
        'check the syntax & data type of required fields in your request submission data',
    });
  } else if (error.name === 'SequelizeValidationError') {
    const errorTypeName = error.errors[0].validatorName;
    const errorMessage = error.errors[0].message;

    if (errorTypeName === 'isEmail') {
      return response.status(400).send({
        error: [errorMessage],
      });
    }
  }

  next(error);
};

module.exports = errorHandler;
