import Fastify from "fastify";
import dotenv from "dotenv";
import { connectDb } from "./src/config/connect.js";
import { PORT } from "./src/config/config.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";

dotenv.config();

const start = async () => {
  await connectDb(process.env.MONGO_URI);
  const app = Fastify();

  app.register(fastifySocketIO,{
    cors:{
      origin:"*"
    },
    pingInterval:10000,
    pingTimeout:5000,
    transports:["websocket"]
  });

  await registerRoutes(app);
  await buildAdminRouter(app);

  app.listen({ port: PORT}, (err, addr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        `Server listening on http://localhost:${PORT}${admin.options.rootPath}`
      );
    }
  });

  app.ready().then(()=>{
    app.io.on("connection",(socket)=>{
      console.log(`A user connected!`);

      socket.on("joinRoom",(orderId)=>{
        socket.join(orderId);
        console.log(`User joined room: ${orderId}`);
      });

      socket.on("disconnect",()=>{
        console.log(`User Disconnected`);
      })
    })
  })
};

start();
