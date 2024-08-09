import { TicketCreatedListener } from "../ticket-created-listener";
import { TicketCreatedEvent } from "@vcoderlearn1/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
const setup=async ()=>{
  //create instance of listener
 const listener=new TicketCreatedListener(natsWrapper.client);
    //create a fake data event
    const data:TicketCreatedEvent['data']={
        version:0,
        id:new mongoose.Types.ObjectId().toHexString(),
        title:'concert',
        price:10,
        userId:new mongoose.Types.ObjectId().toHexString()
    };

    //create fake msg obj
    //@ts-ignore
    const msg:Message={
        ack:jest.fn()
};
return {listener,data,msg};
};
it('creates and saves a ticket',async()=>{
    const {listener,data,msg}=await setup();
    //call onmsg fn with data +msg obj
    await listener.onMessage(data,msg);
    //assertions
    const ticket=await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);

    
});
it('acks the message',async()=>{
    const {listener,data,msg}=await setup();
 //call onmsg fn with data +msg obj
 await listener.onMessage(data,msg);
     //assertions
   expect(msg.ack).toHaveBeenCalled();
});