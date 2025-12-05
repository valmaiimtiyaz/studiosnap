import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function CustomizeStrip() {
  const [layoutId, setLayoutId] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [frameColor, setFrameColor] = useState("#000000");
  const [customColor, setCustomColor] = useState("#e9d5ff");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stripRef = useRef(null);
  const API_BASE_URL = "https://studiosnap-backend.vercel.app";

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const presetColors = [
    "#FFFFFF",
    "#F5F5F4",
    "#000000",
    "#FEF3C7",
    "#D1FAE5",
    "#DBEAFE",
    "#FDE68A",
    "#E9D5FF",
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
      case "layout-1":
        return { rows: 4, photoHeight: 150, gap: 8, padding: 8, border: 12 };
      case "layout-2":
        return { rows: 3, photoHeight: 170, gap: 10, padding: 15, border: 18 };
      case "layout-3":
        return { rows: 4, photoHeight: 150, gap: 8, padding: 8, border: 12 };
      case "layout-4":
        return { rows: 2, photoHeight: 200, gap: 8, padding: 8, border: 14 };
      default:
        return { rows: 4, photoHeight: 150, gap: 8, padding: 8, border: 12 };
    }
  };

  const handleDownload = async () => {
    if (!stripRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(stripRef.current, {
        backgroundColor: frameColor,
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = "studio-snap-photostrip.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Download error:", error);
      setPopup({
        show: true,
        message: "Failed to download. Please try again.",
        type: "error",
      });
    }
  };

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    setFrameColor(color);
  };

  const handleFeedbackSubmit = async () => {
    if (rating === 0) {
      setPopup({
        show: true,
        message: "Please select a star rating first!",
        type: "warning",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/feedback`, {
        session_id: null,
        user_id: 1,
        rating: rating,
        comment: comment,
      });
      setFeedbackSent(true);
    } catch (error) {
      setPopup({
        show: true,
        message: "Failed to send feedback, but thanks anyway!",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-10 font-montserrat max-w-7xl mx-auto text-center">
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-[#FCF9E9] p-6 rounded-2xl shadow-2xl w-80 text-center border-2 border-[#610049] animate-bounce-in">
            <h3
              className={`text-2xl font-bold mb-2 ${
                popup.type === "error" ? "text-red-600" : "text-yellow-600"
              }`}
            >
              {popup.type === "error" ? "Oops!" : "Wait!"}
            </h3>
            <p className="text-[#610049] mb-6 font-medium">{popup.message}</p>
            <button
              onClick={() => setPopup({ ...popup, show: false })}
              className="bg-[#610049] text-white px-6 py-2 rounded-full font-bold hover:bg-[#4a003a]"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-extrabold text-[#610049] tracking-tight sm:text-4xl mb-12 w-full text-center mt-10">
        Customize your photo strip !
      </h1>

      <main className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 px-4">
        <div
          ref={stripRef}
          className="shadow-lg flex flex-col flex-shrink-0"
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

        <div className="flex flex-col items-center lg:items-start gap-6 w-full max-w-lg">
          <div className="w-full space-y-6">
            {/* COLOR PICKER & DOWNLOAD BOX */}
            <div className="bg-[#FCF9E9] rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 w-full">
              <h2 className="text-lg font-bold text-[#610049] mb-4 flex items-center gap-2">
                Choose Frame Color
              </h2>

              <div className="grid grid-cols-5 sm:grid-cols-8 gap-3 mb-6">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFrameColor(color)}
                    className={`w-10 h-10 rounded-full border shadow-sm transition-all duration-200 
                      ${
                        frameColor === color
                          ? "ring-2 ring-offset-2 ring-[#610049] scale-110"
                          : "hover:scale-105 border-gray-200"
                      }
                    `}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}

                <div className="relative group w-10 h-10">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setFrameColor(e.target.value);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className="w-full h-full rounded-full border border-gray-200 shadow-sm flex items-center justify-center bg-gradient-to-br from-pink-200 to-blue-200 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: customColor }}
                  >
                    <span className="text-xs text-gray-600 font-bold">+</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-[#610049] text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-[#4a0037] active:scale-95 transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2"
                >
                  <span>Download Photo Strip</span>
                </button>

                <Link
                  to="/cam"
                  className="flex-1 border-2 border-gray-200 text-gray-600 px-6 py-3.5 rounded-full font-bold text-sm hover:border-[#610049] hover:text-[#610049] active:scale-95 transition-all flex justify-center items-center text-center"
                >
                  Take New Photos
                </Link>
              </div>
            </div>

            <div className="bg-[#FCF9E9] rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 w-full">
              {!feedbackSent ? (
                <>
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-[#610049]">
                      How was your experience?
                    </h3>
                    <p className="text-sm text-[#610049]">
                      We'd love to hear your thoughts!
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-4xl transition-transform hover:scale-110 focus:outline-none ${
                          star <= rating
                            ? "text-yellow-400 drop-shadow-sm"
                            : "text-gray-200"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <textarea
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#610049] focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us what you liked..."
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <button
                    onClick={handleFeedbackSubmit}
                    disabled={isSubmitting}
                    className={`mt-4 w-full py-3 rounded-xl font-bold text-sm transition-all 
                      ${
                        isSubmitting
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-[#610049] text-white hover:bg-[#400030] active:scale-95"
                      }`}
                  >
                    {isSubmitting ? "Sending..." : "Submit Feedback"}
                  </button>
                </>
              ) : (
                <div className="text-center py-6 rounded-xl">
                  <h3 className="text-[#610049] font-bold text-lg">
                    Thank You!
                  </h3>
                  <p className="text-[#610049] text-sm">
                    Your feedback helps us grow.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
