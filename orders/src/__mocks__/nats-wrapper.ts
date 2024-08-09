export const natsWrapper={
client:{
  publish:jest.fn().mockImplementation((
    subject:string,data:string,callback:()=>void
  )=>{
callback();
  })
  //(subject:string,data:string,callback:()=>void)=>{
// callback();
//     } -->create a mock fn to test event publish
},
};