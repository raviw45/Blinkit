import Fastify from "fastify";
import dotenv from "dotenv";
import { connectDb } from "./src/config/connect.js";
import { PORT } from "./src/config/config.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";

dotenv.config();

const start = async () => {
  await connectDb(process.env.MONGO_URI);
  const app = Fastify();

  await buildAdminRouter(app);

  app.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(
        `Server listening on http://localhost:${PORT}${admin.options.rootPath}`
      );
    }
  });
};

start();
