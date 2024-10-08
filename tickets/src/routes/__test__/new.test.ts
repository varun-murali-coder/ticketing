import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

//jest.mock('../../nats-wrapper'); -->move to setup.ts

it('as a route handler listening to /api/tickets for post requests',async()=>{
    const  response=await request(app).post('/api/tickets')
    .send({});
    expect(response.status).not.toEqual(404);
});
it('can only be accessed if user is signed in',async()=>{
   await request(app).post('/api/tickets')
    .send({}).
    expect(401)
});
it('returns a status other than 401 if user is signed in',async()=>{
    const  response=await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({});
    console.log(response.status);
    expect(response.status).not.toEqual(401);


});
it('returns error if invalid title provided',async()=>{
    await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title:'',
        price:10
    }).expect(400);

    await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        price:10
    }).expect(400);

});
it('returns error if invalid price provided',async()=>{
    await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title:'some',
        price:-10
    }).expect(400);

    await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title:'some'
    }).expect(400);
});
it('creates a ticket foe valid inputs',async()=>{
    //add in a check to make sure a ticket was saved
    let tickets=await Ticket.find({});
    expect(tickets.length).toEqual(0);
    await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title:'abcde',
        price:20
    }).expect(201);
    tickets=await Ticket.find({});
    expect(tickets.length).toEqual(1);

});

it('publishes an event',async()=>{
    await request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title:'abcde',
        price:20
    }).expect(201);
    console.log(natsWrapper);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

});