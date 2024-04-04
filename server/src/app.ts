import notFoundMiddleware from "./middlewares/not-found";
import errorHandlerMiddleware from "./middlewares/error-handler";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import productRouter from "./routes/product.routes";
import cartRouter from "./routes/cart.routes";
import express from "express";
import connectDB from "./db/connect";
import logger from "./utils/logger";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";
const file = fs.readFileSync(`${__dirname}/documents/swagger.yaml`, "utf8");
const file2 = fs.readFileSync(`${__dirname}/documents/petSwagger.yaml`, "utf8");
5;
const swaggerDocument = YAML.parse(file);
const swaggerDocument2 = YAML.parse(file2);
import path from "path";

dotenv.config();

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  "/profile",
  express.static(path.join(__dirname, "/uploads/images/profile"))
);
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logger);

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL as string;

app.get("/", (req, res) => {
  res.send(path.join(__dirname, "/uploads/images/"));
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const startServer = async () => {
  try {
    await connectDB(MONGO_URL);
    app.listen(PORT, () => {
      console.log(`server is running on port : ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
