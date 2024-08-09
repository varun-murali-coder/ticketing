// globally adding css
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const App=({Component,pageProps,currentUser})=>{
    return <div>
        <Header currentUser={currentUser}/>
        <div className='container'>
    <Component currentUser={currentUser} {...pageProps}/>
    </div>
    </div>

};
// #important this is custom app so dont have context
// page component initial props=>context==={req,res}
// custom app component initial props=>{Component,ctx:{req,res}}

App.getInitialProps=async(appContext)=>{
console.log(Object.keys(appContext));
const client=buildClient(appContext.ctx);
const {data}=await client.get('/api/users/currentuser')
let pageProps={};
if(appContext.Component.getInitialProps){
    //pass user details to child elements
 pageProps=await appContext.Component.getInitialProps(appContext.ctx,client,data.currentUser);
}
// return data;
return {
    pageProps,
    ...data
}
};

export default App;