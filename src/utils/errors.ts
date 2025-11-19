import { Data } from "effect";

export class NotInGuildError extends Data.TaggedError("NotInGuildError")<{}> {}
