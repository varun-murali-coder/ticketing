import { Listener,OrderCancelledEvent, Subjects } from "@vcoderlearn1/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    readonly subject=Subjects.OrderCancelled;
    queueGroupName: string=queueGroupName;
   async  onMessage(data: OrderCancelledEvent['data'], msg: Message)  {
 //find ticket that order is reserving
 const ticket=await Ticket.findById(data.ticket.id);
 //if no ticket throw error
 if(!ticket)
 throw new Error('Ticket not found');
 //mark ticket as being reserved by setting orderId property
 ticket.set({orderId:undefined});
 //save ticket
 await ticket.save();
 // new TicketUpdatedPublisher(natsWrapper.client);
 //To sync version in 2 services
  //If we dont put await error wont be thrown and we assume everything is success and goes to ack
  await new TicketUpdatedPublisher(this.client).publish({
    id:ticket.id,
    price:ticket.price,
    title:ticket.title,
    userId:ticket.userId,
    orderId:ticket.orderId,
    version:ticket.version
});
//ack msg
msg.ack();
    }
    
}