import mongoose from "mongoose";
import {config} from "../config/config.js"

export default class MongoSingleton{
    static #instance

    constructor(){
        mongoose.connect(config.MONGOOSE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    }

    static getInstance(){
        if(!this.#instance){
            this.#instance = new MongoSingleton();
            console.log('Conectado a instancia Mongo Singleton')
        }else{
        }

        return this.#instance
    }
}