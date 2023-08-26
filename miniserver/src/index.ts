import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const { PORT } = process.env;

// Check that if there is an environment variable to change the port that it's an integer
if (PORT && isNaN(parseInt(PORT))) {
  throw new Error("PORT must be an integer");
}
const port = parseInt(PORT || "3000");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
