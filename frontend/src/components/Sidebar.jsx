import { Link, useLocation } from "react-router-dom";

function Sidebar() {

  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/"
    },
    {
      name: "Products",
      path: "/products"
    },
    {
      name: "Customers",
      path: "/customers"
    },
    {
      name: "Orders",
      path: "/orders"
    }
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white fixed left-0 top-0">

      <div className="p-6 border-b border-slate-700">

        <h1 className="text-2xl font-bold">
          InventoryPro
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Management System
        </p>

      </div>

      <div className="mt-6">

        {menuItems.map((item) => (

          <Link
            key={item.path}
            to={item.path}
            className={`
              block px-6 py-4 transition
              ${
                location.pathname === item.path
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }
            `}
          >
            {item.name}
          </Link>

        ))}

      </div>

    </div>
  );
}

export default Sidebar;