import { Subjects,Publisher,ExpirationCompleteEvent } from "@vcoderlearn1/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
   readonly  subject=Subjects.ExpirationComplete;
    
}