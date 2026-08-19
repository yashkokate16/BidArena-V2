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

