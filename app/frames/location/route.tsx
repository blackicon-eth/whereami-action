import { Button } from "frames.js/next";
import { frames } from "../frames";
import { appURL } from "../../utils";

const locationFrameHandler = frames(async (ctx) => {
  const longitude: string | undefined = ctx.searchParams.lng;
  const latitude: string | undefined = ctx.searchParams.lat;
  const location: string | undefined = ctx.searchParams.location;
  const zoom: string | undefined = ctx.searchParams.zoom;

  if (!longitude || !latitude || !location) {
    // Throw an error if the required parameters are missing
    throw new Error("Missing required parameters");
  }

  return {
    title: "My Location",
    image: `${appURL()}/image?lat=${latitude}&lng=${longitude}&location=${location}&zoom=${zoom}`,
    imageOptions: {
      aspectRatio: "1.91:1",
    },
    buttons: [
      <Button key="1" action="link" target={`http://maps.google.com/maps?z=12&t=m&q=loc:${latitude}+${longitude}`}>
        Open in Maps
      </Button>,
    ],
  };
});

export const GET = locationFrameHandler;
export const POST = locationFrameHandler;
