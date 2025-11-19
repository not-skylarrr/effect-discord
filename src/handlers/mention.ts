import { DiscordGateway } from "dfx/DiscordGateway";
import { DiscordREST } from "dfx/DiscordREST";
import { Data, Effect, Layer } from "effect";
import { DiscordApplication, DiscordGatewayLayer } from "../services/discord";

type InvalidMessageReason = "bot-message" | "invalid-user" | "not-mentioned";

class InvalidMessageError extends Data.TaggedError("InvalidMessageError")<{ reason: InvalidMessageReason }> {}

const mention_handler = Effect.gen(function* () {
    const rest = yield* DiscordREST;
    const gateway = yield* DiscordGateway;

    const application = yield* DiscordApplication!;

    const handle_message_create = gateway.handleDispatch(
        "MESSAGE_CREATE",
        Effect.fn("Mention.MessageCreate")(
            function* (message) {
                if (message.author.bot) {
                    return yield* new InvalidMessageError({ reason: "bot-message" });
                }

                if (!message.mentions.some((m) => m.id == application.id)) {
                    return yield* new InvalidMessageError({ reason: "not-mentioned" });
                }

                yield* rest.createMessage(message.channel_id, {
                    message_reference: { message_id: message.id },
                    content: "You called?",
                });
            },
            Effect.catchTags({
                InvalidMessageError: () => Effect.void,
            }),
            Effect.catchAllCause(Effect.logError),
        ),
    );

    yield* Effect.forkScoped(handle_message_create);
});

export const MentionsHandler = Layer.scopedDiscard(mention_handler).pipe(Layer.provide(DiscordGatewayLayer));
