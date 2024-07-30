import { appURL } from "../../utils";
import { frames } from "../../frames/frames";
import { composerAction, composerActionForm, error } from "frames.js/core";

type ComposerActionMetadata = {
  type: "composer"; // Must be 'composer'
  name: string; // Maximum 15 characters
  icon: string; // Valid Octicon. See cast actions spec.
  description: string; // Maximum 20 characters
  imageUrl: string; // Remote image URL
  aboutUrl: string; // Optional "about" page URL
  action: {
    type: "post"; // Same as cast actions spec
  };
};

const metadata: ComposerActionMetadata = {
  type: "composer",
  name: "Where Am I?",
  icon: "pin",
  description: "Share your location",
  imageUrl: `${appURL()}/logo-small.png`,
  aboutUrl: `${appURL()}`,
  action: {
    type: "post",
  },
};

export const GET = async () => {
  return composerAction(metadata);
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
