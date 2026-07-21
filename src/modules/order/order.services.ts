import { v7 as uuidv7 } from "uuid";
import { OrderStatus } from "../../../prisma/generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../config/stripe.config";
import { loadEnv } from "../../env";
const envVar = loadEnv

interface OrderTypes {
    mealId: string,
    userId: string,
    totalAmount: number,
    quantity: number,
    paymentMethod: string,
    delevaryAddress: string
}


const createOrder = async (data: OrderTypes) => {
  // 1) Validation - transaction এর বাইরে, দ্রুত fail করার জন্য
  const meal = await prisma.meal.findUnique({
    where: { id: data.mealId },
  });

  if (!meal) {
    throw new Error("Meal not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isCashOnDelivery =
    data.paymentMethod.trim().toLowerCase() === "cash on delivery";

  // 2) Cash on Delivery flow
  if (isCashOnDelivery) {
    const { order, payment } = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data,
      });

      const transactionId = uuidv7();

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          amount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          transactionId,
        },
      });

      return { order, payment };
    });

    return {
      order,
      payment,
      paymentUrl: null,
    };
  }

  // 3) Stripe flow - order + payment তৈরি করুন (transaction এ)
  const { order, payment } = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data,
    });

    const transactionId = uuidv7();

    const payment = await tx.payment.create({
      data: {
        orderId: order.id,
        amount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        transactionId,
      },
    });

    return { order, payment };
  });

  // 4) এখন Stripe checkout session তৈরি করুন - transaction এর বাইরে
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          quantity: data.quantity,
          price_data: {
            currency: "bdt",
            unit_amount: Math.round(data.totalAmount * 100),
            product_data: {
              name: meal.name,
            },
          },
        },
      ],
      metadata: {
        orderId: order.id,
        paymentId: payment.id,
        transactionId: payment.transactionId ?? "",
      },
      success_url: `${envVar.APP_URL}/payment/success`,
      cancel_url: `${envVar.APP_URL}/payment/cancel`,
    });

    // 5) সব কাজ শেষে সম্পূর্ণ result রিটার্ন করুন
    return {
      order,
      payment,
      paymentUrl: session.url,
    };
  } catch (err) {
    console.error(
      `Stripe session creation failed for order ${order.id}:`,
      err
    );

    // Compensating rollback - Stripe fail হলে orphan order/payment মুছে ফেলা হচ্ছে
    try {
      await prisma.$transaction([
        prisma.payment.delete({ where: { id: payment.id } }),
        prisma.order.delete({ where: { id: order.id } }),
      ]);
    } catch (cleanupErr) {
      console.error(
        `Cleanup failed for order ${order.id} after Stripe failure:`,
        cleanupErr
      );
    }

    throw new Error("Payment session creation failed. Please try again.");
  }
};

const getSingleOrder = (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      meal: {
        include: { category: true }
      },
      user: {
        select: { email: true, name: true }
      },
      payment: {
        select: {
          amount: true,
          paymentMethod: true,
          paymentStatus: true,
          paidAt: true,
          transactionId: true
        }
      }
    }
  })
}

const getOrderById = (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      meal: {
        include: { category: true }
      },
      payment: {
        select: {
          amount: true,
          paymentMethod: true,
          paymentStatus: true,
          paidAt: true,
          transactionId: true
        }
      }
    }
  })
}
const updateOrderStatus = (id: string,data:{status:OrderStatus}) => {
 
    return prisma.order.update({
        where: { id },
        data
    })
}
const getAllOrders = () => {
  return prisma.order.findMany({
    include: {
      meal: {
        include: { category: true }
      },
      user: {
        select: { email: true, name: true }
      },
      payment: {
        select: {
          amount: true,
          paymentMethod: true,
          paymentStatus: true,
          paidAt: true,
          transactionId: true
        }
      }
    }
  })
}

export const orderServices = {
    createOrder,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
    getSingleOrder
}