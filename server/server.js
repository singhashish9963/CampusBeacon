import express from "express";
import dotenv from "dotenv";
import sequelize from "./src/db/db.js";
import userRoutes from "./src/routes/user.routes.js";
import cors from "cors"
dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;


app.use(
  cors({
    origin: "http://localhost:5174", 
    credentials: true, 
  })
);



app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database ", err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
