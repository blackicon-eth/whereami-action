/* eslint-disable @next/next/no-img-element */
import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import { appURL } from "./utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Where Am I?",
    description: "A composer action to share your location on Farcaster.",
    other: {
      ...(await fetchMetadata(new URL("/frames", appURL()))),
    },
  };
}

export default function Home() {
  return (
    <main className="flex flex-col gap-3 items-center sm:justify-center sm:h-screen bg-lime-100">
      <div className="flex flex-col relative -left-[2px] sm:-left-0 gap-3 bg-lime-300 px-5 pb-7 pt-3 m-2 border-2 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)]">
        <label className="text-[40px] font-bold text-center">Where am I? 📌</label>
        <p className="text-[18px] text-gray-600 pb-2.5 leading-tight">
          It&apos;s a farcaster composer action and it&apos;s easier to use than you think!
          <br />
          Just follow the instructions below:
        </p>
        <p className="text-[20px]">1. Start by creating a cast in Warpcast</p>
        <p className="text-[20px]">2. Click on the composer action button</p>
        <p className="text-[20px]">3. Select the &quot;Where am I?&quot; action</p>
        <p className="text-[20px]">4. Fill at least one of the fields in the form</p>
        <p className="text-[20px]">5. Click on the &quot;Get Location&quot; button</p>
        <p className="text-[20px]">6. If you are satisfied with the result, click on the &quot;Share it!&quot; button</p>
        <p className="text-[20px]">7. Done! You have successfully created a frame with your location!</p>
      </div>
      <div className="flex flex-col relative -left-[2px] sm:-left-0 bg-white px-5 py-4 mb-5 border-2 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-row justify-center">
          Made with ❤️ by
          <a className="flex flex-row underline ml-1.5" href="https://warpcast.com/blackicon.eth" target="_blank">
            blackicon.eth
            <img className="ml-2 h-6 w-6 rounded-full" src="/propic.png" alt="blackicon.eth propic" />
          </a>
        </div>
        <div className="flex flex-col justify-center items-center pt-3">
          * This app doesn&apos;t store any data.
          <div className="flex flex-row">
            Check the source code on
            <a
              className="flex flex-row underline ml-1.5"
              href="https://github.com/blackicon-eth/whereami-action"
              target="_blank"
            >
              GitHub
              <img
                className="ml-2 h-6 w-6 rounded-full"
                src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                alt="github logo"
              />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
