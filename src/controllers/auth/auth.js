import { Customer,DeliveryPartner } from "../../models/index.js";
import jwt from "jsonwebtoken";

export const generateTokens=(user)=>{
    const accessToken=jwt.sign({userId:user._id,role:user.role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'1d'}
    );

    const refreshToken=jwt.sign({userId:user._id,role:user.role},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'7d'}
    );

    return {accessToken,refreshToken};
}

export const loginCustomer=async(req,reply)=>{
      try {
          const {phone}=await req.body;
          let customer=await Customer.findOne({phone});
          if(!customer){
            customer=new Customer({
                phone,
                isActivated:true,
                role:'customer'
            })
            await customer.save();
          };

          const {accessToken,refreshToken}=generateTokens(customer);
          return reply.send({
            message:customer ? "Login Successful":"Customer created and logged in",
            accessToken,
            refreshToken,
            customer
          })
      } catch (error) {
        console.log(error)
        return reply.status(500).send({message:"Internal Server Error:",error})
      }
}

export const loginDeliveryPartner=async(req,reply)=>{
    try {
        const {email,password}=req.body;
        const deliveryPartner=await DeliveryPartner.findOne({email});

        if(!deliveryPartner){
            return reply.status(404).send({message:"Delivery partner not found!!"})
        }
        
        const isMatch= password === deliveryPartner.password;

        if(!isMatch){
            return reply.status(400).send({message:"Invalid Credentials!!"})
        }

        const {accessToken,refreshToken}=generateTokens(deliveryPartner);
        return reply.send({
            message:"Login Success!!",
            accessToken,
            refreshToken,
            deliveryPartner
        })
    } catch (error) {
        return reply.status(500).send({message:"Internal Server Error:",error})
    }
}


export const refreshToken=async(req,reply)=>{
    const {refreshToken}=req.body;
    if(!refreshToken){
       return reply.status(401).send({message:"Refresh Token Required!!"})
    }
    try {
        
    const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
    let user;

    if(decoded.role==='customer'){
        user= await Customer.findById(decoded.userId);
    }else if(decoded.role==='deliveryPartner'){
        user= await DeliveryPartner.findById(decoded.userId);
    }else{
        return reply.status(403).send({message:"Invalid Role!!"})
    }

    if(!user){
        return reply.status(403).send({message:"Invalid Refresh Token!!"});
    }

    const {accessToken,refreshToken:newRefreshToken}=generateTokens(user);

    return reply.send({
        message:"Token refreshed successfully!!",
        accessToken,
        refreshToken:newRefreshToken
    })
    } catch (error) {
       return reply.status(403).send({message:'Invalid Refresh Token!!'}); 
    }
}

export const fetchUser=async(req,reply)=>{
    try {
        const {userId,role}=req.user;
        let user;

        if(role==="customer"){
            user=await Customer.findById(userId);
        }else if(role==="deliveryPartner"){
            user=await DeliveryPartner.findById(userId);
        }else {
            return reply.status(403).send({message:'Invalid role'});
        }

        if(!user){
            return reply.status(404).send({message:'User not found'});
        }

        return reply.send({
            message:"User Fetched Successfully",
            user
        })
    } catch (error) {
        return reply.status(500).send({message:'Internal server error'});
    }
}