import express from "express"
import dotenv from "dotnev"

const app=express();

const PORT=process.env.PORT || 5000

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(PORT,()=>{
    console.log(`Server is listening on port ${PORT}`)

})