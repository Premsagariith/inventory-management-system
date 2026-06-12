import Sidebar from "./Sidebar";

function Layout({ children }) {

  return (
    <div className="flex">

      <Sidebar />

      <main className="ml-64 flex-1 min-h-screen bg-slate-100">

        {children}

      </main>

    </div>
  );
}

export default Layout;