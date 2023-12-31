import NextAuth, { NextAuthOptions   } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client"
import Stripe from "stripe";

const prisma = new PrismaClient()


export const authOptions:NextAuthOptions   = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({ // sidn in with google account
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  events: { // create new user in stripe with google account that signed in
    createUser: async ({ user }: any) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: '2022-11-15',
      })
      //create stripe customer
      if (user.name && user.email) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name
        })
        //also update the prisma user with with the stripe customerId
        await prisma.user.update({
          where: { id: user.id }, // find the prisma user that signed 
          data: { stripeCustomerId: customer.id }, // update the customerId with the new user in stripe
        })
      }
    },
  },
}

export default NextAuth(authOptions)