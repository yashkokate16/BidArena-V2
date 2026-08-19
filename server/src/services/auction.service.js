import * as auctionDao from "../dao/auction.dao.js"
import auctionModel from "../models/auction.model.js";
import ApiError from "../utils/Api.Error.js"

export let createAuction = async (auctionData) => {
    
const {
        title,
        description,
        image,
        startingPrice,
        startTime,
        endTime,
        createdBy
    } = auctionData;

if (
        !title ||
        !description ||
        startingPrice === undefined ||
        !startTime ||
        !endTime ||
        !createdBy
    ) {
        throw new ApiError(
            400,
            "All required auction fields are required"
        );
    }


    if(startingPrice < 0) {
        throw new ApiError(
            400,
            "Starting price cannot be negative"

        )
    }

    if(new Date(endTime) <= new Date(startTime)) {
        throw new ApiError(
            400,
            "ENd time must be after start time"
        )
    }
    console.log("hiiii")

    let auction = await auctionDao.createAuction({
        title,
        description,
        image,
        startingPrice,
        currentPrice: startingPrice,
        startTime,
        endTime,
        createdBy
    });

    return auction;



}


export let getAllAuctions = async () => {
   return await auctionDao.getAllAuctions()

}

export let getAuctionById = async (auctionId) =>{

    let auction = await auctionDao.getAuctionById(auctionId)

    if(!auction) {
        throw new ApiError(
            400,
            "Auction not found"
        )
    }

    return auction
}

export let updateAuction = async (auctionId, userId, updatedata) =>{

    let auction = await auctionDao.getAuctionById(auctionId);
     
  
    if(!auction) {
        throw new ApiError(
            400,
            "Auction not found"
        )
    }
    if(auction.createdBy.toString() !== userId.toString()) {
        throw new ApiError(
            403,
            "YOU are not allowed to update this auction"
        )
    }
    const allowedFields = [
        "title",
        "description",
        "image",
        "startingPrice",
        "startTime",
        "endTime"
    ];

    let filteredData ={}

    for(let field of allowedFields) {
        if(updatedata[field] !== undefined) {
              filteredData[field] = updatedata[field]
        }
    }

    if (Object.keys(filteredData).length === 0) {
        throw new ApiError(
            400,
            "No valid fields provided for update"
        );
    }

    if (
        filteredData.startingPrice !== undefined &&
        filteredData.startingPrice < 0
    ) {
        throw new ApiError(
            400,
            "Starting price cannot be negative"
        );
    }

    const startTime =
        filteredData.startTime ?? auction.startTime;

    const endTime =
        filteredData.endTime ?? auction.endTime;

    if (new Date(endTime) <= new Date(startTime)) {
        throw new ApiError(
            400,
            "End time must be after start time"
        );
    }

    let updateAuction = await auctionDao.updateAuction(auctionId, filteredData)

    return updateAuction

}

export let deleteAuction = async (auctionId, userId) =>{

    

    let auction = await auctionModel.findById(auctionId)
    
    if(!auction) {
        throw new ApiError(
            404,
            "Auction not Found"
        )
    }

    if(auction.createdBy.toString() !== userId.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to delete the auction"
        )
    }
    let deleteAuction = await auctionDao.deleteAuction(auctionId)

    return deleteAuction
}


export let updateAuctionStatus = async (auctionId) => {
    let auction = await auctionDao.getAuctionById(auctionId)

    if(!auction) {
        throw new ApiError (
            404,
            "Auction not found"
        )
    }

    let now = new Date();

    if(now < new Date(auction.startTime)) {
        auction.status ="upcoming"

    } else if (
        now >= new Date(auction.startTime) && 
        now < new Date(auction.endTime) 
    ) {
            auction.status = "live"

    } else {
        auction.status = "ended"
    }

    await auction.save();
    return auction


} 


export const endAuction = async (auctionId) => {

    const auction = await auctionDao.getAuctionById(auctionId);

    if (!auction) {
        throw new ApiError(
            404,
            "Auction not found"
        );
    }

    // Already ended
    if (auction.status === "ended") {
        throw new ApiError(
            400,
            "Auction has already ended"
        );
    }

    // Make sure auction time is actually over
    if (new Date() < new Date(auction.endTime)) {
        throw new ApiError(
            400,
            "Auction has not ended yet"
        );
    }

    // Find all bids
    const bids = await bidDao.getBidsByAuction(auctionId);

    // No bids
    if (bids.length === 0) {
        auction.status = "ended";
        auction.winner = null;

        await auction.save();

        return auction;
    }

    // Highest bid is first because our DAO sorts by amount -1
    const highestBid = bids[0];

    auction.status = "ended";
    auction.winner = highestBid.bidderId._id;

    await auction.save();

    return auction;
};