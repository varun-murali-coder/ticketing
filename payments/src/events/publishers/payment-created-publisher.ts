import { PaymentCreatedEvent, Publisher, Subjects } from "@vcoderlearn1/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject=Subjects.PaymentCreated;
    
}