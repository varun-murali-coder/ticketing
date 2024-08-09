import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@vcoderlearn1/common";
import { Message } from "node-nats-streaming";
const setup=async ()=>{
    //create a listener
    const listener=new TicketUpdatedListener(natsWrapper.client);
    //create and save a ticket
    const ticket=Ticket.build({
        id:new mongoose.Types.ObjectId().toHexString(),
        title:'concert',
        price:150
    });
    await ticket.save();
    //create a fake data obj
    const data:TicketUpdatedEvent['data']={
        id:ticket.id,
        price:999,
        title:'new concert',
        userId:'abcde',
        version:ticket.version+1
    };
    //create a fake msg
    //@ts-ignore
    const msg:Message={
        ack:jest.fn()
    };
    //return all stuff
    return {listener,msg,data,ticket};
};

it('find updates and saves a ticket',async()=>{
    const {listener,msg,data,ticket}=await setup();
    await listener.onMessage(data,msg);
    const updatedTicket=await Ticket.findById(ticket.id);   

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);

});
it('acks the msg',async()=>{
    const {listener,msg,data,ticket}=await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
});

it('doesnt ack if the event version is in future',async()=>{
    const {msg,data,listener,ticket}=await setup();
    data.version=10;
    try{
    await listener.onMessage(data,msg);
    }catch{}
    expect(msg.ack).not.toHaveBeenCalled();


});