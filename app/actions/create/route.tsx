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
    description: "Share your location",
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
  if (!ctx.composerActionState) {
    return error("Must be called from composer");
  }

  createActionUrl.searchParams.set("state", JSON.stringify(ctx.composerActionState));

  return composerActionForm({
    title: "Pick your location",
    url: createActionUrl.toString(),
  });
});
