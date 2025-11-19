import { InteractionsRegistry } from "dfx/gateway";
import { Ix } from "dfx/index";
import { Data, Effect, Layer } from "effect";
import { DiscordLayer } from "../services/discord";
import { InteractionCallbackTypes, MessageFlags } from "dfx/types";

class NonUserCommandError extends Data.TaggedError("NonUserCommandError")<{}> {}

const make_hello_command = Effect.gen(function* () {
    const registry = yield* InteractionsRegistry;

    const command = Ix.global(
        {
            name: "hello",
            description: "A simple hello command",
        },
        Effect.fn("Command.Hello")(function* () {
            const context = yield* Ix.Interaction;

            let user_id: string | null = null;

            if (context.member) {
                user_id = context.member.user.id;
            }

            if (context.user) {
                user_id = context.user.id;

                // @ts-ignore
                yield* Effect.logDebug(context.user.clan);
            }

            if (!user_id) {
                return yield* new NonUserCommandError();
            }

            return Ix.response({
                type: 4,
                data: {
                    content: `Hello <@${user_id}>`,
                },
            });
        }),
    );

    yield* registry.register(
        Ix.builder
            .add(command)
            .catchTagRespond("NonUserCommandError", () =>
                Effect.succeed(
                    Ix.response({
                        type: InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: "This command must be invoked by a user",
                            flags: MessageFlags.Ephemeral,
                        },
                    }),
                ),
            )
            .catchAllCause(Effect.logError),
    );
});

export const HelloCommandLayer = Layer.scopedDiscard(make_hello_command).pipe(Layer.provide(DiscordLayer));
