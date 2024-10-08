import {useState,useEffect} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
//whatever is returned by getinitialprops we get here
const OrderShow=({order,currentUser})=>{
    const [timeLeft,setTimeLeft]=useState(0);
    const {doRequest,errors}=useRequest({
        url:'/api/payments',
        method:'post',
        body:{
            orderId:order.id
        },
        // onSuccess:(payment)=>console.log(payment)
        onSuccess:(payment)=>Router.push("/orders")

    });

    useEffect(()=>{
        const findTimeLeft=()=>{
        const msLeft=new Date(order.expiresAt)-new Date();
        setTimeLeft(Math.round(msLeft/1000));
        };
        findTimeLeft();//set interval calls after 1 second to avoid this we call it at beginning
const timerId=setInterval(findTimeLeft,1000);
//return called when we navigate away from component or re-rendered
return ()=>{
    clearInterval(timerId);
};

    },[]);

    if(timeLeft<0)
    return <div>Order expired</div>
    return (
        <div>
            Time left to pay:-{timeLeft} seconds
            <StripeCheckout 
           // token={(token)=>console.log(token)}
             token={({id})=>doRequest({token:id})}

            stripeKey='pk_test_51PjbeWA5BQxTJfolIrTMWGQNH4liCariodfURfWcEt6dxWjFEztVEkfytr6n1679jLo4NO0lJ2Na90N7yLEOZKUT00VgKVGU9J'
            amount={order.ticket.price *100}
            email={currentUser.email}
            />
            {errors}
        </div>
    );
};

OrderShow.getInitialProps=async (context,client)=>{
    const {orderId}=context.query;
    const {data}=await client.get(`/api/orders/${orderId}`);
    return {order:data};
};
export default OrderShow;