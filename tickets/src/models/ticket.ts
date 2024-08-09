import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs{
    title:string;
    price:number;
    userId:string
}
interface TicketDoc extends mongoose.Document{
    title:string;
    price:number;
    userId:string;
    //Document interface has __v but we want to use version
    version:number;
    //Tell ts ticket has orderId property
    orderId?:string;//optional becaz first time ticket created no order present
}
interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs:TicketAttrs):TicketDoc;
}

const ticketSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    userId:{
        type:String,
        required:true
    }
    //To lock ticket
    ,
    orderId:{
        type:String
    }
},{
    toJSON:{
        transform(doc,ret){
                ret.id=ret._id;
                delete ret._id;
        }
    }
});

ticketSchema.statics.build=(attrs:TicketAttrs)=>{
    return new Ticket(attrs);
};
//Add configuration to solve concurrency issues
ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin);

const Ticket=mongoose.model<TicketDoc,TicketModel>('Tickets',ticketSchema);



export {Ticket};