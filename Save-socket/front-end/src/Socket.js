import opensocket from "socket.io-client";

const Socket = opensocket("http://localhost:4001");

export default Socket;
