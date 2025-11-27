import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="pt-5">
      <nav className="mx-10">
        <div className="h-20 bg-[#FCF9E9] rounded-full py-3 px-8 flex items-center justify-between shadow-lg">
          <div className="text-2xl font-extrabold tracking-tight text-[#610049]">
            StudioSnap
          </div>

          <div className="flex items-center gap-x-6">
            <Link
              to="/"
              className="text-base font-bold text-[#610049] hover:opacity-50"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="text-base font-bold text-[#610049] hover:opacity-50"
            >
              About
            </Link>

            <Link
              to="/layout"
              className="text-base font-bold text-[#610049] hover:opacity-50"
            >
              Choose Layout
            </Link>
            <Link
              to="/login"
              className="text-base font-bold text-[#610049] hover:opacity-50"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
