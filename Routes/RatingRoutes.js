const express = require ("express");
const authenticate = require ("../Middleware/Authenticate.js");
const RatingController = require ("../Controllers/RatingController.js");

const router = express.Router();


router.post("/rating/create", authenticate,RatingController.createRating);

router.get("/rating/:doctorId", RatingController.getAllRatings);

router.put("/rating/:ratingId",authenticate,RatingController.updateRating);

router.delete("/rating/:ratingId", authenticate, RatingController.deleteRating);

module.exports = router;