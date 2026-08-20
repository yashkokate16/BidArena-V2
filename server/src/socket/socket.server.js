import { Server } from "socket.io";
import env from "../config/env.js"

let io ;


export function initializeSocketServer(httpServer) {


    let io = new Server(httpServer,{
        cors:{
            origin:env.CLIENT_URL,
            credentials:true
        }
    })


    io.on("connection", (socket) =>{
        console.log("User connected:", socket.id);

        socket.on("joinAuction", (auctionId) =>{
            console.log(`socket:${socket.id} joined room auction:${auctionId}`)

            let room = `auction:${auctionId}`;

            socket.join(room)
             console.log(`${socket.id} joined ${room}`);

        });

        socket.on("leaveAuction", (auctionId) =>{

            let room = `auction:${auctionId}`
             console.log(`${socket.id} leave ${room}`);

        })



        socket.on("disconnect", (socket) =>{

        console.log("User disconnected:",socket.id);

        })


    })

    return io;

}

export function getIo() {
    if(!io){
        throw new Error("Socket.IO has not been initialized");
    }
    return io;
}