import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./DB/index.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("server listening on port: " + PORT);
    });
  })
  .catch(() => {
    console.log("Error in connecting mongodb instance!!");
  });
