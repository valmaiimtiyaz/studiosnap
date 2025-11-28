import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function CustomizeStrip() {
  const [layoutId, setLayoutId] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [frameColor, setFrameColor] = useState("#000000");
  const [customColor, setCustomColor] = useState("#e9d5ff");
  const stripRef = useRef(null);

  const presetColors = [
    "#FFFFFF", // White
    "#F5F5F4", // Light gray
    "#000000", // Black
    "#FEF3C7", // Cream
    "#D1FAE5", // Mint
    "#DBEAFE", // Light blue
    "#FDE68A", // Yellow
    "#E9D5FF", // Lavender
  ];

  useEffect(() => {
    try {
      const lId = localStorage.getItem("selectedLayoutId");
      const photosJson = localStorage.getItem("takenPhotos");

      if (!photosJson) {
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(photosJson);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        setLoading(false);
        return;
      }

      setLayoutId(lId);
      setPhotos(parsed);
      setLoading(false);
    } catch (err) {
      console.error("Error loading photos:", err);
      setLoading(false);
    }
  }, []);

  const getLayoutConfig = () => {
    switch (layoutId) {
      case "layout-1": // 4 photos, landscape orientation
        return {
          rows: 4,
          photoHeight: 150,
          gap: 8,
          padding: 8,
          border: 12,
        };
      case "layout-2": // 3 photos, landscape orientation
        return {
          rows: 3,
          photoHeight: 170,
          gap: 10,
          padding: 15,
          border: 18,
        };
      case "layout-3": // 4 photos, landscape orientation
        return {
          rows: 4,
          photoHeight: 150,
          gap: 8,
          padding: 8,
          border: 12,
        };
      case "layout-4": // 2 photos, portrait orientation
        return {
          rows: 2,
          photoHeight: 200,
          gap: 8,
          padding: 8,
          border: 14,
        };
      default:
        return {
          rows: 4,
          photoHeight: 150,
          gap: 8,
          padding: 8,
          border: 12,
        };
    }
  };

  const handleDownload = async () => {
    if (!stripRef.current) return;

    try {
      // Dynamically import html2canvas
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(stripRef.current, {
        backgroundColor: frameColor,
        scale: 2, // Higher quality
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = "studio-snap-photostrip.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download. Please try again.");
    }
  };

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    setFrameColor(color);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl text-[#610049]">Loading your photos...</p>
      </div>
    );
  }

  const config = getLayoutConfig();

  return (
    <div className="min-h-screen pb-10">
      <main className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 mt-23 px-4">
        {/* Photo Strip Preview */}
        <div
          ref={stripRef}
          className="shadow-lg flex flex-col"
          style={{
            backgroundColor: frameColor,
            borderWidth: `${config.border}px`,
            borderStyle: "solid",
            borderColor: frameColor,
            padding: `${config.padding}px`,
            gap: `${config.gap}px`,
            width: "320px",
          }}
        >
          {photos.length === 0 && (
            <p className="text-center text-red-600">
              No photos found.{" "}
              <Link className="text-blue-500 underline" to="/cam">
                Please try again
              </Link>
              .
            </p>
          )}

          {photos.map((src, i) => (
            <div
              key={i}
              style={{
                height: `${config.photoHeight}px`,
                width: "100%",
                overflow: "hidden",
              }}
            >
              <img
                src={src}
                alt={`Captured photo ${i + 1}`}
                className="w-full h-full object-cover"
                style={{ objectPosition: "center center" }}
              />
            </div>
          ))}
        </div>

        {/* Customization Panel */}
        <div className="flex flex-col items-center lg:items-start gap-6">
          <h1 className="text-3xl font-bold text-[#610049] text-center lg:text-left">
            Customize your photo strip !!!
          </h1>

          {/* Frame Color Selection */}
          <div className="flex flex-col gap-3">
            <label className="text-[#610049] font-semibold">Frame Color</label>

            <div className="flex flex-wrap gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setFrameColor(color)}
                  className={`w-10 h-10 rounded-4xl border-2 transition-transform hover:scale-110 ${
                    frameColor === color
                      ? "border-[#610049] ring-2 ring-[#610049] ring-offset-2"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            {/* Custom Color Picker */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[#610049] font-medium">Custom :</span>
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 overflow-hidden"
                style={{ padding: 0 }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button
              onClick={handleDownload}
              className="px-8 py-3 bg-[#610049] text-white rounded-full font-bold 
                         transition-all duration-200 hover:bg-[#4a0037] hover:scale-105
                         shadow-md hover:shadow-lg"
            >
              Download Photo Strip
            </button>

            <Link
              to="/cam"
              className="px-8 py-3 border-2 border-[#610049] text-[#610049] rounded-full font-bold 
                         transition-all duration-200 hover:bg-[#fce9e9] hover:scale-105"
            >
              Take New Photos
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
