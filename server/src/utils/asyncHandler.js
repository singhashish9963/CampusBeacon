/*
===================================================================================================
        To wrap everything in this promise to avoid using try and catch again and again
===================================================================================================
*/

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
