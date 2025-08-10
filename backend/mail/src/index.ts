import dotenv from "dotenv";
dotenv.config();
import { connectRabbitMQ, startSendOtpConsumer } from "./consumer.js";

const startApp = async () => {
  await connectRabbitMQ();   // Connect and initialize channel
  await startSendOtpConsumer(); // Now start consuming messages
};

startApp();

import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`email service is running on port ${PORT}`);
});
