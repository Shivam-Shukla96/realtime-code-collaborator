import io from 'socket.io-client';


const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        transports: ['websocket'],
    };

    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000', options);
    return socket;
}

export default initSocket;

