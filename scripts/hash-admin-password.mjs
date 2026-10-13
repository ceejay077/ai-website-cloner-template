#!/usr/bin/env node
// Prints an ADMIN_PASSWORD_HASH value for the admin panel login.
// Usage: node scripts/hash-admin-password.mjs            (prompts for the password)
//        node scripts/hash-admin-password.mjs --secret   (also prints a new ADMIN_SESSION_SECRET)

import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

const rl = createInterface({ input: process.stdin, output: process.stderr });
rl.question("New admin password: ", (password) => {
  rl.close();
  if (password.length < 8) {
    console.error("Use at least 8 characters.");
    process.exit(1);
  }
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 64);
  console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("base64url")}:${key.toString("base64url")}`);
  if (process.argv.includes("--secret")) {
    console.log(`ADMIN_SESSION_SECRET=${randomBytes(48).toString("base64url")}`);
  }
});
