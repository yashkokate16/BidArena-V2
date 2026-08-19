import express from "express";
import * as auctionController from "../controller/auction.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js";

const auctionRouter = express.Router();

auctionRouter.post("/",authMiddleware, auctionController.createAuction);
auctionRouter.get("/all-auctions", auctionController.getAllAuctions)
auctionRouter.get("/:id", auctionController.getAuctionById)
auctionRouter.patch("/:auctionId", authMiddleware, auctionController.updateAuction)
auctionRouter.delete("/:auctionId", authMiddleware, auctionController.deleteAuction)
auctionRouter.patch("/:auctionId/end", authMiddleware,auctionController.endAuction)



export default auctionRouter;


