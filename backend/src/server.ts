import express, { Request, Response, Express, application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import { errorHandler } from "./middlewares/error.middleware"
import userRouter from "./routes/user.routes";
import sellerRouter from "./routes/seller.routes";
import buyerRouter from "./routes/buyer.routes";
import productRouter from "./routes/product.routes";
import orderRouter from "./routes/order.routes";

dotenv.config();

const app: Express = express();

const port = process.env.PORT || 9000;

// connect to mongo db
mongoose.connect(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions).then((res: unknown): void => console.log("connected to mongo db"))
    .catch((err: unknown): void => console.log(err))

// middlewares
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json());

// test route
app.get("/", (req: Request, res: Response): void => {
    res.json({
        success: true,
        message: "typescript server running"
    });
});

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/buyer", buyerRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);

app.use(errorHandler);
// connect
app.listen(port, (): void => console.log(`running on port ${port}`));
