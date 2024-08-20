export const maxDuration = 25; // Max duration for the action to respond in Vercel

import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import { appURL } from "../utils";

const handler = async (req: NextRequest) => {
  try {
    const lng = req.nextUrl.searchParams.get("lng");
    const lat = req.nextUrl.searchParams.get("lat");
    const location = req.nextUrl.searchParams.get("location");
    let zoom = req.nextUrl.searchParams.get("zoom");

    // Validate the zoom parameter
    zoom =
      !zoom || isNaN(parseInt(zoom))
        ? "17"
        : parseInt(zoom) < 1
        ? "2"
        : parseInt(zoom) > 17
        ? "18"
        : (parseInt(zoom) + 1).toString();

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);

    // Optional: If you'd like to disable webgl, true is the default.
    chromium.setGraphicsMode = false;

    // Launch a headless browser
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(
        "https://github.com/Sparticuz/chromium/releases/download/v126.0.0/chromium-v126.0.0-pack.tar"
      ),
      headless: chromium.headless,
    });
    const page = await browser.newPage();

    // Set the viewport size to be slightly larger than the map container size
    await page.setViewport({ width: 764, height: 400 });

    // Set the content of the page
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>
          #map { height: 400px; width: 764px; margin-top: -8px; margin-left: -8px; }
          .leaflet-popup-content-wrapper {
            font-size: 25px; /* Increase the font size */
          }
          .leaflet-popup-content {
            font-size: 25px; /* Increase the font size */
          }
          .leaflet-popup-close-button {
            display: none; /* Hide the close button */
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          var map = L.map('map', { zoomControl: false }).setView([${latitude}, ${longitude}], ${zoom});
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          
          var customIcon = L.icon({
            iconUrl: '${appURL()}/pin.png', // Default icon URL
            iconSize: [88, 88], 
            iconAnchor: [44, 88],
            popupAnchor: [0, -91],
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
          });

          L.marker([${latitude}, ${longitude}], { icon: customIcon })
              .addTo(map).bindPopup("Hi, I'm in ${location}!").openPopup();
        </script>
      </body>
      </html>
    `);

    // Wait for the map to render
    await page.waitForSelector("#map");

    // Wait for network to be idle
    await page.waitForNetworkIdle({ idleTime: 500 });

    // Capture the screenshot
    const buffer = await page.screenshot({ type: "png" });

    // Close the browser
    await browser.close();

    return new NextResponse(buffer, { headers: { "Content-Type": "image/png" } });
  } catch (error) {
    console.error("Error generating image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = handler;
export const POST = handler;
