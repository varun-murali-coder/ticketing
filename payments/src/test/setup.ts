import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from "mongoose";
import request from 'supertest';
import { app } from "../app";
import jwt from 'jsonwebtoken';
declare global {
    // var signin: () => Promise<string[]>;
    var signin: (id?:string) => string[];
  }
//Moccking nats-wrapper
  jest.mock('../nats-wrapper');
  //process.env.STRIPE_KEY='';

let mongo:any;
beforeAll(async()=>{
    process.env.JWT_KEY='adipoli';
     mongo=await MongoMemoryServer.create();
    const mongoUri=mongo.getUri();
    await mongoose.connect(mongoUri,{});
});

beforeEach(async()=>{
    jest.clearAllMocks();
    const collections=await mongoose.connection.db.collections();
    for(let collection of collections){
        await collection.deleteMany({});
    }
})

afterAll(async()=>{
    if(mongo){
        await mongo.stop();
    }
    await mongoose.connection.close();
});


global.signin=(id?:string)=>{
    //Take cookie from header and base64 decode
    //Build a jwt payload {id,email}
    const payload={
        id:id||new mongoose.Types.ObjectId().toHexString(),
        email:'test@test.com'
    }
    //Create jwt
    const token=jwt.sign(payload,process.env.JWT_KEY!);
    //Build session obj.{jwt: MY_JWT}
    const session={jwt:token};
    //Turn that session into json
    const sessionJSON=JSON.stringify(session);
    //Take encode and encode as base64
    const base64=Buffer.from(sessionJSON).toString('base64');
    //return a string thats the cookie with encoded data
    return [`session=${base64}`]; 
};