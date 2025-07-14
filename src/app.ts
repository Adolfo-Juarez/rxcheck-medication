import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./medication/infrastructure/router";

dotenv.config();

const APP_PORT = process.env.PORT || 3000;
const server = express();

server.use(
  cors({
    origin: ["*"],
    methods: ["*"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
server.use(express.json());

server.use("/medication", router);

server.listen(APP_PORT, () => {
  console.log(`Server running on port ${APP_PORT}`);
});
