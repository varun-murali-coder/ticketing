import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();
const stan=nats.connect('ticketing',randomBytes(4).toString('hex'),{
    url:'http://localhost:4222'
});

stan.on('connect',()=>{
    console.log('listener conn to NATS');
    stan.on('close',()=>{
        console.log('nats conn closed');
        process.exit();
    });
    //Queue group in combination with durable subscription makes sure that for a brief period subscription not lost
//     const options=stan.
//     subscriptionOptions()
//     .setManualAckMode(true)//If anything goes wrong we can do something.ACK only event processed.
//     .setDeliverAllAvailable() //Used in combination with durable subscription
//     .setDurableName('accounting-service');//durable subscription
//     const subscription=stan.subscribe('ticket:created',
//    'order-service-queue-group'
//     ,options);//Queue group sends to only 1 member
//     subscription.on('message',(msg:Message)=>{
//     console.log('Message received');
//     const data=msg.getData();
//     if(typeof data==='string'){
//         console.log(`Received event #${msg.getSequence()},with data:${data}`);
//     }
//     msg.ack();
//     });
new TicketCreatedListener(stan).listen();
});

process.on('SIGINT',()=>stan.close());
process.on('SIGTERM     ',()=>stan.close());


