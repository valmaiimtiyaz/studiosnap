import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); 
    
    alert("You have been logged out.");
    window.location.href = "/login"; 
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen z-10">
        <div className="bg-[#FCF9E9] backdrop-blur-md p-10 rounded-2xl w-full max-w-md shadow-lg">
          <h2 className="text-3xl font-semibold text-[#610049] text-center mb-2">
            My Profile
          </h2>
        
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#610049] rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-[#4a003a]">
              {user.username ? user.username.charAt(0).toUpperCase() : "?"}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Username
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800">
                {user.username || "Loading..."}
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800">
                {user.email || "Loading..."}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-[#610049] text-white py-2 rounded-lg hover:bg-[#4a003a] transition-colors duration-200 font-bold mt-4"
            >
              Logout
            </button>
             <button
              onClick={() => navigate("/layout")}
              className="w-full bg-transparent border-2 border-[#610049] text-[#610049] py-2 rounded-lg hover:bg-[#610049] hover:text-white transition-colors duration-200 font-semibold"
            >
              Back to Layout
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
