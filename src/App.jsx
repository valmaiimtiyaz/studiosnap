import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import Layout from "./components/layout.jsx";
import Welcome from "./pages/welcome.jsx";
import Cam from "./pages/cam.jsx";
import LayoutPage from "./pages/layout.jsx";
import Customize from "./pages/customize.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import About from "./pages/about.jsx";
import Profile from "./pages/profile.jsx";
import Library from "./pages/library.jsx";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="text-center px-8 py-[150px] text-[#610049]">
      <h1 className="text-[100px] font-extrabold m-0">StudioSnap</h1>
      <h2 className="text-[25px] font-semibold mt-0 mb-[70px]">
        No Booth, No Problem — Just Snap
      </h2>
      <button
        onClick={() => navigate("/welcome")}
        className="inline-block no-underline bg-[#FCF9E9] text-[#610049] rounded-full px-[55px]
        py-4 text-[20px] font-bold shadow-[0_2px_25px_#FFA3A3] transition-transform duration-200 
        hover:scale-105 hover:bg-[#FDF2D0]"
      >
        START
      </button>
    </main>
  );
};
const AppLayout = () => {
  const location = useLocation();
  const hideLayout = ["/login", "/signup"].includes(location.pathname);
  return (
    <Layout>
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/cam" element={<Cam />} />
        <Route path="/layout" element={<LayoutPage />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
