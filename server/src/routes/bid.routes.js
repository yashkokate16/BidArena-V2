import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import * as bidController from "../controller/bid.controller.js"

let bidRouter = express.Router()


bidRouter.get("/my-bids", authMiddleware, bidController.getMyBids)
bidRouter.post("/:auctionId",  authMiddleware, bidController.createBid)
bidRouter.get("/:auctionId", bidController.getBidsByAuction)



export default bidRouter;