import express, { Request,Response } from "express";
import { Order } from "../models/order";
import { NotAuthorized, OrderStatus, PageNotFound, requireAuth } from "@vcoderlearn1/common";
import { OrderCacncelledPublisher } from "../events/publishers/order-deleted-publisher";
import { natsWrapper } from "../nats-wrapper";

const router=express.Router();

router.delete('/api/orders/:orderId',async(req:Request,res:Response)=>{
    const {orderId}=req.params;
    const order=await Order.findById(orderId).populate('ticket');
    if(!order){
        throw new PageNotFound();
    }
    if(order.userId!==req.currentUser?.id){
        throw new NotAuthorized();
    }
    order.status=OrderStatus.Cancelled;
    await order.save();
    //publish event this was cancelled
    new OrderCacncelledPublisher(natsWrapper.client).publish({
        id:order.id,
        version: order.version,
        ticket:{
          id:order.ticket.id
        }
      })

    res.status(204).send(order);
})

export {router as deleteOrderRouter}