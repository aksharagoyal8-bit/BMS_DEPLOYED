const router = require("express").Router();
const { addMovie, updateMovie, deleteMovie, getAllMovies, getSingleMovie } = require("../controllers/movieControllers");
const MovieModel = require("../models/movieModel");



router.post("/add", addMovie)
router.get("/get-all", getAllMovies);
router.get("/get/:id", getSingleMovie);
router.put("/update", updateMovie);
router.put("/delete", deleteMovie);
module.exports = router;