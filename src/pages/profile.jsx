import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Yakin ingin keluar?");
    if (confirmLogout) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("takenPhotos");
      window.dispatchEvent(new Event("authChange"));
      navigate("/");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-28 pb-10 flex flex-col items-center justify-center overflow-hidden">
      <div className="relative bg-white p-5 pb-8 shadow-[0_20px_50px_rgba(97,0,73,0.3)] border border-gray-200 w-80 transform -rotate-2 hover:rotate-0 transition-transform duration-500 ease-in-out">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-10 bg-[#FCF9E9]/80 backdrop-blur-sm border border-[#610049]/10 rotate-1 shadow-sm z-10"></div>
        <div className="bg-[#FCF9E9] w-full aspect-[4/4] border border-[#610049]/10 flex flex-col items-center justify-center mb-6 relative overflow-hidden">
            <div className="w-28 h-28 rounded-full bg-[#610049] text-[#FCF9E9] flex items-center justify-center text-5xl font-bold shadow-inner">
                {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-4 right-4 bg-[#610049] text-white text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest">
                Member
            </div>
        </div>

        <div className="text-center">
            <h1 className="text-3xl font-extrabold text-[#610049] mb-1 font-[Montserrat]">
                {user.username}
            </h1>
            
            <p className="text-gray-400 text-sm font-mono mb-6">
                {user.email}
            </p>
            <div className="w-full border-t-2 border-dashed border-[#610049]/20 mb-6"></div>
            <div className="flex flex-col gap-3">
                <button 
                    onClick={() => navigate('/layout')}
                    className="text-xs font-bold uppercase tracking-widest text-[#610049] hover:bg-[#FCF9E9] py-2 border border-transparent hover:border-[#610049] transition-all"
                >
                    + Take New Photo
                </button>
                
                <button 
                    onClick={handleLogout}
                    className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600 py-2"
                >
                    Log Out
                </button>
            </div>
        </div>
      </div>

    </div>
  );
};

export default Profile;
