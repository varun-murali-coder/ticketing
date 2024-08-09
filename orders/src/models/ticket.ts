import mongoose from "mongoose";
import { Order,OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

//version number updated by tickets service but we need to check version number in order service
    interface TicketAttrs{
        id:string;
        title:string;
        price:number;

    }
    export interface TicketDoc extends mongoose.Document{
        title:string;
        price:number;
        version:number;
        isReserved():Promise<boolean>
    }
    interface TicketModel extends mongoose.Model<TicketDoc>{
       build(attrs:TicketAttrs):TicketDoc;
       findByEvent(event:{id:string,version:number}):Promise<TicketDoc|null>;
    }

    const ticketSchema=new mongoose.Schema({
        title:{
            type:String,
            required:true,
            min:0
        },
        price:{
            type:Number,
            required:true,
            min:0
        }
    },{
        toJSON:{
            transform(doc,ret){
                ret.id=ret._id;
                delete ret._id;
            }
        }
});

ticketSchema.statics.findByEvent=(event:{id:string,version:number})=>{
    return Ticket.findOne({
        _id:event.id,
        version:event.version -1
    })
};

ticketSchema.statics.build=(attrs:TicketAttrs)=>{
    //return new Ticket(attrs);
    return new Ticket({
        _id:attrs.id,
        title:attrs.title,
        price:attrs.price
    });
}
//dont use arrow fn since using this keyword
ticketSchema.methods.isReserved=async function(){
    const existingOrder=await Order.findOne({
        ticket:this,
        status:{
            $in:[
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
      });
      return !!existingOrder;
};

ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin);
//since using this keyword dont use arrow fn
// ticketSchema.pre('save',function(done){
//     //@ts-ignore
// this.$where={
//     version:this.get('version')-1
// };
// done();

// });

const Ticket=mongoose.model<TicketDoc,TicketModel>('Ticket',ticketSchema);
export {Ticket};



