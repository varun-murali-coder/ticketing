import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('fetches the order',async()=>{
    //create a ticket
     const ticket=Ticket.build({
        title:'concert',
        price:20,
        id: new mongoose.Types.ObjectId().toHexString()
     });
     await ticket.save();
     const user=global.signin();
    //make a req to build an order with this ticket
    const {body:order}=await request(app)
    .post('/api/orders')
    .set('Cookie',user)
    .send({ticketId:ticket.id})
    .expect(201)
    ;
    //make req to fetch the order
    await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie',user)
    //.send()
    .expect(200);

   
});

it('returns an error if one user tries to fetch another users order',async()=>{
     //create a ticket
     const ticket=Ticket.build({
        title:'concert',
        price:20,
        id: new mongoose.Types.ObjectId().toHexString()

     });
     await ticket.save();
     const user=global.signin();
    //make a req to build an order with this ticket
    const {body:order}=await request(app)
    .post('/api/orders')
    .set('Cookie',user)
    .send({ticketId:ticket.id})
    .expect(201)
    ;
    //make req to fetch the order
    await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie',global.signin())
    .send()
   .expect(401);
});