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
      console.log(data);
      if (data.features[0]?.geometry.coordinates && data.features[0]?.properties.display_name) {
        setCoordinates({
          lng: parseFloat(data.features[0]?.geometry.coordinates[0]!.toFixed(4)),
          lat: parseFloat(data.features[0]?.geometry.coordinates[1]!.toFixed(4)),
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
    <form
      className="flex flex-col gap-3 bg-lime-300 px-5 pb-5 pt-3 m-2 border-2 border-black rounded-lg shadow-[6px_6px_0px_rgba(0,0,0,1)]"
      onSubmit={submitForm}
    >
      {/* City */}
      <div className="flex flex-col">
        <label className="text-[20px] font-bold pb-1" htmlFor="city">
          City
        </label>
        <Input type="text" value={city} onChange={setCity} placeholder="City name" rounded="md" focusColor="yellow" />
      </div>

      {/* Country */}
      <div className="flex flex-col">
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

      {/* Postal Code */}
      <div className="flex flex-col">
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

      {/* Street */}
      <div className="flex flex-col">
        <label htmlFor="street" className="text-[20px] font-bold pb-1">
          Street
        </label>
        <Input type="text" value={street} onChange={setStreet} placeholder="Address" rounded="md" focusColor="yellow" />
      </div>

      <div className="">* Fill at least one field</div>

      {/* Buttons */}
      <div className="flex flex-row justify-start gap-3 pb-4">
        <Button className="w-40" buttonText="Get Coordinates" onClick={getCoordinates} rounded="2xl" />
        <Button
          className="w-40"
          buttonText="Create Frame"
          onClick={submitForm}
          rounded="2xl"
          disabled={!coordinates}
          color="yellow"
        />
      </div>

      {(() => {
        if (coordinates && !error) {
          return (
            <div className="flex flex-col gap-1 bg-white p-3 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-row gap-3 justify-start">
                <div className="text-[17px] font-bold">Latitude:</div>
                <div className="text-[17px] pr-4">{coordinates.lat}</div>
                <div className="text-[17px] font-bold">Longitude:</div>
                <div className="text-[17px]">{coordinates.lng}</div>
              </div>
              <div className="flex flex-row gap-3 justify-start">
                <div className="text-[17px] font-bold">Location:</div>
                <div className="text-[17px]">{location}</div>
              </div>
            </div>
          );
        } else if (error && !coordinates) {
          return (
            <div className="bg-red-100 p-3 border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              <div className="flex text-bold text-red-600">{error}</div>
            </div>
          );
        } else {
          return null;
        }
      })()}
    </form>
  );
}
