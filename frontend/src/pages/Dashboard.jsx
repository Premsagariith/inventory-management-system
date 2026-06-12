import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {

  const [dashboardData, setDashboardData] = useState({
    total_products: 0,
    total_customers: 0,
    total_orders: 0,
    low_stock_products: []
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const response = await API.get("/dashboard");
    setDashboardData(response.data);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold mb-8 text-slate-800">
        Inventory Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-500 text-lg">
            Total Products
          </h3>

          <h2 className="text-4xl font-bold text-blue-600 mt-2">
            {dashboardData.total_products}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-500 text-lg">
            Total Customers
          </h3>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {dashboardData.total_customers}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-gray-500 text-lg">
            Total Orders
          </h3>

          <h2 className="text-4xl font-bold text-purple-600 mt-2">
            {dashboardData.total_orders}
          </h2>
        </div>

      </div>

      <div className="bg-white mt-8 rounded-xl shadow-md p-6">

        <h2 className="text-2xl font-semibold mb-4">
          Low Stock Products
        </h2>

        {
          dashboardData.low_stock_products.length === 0 ? (

            <div className="text-green-600 font-medium">
              No Low Stock Products
            </div>

          ) : (

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-3">
                    ID
                  </th>

                  <th className="text-left py-3">
                    Product
                  </th>

                  <th className="text-left py-3">
                    Stock
                  </th>

                </tr>

              </thead>

              <tbody>

                {dashboardData.low_stock_products.map(product => (

                  <tr
                    key={product.id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="py-3">
                      {product.id}
                    </td>

                    <td className="py-3">
                      {product.name}
                    </td>

                    <td className="py-3 text-red-500 font-semibold">
                      {product.quantity}
                    </td>
                  </tr>

                ))}

              </tbody>

            </table>

          )
        }

      </div>

    </div>
  );
}

export default Dashboard;