const express = require("express");

const router = express.Router();

// Controller
const {
  register,
  login,
  logout,
  checkAuth,
} = require("../controllers/auth.js");
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.js");
const {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.js");
const {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/book.js");
const {
  addBorrow,
  getBorrows,
  getBorrowById,
  updateBorrow,
} = require("../controllers/borrow.js");
const { refreshToken } = require("../controllers/refreshToken.js");
const { verifyToken } = require("../middlewares/VerifyToken.js");

// --- Auth Routes ---
router.post("/register", register);
router.post("/login", login);
router.get("/token", refreshToken);
router.get("/check-auth", checkAuth);
router.delete("/logout", logout);

// --- User Routes ---
router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.patch("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);

// --- Category Routes ---
router.post("/category", verifyToken, addCategory);
router.get("/categories", verifyToken, getCategories);
router.get("/category/:id", verifyToken, getCategoryById);
router.patch("/category/:id", verifyToken, updateCategory);
router.delete("/category/:id", verifyToken, deleteCategory);

// --- Book Routes ---
router.post("/book", verifyToken, addBook);
router.get("/books", verifyToken, getBooks);
router.get("/books/:id", verifyToken, getBookById);
router.patch("/books/:id", verifyToken, updateBook);
// router.delete("/books/:id", verifyToken, deleteBook); // I HAVE AN ERROR IN THE TABLE RELATION TO RUN THIS DELETE CONTROL

// Borrow Routes ---
router.post("/borrow", verifyToken, addBorrow);
router.get("/borrows", verifyToken, getBorrows);
router.get("/borrows/:id", verifyToken, getBorrowById);
router.patch("/borrows/:id", verifyToken, updateBorrow);

module.exports = router;
