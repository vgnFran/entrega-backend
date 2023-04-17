const express= require("express")
const router= express.Router()


router.get("/cart", (req,res)=>{
    res.status(200).send("cart");
})



module.exports= router;