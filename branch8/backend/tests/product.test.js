const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const Product = require("../models/productModel");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (user) =>
  jwt.sign({ _id: user._id, role: user.role }, process.env.SECRET, { expiresIn: "1h", });

// Create test users
const createUser = async (role) => {
  const user = new User({
    name: `Test ${role}`,
    email: `${role.toLowerCase()}@example.com`,
    password: "Password123!",
    role,
    address: "123 Test Street",
  });
  await user.save();
  return user;
};

// Create a product payload
const productPayload = (overrides = {}) => ({
  title: "Sample Product",
  category: "Electronics",
  description: "A sample product",
  price: 100,
  stockQuantity: 10,
  supplier: {
    name: "Supplier",
    contactEmail: "supplier@example.com",
    contactPhone: "1234567890",
    rating: 4,
  },
  ...overrides,
});

let adminUser, sellerUser, buyerUser;
let adminToken, sellerToken, buyerToken;

// Create users and tokens
beforeAll(async () => {
  await User.deleteMany({});

  adminUser = await createUser("Admin");
  sellerUser = await createUser("Seller");
  buyerUser = await createUser("Buyer");

  adminToken = generateToken(adminUser);
  sellerToken = generateToken(sellerUser);
  buyerToken = generateToken(buyerUser);
});

// Clear collections before each test
beforeEach(async () => {
  await Product.deleteMany({});
});

// Close DB connection
afterAll(async () => {
  await mongoose.connection.close();
});

describe("product management by Admin, Seller, and Buyer", () => {
  describe("authentication & authorization", () => {
    it("should deny access to get products if user is not authenticated", async () => {
      const res = await api.get("/api/products");
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Authorization token required");
    });

    it("should deny access to get products if user is unauthorized", async () => {
      const res = await api
        .get("/api/products")
        .set("Authorization", "Bearer invalidtoken");
      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Request is not authorized");
    });
  });
  describe("creating products", () => {
    it("should permit Admin to create a product", async () => {
      const res = await api
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productPayload());

      expect(res.status).toBe(201);
      expect(res.body.title).toBe("Sample Product");
    });

    it("should permit Seller to create a product", async () => {
      const res = await api
        .post("/api/products")
        .set("Authorization", `Bearer ${sellerToken}`)
        .send(productPayload());

      expect(res.status).toBe(201);
      expect(res.body.title).toBe("Sample Product");
    });

    it("should deny Buyer to create a product", async () => {
      const res = await api
        .post("/api/products")
        .set("Authorization", `Bearer ${buyerToken}`)
        .send(productPayload());

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Access Denied");
    });
  });

  describe("Updating Products", () => {
    it("should permit only Admin to update a product", async () => {
      const product = await api
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productPayload());

      const res = await api
        .put(`/api/products/${product.body.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Updated Product" });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Updated Product");
    });

    it("should deny Seller to update a product", async () => {
      const product = await api
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productPayload());

      const res = await api
        .put(`/api/products/${product.body.id}`)
        .set("Authorization", `Bearer ${sellerToken}`)
        .send({ title: "Should not update" });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Access Denied");
    });

    it("should return invalid request message for invalid product ID", async () => {
      const res = await api
        .put("/api/products/invalidid")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Test" });

      expect(res.status).toBe(400);
    });
  });

  describe("deleting Products", () => {
    it("should permit Admin to delete a product", async () => {
      const product = await api
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productPayload());

      const res = await api
        .delete(`/api/products/${product.body.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(204);
    });

    it("should deny Seller to delete a product", async () => {
      const product = await api
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productPayload());

      const res = await api
        .delete(`/api/products/${product.body.id}`)
        .set("Authorization", `Bearer ${sellerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Access Denied");
    });

    it("should deny Buyer to delete a product", async () => {
      const product = await api
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productPayload());

      const res = await api
        .delete(`/api/products/${product.body.id}`)
        .set("Authorization", `Bearer ${buyerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("Access Denied");
    });
  });

  describe("viewing products", () => {
    it("should allow authenticated Buyer to get a product", async () => {
      const product = await api
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productPayload());

      const res = await api
        .get(`/api/products/${product.body.id}`)
        .set("Authorization", `Bearer ${buyerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Sample Product");
    });

    it("should return invalid request message for invalid product ID", async () => {
      const res = await api
        .get("/api/products/invalidid")
        .set("Authorization", `Bearer ${buyerToken}`);

      expect(res.status).toBe(400);
    });
  });
});
