import request from 'supertest';
import { app } from '../../app';
import { response } from 'express';


const createTicket=()=>{
    return request(app)
    .post('/api/tickets')
    .set('Cookie',global.signin())
    .send({
        title:'abcde',
        price:20
    }).expect(201);
};
it('retreive all the tickets',async()=>{

  await createTicket();
  await createTicket();
  await createTicket();

const response=await request(app)
.get('/api/tickets').send().expect(200);
expect(response.body.length).toEqual(3);

});