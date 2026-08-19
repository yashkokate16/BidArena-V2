import app from './src/app.js';
import connectDB from './src/config/db.js';
import env from "./src/config/env.js";
// import { startAuctionJob } from "./src/services/auction.jobs.js"


connectDB();
// startAuctionJob();

let PORT = env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})



