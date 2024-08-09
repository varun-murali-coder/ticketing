import nats,{Stan} from 'node-nats-streaming';
//Singleton pattern
class NatsWrapper{
private _client?:Stan;
get client(){
    if(!this._client){
        throw new Error('Cannot access nats client before connecting');
    }
    return this._client;
}
//similar implementation like mongoose
connect(clusterId:string,clientId:string,url:string){
this._client=nats.connect(clusterId,clientId,{url});

//to apply async-await we use promise
return new Promise<void>((resolve,reject)=>{
    this._client!.on('connect',()=>{
        console.log('Conn to nats');
        resolve();
    });
    this._client!.on('error',(err)=>{
        reject(err);
    })
});

}
}

export const natsWrapper=new NatsWrapper();