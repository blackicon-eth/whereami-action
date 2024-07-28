function isComposerActionState(value: any) {
  return (
    typeof value === "object" &&
    !!value &&
    "text" in value &&
    typeof value.text === "string" &&
    "embeds" in value &&
    Array.isArray(value.embeds) &&
    value.embeds.every((embed: any) => typeof embed === "string" && !!embed)
  );
}

export function extractComposerActionStateFromMessage(ctx: any) {
  if (
    "message" in ctx &&
    typeof ctx.message === "object" &&
    !!ctx.message &&
    "state" in ctx.message &&
    !!ctx.message.state
  ) {
    try {
      if (typeof ctx.message.state !== "string") {
        throw new Error("State is not a string");
      }
      const jsonString = decodeURIComponent(ctx.message.state);
      const parsedState = JSON.parse(jsonString);
      if (isComposerActionState(parsedState.cast)) {
        return parsedState;
      }
      throw new Error("Invalid state shape");
    } catch (e) {
      console.warn(`warpcastComposerActionState: Could not parse composer action state.`);
      return void 0;
    }
  }
  return void 0;
}
