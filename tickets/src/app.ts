import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { showAllTicketsRouter } from './routes';
import { updateTicketRouter } from './routes/update';

// import { errorHandler } from './middlewares/error-handler';
// import { PageNotFound } from './errors/not-found-error';
import cookieSession from 'cookie-session';
import { errorHandler,PageNotFound,currentUser } from '@vcoderlearn1/common';

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
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(showAllTicketsRouter);
app.use(updateTicketRouter);
app.all('*',async ()=>{
    throw new PageNotFound();
})
app.use(errorHandler);

export {app};