import bcrypt from "bcryptjs";
import { UserModel } from "../models/UserModel.js";
import generateToken from "../utils/generateToken.js";


// Register User

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check whether user already exists

    const existingUser = await UserModel.findOne({
      email
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// Login User

export const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Find user

    const user = await UserModel.findOne({
      email
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email"
      });
    }

    // Compare passwords

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid Password"
      });
    }

    // Generate token

    const token = generateToken(
      user._id
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

//Logout user 

export const logout = async(req,res)=>{

try{

res.status(200).json({

message:"Logout successful"

});

}
catch(error){

res.status(500).json({

message:error.message

});

}

};