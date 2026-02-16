const express = require ("express");
const authenticate = require ("../Middleware/Authenticate.js");
const ReviewController = require ("../Controllers/ReviewController.js");

const router = express.Router();

// Create review
router.post("/review/create", authenticate, ReviewController.createReview);

// Get product reviews (optional skuCode)
router.get("/reviews/all/:doctorId", ReviewController.getAllReviews);

// Update review
router.put("/review/update/:reviewId", authenticate, ReviewController.updateReview);

// Delete review
router.delete("/review/delete/:reviewId", authenticate, ReviewController.deleteReview);

module.exports = router;