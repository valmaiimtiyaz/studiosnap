import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <>
      <main className="text-center px-8 py-[130px] text-[#610049]">
        <h1 className="text-[80px] font-extrabold m-0">Welcome!</h1>

        <h2 className="text-[25px] font-bold mt-[-12px] mb-[30px]">
          Ready, Set, Snap
        </h2>

        <p className="text-[18px] font-medium mt-[-10px] mb-[30px]">
          You've got 3 seconds to shine — no do-overs, just pure fun!
          <br />
          Take 4 epic shots in a row, bring your best energy, and own the camera
          <br />
          After that, save your pics and share your vibe online!
        </p>
        <button
          onClick={() => navigate("/layout")}
          className="inline-block no-underline bg-[#FCF9E9] text-[#610049] rounded-full px-[55px]
          py-4 text-[20px] font-bold shadow-[0_2px_25px_#FFA3A3] transition-transform duration-200 
          hover:scale-105 hover:bg-[#FDF2D0]"
        >
          START
        </button>
      </main>
    </>
  );
};

export default Welcome;
