import { OrderCreatedListener } from "../order-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@vcoderlearn1/common";
import mongoose from "mongoose";
const setup=async()=>{
    //create listener
    const listener=new OrderCreatedListener(natsWrapper.client);
    //create and save ticket
    const ticket=Ticket.build({
        title:'concert',
        price:99,
        userId:'abcd'
    });
    await ticket.save();
    //fake data object
    const data:OrderCreatedEvent['data']={
        id:new mongoose.Types.ObjectId().toHexString(),
        version:0,
        status:OrderStatus.Created,
        userId:'sfeflf',
        expiresAt:'dfdfd',
        ticket:{
            id:ticket.id,
            price:ticket.price

        }

    };
    //fake msg
    //@ts-ignore
    const msg:Message={
        ack:jest.fn()
    }
    return {listener,msg,data,ticket};
};

it('it sets userId of ticket',async()=>{
    const {listener,msg,data,ticket}=await setup();
    await listener.onMessage(data,msg);
    //ticket is outdated so fetch again
    const updatedTicket=await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toEqual(data.id);
});
it('acks the message',async()=>{
    const {listener,msg,data,ticket}=await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
});
it('publishes a ticket updated event',async()=>{
    const {listener,msg,data,ticket}=await setup();
    await listener.onMessage(data,msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    //@ts-ignore
    //console.log(natsWrapper.client.publish.mock.calls);
    // console.log
    //   [
    //     [
    //       'ticket:updated',
    //       '{"id":"668a1f74834f8c8c5d6d7f84","price":99,"title":"concert","userId":"abcd","orderId":"668a1f74834f8c8c5d6d7f86","version":1}',
    //       [Function (anonymous)]
    //     ]
    //   ]
    const ticketUpdatedData=JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(data.id).toEqual(ticketUpdatedData.orderId);

});