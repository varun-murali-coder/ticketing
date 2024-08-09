import { Message } from "node-nats-streaming";
import { Subjects,Listener,TicketCreatedEvent } from "@vcoderlearn1/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subjects.TicketCreated=Subjects.TicketCreated;
    queueGroupName: string=queueGroupName;

   async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const {id,title,price}=data;
    const ticket=Ticket.build({
       id, title,price
    });
    //ID adjustement sol
    await ticket.save(); //Issue here 2 diff ids for ticket service and order service while data replication 
    msg.ack();//means event successfully processed
        
    }
}