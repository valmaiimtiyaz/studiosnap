import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen z-10 p-4">
      <div className="relative bg-[#FCF9E9] w-full max-w-sm rounded-xl shadow-[0_10px_40px_-10px_rgba(97,0,73,0.5)] overflow-hidden border-4 border-white transform transition-transform hover:scale-[1.02] duration-300">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-[#610049] rounded-full opacity-20"></div>
        <div className="bg-[#610049] h-32 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-[-20px] left-[-20px] w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-[-10px] right-[-10px] w-14 h-14 bg-white opacity-10 rounded-full"></div>
        </div>

        <div className="flex justify-center -mt-16 relative">
          <div className="w-32 h-32 bg-[#FCF9E9] rounded-full flex items-center justify-center p-2 shadow-lg">
             <div className="w-full h-full bg-[#610049] rounded-full flex items-center justify-center text-white text-5xl font-extrabold border-4 border-white">
                {user.username ? user.username.charAt(0).toUpperCase() : "S"}
             </div>
          </div>
          <div className="absolute bottom-0 right-[35%] bg-white text-[#610049] rounded-full p-2 border-2 border-[#610049] shadow-sm">
             📷
          </div>
        </div>

        <div className="px-8 pt-4 pb-8 text-center space-y-1">
          <h1 className="text-3xl font-extrabold text-[#610049]">
            @{user.username || "Guest"}
          </h1>
          <p className="text-gray-500 font-medium text-sm pb-4 border-b-2 border-dashed border-gray-300">
            {user.email || "No Email"}
          </p>
          <div className="flex justify-around py-4 text-[#610049]">
            <div className="flex flex-col">
              <span className="font-bold text-xl">0</span>
              <span className="text-xs uppercase tracking-wide opacity-70">Photos</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl">Active</span>
              <span className="text-xs uppercase tracking-wide opacity-70">Status</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleLogout}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-[#610049] hover:bg-[#4a003a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#610049] shadow-md transition-all duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-[#FCF9E9] group-hover:text-white transition ease-in-out duration-150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </span>
              LOG OUT
            </button>
          </div>
        </div>
        
        <div className="bg-gray-100 h-12 flex items-center justify-center opacity-50">
           <div className="h-6 w-48 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Barcode_UPC-A.svg/1200px-Barcode_UPC-A.svg.png')] bg-cover bg-center grayscale opacity-40"></div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
