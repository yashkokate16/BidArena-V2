import * as auctionDao from "../dao/auction.dao.js"
import * as bidDao from "../dao/bid.dao.js"
import ApiError from "../utils/Api.Error.js";
import { getIo } from "../socket/socket.server.js";

export let createBid = async (auctionId, bidderId, amount) =>{
    console.log("service called createbid")

    let auction = await auctionDao.getAuctionById(auctionId)
    console.log(auction)

    if(!auction) {
        throw new ApiError(
            404,
            "Auction not found"
        )
    }
    if (auction.createdBy.toString() === bidderId.toString()) {
        throw new ApiError(
            403,
            "You cannot bid on your own auction"
        );
    }

    if(new Date() < new Date(auction.startTime)) {
        throw new ApiError(
            400,
            "Auction has not started"
        )
    }

  if(new Date() >= new Date(auction.endTime)) {
        throw new ApiError(
            400,
            "Auction has ended"
        )
    }

  

     if (amount === undefined || amount === null) {
        throw new ApiError(
            400,
            "Bid amount is required"
        );
    }

    if(amount <= auction.currentPrice){
        throw new ApiError(
            400,
            `Bid must be higher than current price ${auction.currentPrice}`

        )
    }
    






    let bid = await bidDao.createBid({
        auctionId,
        bidderId,
        amount
    })

    auction.currentPrice = amount;

    await auction.save()

    let io = getIo()

    io.to(`auction:${auctionId}`).emit("newBid",{
        bid,
        currentPrice: auction.currentPrice
    })
    return bid
}

export let getBidsByAuction = async (auctionId) =>{

    let auction = await auctionDao.getAuctionById(auctionId)

    if(!auction) {
        throw new ApiError(
            404,
            "Auction not found"
        )
    }

    let bids = await bidDao.getBidsByAuction(auctionId)
    
    return bids

}

export let getMyBids = async (bidderId) =>{
    let bids = await bidDao.getMyBids(bidderId);
    return bids;
}


