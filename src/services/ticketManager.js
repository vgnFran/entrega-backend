import ticketModel from "../models/dao/models/tickets.model.js";

export default class Ticket{
    getTickets= async()=>{
        try{
            return await ticketModel.find()
        }catch(err){
            console.log(err)
            return null
        }
    }
    
}