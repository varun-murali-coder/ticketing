import { ExpirationCompleteEvent, Listener, Subjects,OrderStatus } from "@vcoderlearn1/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCacncelledPublisher } from "../publishers/order-deleted-publisher";
export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    readonly subject= Subjects.ExpirationComplete;
    queueGroupName: string=queueGroupName;
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order=await Order.findById(data.orderId).populate('ticket');
        if(!order)
        throw new Error('Order not found');
    //Do not cancel order that is already paid
        if(order.status===OrderStatus.Complete){
            return msg.ack();
        }
        
        order.set({
          status:OrderStatus.Cancelled,
        });
        await order.save();
       await new OrderCacncelledPublisher(this.client).publish({
            id:order.id,
            version:order.version,
            ticket:{
                id:order.ticket.id
            }
        });
        msg.ack();

    }
    
}