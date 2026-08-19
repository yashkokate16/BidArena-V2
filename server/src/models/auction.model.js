import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            type: String,
            default: "",
        },

        startingPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        currentPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        startTime: {
            type: Date,
            required: true,
        },

        endTime: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["upcoming", "live", "ended"],
            default: "upcoming",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const auctionModel = mongoose.model("Auction", auctionSchema);

export default auctionModel;