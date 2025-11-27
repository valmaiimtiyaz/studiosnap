import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import layout1 from "../assets/Layout1.svg";
import layout2 from "../assets/Layout2.svg";
import layout3 from "../assets/Layout3.svg";
import layout4 from "../assets/Layout4.svg";

const Layout = () => {
  const [selectedLayout, setSelectedLayout] = useState(null);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (!user || user === "undefined") {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user || user === "undefined") {
    return null; 
  }

  const handleLayoutClick = (id) => {
    setSelectedLayout(selectedLayout === id ? null : id);
  };

  const handleContinue = () => {
    if (selectedLayout) {
      const layout = photoLayouts.find(l => l.id === selectedLayout);
      
      localStorage.setItem("selectedLayoutId", selectedLayout);
      localStorage.setItem("totalShots", layout.photoCount.toString());
      localStorage.setItem("layoutConfig", JSON.stringify({
        id: selectedLayout,
        photoCount: layout.photoCount,
        gridConfig: layout.gridConfig,
      }));
      
      navigate("/cam");
    }
  };

  const photoLayouts = [
    { 
      id: "1", 
      image: layout1, 
      alt: "Layout 1 - 4 photos vertical",
      photoCount: 4,
      gridConfig: { columns: 1, rows: 4, aspectRatio: "3/4" }
    },
    { 
      id: "2", 
      image: layout2, 
      alt: "Layout 2 - 3 photos vertical",
      photoCount: 3,
      gridConfig: { columns: 1, rows: 3, aspectRatio: "4/3" }
    },
    { 
      id: "3", 
      image: layout3, 
      alt: "Layout 3 - 4 photos grid",
      photoCount: 4,
      gridConfig: { columns: 2, rows: 2, aspectRatio: "1/1" }
    },
    { 
      id: "4", 
      image: layout4, 
      alt: "Layout 4 - 2 photos vertical",
      photoCount: 2,
      gridConfig: { columns: 1, rows: 2, aspectRatio: "3/4" }
    },
  ];

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="text-[#610049] text-center mb-10">
        <h1 className="text-[70px] mb-5 font-extrabold leading-none">
          Choose Your Layout !
        </h1>
        <p className="text-[18px] font-medium mb-10 max-w-2xl mx-auto">
          Design your photo moment, select your favorite layout and make every
          pose your own. Mix styles, strike a pose, and let's go!
        </p>
      </div>

      <div className="flex justify-center items-start px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {photoLayouts.map((layout) => (
            <div
              key={layout.id}
              onClick={() => handleLayoutClick(layout.id)}
              className={`
                w-46 h-auto cursor-pointer transition duration-300 transform hover:scale-105 
                overflow-hidden rounded-sm relative
              `}
              style={{
                boxShadow:
                  selectedLayout === layout.id
                    ? `0 0 0 6px #610049, 0 0 15px rgba(255, 255, 255, 0.9)`
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={layout.image}
                alt={layout.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-[#610049] text-white text-xs font-bold px-2 py-1 rounded-full">
                {layout.photoCount} photos
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedLayout && (
        <p className="text-center text-[#610049] mt-6 font-medium">
          Selected: Layout {selectedLayout} ({photoLayouts.find(l => l.id === selectedLayout)?.photoCount} photos)
        </p>
      )}

      <div className="text-center mt-8">
        <button
          onClick={handleContinue}
          disabled={!selectedLayout}
          className={`inline-block no-underline bg-[#FCF9E9] text-[#610049] rounded-full px-[55px] py-4 text-[20px] font-bold shadow-[0_2px_25px_#FFA3A3] transition-all duration-200 
          ${selectedLayout
            ? "hover:scale-105 hover:bg-[#FDF2D0] cursor-pointer"
            : "opacity-50 cursor-not-allowed transform-none"
          }`}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};

export default Layout;
