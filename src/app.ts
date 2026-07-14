import express from "express";
import userRoute from "./routes/user.route";

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Working");
});

app.use("/api/users", userRoute);

export default app;
