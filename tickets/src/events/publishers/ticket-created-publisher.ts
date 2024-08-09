import { Publisher,Subjects,TicketCreatedEvent } from "@vcoderlearn1/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject= Subjects.TicketCreated;
}