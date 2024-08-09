import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@vcoderlearn1/common";
import { Message } from "node-nats-streaming";
import { ListFormat } from "typescript";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";


export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
   readonly  subject= Subjects.PaymentCreated;
    queueGroupName: string=queueGroupName;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
     const order=await Order.findById(data.orderId);
     if(!order)
     throw new Error('Order not found');
    //Actually this is an update event to sync version with other apps u can emit an event here
    //once order complete no more changes happens to order so no need to emit events
    order.set({
        status:OrderStatus.Complete
    });

    await order.save();
    msg.ack();
    }
    
}