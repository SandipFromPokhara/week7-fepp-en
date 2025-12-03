import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// pages & components
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import AddJobPage from "./pages/AddJobPage";
import JobPage from "./pages/JobPage";
import EditJobPage from "./pages/EditJobPage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductPage from "./pages/ProductPage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token ? true : false;
  });


  return (
    <div className="App">
      <BrowserRouter>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/:id" element={<JobPage isAuthenticated={isAuthenticated} />} />
            <Route
              path="/jobs/add-job"
              element={isAuthenticated ? <AddJobPage /> : <Navigate to="/signup" />}
            />
            <Route
              path="/edit-job/:id"
              element={isAuthenticated ? <EditJobPage /> : <Navigate to="/signup" />}
            />
            <Route
              path="/products/:productId"
              element={<ProductPage isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/products/add-product"
              element={isAuthenticated ? <AddProductPage /> : <Navigate to="/signup" />}
            />
            <Route
              path="/edit-product/:productId"
              element={isAuthenticated ? <EditProductPage /> : <Navigate to="/signup" />}
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Signup setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
