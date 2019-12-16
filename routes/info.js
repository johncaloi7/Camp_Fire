const express = require("express");
const router = express.Router();


//make about the creator page 
router.get("/", (req, res) => {
	res.render("about")
})



module.exports = router;