import { Publisher,Subjects,OrderCreatedEvent } from "@vcoderlearn1/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated=Subjects.OrderCreated;
    
}