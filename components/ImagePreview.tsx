/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

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

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center rounded-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
      {loading && <img className="w-8 h-8 my-12" src="/loading.gif" alt="Loading..." />}
      <img
        className={`rounded-lg ${loading ? "hidden" : "block w-full"}`}
        src={`/image?lat=${latitude}&lng=${longitude}&location=${location}&zoom=${zoom}`}
        alt="frame image preview"
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default ImagePreview;
