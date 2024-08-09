import express, { Request,Response } from "express";
import { BadRequestError, OrderStatus, PageNotFound, requireAuth,validateRequest } from "@vcoderlearn1/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router=express.Router();
//Use db or env variable
//const EXPIRATION_WINDOWS_SECOND=15*60;
const EXPIRATION_WINDOWS_SECOND=1*60;//1 min for testing
//requireAuth to see user token
router.post('/api/orders',requireAuth,[
    body('ticketId')
    .not()
    .isEmpty()
    .custom((input:string)=>mongoose.Types.ObjectId.isValid(input))
    .withMessage('Ticket id must be empty')
],
validateRequest,
async(req:Request,res:Response)=>{
    const {ticketId}=req.body;
    //Find ticket user is trying to order in db
    const ticket=await Ticket.findById(ticketId);
    if(!ticket)
    throw new PageNotFound();
    //make sure ticket is not already reserved
    const isReserved=await ticket.isReserved();
    if(isReserved)
    throw new BadRequestError('Ticket is already reserved');
  //Run query to look at all orders.Find an order where ticket is ticket we just found
  //*and* order status is *not* cancelled.If we find an order from that means ticket reserved
  const existingOrder=await ticket.isReserved();  
  if(existingOrder){
    throw new BadRequestError('ticket already reserved');
  }
    //calculate expiration period 15 min for payment
    const expiration=new Date();
    expiration.setSeconds(expiration.getSeconds()+EXPIRATION_WINDOWS_SECOND);//15*60=15 min
    //Build order and save to db
    const order=Order.build({
      userId:req.currentUser!.id,
      status:OrderStatus.Created,
      expiresAt:expiration,
      ticket
    });
    await order.save();
    //publish event order created
    //Mongodb takes expiresAt in date format and converts to string before saving to db
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id:order.id,
      status:order.status,
      userId:order.userId,
      version: order.version,
      //use UTC format instead of depending on dates toString method
      expiresAt:order.expiresAt.toISOString(),
      ticket:{
        id:ticket.id,
        price:ticket.price
      }
    });

    res.status(201).send(order);
})

export {router as newOrderRouter}