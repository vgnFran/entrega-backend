import express from "express";
import productsRoutes from "./src/routes/products.routes.FS.js";
import routerCart from "./src/routes/carts.routes.FS.js"
import viewsRouter from "./src/routes/views.js";
import productRoutesDB from "./src/routes/product.routes.DB.js";
import cartsRoutesDB from "./src/routes/carts.routes.DB.js";
import chatRouter from "./src/chat/chat.js";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
// import  FileStore  from "session-file-store";
import MongoStore from "connect-mongo";
import usersRoutes from "./src/routes/users.routes.js";

import passport from "passport"
import cookieParser from "cookie-parser";
import { initPassport } from "./src/config/passport.jwt.config.js";

import {} from 'dotenv/config'

const session_secret= "abcdfgh12345678"
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

const moongose_url = process.env.MONGOOSE_URL;

server.use("/api",productsRoutes())
server.use("/api",routerCart)
server.use("/api",productRoutesDB)
server.use("/api",cartsRoutesDB)
server.use(viewsRouter(io))
server.use(chatRouter(io))
server.use("/public", express.static(`${__dirname}/src/public`))



// const fileStorage = new FileStore(session);
// const store = new fileStorage({ path: `${__dirname}/sessions/`, ttl: 30, reapInterval: 300, retries: 0 });
const store= MongoStore.create({mongoUrl: moongose_url, mongoOptions: {}, ttl:30})
server.use(session({
    store: store,
    secret: "abcdef123456",
    resave: false,
    saveUninitialized: false,
    // cookie: { maxAge: 30 * 1000 }, // la sesión expira luego de 30 segundos de INACTIVIDAD
}));
server.use("/", usersRoutes(store))


server.use(cookieParser("abcdfgh12345678"))
initPassport()
server.use(passport.initialize())


server.use(passport.initialize())
server.use(passport.session())




server.engine("handlebars",engine())
server.set("view engine","handlebars")
server.set("views","src/views")

io.on("connection",(socket)=>{
    console.log(`nuevo cliente conectado ${socket.id}`)
    
    socket.on("disconnect",(reason)=>{
        console.log("cliente desconectado")
    })

    socket.emit("confirm","mensaje desde el servidor")

})


try{
    await mongoose.connect(moongose_url)
    server.listen(port,()=>{
        console.log("server http on")
    }) 
}catch(err){
    console.log("no se puede conectar a la bbdd")

}



