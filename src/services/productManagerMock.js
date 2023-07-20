import { Faker, en } from "@faker-js/faker"
import errorManager from "./errorManager.js"
import { dictionary } from "../utils/dictionary.js"

const faker= new Faker({ locale:[en] })

export default class MockProduct{

    constructor(){
        this.products=[]
    }

    generateProduct= (number )=>{

        if(isNaN(number)){
            throw new errorManager(dictionary.invalidType)
        }

        const products=[]

        const newProduct= {
            id:faker.database.mongodbObjectId() ,
            category:faker.commerce.product(),
            code:faker.string.numeric(8),
            description:faker.commerce.productDescription(),
            price:faker.commerce.price({ dec: 0 }),
            stock:faker.number.int(100),
            thumbnail:faker.image.urlLoremFlickr(),
            title:faker.commerce.productName()
        }

        for(let i=0; i <= number; i++){
            products.push(newProduct)
        }

        return products
    }

}
