/* eslint-disable @next/next/no-img-element */
"use client";
import type { ComposerActionState } from "frames.js/types";
import React, { useState } from "react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";

interface Coordinates {
  features: {
    geometry: {
      coordinates: number[];
    };
    properties: {
      display_name: string;
    };
  }[];
}

// pass state from frame message
export default function LocationForm({
  searchParams,
}: {
  // provided by URL returned from composer action server
  searchParams: {
    uid: string;
    state: string;
  };
}) {
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [zoom, setZoom] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const composerActionState = JSON.parse(searchParams.state) as ComposerActionState;

  // A function to get the coordinates of the location
  const getCoordinates = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const baseUrl = "https://nominatim.openstreetmap.org/search?format=geojson&limit=1";
      const searchParams = `${city ? "&city=" + encodeURIComponent(city) : ""}${
        country ? "&country=" + encodeURIComponent(country) : ""
      }${postalCode ? "&postalcode=" + encodeURIComponent(postalCode) : ""}${
        street ? "&street=" + encodeURIComponent(street) : ""
      }`;
      const response = await fetch(`${baseUrl}${searchParams}`, {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      const data: Coordinates = await response.json();
      if (data.features[0]?.geometry.coordinates && data.features[0]?.properties.display_name) {
        setCoordinates({
          lng: parseFloat(data.features[0]?.geometry.coordinates[0]!.toFixed(6)),
          lat: parseFloat(data.features[0]?.geometry.coordinates[1]!.toFixed(6)),
        });
        setLocation(data.features[0]?.properties.display_name);
        setError(null);
      } else {
        setError("Location not found");
        setCoordinates(null);
        setLocation(null);
      }
    } catch (err) {
      setError("Error fetching location");
      setCoordinates(null);
      setLocation(null);
    }
  };

  const submitForm = (e: any) => {
    e.preventDefault();
    const newFrameUrl = new URL("/frames/location", window.location.href);

    newFrameUrl.searchParams.set("lat", coordinates!.lat.toString());
    newFrameUrl.searchParams.set("lng", coordinates!.lng.toString());
    newFrameUrl.searchParams.set("location", location!);
    newFrameUrl.searchParams.set("zoom", zoom);

    window.parent.postMessage(
      {
        type: "createCast",
        data: {
          cast: {
            ...composerActionState,
            // always append to the end of the embeds array
            embeds: [newFrameUrl.toString()],
          },
        },
      },
      "*"
    );
  };

  return (
    <main className="flex flex-col items-center justify-start sm:px-0 sm:py-5 px-3 pt-2 pb-3 bg-lime-100">
      <form
        className="flex relative -left-[1px] max-w-lg bg-lime-300 px-5 sm:px-14 pb-5 pt-3 border-2 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)]"
        onSubmit={submitForm}
      >
        <div className="flex flex-col items-center gap-2 ">
          {/* Title */}
          <h1 className="text-[30px] font-bold">Where am I? 📌</h1>

          {/* Instructions */}
          <div className="text-[18px] w-full text-gray-600 text-wrap leading-tight">
            Fill at least <b>one field</b> to get your location and share it with your friends & followers!
          </div>

          {/* City */}
          <div className="flex flex-col w-full">
            <label className="text-[20px] font-bold pb-1" htmlFor="city">
              City
            </label>
            <Input type="text" value={city} onChange={setCity} placeholder="City name" rounded="md" focusColor="yellow" />
          </div>

          {/* Country */}
          <div className="flex flex-col w-full">
            <label htmlFor="country" className="text-[20px] font-bold pb-1">
              Country
            </label>
            <Input
              type="text"
              value={country}
              onChange={setCountry}
              placeholder="Country name (e.g. IT or Italy)"
              rounded="md"
              focusColor="yellow"
            />
          </div>

          {/* Postal Code and Zoom */}
          <div className="flex flex-row w-full gap-5">
            <div className="flex flex-col w-1/2">
              <label htmlFor="postalCode" className="text-[20px] font-bold pb-1">
                Zip Code
              </label>
              <Input
                type="text"
                value={postalCode}
                onChange={setPostalCode}
                placeholder="Postal code"
                rounded="md"
                focusColor="yellow"
              />
            </div>

            <div className="flex flex-col w-1/2">
              <label htmlFor="zoom" className="text-[20px] font-bold pb-1">
                Map Zoom
              </label>
              <Input
                className="w-[80%]"
                type="number"
                placeholder="1-17"
                value={zoom}
                onChange={(e) => {
                  let value = parseInt(e, 10);
                  if (value < 1) value = 1;
                  if (value > 17) value = 17;
                  setZoom(value.toString());
                }}
                rounded="md"
                focusColor="yellow"
              />
            </div>
          </div>

          {/* Street */}
          <div className="flex flex-col w-full">
            <label htmlFor="street" className="text-[20px] font-bold pb-1">
              Street
            </label>
            <Input type="text" value={street} onChange={setStreet} placeholder="Address" rounded="md" focusColor="yellow" />
          </div>

          <div className="flex flex-col justify-center items-center text-xs">
            <div>* No data will be stored.</div>
            <div className="flex flex-row">
              Check the source code on
              <a
                className="flex flex-row justify-center items-center underline ml-1"
                href="https://github.com/blackicon-eth/whereami-action"
                target="_blank"
              >
                GitHub
                <img
                  className="ml-1 h-4 w-4 rounded-full"
                  src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                  alt="github logo"
                />
              </a>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-row gap-3 pb-4 w-full justify-center">
            <Button className="w-36" buttonText="Get Location" onClick={getCoordinates} rounded="2xl" />
            <Button
              className="w-36"
              buttonText="Share it!"
              onClick={submitForm}
              rounded="2xl"
              disabled={!coordinates}
              color="yellow"
            />
          </div>

          {(() => {
            if (coordinates && !error) {
              return (
                <div className="flex flex-col gap-1 w-full bg-white p-3 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <div className="flex flex-col gap-1 justify-start">
                    <div className="text-[17px]">
                      <b>Latitude:</b> &nbsp; {coordinates.lat}📍
                    </div>
                    <div className="text-[17px]">
                      <b>Longitude:</b> &nbsp; {coordinates.lng}📍
                    </div>
                  </div>
                  <div className="flex flex-row gap-2 justify-start">
                    <div className="text-[17px] font-bold">Location:</div>
                    <div className="text-[17px]">{location}</div>
                  </div>
                  <div className="flex flex-col justify-start">
                    <div className="text-[17px] font-bold">Frame preview:</div>
                    <img
                      className="rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                      src={`/image?lat=${coordinates.lat}&lng=${coordinates.lng}&location=${location}&zoom=${zoom}`}
                      alt="frame image preview"
                    />
                  </div>
                </div>
              );
            } else if (error && !coordinates) {
              return (
                <div className="bg-red-100 w-full p-3 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <div className="flex text-bold text-red-600">{error}</div>
                </div>
              );
            } else {
              return null;
            }
          })()}
        </div>
      </form>
    </main>
  );
}
