import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const buildTicket=async ()=>{
    const ticket=Ticket.build({
        title:'concert',
        price:20,
        id: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();
    return ticket;
};
it('fetches orders for a particular user',async()=>{
    //Create 3 tickets
    const ticketOne=await buildTicket();
    const ticketTwo=await buildTicket();
    const ticketThree=await buildTicket();
    
    const userOne=global.signin();
    const userTwo=global.signin();
    //Create 1 order user 1
    await request(app)
    .post('/api/orders')
    .set('Cookie',userOne)
    .send({ticketId:ticketOne.id})
    .expect(201);
    //Create 2 order user 2
    const {body:orderOne}=await request(app)
    .post('/api/orders')
    .set('Cookie',userTwo)
    .send({ticketId:ticketTwo.id})
    .expect(201);
//destructuring and giving name
    const {body:orderTwo}=await request(app)
    .post('/api/orders')
    .set('Cookie',userTwo)
    .send({ticketId:ticketThree.id})
    .expect(201);
    //Make req to get orders for only user 2
    const response=await request(app)
     .get('/api/orders')
    .set('Cookie',userTwo)
    .expect(200);
    //console.log(response.body);
    //make sure got only orders for user2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
})