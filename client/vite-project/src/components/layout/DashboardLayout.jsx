// import Navbar from "./Navbar";

function DashboardLayout({ children }) {

  return (

    <div className="
      min-h-screen
      bg-slate-950
      text-white
    ">

      {/* <Navbar /> */}

      <div className="p-8">

        {children}

      </div>

    </div>
  );
}

export default DashboardLayout;