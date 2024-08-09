import { Publisher,Subjects,TicketUpdatedEvent } from "@vcoderlearn1/common";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject= Subjects.TicketUpdated;
}