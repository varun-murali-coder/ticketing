import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderStatus } from "@vcoderlearn1/common";
import { Order } from "../../../models/order";
import { OrderCancelledEvent } from "@vcoderlearn1/common";
import { Message } from "node-nats-streaming";


const setUp=async ()=>{
const listener=new OrderCancelledListener(natsWrapper.client);
const order=Order.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    status:OrderStatus.Created,
    version:0,
    userId:'asas',
    price:10
});
await order.save();

const data:OrderCancelledEvent['data']={
    id:order.id,
    version:1,
    ticket:{
        id:'aklsh'
    }
};

//@ts-ignore
const msg:Message={
    ack:jest.fn() 
};

return {listener,data,msg,order};
};

it('update status of order',async()=>{
const {listener,data,msg,order}=await setUp();
await listener.onMessage(data,msg);
const updatedOrder=await Order.findById(order.id);
expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
it('acks msg',async()=>{
    const {listener,data,msg,order}=await setUp();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
});