import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import env from "./src/config/env.js";
import { startAuctionJob } from "./src/services/auction.jobs.js";
import { createServer } from "http";
import { initializeSocketServer } from "./src/socket/socket.server.js";

const server = createServer(app);

async function startServer() {
    try {

        await connectDB();

        startAuctionJob();

        initializeSocketServer(server);

        const PORT = env.PORT || 8000;

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {

        console.error("Server Startup failed", error);
        process.exit(1);

    }
}

startServer();