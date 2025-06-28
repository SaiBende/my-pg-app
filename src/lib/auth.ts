import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
//import { MongoClient } from "mongodb";
import { sendEmail } from "./mail-service";
import mongoose from "mongoose";
 
// const client = new MongoClient(process.env.MONGODB_URI as string);
// const db = client.db();
await mongoose.connect(process.env.MONGODB_URI!);
const db = mongoose.connection.db;
if (!db) {
  throw new Error("MongoDB connection failed: db is undefined.");
}

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        sendResetPassword: async ({user, url}, ) => {
        await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
        html: `<p>Click the link to reset your password:</p><p><a href="${url}">${url}</a></p>`,

      });
      
    },
    },
    
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }
    },
});