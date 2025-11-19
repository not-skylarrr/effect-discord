import { DiscordConfig, DiscordREST, Intents } from "dfx";
import { DiscordIxLive } from "dfx/gateway";
import { Config, Effect, Layer } from "effect";
import { NodeHttpClient, NodeSocket } from "@effect/platform-node";

export const DiscordLayer = DiscordIxLive.pipe(
    Layer.provide([
        DiscordConfig.layerConfig({
            gateway: {
                intents: Config.succeed(Intents.fromList(["GuildMessages", "MessageContent", "Guilds"])),
            },
            token: Config.redacted("DISCORD_BOT_TOKEN"),
        }),
        NodeHttpClient.layerUndici,
        NodeSocket.layerWebSocketConstructor,
    ]),
);

export class DiscordApplication extends Effect.Service<DiscordApplication>()("app/DiscordApplication", {
    effect: DiscordREST.pipe(
        Effect.flatMap((_) => _.getMyApplication()),
        Effect.orDie,
    ),
    dependencies: [DiscordLayer],
}) {}

export const DiscordGatewayLayer = Layer.merge(DiscordLayer, DiscordApplication.Default);
