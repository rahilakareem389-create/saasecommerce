import { io } from 'socket.io-client';

const SOCKET_URL = 'https://saasecommerce.vercel.app';

export const socket = io(SOCKET_URL);
