import express from "express";
import routes from "./routes";
import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const upload = multer();

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});

// Apply CORS middleware early and handle preflight requests
app.use(cors({ origin: "*" }));

// Explicitly handle preflight requests
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.any());

app.use("/", routes());
