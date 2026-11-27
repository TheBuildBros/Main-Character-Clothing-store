import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../server/db";
import { users } from "../drizzle/schema";

async function main() {
  const rawEmail = process.argv[2]?.trim();
  if (!rawEmail) {
    console.error("Usage: pnpm make-admin <email>");
    process.exit(1);
  }

  const normalizedEmail = rawEmail.toLowerCase();

  const updated = await db
    .update(users)
    .set({ role: "admin", updatedAt: new Date() })
    .where(sql`lower(${users.email}) = ${normalizedEmail}`)
    .returning({ email: users.email });

  if (updated.length === 0) {
    console.error("No user with that email");
    process.exit(1);
  }

  console.log(`Promoted ${normalizedEmail} to admin`);
  process.exit(0);
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message.split("\n")[0] : "Failed to promote user";
  console.error(msg);
  process.exit(1);
});
