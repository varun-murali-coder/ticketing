import { Publisher,Subjects,OrderCancelledEvent } from "@vcoderlearn1/common";

export class OrderCacncelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled=Subjects.OrderCancelled;
    
}