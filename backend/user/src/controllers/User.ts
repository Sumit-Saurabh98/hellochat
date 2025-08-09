import { publishToQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/trycatch.js";
import { redisClient } from "../index.js";

export const loginUser = TryCatch(async(req, res) =>{
    const {email} = req.body;

    const rateLimitKey = `hellootp:ratelimit${email}`

    const rateLimit = await redisClient.get(rateLimitKey)

    if(rateLimit){
        return res.status(429).json({
            message: "Too many request, please try after 1 min."
        })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpKey = `hellootp:${email}`

    await redisClient.set(rateLimitKey, "true", {
        EX: 60
    })

    await redisClient.set(otpKey, otp, {
        EX: 300
    })

    const message = {
        to: email,
        subject: "Your OTP code",
        body: `Your OTP is ${otp}. This code will expire in 5 minutes.`
    }

    await publishToQueue("hello-send-otp", message)

    res.status(200).json({
        message: "OTP sent successfully"
    })
})