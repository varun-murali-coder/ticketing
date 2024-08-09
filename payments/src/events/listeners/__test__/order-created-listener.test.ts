import { OrderCreatedEvent, OrderStatus } from "@vcoderlearn1/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setUp=async()=>{
    const listener=new OrderCreatedListener(natsWrapper.client);
    const data:OrderCreatedEvent['data']={
        id:new mongoose.Types.ObjectId().toHexString(),
        version:0,
        expiresAt:'alsdf',
        userId:'alskfj',
        status:OrderStatus.Created,
        ticket:{
            id:'asldf',
            price:10
        }
    };

    //@ts-ignore
    const  msg:Message={
        ack:jest.fn()
    }
    return {listener,data,msg};
};

it('replicates order info',async()=>{
    const {listener,data,msg}=await setUp();
    await listener.onMessage(data,msg);
    const order=await Order.findById(data.id);
    expect(order!.price).toEqual(data.ticket.price);

});

it('acks the message',async()=>{
    const {listener,data,msg}=await setUp();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
    
});