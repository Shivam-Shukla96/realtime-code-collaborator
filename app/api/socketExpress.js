
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

const server = http.createServer(app);

const ioServer = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// in memory store for socketId to user mapping. to be replaced with a proper database in production
const socketMap = {};
const socketRoomMap = {}; // Track which room each socket is in

const getAllUsersInRoom = (roomId) => {
    const clients = ioServer.sockets.adapter.rooms.get(roomId) || [];
    const users = [];
    clients.forEach((socketId) => {
        users.push({
            socketId,
            username: socketMap[socketId],
        });
    });
    return users;
}

ioServer.on('connection', (socket) => {
    console.log(`socket ${socket.id} connected`)

    socket.on('join', ({ roomId, username }) => {
        socketMap[socket.id] = username;
        socketRoomMap[socket.id] = roomId; // Track which room this socket is in
        socket.join(roomId);
        console.log(`User ${username} joined room ${roomId}`);
        const activeClients = getAllUsersInRoom(roomId);
        console.log('activeClients  -->', activeClients)

        // Send the complete list of active clients to everyone in the room (including the new joiner)
        ioServer.to(roomId).emit('user-joined', {
            username,
            socketId: socket.id,
            activeClients
        });
    });

    // Handle code edit events
    socket.on('edit', (content) => {
        const roomId = socketRoomMap[socket.id];
        const username = socketMap[socket.id];
        if (roomId) {
            console.log(`User ${username} (${socket.id}) edited code in room ${roomId}`);
            // Broadcast to all other users in the room (not the sender)
            socket.to(roomId).emit('edit', content);
        }
    });

    socket.on('disconnecting', () => {
        const roomId = socketRoomMap[socket.id];
        const username = socketMap[socket.id];
        console.log(`socket ${socket.id} (${username}) is disconnecting from room ${roomId}`);

        const rooms = [...socket.rooms];
        rooms.forEach((room) => {
            if (room !== socket.id) {
                const activeClients = getAllUsersInRoom(room);
                // Notify other users in the room about the disconnection
                socket.to(room).emit('user-left', {
                    socketId: socket.id,
                    username,
                    activeClients
                });
                delete socketRoomMap[socket.id];
                delete socketMap[socket.id];
                socket.leave(room);
            }
        });
    });

    // Notify remaining users in the room

    socket.on('disconnect', () => {
        const roomId = socketRoomMap[socket.id];
        const username = socketMap[socket.id];
        console.log(`socket ${socket.id} (${username}) disconnected from room ${roomId}`);

        // Clean up the maps
        delete socketMap[socket.id];
        delete socketRoomMap[socket.id];

        // Notify remaining users in the room
        if (roomId) {
            const activeClients = getAllUsersInRoom(roomId);
            ioServer.to(roomId).emit('user-left', {
                socketId: socket.id,
                username,
                activeClients
            });
        }
    })
})

server.listen(5000, () => {
    console.log(`Socket Express server is running on port ${5000}`);
});

export default app;