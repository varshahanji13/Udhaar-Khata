import dotenv from "dotenv";

dotenv.config({
  path:"./.env"
});

console.log(process.env.TWILIO_ACCOUNT_SID);
console.log(process.env.TWILIO_AUTH_TOKEN);
console.log(process.env.TWILIO_PHONE_NUMBER);