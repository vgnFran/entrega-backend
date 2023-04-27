import express from "express";
import router from "./src/routes/products.routes.js";
import routerCart from "./src/routes/carts.routes.js"
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";


const port= 8080;
const wsPort= 8081;
const server= express();
const httpServer= server.listen(wsPort,()=>{console.log("server socket.io on")})
const wsServer= new Server(httpServer)

server.use(express.json());
server.use(express.urlencoded({extended:true}));


server.use("/api",router)
server.use("/api",routerCart)
// server.use("/public", express.static(`${__dirname}/src/public`))

server.engine("handlebars",engine())
server.set("view engine","handlebars")
server.set("views","src/views")

server.listen(port,()=>{console.log("server http on")}) 