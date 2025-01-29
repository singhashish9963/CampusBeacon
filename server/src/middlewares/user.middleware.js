import { Client, Account } from "appwrite";
import ApiError from "../utils/apiError.js";

export const authMiddleware = async (req, res, next) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

  const account = new Account(client);

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const jwt = authHeader.split(" ")[1];
    if (!jwt) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Validate the JWT by checking the current session
    const user = await account.updateSession("current", jwt); // Update session based on JWT

    req.user = {
      id: user.$id,
      email: user.email,
      login: user.email.split("@")[0],
      verified: user.emailVerification || false,
    };

    next();
  } catch (error) {
    next(
      new ApiError(error.code || 401, error.message || "Authentication failed")
    );
  }
};

export default authMiddleware;
