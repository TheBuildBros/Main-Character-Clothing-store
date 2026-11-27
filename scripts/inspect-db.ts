import "dotenv/config";
import postgres from "postgres";

async function main() {
  console.log("ENV_CHECK:", {
    DATABASE_URL: process.env.DATABASE_URL ? "set" : "missing",
    JWT_SECRET: process.env.JWT_SECRET ? "set" : "missing",
    SMTP_PASS: process.env.SMTP_PASS ? "set" : "missing",
  });

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  const sql = postgres(process.env.DATABASE_URL, { prepare: false });

  try {
    const columns = await sql`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name IN ('users', 'otp_codes')
      ORDER BY table_name, ordinal_position
    `;
    console.log("COLUMNS:", JSON.stringify(columns, null, 2));

    try {
      const usersCount = await sql`SELECT count(*) AS rows FROM users`;
      console.log("USERS_COUNT:", usersCount[0]?.rows);
    } catch (err: any) {
      console.log("USERS_COUNT_ERROR:", err?.message?.split("\n")[0]);
    }

    try {
      const otpCount = await sql`SELECT count(*) AS rows FROM otp_codes`;
      console.log("OTP_CODES_COUNT:", otpCount[0]?.rows);
    } catch (err: any) {
      console.log("OTP_CODES_COUNT_ERROR:", err?.message?.split("\n")[0]);
    }

    const roleType = await sql`SELECT typname FROM pg_type WHERE typname = 'role'`;
    console.log("ROLE_ENUM:", JSON.stringify(roleType));

    try {
      const migrations = await sql`SELECT * FROM drizzle.__drizzle_migrations`;
      console.log("DRIZZLE_MIGRATIONS:", JSON.stringify(migrations, null, 2));
    } catch (err: any) {
      console.log("DRIZZLE_MIGRATIONS_ERROR:", err?.message?.split("\n")[0]);
    }
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error("INSPECT_ERROR:", err?.message?.split("\n")[0]);
  process.exit(1);
});
