import { Layer, Logger, LogLevel } from "effect";
import { NodeRuntime } from "@effect/platform-node";
import { config } from "dotenv";
import { HelloCommandLayer } from "./commands/hello";
import { MentionsHandler } from "./handlers/mention";

config();

const MainLive = Layer.mergeAll(HelloCommandLayer, MentionsHandler).pipe(
    Layer.provide(Logger.pretty),
    Layer.provide(Logger.minimumLogLevel(LogLevel.Debug)),
);

NodeRuntime.runMain(Layer.launch(MainLive));
