import "dotenv/config";
import app from "./app.js";
import { logger } from "./lib/logger.js";
import { connectDB } from "./config/db.js";
import { initCloudinary } from "./config/cloudinary.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("PORT environment variable is required but was not provided.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function bootstrap(): Promise<void> {
  // DB and Cloudinary are optional at startup — routes will 503 if not connected
  try {
    await connectDB();
  } catch (err) {
    logger.warn({ err }, "MongoDB connection failed — DB routes will be unavailable");
  }

  try {
    initCloudinary();
  } catch (err) {
    logger.warn({ err }, "Cloudinary init failed — image uploads will be unavailable");
  }

  app.listen(port, (err?: Error) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
}

bootstrap().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
