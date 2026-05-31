
import twilio from "twilio";
import { config as loadEnv } from "dotenv";
import path from "path";

let TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
let TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
let TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// If Twilio env vars are missing, try loading .env explicitly from the project root.
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    const result = loadEnv({ path: envPath });
    if (result && result.parsed) {
      console.log(`Loaded environment from ${envPath}`);
    }
  } catch (e) {
    console.warn("Failed to load .env explicitly:", e && e.message ? e.message : e);
  }

  // Re-read after attempting to load
  TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
}

console.log("TWILIO_ACCOUNT_SID present:", !!TWILIO_ACCOUNT_SID);
console.log("TWILIO_AUTH_TOKEN present:", !!TWILIO_AUTH_TOKEN);
console.log("TWILIO_PHONE_NUMBER:", TWILIO_PHONE_NUMBER);

let client = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
} else {
  console.warn(
    "Twilio credentials are missing. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in your environment."
  );
}

const sendSMS = async (phoneNumber, message) => {
  if (!client) {
    // In development we don't want to crash; return a mock result so testing can continue
    if (process.env.NODE_ENV === "development") {
      console.warn("Twilio credentials missing — using development fallback (no SMS sent)");
      console.log("Dev SMS -> to:", phoneNumber);
      console.log("Dev SMS -> body:\n", message);
      return {
        sid: `DEV_${Date.now()}`,
        to: phoneNumber,
        body: message,
        status: "dev-fallback",
      };
    }

    // Fail fast with a helpful error so caller can report it
    const err = new Error(
      "Twilio configuration missing: TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set"
    );
    err.code = "TWILIO_CONFIG_MISSING";
    throw err;
  }

  if (!TWILIO_PHONE_NUMBER) {
    if (process.env.NODE_ENV === "development") {
      console.warn("TWILIO_PHONE_NUMBER not set — using development fallback (no from number)");
      console.log("Dev SMS -> to:", phoneNumber);
      console.log("Dev SMS -> body:\n", message);
      return {
        sid: `DEV_${Date.now()}`,
        to: phoneNumber,
        body: message,
        status: "dev-fallback-no-from",
      };
    }

    const err = new Error("TWILIO_PHONE_NUMBER is not set in environment");
    err.code = "TWILIO_FROM_NUMBER_MISSING";
    throw err;
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return result;
  } catch (error) {
    console.error("TWILIO ERROR:", error && error.message ? error.message : error);
    throw error;
  }
};

export default sendSMS;