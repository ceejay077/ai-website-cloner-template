"use client";

import { useEffect } from "react";
import { firePendingPurchaseConversion } from "./enquiry";

export function ThankYouConversion() {
  useEffect(() => {
    firePendingPurchaseConversion();
  }, []);

  return null;
}
