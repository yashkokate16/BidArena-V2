import bidModel from "../models/bid.model.js"



export let createBid = async (bidData) => {
    return await bidModel.create(bidData)
}

export let getBidsByAuction = async (auctionId) =>{
    return await bidModel
    .find({auctionId})
    .populate("bidderId", "fullName username")
    .sort({amount: -1})
}

export let getMyBids = async (bidderId) => {
    return await bidModel
    .find({bidderId})
    .populate("auctionId")
    .sort({createdAt: -1})
}

