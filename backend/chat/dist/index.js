import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chat.js";
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
// routes
app.use("/api/v1", chatRoutes);
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`chat service is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map