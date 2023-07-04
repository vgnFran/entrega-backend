import { Router } from "express";
// import chatModel from "../dao/models/chat.model.js";
import chatModel from "../models/dao/models/chat.model.js"



const chatRouter= (io)=>{

    const router=Router()

    router.get("/chat", async (req,res)=>{
        res.render("chat")
    })

    io.on("connection",(socket)=>{

        socket.on("newMsg",(data)=>{
            console.log(data)
            chatModel.create(data)
            io.emit("msgRecived",data)
        })

        
    })


    return router
}

export default chatRouter