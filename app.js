import express from "express";
import router from "./src/routes/products.routes.js";
import routerCart from "./src/routes/carts.routes.js"
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";


const port= 8080;
const wsPort= 8090;
const server= express();
const httpServer= server.listen(wsPort,()=>{console.log("server socket.io on")})
const wss= new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080"
    }
})

server.use(express.json());
server.use(express.urlencoded({extended:true}));


server.use("/api",router)
server.use("/api",routerCart)
server.use("/public", express.static(`${__dirname}/src/public`))

server.engine("handlebars",engine())
server.set("view engine","handlebars")
server.set("views","src/views")

wss.on("connection",(socket)=>{
    console.log("nuevo cliente conectado")
    socket.emit("confirm","mensaje recibido")

    // socket.on("message",(data)=>{
    //     console.log(data)

    // })
})


server.listen(port,()=>{console.log("server http on")}) 