import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';
it('return 404 if provided id doesnt exist',async()=>{
    const id=new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie',global.signin())
    .send({
        title:'some',
        price:20
    }).expect(404);
});
it('return 401 if user not authenticated',async()=>{
    const id=new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`)
    .send({
        title:'some',
        price:20
    }).expect(401);
});
it('return 401 if ticket not owned by user',async()=>{
    const response=await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title:'some',
        price:500
    });

    await request(app).put(`/api/tickets/${response.body.id}`)
    .set('Cookie',global.signin())
    .send({
        title:'other',
        price:40
    }).expect(401);
});
it('return 400 if user provides invalid title or price',async()=>{
    const cookie=global.signin();
    const response=await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title:'some',
        price:500
    });
    await request(app).put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'',
        price:-70
    }).expect(400);
});
it('updates ticket provided valid inputs',async()=>{
    const cookie=global.signin();
    const response=await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title:'some',
        price:500
    });
    await request(app).put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'updated',
        price:70
    }).expect(200);
    //cookies not required for get calls
    const ticketResponse=await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

    expect(ticketResponse.body.title).toEqual('updated');
});

it('publishes an event',async()=>{
    const cookie=global.signin();
    const response=await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title:'some',
        price:500
    });
    await request(app).put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'updated',
        price:70
    }).expect(200);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();

});

it('rejects updates if ticket reserved',async()=>{
    const cookie=global.signin();
    const response=await request(app)
    .post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title:'some',
        price:500
    });

const ticket=await Ticket.findById(response.body.id);
ticket!.set({orderId:new mongoose.Types.ObjectId().toHexString()});
await ticket!.save();

    await request(app).put(`/api/tickets/${response.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'updated',
        price:70
    }).expect(400);
});
