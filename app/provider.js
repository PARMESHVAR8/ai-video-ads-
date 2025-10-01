"use client";
import React from 'react'

import { ConvexProvider, ConvexReactClient } from "convex/react";

const provider = (children) => {
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  return (
    <div>
        <ConvexProvider client={convex}>{children}</ConvexProvider>
    </div>
  )
}

export default provider
