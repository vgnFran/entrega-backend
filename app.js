import express from "express";
import productsRoutes from "./src/routes/products.routes.js";
import routerCart from "./src/routes/carts.routes.js"
import viewsRouter from "./src/routes/views.js";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";


const port= 8080;
const wsPort= 8090;
const server= express();
const httpServer= server.listen(wsPort,()=>{console.log("server socket.io on")})
const io= new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials:false
    }
})

server.use(express.json());
server.use(express.urlencoded({extended:true}));


server.use("/api",productsRoutes(io))
server.use("/api",routerCart)
server.use(viewsRouter(io))
server.use("/public", express.static(`${__dirname}/src/public`))


server.engine("handlebars",engine())
server.set("view engine","handlebars")
server.set("views","src/views")

io.on("connection",(socket)=>{
    console.log(`nuevo cliente conectado ${socket.id}`)

    socket.on("message",(data)=>{
        console.log(data)
        // recibimos y distribuimos con io.emit ("messrecib", (data))

    })

    socket.on("disconnect",(reason)=>{
        console.log("cliente desconectado")
    })

    socket.emit("confirm","mensaje desde el servidor")

})





server.listen(port,()=>{console.log("server http on")}) 