import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


const ProductPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;

  const deleteProduct = async (id) => {
    if (!isAuthenticated || !token) {
        console.error("User is not authenticated or token is missing.");
        alert("You must be logged in to delete products.");
        return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to delete product: ${errorText}`);
      }
      console.log("Product deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const onDeleteClick = (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this listing? ID: " + id
    );
    if (!confirm) return;

    deleteProduct(id);
  };

  return (
    <div className="product-page">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {/* Display Product Details */}
          <h2>{product.title}</h2>
          <p>Category: {product.category}</p>
          <p>Description: {product.description}</p>
          <p>Price: ${product.price.toFixed(2)}</p>
          <p>Stock: {product.stockQuantity}</p>
          <p>Supplier: {product.supplier.name}</p>
          <p>Contact: {product.supplier.contactEmail}</p>

          {/* Conditional rendering of management buttons */}
          {/* Renders only if the 'isAuthenticated' prop is true */}
          {isAuthenticated && (
            <>
              <button onClick={() => onDeleteClick(product._id)}>Delete</button>
              <button onClick={() => navigate(`/edit-product/${product._id}`)}>
                edit
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPage;
