import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://studiosnap-backend.vercel.app";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setEditUsername(parsedUser.username);
        setEditEmail(parsedUser.email);
      } catch (error) {
        console.error("Data error:", error);
        localStorage.removeItem("user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSave = async () => {
    if (!editUsername || !editEmail) {
      setPopup({
        show: true,
        message: "Username and Email cannot be empty",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/users/${user._id || user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: editUsername,
            email: editEmail,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPopup({
          show: true,
          message: "Profile Updated Successfully!",
          type: "success",
        });
        const updatedUser = { ...user, ...data.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
      } else {
        setPopup({
          show: true,
          message: data.message || "Failed to update profile",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      setPopup({
        show: true,
        message: "Error connecting to server",
        type: "error",
      });
    }
  };

  const handleDeleteClick = () => {
    setConfirmModal({
      show: true,
      message:
        "WARNING: Are you sure you want to delete your account? This cannot be undone.",
      type: "delete",
    });
  };

  const executeDelete = async () => {
    setConfirmModal({ ...confirmModal, show: false });
    try {
      const response = await fetch(
        `${API_URL}/api/users/${user._id || user.id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("Account Deleted. Goodbye!");
        localStorage.clear();
        window.location.href = "/login";
      } else {
        setPopup({
          show: true,
          message: "Failed to delete account",
          type: "error",
        });
      }
    } catch (error) {
      setPopup({
        show: true,
        message: "Error connecting to server",
        type: "error",
      });
    }
  };

  const handleLogoutClick = () => {
    setConfirmModal({
      show: true,
      message: "Are you sure you want to log out?",
      type: "logout",
    });
  };

  const executeLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("takenPhotos");
    localStorage.removeItem("selectedLayoutId");
    window.location.href = "/login";
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-28 pb-10 flex flex-col items-center justify-center overflow-hidden">
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-[#FCF9E9] p-6 rounded-2xl shadow-2xl w-80 text-center border-2 border-[#610049] animate-bounce-in">
            <h3
              className={`text-2xl font-bold mb-2 ${
                popup.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {popup.type === "success" ? "Success!" : "Oops!"}
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

      {confirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-[#FCF9E9] p-6 rounded-2xl shadow-2xl w-80 text-center border-2 border-[#610049] animate-bounce-in">
            <h3 className="text-xl font-bold mb-2 text-[#610049]">
              Confirmation
            </h3>
            <p className="text-[#610049] mb-6 font-medium">
              {confirmModal.message}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() =>
                  setConfirmModal({ ...confirmModal, show: false })
                }
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full font-bold hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={
                  confirmModal.type === "delete" ? executeDelete : executeLogout
                }
                className={`px-6 py-2 rounded-full font-bold text-white ${
                  confirmModal.type === "delete"
                    ? "bg-red-500 hover:bg-red-700"
                    : "bg-[#610049] hover:bg-[#4a003a]"
                }`}
              >
                Yes, {confirmModal.type === "delete" ? "Delete" : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative bg-white p-5 pb-8 shadow-[0_20px_50px_rgba(97,0,73,0.3)] border border-gray-200 w-80 transform -rotate-2 hover:rotate-0 transition-transform duration-500 ease-in-out">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-10 bg-[#FCF9E9]/80 backdrop-blur-sm border border-[#610049]/10 rotate-1 shadow-sm z-10"></div>

        <div className="bg-[#FCF9E9] w-full aspect-[4/4] border border-[#610049]/10 flex flex-col items-center justify-center mb-6 relative overflow-hidden">
          <div className="w-28 h-28 rounded-full bg-[#610049] text-[#FCF9E9] flex items-center justify-center text-5xl font-bold shadow-inner">
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        <div className="text-center">
          {isEditing ? (
            <div className="flex flex-col gap-2 mb-4">
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="border border-[#610049] rounded px-2 py-1 text-center font-bold text-[#610049]"
                placeholder="Username"
              />
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="border border-[#610049] rounded px-2 py-1 text-center text-sm"
                placeholder="Email"
              />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-extrabold text-[#610049] mb-1 font-[Montserrat]">
                {user.username || "User"}
              </h1>
              <p className="text-gray-400 text-sm font-mono mb-6">
                {user.email || "No Email"}
              </p>
            </>
          )}

          <div className="w-full border-t-2 border-dashed border-[#610049]/20 mb-6"></div>

          <div className="flex flex-col gap-3">
            {!isEditing && (
              <button
                onClick={() => navigate("/layout")}
                className="text-xs font-bold uppercase tracking-widest text-[#610049] hover:bg-[#FCF9E9] py-2 border border-transparent hover:border-[#610049] transition-all"
              >
                + Take New Photo
              </button>
            )}

            {isEditing ? (
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-[#610049] text-white text-xs font-bold uppercase py-2 rounded hover:bg-[#4a003a]"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-700 text-xs font-bold uppercase py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 py-2"
              >
                Edit Profile
              </button>
            )}

            <div className="flex justify-between mt-2 pt-2 border-t border-gray-100">
              <button
                onClick={handleLogoutClick}
                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600"
              >
                Log Out
              </button>

              <button
                onClick={handleDeleteClick}
                className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
