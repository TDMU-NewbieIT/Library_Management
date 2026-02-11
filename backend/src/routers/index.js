const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const pageController = require('../controllers/pageController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

const systemRouter = require('./systemRouter');

// --- Auth Routes ---
router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);
router.get("/auth/me", authMiddleware, userController.getMe);

// --- System Routes ---
router.use("/system", systemRouter);

// --- User Routes ---
router.get("/users/:userId", authMiddleware, userController.getProfile);
router.put("/users/:userId", authMiddleware, userController.updateProfile);
router.put("/users/:userId/password", authMiddleware, userController.changePassword);
router.put("/users/:userId/avatar", authMiddleware, userController.updateAvatar);
router.post("/users/:userId/favorites", authMiddleware, userController.addFavorite);
router.delete("/users/:userId/favorites/:bookId", authMiddleware, userController.removeFavorite);
router.get("/users/:userId/favorites", authMiddleware, userController.getFavorites);
router.get("/users/:userId/stats", authMiddleware, userController.getStats);
router.post("/users/:userId/heartbeat", authMiddleware, userController.updateHeartbeat);

// --- Page/Content Routes (Books, Borrows, News) ---
router.get("/books", pageController.getAllBooks);
router.get("/books/search", pageController.searchBooks);
router.get("/books/:id", pageController.getBookById);
router.get("/books/:id/read", pageController.getBookContent);
router.get("/authors", pageController.getUniqueAuthors);

// Management Routes (Admin & Librarian)
router.post("/books", authMiddleware, checkRole(['admin', 'librarian']), pageController.createBook);
router.put("/books/:id", authMiddleware, checkRole(['admin', 'librarian']), pageController.updateBook);
router.delete("/books/:id", authMiddleware, checkRole(['admin', 'librarian']), pageController.deleteBook);

router.post("/borrows", authMiddleware, pageController.borrowBook);
router.get("/borrows/user/:userId", authMiddleware, pageController.getUserBorrows);
router.put("/borrows/:borrowId/return", authMiddleware, checkRole(['admin', 'librarian']), pageController.returnBook);
router.get("/borrows", authMiddleware, checkRole(['admin', 'librarian']), pageController.getAllBorrows);

router.get("/news", pageController.getAllNews);
router.get("/news/:id", pageController.getNewsById);
router.post("/news", authMiddleware, checkRole(['admin', 'librarian']), pageController.createNews); 
router.put("/news/:id", authMiddleware, checkRole(['admin', 'librarian']), pageController.updateNews);
router.delete("/news/:id", authMiddleware, checkRole(['admin', 'librarian']), pageController.deleteNews);

// --- Admin-Only Routes ---
router.get("/admin/stats", authMiddleware, checkRole(['admin', 'librarian']), adminController.getDashboardStats); // Dashboard is fine for both
router.get("/admin/users", authMiddleware, checkRole(['admin', 'librarian']), adminController.getAllUsers); // Visibility is fine
router.put("/admin/users/:userId/role", authMiddleware, checkRole(['admin']), adminController.updateUserRole);
router.delete("/admin/users/:userId", authMiddleware, checkRole(['admin']), adminController.deleteUser);
router.get("/admin/logs", authMiddleware, checkRole(['admin']), adminController.getActivityLogs);

module.exports = router;
