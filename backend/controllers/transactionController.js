import { TransactionModel } 
from "../models/TransactionModel.js";

import { CustomerModel } 
from "../models/CustomerModel.js";


// Add Transaction

export const addTransaction =
async (req,res)=>{

try{

const {
customerId,
type,
amount,
description
}=req.body;

const customer=
await CustomerModel.findById(
customerId
);

if(!customer){

return res.status(404).json({
message:"Customer not found"
});

}


// Prevent invalid payment

if(
type==="payment" &&
amount>customer.currentBalance
){

return res.status(400).json({

message:
"Payment exceeds pending balance"

});

}


// Create transaction

const transaction=
await TransactionModel.create({

customerId,
type,
amount,
description,
createdBy:req.user.userId

});


// Update balance

if(type==="credit"){

customer.currentBalance += amount;

}

else{

customer.currentBalance -= amount;

}

await customer.save();

res.status(201).json({

message:"Transaction added",
transaction

});

}
catch(error){

res.status(500).json({

message:error.message

});

}
};



// Get transaction history

export const getTransactions=
async(req,res)=>{

try{

const transactions=
await TransactionModel.find({

customerId:req.params.customerId

}).sort({

createdAt:-1

});

res.status(200).json(
transactions
);

}
catch(error){

res.status(500).json({
message:error.message
});

}

};


// Get all transactions for the logged-in user
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await TransactionModel.find({
      createdBy: req.user.userId
    })
    .populate('customerId', 'customerName')
    .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};