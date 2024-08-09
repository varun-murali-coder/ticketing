import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
// import { errorHandler } from './middlewares/error-handler';
// import { PageNotFound } from './errors/not-found-error';
import cookieSession from 'cookie-session';
import { errorHandler,PageNotFound } from '@vcoderlearn1/common';

const app=express();
// traffic proxied via nginx
app.set('trust proxy',true);
app.use(json());
// #only for https cookie send
app.use(
    cookieSession({
        signed:false,
        secure:process.env.NODE_ENV!=='test'
    })
)

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.all('*',async ()=>{
    throw new PageNotFound();
})
app.use(errorHandler);

export {app};