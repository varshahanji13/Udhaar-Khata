import { CustomerModel } from "../models/CustomerModel.js";

import sendSMS from "../services/twilioService.js";

export const sendReminder = async(req,res)=>{

try{

const customer=
await CustomerModel.findById(
req.params.customerId
);

if(!customer){

return res.status(404).json({
message:"Customer not found"
});

}


// Generate message

const message=`Hello ${customer.customerName},This is a reminder from UdhaarBook.

Pending Amount:
₹${customer.currentBalance}

Please clear your dues.

Thank you.`;


// Send SMS

await sendSMS(

customer.phoneNumber,

message

);

res.status(200).json({message:"Reminder sent successfully",

sentMessage:message});

}
catch(error){

 res.status(500).json({message:error.message});

}

};