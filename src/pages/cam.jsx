import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CamPage() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [filter, setFilter] = useState("none");
  const [countdown, setCountdown] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [currentShot, setCurrentShot] = useState(0);
  
  const [totalShots, setTotalShots] = useState(4);
  const [layoutId, setLayoutId] = useState(null);
  const [takenPhotos, setTakenPhotos] = useState([]);

  const photosArrayRef = useRef([]);
  const isCapturingRef = useRef(false);
  const filterRef = useRef(filter);

  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  // Load layout config
  useEffect(() => {
    const configJson = localStorage.getItem("layoutConfig");
    
    if (configJson) {
      try {
        const config = JSON.parse(configJson);
        console.log("Loaded layout config:", config);
        setTotalShots(config.photoCount);
        setLayoutId(config.id);
      } catch (e) {
        console.error("Failed to parse layout config:", e);
        const shots = parseInt(localStorage.getItem("totalShots")) || 4;
        setTotalShots(shots);
      }
    } else {
      const shots = parseInt(localStorage.getItem("totalShots")) || 4;
      console.log("No layout config found, using fallback:", shots);
      setTotalShots(shots);
    }
  }, []);

  // Start Camera
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
        console.error("Error accessing camera:", err);
        alert("Camera access denied. Please allow camera permission.");
      }
    }

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function startPhotoSession() {
    if (isCapturingRef.current || !isVideoReady) {
      console.log("Cannot start: already capturing or video not ready");
      return;
    }

    console.log(`Starting photo session with ${totalShots} shots...`);
    isCapturingRef.current = true;
    setIsCapturing(true);
    photosArrayRef.current = [];
    setTakenPhotos([]);

    for (let shot = 1; shot <= totalShots; shot++) {
      console.log(`Starting shot ${shot} of ${totalShots}`);
      setCurrentShot(shot);

      for (let i = 3; i >= 1; i--) {
        setCountdown(i);
        await sleep(1000);
      }

      // Take photo and update preview
      const photoData = takeOnePhoto();
      if (photoData) {
        photosArrayRef.current.push(photoData);
        setTakenPhotos(prev => [...prev, photoData]);
        console.log(`Shot ${shot} captured successfully`);
      } else {
        console.log(`Shot ${shot} failed`);
      }

      setCountdown("📸");
      await sleep(800);
      setCountdown(null);

      if (shot < totalShots) {
        await sleep(1500);
      }
    }

    console.log(`Photo session complete. Captured ${photosArrayRef.current.length} photos`);
    await saveAndNavigate();
  }

  async function saveAndNavigate() {
    const photos = photosArrayRef.current;
    
    if (photos.length === 0) {
      alert("No photos were captured. Please try again.");
      isCapturingRef.current = false;
      setIsCapturing(false);
      return;
    }

    try {
      localStorage.removeItem("takenPhotos");
      localStorage.setItem("takenPhotos", JSON.stringify(photos));
      
      console.log("Photos saved successfully, navigating...");
      await sleep(300);
      navigate("/customize");
      
    } catch (error) {
      console.error("Save error:", error);
      
      if (error.name === "QuotaExceededError" || error.message?.includes("quota")) {
        await saveCompressed(photos);
      } else {
        alert("Failed to save photos: " + error.message);
        isCapturingRef.current = false;
        setIsCapturing(false);
      }
    }
  }

  async function saveCompressed(photos) {
    try {
      const compressedPhotos = await Promise.all(
        photos.map(dataUrl => compressImage(dataUrl))
      );
      
      localStorage.removeItem("takenPhotos");
      localStorage.setItem("takenPhotos", JSON.stringify(compressedPhotos));
      
      await sleep(300);
      navigate("/customize");
      
    } catch (error) {
      alert("Photos are too large to save. Please try with fewer photos.");
      isCapturingRef.current = false;
      setIsCapturing(false);
    }
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

    if (!video || !canvas) {
      console.error("Video or canvas not available");
      return null;
    }

    if (video.readyState < 2) {
      console.error("Video not ready, readyState:", video.readyState);
      return null;
    }

    try {
      const scale = 0.75;
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;

      const ctx = canvas.getContext("2d");
      ctx.filter = filterRef.current;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      
      if (dataUrl && dataUrl.length > 100) {
        console.log(`Photo captured, size: ${Math.round(dataUrl.length / 1024)}KB`);
        return dataUrl;
      }
      
      console.error("Generated empty image");
      return null;
      
    } catch (error) {
      console.error("Error in takeOnePhoto:", error);
      return null;
    }
  }

  return (
    <div className="cam w-full min-h-screen flex flex-col items-center px-[30px] py-[40px] text-[#610049]">

      {/* Layout info banner */}
      <div className="bg-[#610049] text-white py-3 px-6 rounded-full">
        <span className="font-semibold">
          {layoutId ? `Layout ${layoutId} • ` : ""}
          Taking {totalShots} photo{totalShots !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Camera and Preview Container */}
      <div className="flex flex-row items-center gap-5 ml-20">
        
        {/* Camera */}
        <div className="camera-container relative border-[3px] border-[#610049] rounded-[10px] overflow-hidden shadow-[0_2px_25px_#FFA3A3]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-[640px] h-auto block"
            style={{ filter }}
          />

          {countdown !== null && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                            text-[80px] font-extrabold text-white 
                            drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
              {countdown}
            </div>
          )}
        </div>

        {/* Photo Preview Panel */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-center mb-1">
            Photos: {takenPhotos.length} / {totalShots}
          </p>
          <div className="flex flex-col p-3 bg-white rounded-lg shadow-md border border-gray-200">
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
          capture-button font-[Montserrat] mt-6 
          bg-[#FCF9E9] text-[#610049] rounded-[50px] 
          px-[45px] py-[14px] text-[1.1rem] font-semibold 
          shadow-[0_2px_25px_#FFA3A3] transition-transform hover:scale-105
          ${(!isVideoReady || isCapturing) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {!isVideoReady
          ? "Loading camera..."
          : isCapturing
            ? `Shooting ${currentShot} / ${totalShots}`
            : "Start Capture"}
      </button>

      {/* Filter selection */}
      <h3 className="filter-title text-[1.1rem] font-bold mt-[30px] mb-[15px]">
        Choose a filter for your photos!
      </h3>

      <div className="filter-bar inline-flex items-center bg-[#610049] rounded-[50px] p-2 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
        <span className="filter-label text-white text-[1.1rem] font-bold px-[16px] py-[8px] mr-[10px]">
          Filter
        </span>

        {[
          { name: "No Filter", value: "none" },
          { name: "B&W", value: "grayscale(100%) contrast(130%)" },
          { name: "Sepia", value: "sepia(100%)" },
          { name: "Vintage", value: "sepia(60%) contrast(110%)" },
        ].map((f) => (
          <button
            key={f.name}
            onClick={() => !isCapturing && setFilter(f.value)}
            disabled={isCapturing}
            className={`filter-option border-2 border-white rounded-[50px] px-[18px] py-[8px] mx-[5px] font-semibold transition 
              ${filter === f.value
                  ? "bg-white text-[#610049]"
                  : "bg-transparent text-white hover:bg-white hover:text-[#610049]"
              }
              ${isCapturing ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {f.name}
          </button>
        ))}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}