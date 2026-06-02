const {addTheatre, updateTheatre,deleteTheatre,getAllTheatre,getTheatreByOwner} = require("../controllers/theatreController");


const router=require("express").Router();


router.post("/add",addTheatre);
router.put("/update",updateTheatre);
router.put("/delete",deleteTheatre);
router.get("/get-all",getAllTheatre);
router.post("/get-all-by-owner",getTheatreByOwner);



module.exports=router;