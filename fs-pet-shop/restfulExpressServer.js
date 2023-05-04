import express from "express";

const server = express();
const port = 3000;

server.listen(() => console.log(`Listening on port ${port}`));
