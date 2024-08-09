import Queue  from "bull";
import { natsWrapper } from "../nats-wrapper";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
interface Payload{
    orderId:string;
}
const expirationQueue=new Queue<Payload>('order:expiration',{
    //Tell to use redis
    redis:{
        host:process.env.REDIS_HOST
    }
});
//job is similar to event in nats-streaming
expirationQueue.process(async (job)=>{
//console.log('I want to publish an expiration:complete event for orderId',job.data.orderId);
new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId:job.data.orderId
});
});

export {expirationQueue};