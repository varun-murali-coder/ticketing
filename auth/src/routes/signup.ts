import express,{Request,Response} from 'express';
import { body,validationResult } from 'express-validator';
// import { RequestValidationError } from '../errors/request-validation-errors';
import { User } from '../models/user';
// import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken';
// import { validateRequest } from '../middlewares/validate-request';
import { validateRequest,BadRequestError,RequestValidationError } from '@vcoderlearn1/common';


const router=express.Router();

router.post('/api/users/signup',
[
    body('email').isEmail().withMessage('Provide a valid email'),
    body('password').trim().isLength({min:4,max:20}).withMessage('Provide a valid password of length betweeen 4 and 20 letters')

],
validateRequest
,async(req:Request,res:Response)=>{
    // const errors=validationResult(req);
    // if(!errors.isEmpty()){
    // //    return  res.status(400).send(errors.array());
    // throw new RequestValidationError(errors.array());
    // }
    const {email,password}=req.body;
    const existingUser=await User.findOne({email});
    if(existingUser){
      throw new BadRequestError('Email in use');
    }
    const user=User.build({email,password});
    await user.save();
    //Generate jwt and store on sesssion obj
    const userJwt=jwt.sign({
      id:user.id,
      email:user.email
    },
    process.env.JWT_KEY!
    );
    req.session={
      jwt:userJwt
    };
    res.status(201).send(user);
  
});

export {router as signupRouter};