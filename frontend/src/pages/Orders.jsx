import { useEffect, useState } from "react";
import API from "../services/api";

function Orders() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");

  const [quantities, setQuantities] = useState({});

  const loadData = async () => {
    try {
      const customerRes = await API.get("/customers");
      const productRes = await API.get("/products");
      const orderRes = await API.get("/orders");

      setCustomers(customerRes.data);
      setProducts(productRes.data);
      setOrders(orderRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: value
    });
  };

  const calculateTotal = () => {
    let total = 0;

    products.forEach((product) => {
      const qty = Number(quantities[product.id] || 0);

      total += qty * Number(product.price);
    });

    return total;
  };

  const placeOrder = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }

    const items = Object.keys(quantities)
      .filter((id) => Number(quantities[id]) > 0)
      .map((id) => ({
        product_id: Number(id),
        quantity: Number(quantities[id])
      }));

    if (items.length === 0) {
      alert("Please select at least one product");
      return;
    }

    try {
      await API.post("/orders", {
        customer_id: Number(selectedCustomer),
        items
      });

      alert("Order Created Successfully");

      setSelectedCustomer("");
      setQuantities({});

      loadData();
    } catch (error) {
      alert(
        error.response?.data?.detail ||
        "Failed to create order"
      );
    }
  };

  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this order?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/orders/${id}`);

      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold text-slate-800 mb-8">
        Order Management
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">

        <h2 className="text-2xl font-semibold mb-4">
          Create Order
        </h2>

        <select
          value={selectedCustomer}
          onChange={(e) =>
            setSelectedCustomer(e.target.value)
          }
          className="border p-3 rounded w-full mb-6"
        >
          <option value="">
            Select Customer
          </option>

          {customers.map((customer) => (
            <option
              key={customer.id}
              value={customer.id}
            >
              {customer.full_name}
            </option>
          ))}
        </select>

        <div className="space-y-4">

          {products.map((product) => (

            <div
              key={product.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >

              <div>
                <h3 className="font-semibold">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-500">
                  SKU: {product.sku}
                </p>

                <p className="text-green-600 font-medium">
                  ₹ {product.price}
                </p>

                <p className="text-blue-600 text-sm">
                  Stock: {product.quantity}
                </p>
              </div>

              <input
                type="number"
                min="0"
                value={quantities[product.id] || ""}
                onChange={(e) =>
                  handleQuantityChange(
                    product.id,
                    e.target.value
                  )
                }
                placeholder="Qty"
                className="border p-2 rounded w-24"
              />

            </div>

          ))}

        </div>

        <div className="mt-6 flex justify-between items-center">

          <h3 className="text-2xl font-bold text-purple-600">
            Total: ₹ {calculateTotal()}
          </h3>

          <button
            onClick={placeOrder}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Place Order
          </button>

        </div>

      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">

        <h2 className="text-2xl font-semibold mb-4">
          Orders
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b">
              <th className="text-left py-3">
                Order ID
              </th>

              <th className="text-left py-3">
                Customer ID
              </th>

              <th className="text-left py-3">
                Total Amount
              </th>

              <th className="text-left py-3">
                Action
              </th>
            </tr>

          </thead>

          <tbody>

            {orders.map((order) => (

              <tr
                key={order.id}
                className="border-b"
              >

                <td className="py-3">
                  {order.id}
                </td>

                <td className="py-3">
                  {order.customer_id}
                </td>

                <td className="py-3">
                  ₹ {order.total_amount}
                </td>

                <td className="py-3">

                  <button
                    onClick={() =>
                      deleteOrder(order.id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Orders;