import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { productId } = useParams();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [supplierRating, setSupplierRating] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const navigate = useNavigate();

  const updateProduct = async (product) => {
    if (!token) {
        console.error("Authentication token missing.");
        return false;
    }

    try {
      console.log("Updating product:", product);
      const res = await fetch(`/api/products/${product.productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Server Error:", errorData.error);
        throw new Error("Failed to update product");
      }
      return res.ok;
    } catch (error) {
      console.error("Error updating product:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setProduct(data);
        setTitle(data.title);
        setCategory(data.category);
        setDescription(data.description);
        setPrice(data.price.toString());
        setStockQuantity(data.stockQuantity.toString());
        setSupplierName(data.supplier.name);
        setContactEmail(data.supplier.contactEmail);
        setContactPhone(data.supplier.contactPhone);
        setSupplierRating(data.supplier.rating ? data.supplier.rating.toString() : '');

      } catch (error) {
        console.error("Failed to fetch product:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const submitForm = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      productId,
      title,
      category,
      description,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity),
      supplier: {
        name: supplierName,
        contactEmail,
        contactPhone,
        rating: supplierRating ? parseInt(supplierRating) : undefined,
      },
    };

    const success = await updateProduct(updatedProduct);
    if (success) {
      console.log("Product Updated Successfully");
      navigate(`/products/${productId}`);
    } else {
      console.error("Failed to update the product");
    }
  };

  return (
    <div className="create">
      <h2>Update Product</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <form onSubmit={submitForm}>
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
            step="0.01"
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

          <button type="submit">Update Product</button>
        </form>
      )}
    </div>
  );
};

export default EditProductPage;
