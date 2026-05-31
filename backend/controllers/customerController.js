import { CustomerModel } from "../models/CustomerModel.js";


// Add customer

export const addCustomer = async (req,res) => {
  try {

    const customer =
      await CustomerModel.create({
        ...req.body,
        createdBy: req.user.userId
      });

    res.status(201).json({
      message: "Customer added",
      customer
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// Get all customers

export const getCustomers = async (req, res) => {

  try {

    const customers =
    await CustomerModel.find({
      createdBy:
      req.user.userId
    });

    res.json(customers);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// Get single customer

export const getCustomerById =
async (req,res)=>{

try{

const customer=
await CustomerModel.findById(
req.params.id
);

if(!customer){

return res.status(404).json({
message:"Customer not found"
});

}

res.status(200).json(
customer
);

}
catch(error){

res.status(500).json({
message:error.message
});

}

};


// Update customer

export const updateCustomer =
async(req,res)=>{

try{

const customer=
await CustomerModel.findByIdAndUpdate(

req.params.id,

req.body,

{
new:true
}

);

res.status(200).json({

message:"Customer updated",

customer

});

}
catch(error){

res.status(500).json({
message:error.message
});

}

};


// Soft Delete Customer

export const deleteCustomer =
async(req,res)=>{

try{

await CustomerModel.findByIdAndUpdate(

req.params.id,

{
status:false
}

);

res.status(200).json({

message:"Customer deleted"

});

}
catch(error){

res.status(500).json({
message:error.message
});

}

};