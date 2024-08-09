import express,{ Request,Response } from "express";
import { Order } from "../models/order";
import { BadRequestError, NotAuthorized, OrderStatus, PageNotFound, requireAuth, validateRequest } from "@vcoderlearn1/common";
import { body } from "express-validator";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";


const router=express.Router();

router.post('/api/payments',
requireAuth,
[
    body('token')
    .not().isEmpty(),
    body('orderId').not().isEmpty(),
    validateRequest,
],async (req:Request,res:Response)=>{
    const {token,orderId}=req.body;
    const order=await Order.findById(orderId);
    if(!order)
    throw new PageNotFound();
if(order.userId !== req.currentUser!.id){
    throw new NotAuthorized();
}
if(order.status===OrderStatus.Cancelled){
    throw new BadRequestError('Cannot pay for cancelled order');
}

const charge=await stripe.charges.create({
    currency:'usd',
    amount:order.price*100,//this comes as cents to convert to cents multiply by 100 check documentation
    source:token
});

const payment=Payment.build({
    orderId,
    stripeId:charge.id
});
await payment.save();
await new PaymentCreatedPublisher(natsWrapper.client).publish({
    id:payment.id,
    orderId:order.id,
    stripeId:payment.stripeId
});
res.status(201).send({id:payment.id});

});

export {router as createChargeRouter};