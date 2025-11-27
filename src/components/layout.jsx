const Layout = ({ children }) => {
  return (
    <div
      className="min-h-screen font-['Montserrat',sans-serif] p-6 box-border"
      style={{
        backgroundImage: "radial-gradient(circle, #FCF9E9 5%, #FFBDBD)",
        backgroundAttachment: "fixed",
      }}
    >
      {children}
    </div>
  );
};

export default Layout;
