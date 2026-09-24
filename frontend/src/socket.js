import { io } from 'socket.io-client';

// Change this URL to your Railway backend URL once deployed
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL);
