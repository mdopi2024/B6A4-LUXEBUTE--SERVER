/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../config/stripe.config";
import { PaymentStatus } from "../../../prisma/generated/prisma/enums";

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
  const session = event.data.object;

  const orderId = session.metadata?.orderId;

  if (!orderId) {
    return { message: "Missing orderId in session metadata" };
  }

  const payment = await prisma.payment.findUnique({
    where: {
      orderId,
    },
  });

  if (!payment) {
    return { message: "Payment not found" };
  }

  if (payment.paymentStatus === PaymentStatus.PAID) {
    return { message: "Payment already completed" };
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });

    await tx.payment.update({
      where: {
        orderId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paymentIntentId: session.payment_intent as string,
        paidAt: new Date(),
      },
    });
  });

  break;
}

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (!orderId) {
        console.error("Missing orderId in payment intent metadata");
        return { message: "Missing orderId in payment intent metadata" };
      }

      console.log(
        `Payment intent ${paymentIntent.id} failed for order ${orderId}: ${
          paymentIntent.last_payment_error?.message ?? "unknown reason"
        }`
      );
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object;
      const orderId = charge.metadata?.orderId;

      if (!orderId) {
        console.error("Missing orderId in charge metadata");
        return { message: "Missing orderId in charge metadata" };
      }

      const payment = await prisma.payment.findUnique({ where: { orderId } });

      if (!payment) {
        console.error(`No payment record found for order ${orderId}`);
        return { message: `No payment record found for order ${orderId}` };
      }

      if (payment.paymentStatus === PaymentStatus.UNPAID) {
        console.log(`Order ${orderId} already marked as UNPAID. Skipping`);
        return { message: `Order ${orderId} already marked as UNPAID. Skipping` };
      }

      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: orderId },
          data: { paymentStatus: PaymentStatus.UNPAID, status: "CANCELLED" },
        });
        await tx.payment.update({
          where: { orderId },
          data: { paymentStatus: PaymentStatus.UNPAID },
        });
      });

      console.log(`Processed charge.refunded for order ${orderId}`);
      break;
    }

   case "checkout.session.expired": {
  const session = event.data.object;
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    return { message: "Missing orderId in checkout session metadata" };
  }

  const payment = await prisma.payment.findUnique({ where: { orderId } });
  if (payment && payment.paymentStatus === "UNPAID") {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });
      await tx.payment.update({
        where: { orderId },
        data: { paymentStatus:PaymentStatus.UNPAID },
      });
    });
  }

  console.log(`Checkout session ${session.id} expired for order ${orderId}`);
  break;
}

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { message: `Webhook Event ${event.id} processed successfully` };
};

export const PaymentService = {
  handlerStripeWebhookEvent,
};