import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CamPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [dbFilters, setDbFilters] = useState([]);
  const [filter, setFilter] = useState("none");
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [currentShot, setCurrentShot] = useState(0);
  const [totalShots, setTotalShots] = useState(4);
  const [layoutId, setLayoutId] = useState(null);
  const [takenPhotos, setTakenPhotos] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const currentUserId = "1";
  const photosArrayRef = useRef([]);
  const isCapturingRef = useRef(false);
  const filterRef = useRef(filter);

  const API_BASE_URL = "https://studiosnap-backend.vercel.app";

  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/filters`);
        if (
          response.data.status === "success" &&
          response.data.data.length > 0
        ) {
          const mappedFilters = response.data.data.map((f) => ({
            name: f.name,
            value: f.css_value,
          }));
          setDbFilters(mappedFilters);
        } else {
          useDefaultFilters();
        }
      } catch (error) {
        console.warn("Using default filters (Offline/DB Error).");
        useDefaultFilters();
      }
    };

    fetchFilters();
  }, []);

  const useDefaultFilters = () => {
    setDbFilters([
      { name: "No Filter", value: "none" },
      { name: "B&W", value: "grayscale(100%) contrast(130%)" },
      { name: "Sepia", value: "sepia(100%)" },
      { name: "Vintage", value: "sepia(60%) contrast(110%)" },
    ]);
  };

  useEffect(() => {
    const configJson = localStorage.getItem("layoutConfig");
    if (configJson) {
      try {
        const config = JSON.parse(configJson);
        setTotalShots(config.photoCount);
        setLayoutId(config.id);
      } catch (e) {
        setTotalShots(4);
      }
    } else {
      setTotalShots(4);
    }
  }, []);

  async function handleEndSession(sessionId) {
    if (!sessionId) return;
    try {
      axios.post(`${API_BASE_URL}/api/end-session`, { session_id: sessionId });
      setActiveSessionId(null);
    } catch (error) {
      console.error("Failed to end session on server:", error);
    }
  }

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setIsVideoReady(true);
          };
        }
      } catch (err) {
        alert("Camera access denied. Please allow camera permission.");
      }
    }
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
      if (activeSessionId) {
        handleEndSession(activeSessionId);
      }
    };
  }, [activeSessionId]);

  async function startPhotoSession() {
    if (isCapturingRef.current || !isVideoReady) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/start-session`, {
        user_id: currentUserId,
        filter: filter,
      });

      if (response.data.status === "success") {
        setActiveSessionId(response.data.data.session_id);
      }
    } catch (error) {
      console.warn("Offline mode: Failed to start session on server.");
    }

    isCapturingRef.current = true;
    setIsCapturing(true);
    photosArrayRef.current = [];
    setTakenPhotos([]);

    for (let shot = 1; shot <= totalShots; shot++) {
      setCurrentShot(shot);
      for (let i = 3; i >= 1; i--) {
        setCountdown(i);
        await sleep(1000);
      }

      const photoData = takeOnePhoto();
      if (photoData) {
        photosArrayRef.current.push(photoData);
        setTakenPhotos((prev) => [...prev, photoData]);
      }
      setCountdown("📸");
      await sleep(800);
      setCountdown(null);
      if (shot < totalShots) await sleep(1500);
    }

    await uploadPhotosAndNavigate();
  }

  async function uploadPhotosAndNavigate() {
    const photos = photosArrayRef.current;

    if (photos.length === 0) {
      alert("No photos captured.");
      isCapturingRef.current = false;
      setIsCapturing(false);
      return;
    }

    try {
      localStorage.setItem("takenPhotos", JSON.stringify(photos));
    } catch (error) {
      try {
        const compressed = await Promise.all(
          photos.map((p) => compressImage(p))
        );
        localStorage.setItem("takenPhotos", JSON.stringify(compressed));
      } catch (e) {
        console.error("Storage full");
      }
    }

    if (activeSessionId) {
      try {
        const uploadPromises = photos.map((photoDataUrl) =>
          axios.post(`${API_BASE_URL}/api/upload-photo`, {
            session_id: activeSessionId,
            photo_data: photoDataUrl,
          })
        );
        await Promise.race([
          Promise.all(uploadPromises),
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);
        await handleEndSession(activeSessionId);
      } catch (error) {
        console.error("Upload skipped:", error);
      }
    }

    await sleep(300);
    navigate("/customize");

    isCapturingRef.current = false;
    setIsCapturing(false);
  }

  function compressImage(dataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width * 0.5;
        canvas.height = img.height * 0.5;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  function takeOnePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || video.readyState < 2) return null;

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.filter = filterRef.current;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/jpeg", 0.7);
    } catch (error) {
      return null;
    }
  }

  return (
    <div className="cam w-full min-h-screen flex flex-col items-center px-[30px] py-[40px] text-[#610049]">
      {/* Layout info banner */}
      <div className="bg-[#610049] text-white py-3 px-6 rounded-full mt-4">
        <span className="font-semibold">
          {layoutId ? `Layout ${layoutId} • ` : ""}
          Taking {totalShots} photo{totalShots !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Camera and Preview Container */}
      <div className="flex flex-row items-center gap-5 ml-20">
        {/* Camera */}
        <div className="camera-container relative border-[3px] border-[#610049] rounded-[10px] overflow-hidden shadow-[0_2px_25px_#FFA3A3] mt-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-[640px] h-auto block"
            style={{ filter }}
          />

          {countdown !== null && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                            text-[80px] font-extrabold text-white 
                            drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
            >
              {countdown}
            </div>
          )}
        </div>

        {/* Photo Preview Panel */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-center mb-1 gap-2">
            Photos: {takenPhotos.length} / {totalShots}
          </p>
          <div className="gap-2 flex flex-col p-3 bg-white rounded-lg shadow-md border border-gray-200">
            {Array.from({ length: totalShots }).map((_, i) => (
              <div
                key={i}
                className={`w-[120px] h-[90px] rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  takenPhotos[i]
                    ? "border-[#610049] shadow-md"
                    : "border-dashed border-gray-300 bg-gray-50"
                }`}
              >
                {takenPhotos[i] ? (
                  <img
                    src={takenPhotos[i]}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-semibold">
                    {i + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Capture button */}
      <button
        onClick={startPhotoSession}
        disabled={isCapturing || !isVideoReady}
        className={`
          capture-button font-[Montserrat] mt-3 
          bg-[#FCF9E9] text-[#610049] rounded-[50px] 
          px-[45px] py-[14px] text-[1.1rem] font-semibold 
          shadow-[0_2px_25px_#FFA3A3] transition-transform hover:scale-105
          ${!isVideoReady || isCapturing ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {!isVideoReady
          ? "Loading camera..."
          : isCapturing
          ? `Shooting ${currentShot} / ${totalShots}`
          : "Start Capture"}
      </button>

      {/* Filter selection */}
      <h3 className="filter-title text-[1.1rem] font-bold mt-5 mb-5">
        Choose a filter for your photos!
      </h3>

      <div className="filter-bar inline-flex items-center bg-[#610049] rounded-[50px] p-2 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
        <span className="filter-label text-white text-[1.1rem] font-bold px-[16px] py-[8px] mr-[10px]">
          Filter
        </span>

        {dbFilters.length > 0 ? (
          dbFilters.map((f, index) => (
            <button
              key={index}
              onClick={() => !isCapturing && setFilter(f.value)}
              disabled={isCapturing}
              className={`filter-option border-2 border-white rounded-[50px] px-[18px] py-[8px] mx-[5px] font-semibold transition 
                ${
                  filter === f.value
                    ? "bg-white text-[#610049]"
                    : "bg-transparent text-white hover:bg-white hover:text-[#610049]"
                }
                ${isCapturing ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {f.name}
            </button>
          ))
        ) : (
          <span className="text-white px-4">Loading filters...</span>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
