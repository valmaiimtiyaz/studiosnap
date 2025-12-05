import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://studiosnap-backend.vercel.app";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data) {
        localStorage.setItem("user", JSON.stringify(data.data));

        setPopup({
          show: true,
          message: "Login Successful! Welcome back.",
          type: "success",
        });
      } else {
        setPopup({
          show: true,
          message: data?.message || "Login Failed. Check your credentials.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setPopup({
        show: true,
        message: "Connection error. Please try again later.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePopup = () => {
    if (popup.type === "success") {
      setPopup({ ...popup, show: false });
      navigate("/layout");
    } else {
      setPopup({ ...popup, show: false });
    }
  };

  return (
    <>
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-[#FCF9E9] p-6 rounded-2xl shadow-2xl w-80 text-center border-2 border-[#610049] animate-bounce-in">
            {/* Judul Popup */}
            <h3
              className={`text-2xl font-bold mb-2 ${
                popup.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {popup.type === "success" ? "Yeay!" : "Oops!"}
            </h3>

            {/* Pesan Popup */}
            <p className="text-[#610049] mb-6 font-medium">{popup.message}</p>

            {/* Tombol OK */}
            <button
              onClick={handleClosePopup}
              className="bg-[#610049] text-white px-6 py-2 rounded-full font-bold hover:bg-[#4a003a] transition-transform transform hover:scale-105"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center min-h-screen z-10">
        <div className="bg-[#FCF9E9] backdrop-blur-md p-10 rounded-2xl w-full max-w-md shadow-lg">
          <h2 className="text-3xl font-semibold text-[#610049] text-center mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#610049]"
                placeholder="Enter Your Email"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#610049]"
                placeholder="Enter Your Password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-2 rounded-lg transition-colors duration-200 
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#610049] hover:bg-[#4a003a]"
                }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <span
              className="text-[#610049] font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
