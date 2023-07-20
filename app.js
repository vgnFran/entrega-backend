import express from "express";
// import productsRoutes from "./src/routes/products.routes.FS.js";
// import routerCart from "./src/routes/carts.routes.FS.js"
// import viewsRouter from "./src/routes/views.js";
import productRoutesDB from "./src/routes/products.routes.js";
import cartsRoutesDB from "./src/routes/carts.routes.js";
import chatRouter from "./src/chat/chat.js";
import { __dirname } from "./src/utils/utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
// import  FileStore  from "session-file-store";
import MongoStore from "connect-mongo";
import usersRoutes from "./src/routes/users.routes.js";

import passport from "passport"
import cookieParser from "cookie-parser";
import { initPassport } from "./src/auth/passport.cookies.config.js";
import { initPassportJwt } from "./src/auth/passport.jwtStrategy.config.js";
import cors from "cors"
import {} from 'dotenv/config'
import config from "./src/config/config.js"
import errorManager from "./src/services/errorManager.js";
import { dictionary } from "./src/utils/dictionary.js";


//CONGIF PRINCIPAL DEL SERVER
const session_secret= "abcdfgh12345678"
const port= 8080;
const wsPort= 8090;
const app= express();
const httpServer= app.listen(wsPort,()=>{console.log("Server socket.io on")})
const io= new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials:false
    }
})
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const moongose_url = config.MONGOOSE_URL;


//CONFIG dependencias
// const fileStorage = new FileStore(session);
// const store = new fileStorage({ path: `${__dirname}/sessions/`, ttl: 30, reapInterval: 300, retries: 0 });
const store= MongoStore.create({mongoUrl: moongose_url, mongoOptions: {}, ttl:30})
app.use(session({
    store: store,
    secret: "abcdef123456",
    resave: false,
    saveUninitialized: false,
}));
app.use(cors())
app.engine("handlebars",engine())
app.set("view engine","handlebars")
app.set("views","src/views")

//habilitar para validar jwt con cookies
// app.use(cookieParser('abc123'))
initPassport()
initPassportJwt()
app.use(passport.initialize())
// app.use(passport.session())




//ROUTES
app.use("/", usersRoutes(store))
// app.use("/api",productsRoutes())
// app.use("/api",routerCart)
app.use("/api",productRoutesDB)
app.use("/api",cartsRoutesDB)
// app.use(viewsRouter(io))
app.use(chatRouter(io))
app.use("/public", express.static(`${__dirname}/src/public`))

app.all("*",(req,res)=>{
    throw new errorManager(dictionary.routingError)
})

app.use((err,req,res,next)=>{
    const code= err.statusCode || 500
    res.status(code).send(err.message)
})




io.on("connection",(socket)=>{
    console.log(`new client connected ${socket.id}`)
    
    socket.on("disconnect",(reason)=>{
        console.log("client disconect")
    })

    socket.emit("confirm","server message")

})


try{
    await mongoose.connect(moongose_url)
    app.listen(config.SERVER_PORT,()=>{
        console.log(`Server HTTP started on port ${config.SERVER_PORT}`)
    }) 
}catch(err){
    console.log("Cannot connect to the DDBB")

}



