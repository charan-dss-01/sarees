import { User } from "../models/User.js";
import { logger } from "../lib/logger.js";

const DEFAULT_EMAIL    = "admin@ananya.com";
const DEFAULT_PASSWORD = "Ananya@2025!";

/**
 * Creates the first admin user if no users exist in the database.
 * Credentials are read from ADMIN_EMAIL / ADMIN_PASSWORD env vars,
 * falling back to the defaults above.
 * Safe to call on every boot — it is a no-op once a user exists.
 */
export async function seedAdmin(): Promise<void> {
  const count = await User.countDocuments();
  if (count > 0) {
    logger.info("Admin user already exists — skipping seed.");
    return;
  }

  const email    = process.env["ADMIN_EMAIL"]    ?? DEFAULT_EMAIL;
  const password = process.env["ADMIN_PASSWORD"] ?? DEFAULT_PASSWORD;

  await User.create({ email, password });
  logger.info({ email }, "Admin user created successfully.");
}
