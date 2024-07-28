import { appURL } from "../../utils";
import { frames } from "../../frames/frames";
import { composerAction, composerActionForm, error } from "frames.js/core";

export const GET = async () => {
  return composerAction({
    action: {
      type: "post",
    },
    icon: "pin",
    name: "Where Am I?",
    aboutUrl: `${appURL()}`,
    description: "A composer action to share your location on Farcaster!",
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

  // in case of composer actions we can't use ctx.state because the composer actions
  if (!ctx.composerActionState) {
    return error("Must be called from composer");
  }

  createActionUrl.searchParams.set("state", JSON.stringify(ctx.composerActionState));

  return composerActionForm({
    title: "Pick your location",
    url: createActionUrl.toString(),
  });
});
