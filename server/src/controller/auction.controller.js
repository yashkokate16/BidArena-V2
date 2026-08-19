import { json, success } from "zod";
import * as auctionService from "../services/auction.service.js"
import ApiError from "../utils/Api.Error.js";



export let createAuction = async(req, res) => {
    console.log("create auction controller called")
    console.log("body",req.body)
    try{
         let {
            title,
            description,
            image,
            startingPrice,
            startTime,
            endTime
        } = req.body;

        let createdBy = req.userId;

        let auctionData = {
            title,
            description,
            image,
            startingPrice,
            startTime,
            endTime,
            createdBy
        };
        console.log("auctionData", auctionData)
        let auction = await auctionService.createAuction(auctionData)

        return res.status(201).json({
            success:true,
            message:"Auction created successfully",
            auction
        })


    } catch(error) {
        console.error("error in auction controller", error);

    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success:false,
        message:"Internal server error"
    })
    }
}


export let getAllAuctions = async (req, res) =>{
    try{
        let auctions = await auctionService.getAllAuctions();

        return res.status(200).json({
            success:true,
            auctions,
            message:"Auctions fetched successfully"
        })

    } catch(error) {
        console.error("error in get all auction controller ", error);

    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success:false,
        message:"Internal server errror"
    })
    }
}


export let getAuctionById = async (req, res) =>{
    try{
       

        let auction = await auctionService.getAuctionById(req.params.id)

        return res.status(200).json({
            success:true,
            auction,
            message:"Auction Fetched successfully"
        })


    } catch(error){
         console.error("error in get auction by Id ", error);

    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success:false,
        message:"Internal server errror"
    })
    }
}


export let updateAuction = async (req, res) => {
    try{
        let auctionId = req.params.auctionId
        let auction = await auctionService.updateAuction(
            auctionId, 
            req.userId, 
            req.body
        )

        return res.status(200).json({
            success: true,
            message: "Auction updated successfully",
            auction
        });

    } catch(error) {
          console.error("Error in update auction controller", error);

    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success:false,
        messgae:"internal server error"
    })
    }
}

export let deleteAuction = async (req, res) => {

    try{
        let auctionId = req.params.auctionId

        let userId = req.userId

        let auction = await auctionService.deleteAuction(auctionId, userId)

        return res.status(200).json({
            success:true,
            auction,
            messgae:"Auction delete successfully"
        })
    } catch(error){
        console.error("error in delete controller", error);

    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success:true,
        messgae:"Internal server error"
    })     

    }   
}

export let endAuction = async (req, res) =>{
    console.log("end auction controller called")

    try{
        let { auctionId } = req.params

        let auction = await auctionService.endAuction(auctionId)

        return res.status(200).json({
            success: true,
            message: "Auction ended successfully",
            auction
        });


    } catch(error){
        console.error("Error in end auction controller:", error);

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