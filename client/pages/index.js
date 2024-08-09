import axios from "axios";
import buildClient from "../api/build-client";
import Link from 'next/link';

//tickets got from fn getInitialProps
const Landing=({currentUser,tickets})=>{
    console.log(currentUser);
    //Here it worked ;in server didnt work why?
    // axios.get('/api/users/currentuser').catch((err) => {
    //   console.log(err.message);
    // });
   
    // return currentUser?(
    //     <h1>You are signed in</h1>
    // ):(<h1>
    //     You are NOT signed in 
    // </h1>)
    const ticketList=tickets.map(ticket=>{
        return <tr key={ticket.id}>
          <td>{ticket.title}</td>
          <td>{ticket.price}</td>
          <td>
            <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                View
            </Link>
          </td>
        </tr>
    });
return (
    <div>
        <h1>Tickets</h1>
        <table className="table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
                {ticketList}
            </tbody>
        </table>
    </div>
);
};
// called by nextjs during server side rebdering
// Landing.getInitialProps=({req})=>{
    // if(typeof window==='undefined'){
    //     console.log('I am on the server!');
    //     const {data}=axios.get('http://ingress-nginx.ingress-nginx-controller.svc.cluster.local/api/users/currentuser',{
    //         // headers:{
    //             headers:req.headers
    //         //     Host:'ticketing.dev'
    //         // }
    //     }).catch((err) => {
    //         console.log(err.message);
    //       });
    //       return data;

    // }else{
    //     //on browser -->browser calls ticketing.dev
    //     const {data}=axios.get('/api/users/currentuser').catch((err) => {
    //         console.log(err.message);
    //       });
    //       return data;

    // }
    Landing.getInitialProps=async (context,client,currentUser)=>{
        // const {data}=await buildClient(context).get('/api/users/currentuser');
        // return data;
        const {data}=await client.get('/api/tickets');
        return {tickets:data};
   
}

export default Landing;