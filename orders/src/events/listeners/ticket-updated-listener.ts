import { Message } from "node-nats-streaming";
import { Subjects,TicketUpdatedEvent,Listener } from "@vcoderlearn1/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated=Subjects.TicketUpdated;
    queueGroupName: string=queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        //const ticket=await Ticket.findById(data.id);
        //Now we need to look for id and version to solve concurrency issue
        // const ticket=await Ticket.findOne({
        //     _id:data.id,
        //     version:data.version-1
        // });//if dont get any means we are processing out of order
        const ticket=await Ticket.findByEvent(data);
        if(!ticket)
        throw new Error('Ticket not found');
    // const {title,price,version}=data;
    // ticket.set({title,price,version});
     const {title,price}=data;
    ticket.set({title,price});
    await ticket.save();//Once we save the version in order service increments to match version in updates service
    //Important
    msg.ack();
    }
}