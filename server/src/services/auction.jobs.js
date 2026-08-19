import * as auctionDao from "../dao/auction.dao.js"
import * as auctionService from "../services/auction.service.js"

export let startAuctionJob = () => {

     setInterval(async () =>{
        try{
            console.log("checking auctions")
            let auctions = auctionDao.getAllAuctions()

            for(auction of auctions){
                let now = new Date()

                  if (
                    auction.status === "upcoming" &&
                    now >= new Date(auction.startTime)
                ) {
                    await auctionService.updateAuctionStatus(
                        auction._id
                    );

                    console.log(
                        `Auction ${auction._id} is now live`
                    );
                }

                // Auction has ended
                if (
                    auction.status === "live" &&
                    now >= new Date(auction.endTime)
                ) {
                    await auctionService.endAuction(
                        auction._id
                    );

                    console.log(
                        `Auction ${auction._id} has ended`
                    );
                }
            }

        } catch (error) {

            console.error(
                "Auction job error:",
                error
            );

        }

    }, 60 * 1000);
};
