import leoProfanity from "leo-profanity";
import ApiError from "../utils/apiError.js";


export const filterInputMiddleware = (req, res, next) => {

  const keysToCheck = [
    "text",
    "message",
    "name",
    "comment",
    "review",
    "title",
    "description",
    "body",
    "content",
    "subject",
    "username",
    "bio",
    "feedback",
  ];

  for (const key of keysToCheck) {
    if (req.body[key] && typeof req.body[key] === "string") {
      if (leoProfanity.check(req.body[key])) {

        return next(
          new ApiError(`The ${key} field contains offensive language`, 400)
        );
      }
    }
  }

  // If no offensive language is detected, proceed to the next middleware
  next();
};

export default filterInputMiddleware;
