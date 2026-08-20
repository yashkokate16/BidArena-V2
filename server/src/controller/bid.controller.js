import * as bidService from "../services/bid.service.js"
import ApiError from "../utils/Api.Error.js";


export let createBid = async (req, res) => {

    console.log("createbid controller called");

    try {

        let { auctionId } = req.params;
        console.log("auctionId:", auctionId);

        let { amount } = req.body;
        console.log("amount:", amount);

        let bidderId = req.userId;
        console.log("bidderId:", bidderId);

        let bid = await bidService.createBid(
            auctionId,
            bidderId,
            amount
        );

        return res.status(201).json({
            success: true,
            message: "Bid placed successfully",
            bid
        });

    } catch (error) {

        console.error("error in createbid controller", error);

        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export let getBidsByAuction = async(req, res) =>{
    console.log("get bids controller called");
    try{
        let { auctionId } = req.params;

        let bids = await bidService.getBidsByAuction(auctionId)

        return res.status(200).json({
            success: true,
            message: "Bids fetched successfully",
            bids
        });

    } catch(error){
        console.error("Error in get bids controller:", error);

        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export let getMyBids = async (req, res) =>{
    console.log("get ny bids controller called")
    try{

        let bidderId = req.userId;

        let bids = await bidService.getMyBids(bidderId)

        return res.status(200).json({
            success: true,
            message: "Your bids fetched successfully",
            bids
        }); 
    } catch(error) {
        console.error(
            "Error in get my bids controller:",
            error
        );

        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}