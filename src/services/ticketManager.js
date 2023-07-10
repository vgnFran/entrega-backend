import ticketModel from "../models/dao/models/tickets.model.js";

export default class Ticket{
    getTickets= async()=>{
        try{
            return await ticketModel.find().populate("products.product")
        }catch(err){
            console.log(err)
            return null
        }
    }
    
}