import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    schema: "./src/services/database/schema.ts",
    out: "./.drizzle",
    dbCredentials: {
        url: "database.db",
    },
});
