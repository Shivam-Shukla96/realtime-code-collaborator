// import { Server } from "socket.io";
// import http from "http";

// const server = http.createServer();

// const io = new Server(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//     },
// });


// io.on('connection', (socket) => {
//     console.log("Auser connected")

//     socket.on("edit", (data) => {
//         socket.broadcast.emit("edit", data)
//     })

//     socket.on("disconnect", () => {
//         console.log("user discoonnetced ")
//     })
// })

// server.listen(3001, () => {
//     console.log("websocket is running on port 3001")
// })