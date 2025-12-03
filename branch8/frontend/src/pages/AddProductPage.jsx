import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
  // --- State Setup for Product Fields ---
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronics"); // Initial category
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  // --- State Setup for Nested Supplier Fields ---
  const [supplierName, setSupplierName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [supplierRating, setSupplierRating] = useState("");

  // --- Authentication and Navigation ---
  // Retrieves the user token for the Authorization header
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const navigate = useNavigate();

  // --- API Call Function ---
  const addProduct = async (newProduct) => {
    // Check if token exists before proceeding
    if (!token) {
        console.error("Authentication token missing. Cannot add product.");
        alert("You must be logged in to add a product.");
        return false;
    }

    try {
      console.log("Adding product:", newProduct);
      const res = await fetch("/api/products", { // 👈 Change API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔒 Required Authorization header
        },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) {
        // Log the server's response for better debugging
        const errorData = await res.json();
        console.error("Server Error:", errorData.error);
        throw new Error("Failed to add product");
      }
      return true;
    } catch (error) {
      console.error("Error adding product:", error);
      return false;
    }
  };

  // --- Form Submission Handler ---
  const submitForm = async (e) => {
    e.preventDefault();

    // Construct the new product object matching the Mongoose schema
    const newProduct = {
      title,
      category,
      description,
      price: parseFloat(price), // Convert to number
      stockQuantity: parseInt(stockQuantity), // Convert to integer
      supplier: {
        name: supplierName,
        contactEmail,
        contactPhone,
        rating: parseInt(supplierRating), // Convert to integer
      },
    };

    const success = await addProduct(newProduct);
    if (success) {
      console.log("Product Added Successfully");
      navigate("/"); // Redirect to homepage or product list
    } else {
      console.error("Failed to add the product");
    }
  };

  // --- Rendered Form ---
  return (
    <div className="create">
      <h2>Add a New Product</h2>
      <form onSubmit={submitForm}>
        {/* Basic Product Details */}
        <label>Product Title:</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Category:</label>
        <select
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Furniture">Furniture</option>
          <option value="Books">Books</option>
        </select>

        <label>Product Description:</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <label>Price ($):</label>
        <input
          type="number"
          step="0.01" // Allows for decimal prices
          min="0"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label>Stock Quantity:</label>
        <input
          type="number"
          min="0"
          required
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
        />

        {/* Supplier Details (Nested) */}
        <hr />
        <h3>Supplier Information</h3>

        <label>Supplier Name:</label>
        <input
          type="text"
          required
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
        />
        <label>Contact Email:</label>
        <input
          type="email"
          required
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <label>Contact Phone:</label>
        <input
          type="tel"
          required
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
        <label>Supplier Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={supplierRating}
          onChange={(e) => setSupplierRating(e.target.value)}
        />

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductPage;
