import { Ticket } from "../ticket";

it('implements optimistic concurrency control',async()=>{
//Create instance of a ticket
const ticket=Ticket.build({
    title:'concert',
    price:5,
    userId:'123'
});
//Save ticket to db
await ticket.save();
//fetch ticket twice
const firstInstance=await Ticket.findById(ticket.id);
const secondInstance=await Ticket.findById(ticket.id);
//make 2 separate changes to ticket we fetched
firstInstance!.set({price:10});
secondInstance!.set({price:15});
//save first fetched ticket
await firstInstance!.save();
//save 2nd fetched ticket and expect an error
try{
await secondInstance!.save();
}catch(err){
    return;
}
});

it("increment version number on multiple saves",async()=>{
    const ticket=Ticket.build({
        title:'concert',
        price:5,
        userId:'123'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
});