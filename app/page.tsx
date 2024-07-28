import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import { appURL } from "./utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Where Am I?",
    description: "A composer action to share your location on Farcaster!",
    other: {
      ...(await fetchMetadata(new URL("/frames", appURL()))),
    },
  };
}

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen bg-lime-100">
      <div className="flex flex-col gap-3 bg-lime-300 px-5 pb-7 pt-3 mx-2 mb-2 border-2 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)]">
        <label className="text-[30px] font-bold">
          What&apos;s the &quot;Where am I?&quot; composer action and how does it work?
        </label>
        <p className="text-[20px] pb-5">It&apos;s easier than you think! Just follow the instructions below:</p>
        <p className="text-[20px]">1. Start by creating a cast in Warpcast</p>
        <p className="text-[20px]">2. Click on the composer action button</p>
        <p className="text-[20px]">3. Select the &quot;Where am I?&quot; action</p>
        <p className="text-[20px]">4. Fill at least one of the fields in the form</p>
        <p className="text-[20px]">5. Click on the &quot;Get Coordinates&quot; button</p>
        <p className="text-[20px]">6. If you are satisfied with the result, click on the &quot;Create Frame&quot; button</p>
        <p className="text-[20px]">7. Done! You have successfully created a frame with your location!</p>
      </div>
    </main>
  );
}
