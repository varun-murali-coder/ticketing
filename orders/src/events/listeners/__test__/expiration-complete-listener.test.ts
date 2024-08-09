import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order, OrderStatus } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { ExpirationCompleteEvent } from "@vcoderlearn1/common";
import { Message } from "node-nats-streaming";


const setUp=async ()=>{
    const listener=new ExpirationCompleteListener(natsWrapper.client);
    const ticket=Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title:'concert',
        price:20
    });
    await ticket.save();
    const order=Order.build({
        status: OrderStatus.Created,
        userId:'asllwe',
        expiresAt:new Date(),
        ticket
    });
    await order.save();

    const data:ExpirationCompleteEvent['data']={
        orderId:order.id
    };
//@ts-ignore
    const msg:Message={
        ack:jest.fn()
    };
    return {listener,order,ticket,data,msg};

};


it('update order status to cancelled',async()=>{
    const {listener,order,ticket,data,msg}=await setUp();
    await listener.onMessage(data,msg);
    const updatedOrder=await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
it('emit ordercancelled event',async()=>{
    const {listener,order,ticket,data,msg}=await setUp();
    await listener.onMessage(data,msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const eventData=JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);

});
it('ack the message',async()=>{
    const {listener,order,ticket,data,msg}=await setUp();
   await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();

});