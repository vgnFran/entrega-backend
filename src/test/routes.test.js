import chai from "chai"
import supertest from "supertest"
import mongoose from "mongoose"
import { config } from "../config/config.js"
import errorManager from "../services/errorManager.js"
import { dictionary } from "../utils/dictionary.js"
import cartModel from "../models/dao/models/cart.model.js"

const url= config.MONGOOSE_URL

const expect= chai.expect
const requester= supertest("http://localhost:8080")

// siempre iniciar sesion antes de correr el test
describe("Test general router API ecommerce", ()=>{ 
    before(async function (){
        try{
            await mongoose.connect(url)
        }catch(err){
            throw new errorManager(dictionary.connectionError)
        }
    })

    describe("Test area Products", ()=>{

        it("El GET /api/products debe retornar todos los productos disponibles en la DB", async ()=>{
            const {statusCode, ok, body} = await requester.get("/api/products")
            expect(statusCode).to.be.eql(200)
            expect(ok).to.be.true
            expect(body).to.have.length.above(1)
        })

        it("El GET /api/products/:id debe retornar el producto que coincida con el :id", async()=>{
            const id="6461b1838c7c16ce6925cf94"
            const {statusCode, ok, body} = await requester.get(`/api/products/${id}`)
            expect(statusCode).to.be.eql(200)
            expect(ok).to.be.true
            expect(body._id)
            expect(body._id).to.be.eql(id)
        })

        it("El POST /api/products debe crear un producto correctamente", async()=>{
            const newProduct= {title:"test", description:"test description", code: 1245585, price: 123, stock:123, category: "test category" }
            const {statusCode, ok, body} = await requester.post("/api/products").send(newProduct)
            expect(statusCode).to.eql(200)
            expect(ok).to.be.true
            expect(body._id)
        })

        it("El PUT /api/products/:id debe modificar el producto que coincida con el :id", async ()=>{
            const id="6461b1838c7c16ce6925cf94"
            const original= await requester.get(`/api/products/${id}`)

            const {statusCode} =await requester.put(`/api/products/${id}`).send({price:1150})
            expect(statusCode).to.be.eql(200)

            const modified= await requester.get(`/api/products/${id}`)
            expect(original.body.price).not.eql(modified.body.price)
        })

        it("El DELETE /api/products/:id debe eliminar el producto que coincida con el :id", async ()=>{
            const id="64e56e2b4bbb99d530d052e5"
            const {statusCode, body}= await requester.delete(`/api/products/${id}`)
            expect(statusCode).to.be.eql(200)
            expect(body.deletedCount).to.be.eql(1)
        })

        it("El GET /api/mockingproducts debe retornar 20 productos inexistentes en la db", async() =>{
            const products= await requester.get("/api/products")
            const realProducts= products.body
            const fakeProducts= await requester.get("/api/mockingproducts")
            expect(fakeProducts.statusCode).to.be.eql(200)
            expect(fakeProducts.body).not.eql(realProducts)
        })

    })

    describe("Test area Carts", async()=>{

        it("El GET /api/carts debe retornar todos los carts", async()=>{
            const {body, statusCode} = await requester.get("/api/carts")
            expect(body).to.have.length.above(1)
            expect(statusCode).to.be.eql(200)
        })

        it("el POST /api/carts debe crear un carrito nuevo", async()=>{
            const {body, statusCode} = await requester.post("/api/carts")
            expect(statusCode).to.be.eql(200)
            expect(body.products).to.be.a("array")
        })

        it("El GET /api/carts/:id debe retornar la lista de productos del carrito :id", async()=>{
            const id= "6462a52fdd5fc5d7c231bdac"
            const {body, statusCode} = await requester.get(`/api/carts/${id}`)
            expect(statusCode).to.be.eql(200)
            expect(body).to.be.a("array")
            expect(body[0]._id)
        })

        it("El POST /api/carts/:cid/products/:pid debe agregar el producto :pid al cart :cid, o si ya esta agregado debe sumarle 1 en su campo quantity", async()=>{
            const cid= "64e3fe01945221b68cf8714d"
            const pid= "64e3fe01945221b68cf8714d"
            const {body, statusCode}= await requester.post(`/api/carts/${cid}/products/${pid}`)
            expect(statusCode).to.be.eql(200)
            expect(body.products[0].quantity).to.be.gte(1)
         })

         it("El DELETE /api/carts/:cid/products/:pid debe eliminar el producto :pid del cart :cid", async()=>{
            const cid= "64b204dc01e4ae194e0cd29e"
            const pid= "6467d069809faa34a65f1b4a"
            const original = await cartModel.findById(cid)
            const first= original.products.find(prod=>{
                return prod.product == pid
            })
            expect(first)

            const deleted = await requester.delete(`/api/carts/${cid}/products/${pid}`)
            expect(first).to.not.eql(deleted.body)
            
         })

        it("El PUT /api/carts/:cid/products/:pid debe actualizar la cantidad del producto :pid en el cart :cid", async ()=>{
            const cid= "6463fc9201d78b40f0dbb4c8"
            const pid= "6467d0ff809faa34a65f1b56"
            const actualized= {quantity:4}
            const older= await cartModel.findOne({
                _id: cid,
                products: { $elemMatch: { product: pid } }
              })

            const act = await requester.put(`/api/carts/${cid}/products/${pid}`).send(actualized)
            expect(act.statusCode).to.be.eql(200)
            expect(act.body).to.not.eql(older)
        })

        it("El DELETE /api/carts/:cid debe eliminar los productos del cart :cid", async ()=>{
            const cid= "64b2040ee40119b7d7792d53"
            const {body, statusCode} = await requester.delete(`/api/carts/${cid}`)
            expect(statusCode).to.be.eql(200)
            expect(body.products).to.have.lengthOf(0)
        })
    })


    describe("Test area Users", async ()=>{
        it("El POST /login debe iniciar sesion correctamente", async ()=>{
            const user= {login_email:"vgnfran.dev@gmail.com", login_password:"abc123"}
            const {headers} = await requester.post("/login").send(user)
            expect(headers["set-cookie"][0])
        })

        it("El POST /register debe registrar un usuario correctamente", async ()=>{
            const user={name:"test", surName:"testing", password: "abc123",email:"test@testing.com", age:50 }
            const {body, statusCode} = await requester.post("/register").send(user)
            expect(body).to.be.an('object')
            expect(body._id).to.not.be.undefined
            expect(statusCode).to.be.eql(200)
        })

        it("El GET /logout debe cerrar sesion, por lo tanto debe devolver una cookie vacia",async ()=>{
            const {headers, statusCode}= await requester.get("/logout")
            const cookie= headers["set-cookie"][0].split(";")[0]
            const value= cookie.slice(cookie.indexOf("=")+1)
            expect(value).to.be.eql("")
        })

    })


    after(async function(){
        try{
            mongoose.disconnect()
        }catch{
            throw new errorManager(dictionary.disconnectError)
        }
    })
})

