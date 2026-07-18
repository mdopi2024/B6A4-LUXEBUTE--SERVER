/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import status from "http-status";
import Stripe from "stripe";

import { stripe } from "../../config/stripe.config";
import { PaymentService } from "./payment.services";
import { loadEnv } from "../../env";

const handleStripeWebhookEvent = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret =loadEnv.STRIPE_WEBHOOK_SECRETE

  if (!signature || typeof signature !== "string") {
    console.error("Missing or invalid Stripe signature header");
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: "Missing or invalid Stripe signature header",
    });
  }

  if (!webhookSecret) {
    console.error("Missing Stripe webhook secret in environment config");
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Webhook secret is not configured",
    });
  }

  if (!req.body || !Buffer.isBuffer(req.body)) {
    console.error("Webhook request body is not a raw Buffer");
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: "Invalid webhook payload",
    });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error: any) {
    console.error("Error verifying Stripe webhook signature:", error.message);
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: `Webhook signature verification failed: ${error.message}`,
    });
  }

  if (!event || !event.type) {
    console.error("Malformed Stripe event received");
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: "Malformed Stripe event received",
    });
  }

  try {
    const result = await PaymentService.handlerStripeWebhookEvent(event);
    return res.status(status.OK).json({
      success: true,
      message: "Stripe webhook event processed successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error handling Stripe webhook event:", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Error handling Stripe webhook event",
    });
  }
};

export const PaymentController = {
  handleStripeWebhookEvent,
};