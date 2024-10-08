import {useState} from 'react';
import axios from 'axios';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
const signup=()=>{
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    // const [errors,setErrors]=useState([]);
    const {doRequest,errors}=useRequest(
        {
            url:'/api/users/signin',
            method:'post',
            body:{
                email,password 
            },
            onSuccess:()=>    Router.push('/')
        }
    )
    const onSubmit=async (event)=>{
        event.preventDefault();
    //     try{
    //     const response=await axios.post('/api/users/signup',{
    //         email,password
    //     });
    //     console.log(response.data);
    // }catch(err){
    //     console.log(err.response.data);
    //     setErrors(err.response.data.errors);
    // }
    doRequest();
    };
    return (
        <form onSubmit={onSubmit}>
            <h1>Sign in</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input 
                value={email}
                onChange={e=>setEmail(e.target.value)}
                className="form-control"></input>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input 
                 value={password}
                 onChange={e=>setPassword(e.target.value)}
                type="password" className="form-control"></input>
            </div>
             {/* {errors.length>0&&
            (<div className='alert alert-danger'>
                <h4>Oooops..</h4>
                <ul className='my-0'>
                    { errors.map(err=><li key={err.message}>{err.message}</li>)}
                </ul>
            </div>
            )}  */}
            {errors}
            <button className="btn btn-primary">Sign in</button>
        </form>
    );
}

export default signup;