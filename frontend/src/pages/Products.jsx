import { useEffect, useState } from "react";
import API from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: ""
  });

  const [editingProduct, setEditingProduct] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: ""
  });

  const loadProducts = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      await API.post("/products", {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      });

      setFormData({
        name: "",
        sku: "",
        price: "",
        quantity: ""
      });

      loadProducts();
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to add product");
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}`);
      loadProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);

    setEditForm({
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: product.quantity
    });
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      await API.put(
        `/products/${editingProduct.id}`,
        {
          ...editForm,
          price: Number(editForm.price),
          quantity: Number(editForm.quantity)
        }
      );

      setEditingProduct(null);

      loadProducts();
    } catch (error) {
      alert(error.response?.data?.detail || "Update failed");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Product Management
          </h1>

          <p className="text-gray-500 mt-1">
            Total Products: {products.length}
          </p>
        </div>

      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Add Product
        </h2>

        <form
          onSubmit={addProduct}
          className="grid md:grid-cols-4 gap-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={formData.sku}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />

          <button
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Product
          </button>

        </form>

      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-semibold">
            Product Inventory
          </h2>

          <input
            type="text"
            placeholder="Search Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-lg w-64"
          />

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">
                <th className="text-left py-3">ID</th>
                <th className="text-left py-3">Name</th>
                <th className="text-left py-3">SKU</th>
                <th className="text-left py-3">Price</th>
                <th className="text-left py-3">Stock</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredProducts.map((product) => (

                <tr
                  key={product.id}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="py-3">{product.id}</td>

                  <td className="py-3">{product.name}</td>

                  <td className="py-3">{product.sku}</td>

                  <td className="py-3">
                    ₹ {product.price}
                  </td>

                  <td className="py-3">
                    {product.quantity}
                  </td>

                  <td className="py-3">

                    {product.quantity < 5 ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                        In Stock
                      </span>
                    )}

                  </td>

                  <td className="py-3">

                    <div className="flex gap-2">

                      <button
                        onClick={() => openEditModal(product)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {editingProduct && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-[500px] shadow-xl">

            <h2 className="text-2xl font-bold mb-4">
              Edit Product
            </h2>

            <form
              onSubmit={updateProduct}
              className="space-y-4"
            >

              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    name: e.target.value
                  })
                }
                className="w-full border p-3 rounded"
              />

              <input
                type="text"
                value={editForm.sku}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    sku: e.target.value
                  })
                }
                className="w-full border p-3 rounded"
              />

              <input
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    price: e.target.value
                  })
                }
                className="w-full border p-3 rounded"
              />

              <input
                type="number"
                value={editForm.quantity}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    quantity: e.target.value
                  })
                }
                className="w-full border p-3 rounded"
              />

              <div className="flex gap-3">

                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Update
                </button>

                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Products;