import express from "express";
import authRouter from "./routes/auth.route.js";
import auctionRouter from "./routes/auction.routes.js";
import bidRouter from "./routes/bid.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import env from "./config/env.js"


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin:env.CLIENT_URL,
        credentials:true,
    })
)



app.get("/", (req, res) =>{
    return res.status(200)
    .json({
        success: true,
        message: "BidArena Server is healthy"
    })
})

app.use("/api/auth", authRouter);

app.use("/api/auctions", auctionRouter)

app.use("/api/bids", bidRouter)


export default app;


