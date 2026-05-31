import { CustomerModel } 
from "../models/CustomerModel.js";

import { TransactionModel } 
from "../models/TransactionModel.js";

export const getDashboardData =
async(req,res)=>{

try{

const userId = req.user.userId;

// Total customers

const totalCustomers =
await CustomerModel.countDocuments({
createdBy:userId
});


// Total Credit & Paid

const stats = await TransactionModel.aggregate([
  { $match: { createdBy: userId } },
  {
    $group: {
      _id: null,
      totalCredit: {
        $sum: { $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0] }
      },
      totalPaid: {
        $sum: { $cond: [{ $eq: ["$type", "payment"] }, "$amount", 0] }
      }
    }
  }
]);

const totalCredit = stats[0]?.totalCredit || 0;
const totalPaid = stats[0]?.totalPaid || 0;
const pendingAmount = totalCredit - totalPaid;


// Recent transactions

const recentTransactions=
await TransactionModel.find({
createdBy:userId
})
.populate("customerId", "customerName")
.sort({
createdAt:-1
})
.limit(5);

res.status(200).json({
totalCustomers,
totalCredit,
totalPaid,
pendingAmount,
recentTransactions
});

}
catch(error){

res.status(500).json({

message:error.message

});

}

};