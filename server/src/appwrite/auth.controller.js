import { Client, ID, Account, OAuthProvider } from "appwrite";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const client = new Client()
  .setProject(process.env.APPWRITE_PROJECT_ID || "679a6e2d0021917d3cba")
  .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1");

const account = new Account(client);



const signUpUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    throw new ApiError(400, "All fields are required");
  }

  if (!email.endsWith("@mnnit.ac.in")) {
    throw new ApiError(400, "Only official college emails are allowed");
  }

 

  try {
    const signedUp = await account.create(ID.unique(), email, password);
    return res
      .status(201)
      .json({ message: "Account created successfully", user: signedUp });
  } catch (error) {
    console.error(error);
    throw new ApiError(
      500,
      error.message || "Something went wrong during signup"
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    throw new ApiError(400, "All fields are required");
  }

  if (!email.endsWith("@mnnit.ac.in")) {
    throw new ApiError(400, "Only official college emails are allowed");
  }

  try {
    const session = await account.createEmailPasswordSession(email, password);
    return res.status(200).json({ message: "Login successful", session });
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ error: "Invalid credentials or login failed" });
  }
});

const emailVerification = asyncHandler(async (req, res) => {
  const { userId, secret } = req.body;

  if (!userId || !secret) {
    throw new ApiError(400, "All fields are required");
  }

  try {
    const verification = await account.updateVerification(userId, secret);
    return res
      .status(200)
      .json({ message: "Email verified successfully", verification });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Email verification failed" });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { userId, secret, newPassword } = req.body;

  if (!userId || !secret || !newPassword) {
    throw new ApiError(400, "userId, secret, and new password are required");
  }

  validatePassword(newPassword);

  try {
    const reset = await account.updateRecovery(userId, secret, newPassword); // Ensure Appwrite method
    return res
      .status(200)
      .json({ message: "Password reset successfully", reset });
  } catch (error) {
    console.error(error);
    throw new ApiError(500, error.message || "Password reset failed");
  }
});

const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "College email is required");
  }

  try {
    const recovery = await account.createRecovery(email, "/"); 
    return res
      .status(200)
      .json({ message: "Password recovery email sent", recovery });
  } catch (err) {
    console.error(err);
    throw new ApiError(500, "Password recovery failed");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const currentUser = await account.get();
    return res.status(200).json({ user: currentUser });
  } catch (error) {
    console.error(error);
    throw new ApiError(500, error.message || "Failed to get current user");
  }
});

const loginGoogle=asyncHandler(async()=>{
  try{
    await account.createOAuth2Session("google","http://localhost:5173/","/failure_url")

  }catch(err){
    console.error("Login failed", err)
  }

})




 








export {
  signUpUser,
  loginUser,
  emailVerification,
  resetPassword,
  forgetPassword,
  getCurrentUser,
};
