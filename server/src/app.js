import express from "express";
import authRouter from "./routes/auth.route.js";
import auctionRouter from "./routes/auction.routes.js";
import bidRouter from "./routes/bid.routes.js"
import cookieParser from "cookie-parser";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




app.get("/health", (req, res) =>{
    return res.status(200)
    .json({
        success: true,
        message: "Server is healthy"
    })
})

app.use("/api/auth", authRouter);

app.use("/api/auctions", auctionRouter)

app.use("/api/bids", bidRouter)


export default app;


