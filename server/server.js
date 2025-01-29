import express from "express"
import dotenv from "dotenv"
import sequelize from "./src/db/db.js";

dotenv.config({path:"./.env"});

const app=express();

const PORT=process.env.PORT || 5000


sequelize
  .authenticate()
  .then(()=>{
    console.log("Connection has been established  successfully.");
  })
  .catch((err)=>{
    console.error("Unable to connect to the database ", err)
  });



app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`)

})