import { useEffect, useState } from "react";
import API from "../services/api";

function Customers() {

  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: ""
  });

  const loadCustomers = async () => {
    try {

      const response = await API.get("/customers");

      setCustomers(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const addCustomer = async (e) => {

    e.preventDefault();

    try {

      await API.post("/customers", formData);

      setFormData({
        full_name: "",
        email: "",
        phone: ""
      });

      loadCustomers();

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Failed to add customer"
      );

    }
  };

  const deleteCustomer = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this customer?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(`/customers/${id}`);

      loadCustomers();

    } catch (error) {
      console.error(error);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.full_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      customer.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-800">
          Customer Management
        </h1>

        <p className="text-gray-500 mt-1">
          Total Customers: {customers.length}
        </p>

      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Add Customer
        </h2>

        <form
          onSubmit={addCustomer}
          className="grid md:grid-cols-3 gap-4"
        >

          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />

          <button
            className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Add Customer
          </button>

        </form>

      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-semibold">
            Customer List
          </h2>

          <input
            type="text"
            placeholder="Search Customer..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border px-4 py-2 rounded-lg w-64"
          />

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">ID</th>
                <th className="text-left py-3">Name</th>
                <th className="text-left py-3">Email</th>
                <th className="text-left py-3">Phone</th>
                <th className="text-left py-3">Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredCustomers.map((customer) => (

                <tr
                  key={customer.id}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="py-3">
                    {customer.id}
                  </td>

                  <td className="py-3">
                    {customer.full_name}
                  </td>

                  <td className="py-3">
                    {customer.email}
                  </td>

                  <td className="py-3">
                    {customer.phone}
                  </td>

                  <td className="py-3">

                    <button
                      onClick={() =>
                        deleteCustomer(customer.id)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
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

    </div>
  );
}

export default Customers;