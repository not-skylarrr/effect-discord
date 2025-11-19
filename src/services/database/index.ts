import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { Context, Effect, Layer } from "effect";
import * as schema from "./schema";

const database = new Database("database.db");
const db = drizzle(database, { schema });

export type Database = typeof db;

export class DatabaseService extends Context.Tag("DatabaseService")<
    DatabaseService,
    {
        readonly db: typeof db;
        readonly schema: typeof schema;
    }
>() {}

export const DatabaseServiceLive = Layer.succeed(DatabaseService, {
    db,
    schema,
});

export { schema };
