/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";

const ImagePreview = ({
  latitude,
  longitude,
  location,
  zoom,
}: {
  latitude: number;
  longitude: number;
  location: string | null;
  zoom: string;
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [latitude, longitude, location, zoom]);

  return (
    <div className="flex justify-center items-center rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
      {loading && (
        <div className="flex flex-col justify-center items-center my-10 text-[18px]">
          <img className="w-8 h-8 mb-1" src="/loading.gif" alt="Loading..." />
          <span>Loading image...</span>
        </div>
      )}
      <img
        className={`rounded-lg ${loading ? "hidden" : "block w-full"}`}
        src={`/image?lat=${latitude}&lng=${longitude}&location=${location}&zoom=${zoom}`}
        alt="frame image preview"
        onLoad={() => {
          setLoading(false);
        }}
      />
    </div>
  );
};

export default ImagePreview;
