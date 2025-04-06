import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./routes/user.routes.js";
import pcRouter from "./routes/pc.routes.js";
import rentPcRouter from "./routes/rentpc.routes.js";
import orderRouter from "./payment/payment.routes.js";

const app = express();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));

// Routes
app.get("/api/test", (req, res) => {
  res.send("Welcome to the Rental PC Backend!");
});

app.use("/api/user", userRouter);
app.use("/api/pc", pcRouter);
app.use("/api/rent", rentPcRouter);
app.use("/api/order", orderRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Export the app
export default app;
