import auctionModel from "../models/auction.model.js";

export const createAuction = async (auctionData) => {
    return await auctionModel.create(auctionData);
};

export let getAllAuctions = async () =>{
    return await auctionModel.find()
    .sort({createdAt: -1})
}


export let getAuctionById = async (auctionId) =>{
    return await auctionModel.findById(auctionId)
}


export let updateAuction = async (auctionId, updateData) => {
    return await auctionModel.findByIdAndUpdate(
        auctionId,
        updateData,
        {
            new:true,
            runValidators: true

        }
    )
}

export let deleteAuction = async (auctionId, userId) => {
    return auctionModel.findByIdAndDelete(auctionId)
}