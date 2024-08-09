import request from 'supertest';
import { app } from '../../app';

it('return 201 on successful signup',async()=>{
    return request(app)
    .post('/api/users/signup')
    .send({
        email:"test@test.com",
        password:"password"
    })
    .expect(201);
});

it('returns a 400 with invalid email',async()=>{
return request(app)
.post('/api/users/signup')
    .send({
        email:"test.com",
        password:"password"
    })
    .expect(400);

});

it('returns a 400 with invalid password',async()=>{
    return request(app)
    .post('/api/users/signup')
        .send({
            email:"test@test.com",
            password:"pas"
        })
        .expect(400);
    
    });


it('returns a 400 with missing email & password',async()=>{
    return request(app)
    .post('/api/users/signup')
        .send({
        })
        .expect(400);
    
    });

    it('disallow duplicate emails',async()=>{
        await request(app)
    .post('/api/users/signup')
    .send({
        email:"test@test.com",
        password:"password"
    })
    .expect(201);

    await request(app)
    .post('/api/users/signup')
    .send({
        email:"test@test.com",
        password:"password"
    })
    .expect(400);
    });

    it('sets a cookie after successful signup',async()=>{
        const response=await request(app)
        .post('/api/users/signup')
        .send({
            email:"test@test.com",
            password:"password"
        })
        .expect(201);
        expect(response.get('Set-Cookie')).toBeDefined();
    });