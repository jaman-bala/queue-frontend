import { io } from 'socket.io-client';

const URL = 'http://dev-queue.tsvs.kg/';

export const socket = io(URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
});
