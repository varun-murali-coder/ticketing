import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@vcoderlearn1/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
   readonly  subject= Subjects.OrderCreated;
    queueGroupName: string=queueGroupName;
    async onMessage(data:OrderCreatedEvent['data'], msg: Message) {
        const delay=new Date(data.expiresAt).getTime()-new Date().getTime();
        console.log('Waiting this many ms to process job:',delay);
        //create a job and enqueue it
        //Actually we need a 15 min delay in adding and processing job
        await expirationQueue.add({
            orderId:data.id
        },{
            //delay:10000,//10s this is in ms
            //In order-service we have set it 15 min
            delay
        }
        
        );
        msg.ack();
    }
    
}