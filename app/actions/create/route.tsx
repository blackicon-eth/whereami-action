import { appURL } from "../../utils";
import { frames } from "../../frames/frames";
import { composerAction, composerActionForm, error } from "frames.js/core";

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
function extractComposerActionStateFromMessage(ctx: any) {
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

export const GET = async () => {
  return composerAction({
    action: {
      type: "post",
    },
    icon: "pin",
    name: "Where Am I?",
    aboutUrl: `${appURL()}`,
    description: "A composer action to share your location on Farcaster.",
  });
};

export const POST = frames(async (ctx) => {
  const walletAddress = await ctx.walletAddress();

  const createActionUrl = new URL("/actions/form", appURL());

  if (walletAddress) {
    createActionUrl.searchParams.set("uid", walletAddress);
  } else {
    return error("Must be authenticated");
  }

  // Check if the state is valid
  const composerActionState = extractComposerActionStateFromMessage(ctx);
  if (!composerActionState) {
    return error("Must be called from composer");
  }

  createActionUrl.searchParams.set("state", JSON.stringify(composerActionState.cast));

  return composerActionForm({
    title: "Pick your location",
    url: createActionUrl.toString(),
  });
});
