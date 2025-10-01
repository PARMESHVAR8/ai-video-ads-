import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    credits: v.number(),
    paymentid:v.optional(v.string()),
    // age: v.optional(v.number()),  // example with optional field
  }),
});
