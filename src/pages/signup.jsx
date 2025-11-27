import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://studiosnap-backend.vercel.app";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration Successful! Please Login.");
        navigate("/login");
      } else {
        alert(data.message || "Registration Failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("A connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen z-10">
        <div className="bg-[#FCF9E9] backdrop-blur-md p-10 rounded-2xl w-full max-w-md shadow-lg">
          <h2 className="text-3xl font-semibold text-[#610049] text-center mb-6">
            Sign Up
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
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#610049]"
                placeholder="Enter Your Username"
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
              disabled={loading}
              className={`w-full bg-[#610049] text-white py-2 rounded-lg hover:bg-[#4a003a] transition-colors duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Already Have an account?{" "}
            <span
              className="text-[#610049] font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
