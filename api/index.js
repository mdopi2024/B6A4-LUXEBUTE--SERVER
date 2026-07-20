// src/app.ts
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// src/env.ts
import dotenv from "dotenv";
dotenv.config();
var getEnv = (key) => {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};
var loadEnv = {
  DATABASE_URL: getEnv("DATABASE_URL"),
  PORT: getEnv("PORT"),
  APP_URL: getEnv("APP_URL"),
  PROD_API_URL: getEnv("PROD_API_URL"),
  BETTER_AUTH_SECRET: getEnv("BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: getEnv("BETTER_AUTH_URL"),
  STRIPE_SECRET_KEY: getEnv("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRETE: getEnv("STRIPE_WEBHOOK_SECRETE")
};

// src/lib/prisma.ts
var env = loadEnv;
var connectionString = `${env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var env2 = loadEnv;
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [
    env2.APP_URL ?? "http://localhost:3000",
    "https://b6-a4-frontend-client.vercel.app",
    "http://localhost:3000",
    "http://localhost:6000",
    "http://localhost:4000"
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // 5 minutes
    }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production"
  },
  crossSubDomainCookies: {
    enabled: false
  },
  disableCSRFCheck: true
});

// src/modules/category/category.route.ts
import { Router } from "express";

// src/modules/category/category.services.ts
var createCategories = async (data) => {
  return prisma.category.create({ data });
};
var getAllCategories = async () => {
  return prisma.category.findMany();
};
var getAllCategoryById = (id) => {
  return prisma.category.findUnique({
    where: {
      id
    }
  });
};
var updateCategory = async (id, data) => {
  return prisma.category.update({
    where: {
      id
    },
    data
  });
};
var deleteCategory = async (id) => {
  return prisma.category.delete({
    where: {
      id
    }
  });
};
var categoryServices = {
  createCategories,
  getAllCategories,
  getAllCategoryById,
  updateCategory,
  deleteCategory
};

// src/modules/category/category.controllar.ts
var createCategories2 = async (req, res) => {
  try {
    const categoryData = req.body;
    const data = await categoryServices.createCategories(categoryData);
    res.status(201).json({
      success: true,
      message: "category created successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "category creation failed",
      error: err.message
    });
  }
};
var getAllCategories2 = async (req, res) => {
  try {
    const data = await categoryServices.getAllCategories();
    res.status(201).json({
      success: true,
      message: "All categories retrieved successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: err.message
    });
  }
};
var getAllCategoryById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await categoryServices.getAllCategoryById(id);
    res.status(201).json({
      success: true,
      message: "Category retrieved successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: err.message
    });
  }
};
var updateCategory2 = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await categoryServices.updateCategory(id, req.body);
    res.status(201).json({
      success: true,
      message: "updated category successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: err.message
    });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await categoryServices.deleteCategory(id);
    res.status(201).json({
      success: true,
      message: "Category deleted successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: err.message
    });
  }
};
var categoryController = {
  createCategories: createCategories2,
  getAllCategories: getAllCategories2,
  getAllCategoryById: getAllCategoryById2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/middleware/auth.ts
var auth2 = (...role) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access"
        });
      }
      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role
      };
      if (role.length && !role.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource"
        });
      }
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Authentication failed"
      });
    }
  };
};

// src/modules/category/category.route.ts
var router = Router();
router.post("/category", auth2("ADMIN" /* ADMIN */), categoryController.createCategories);
router.get("/category", auth2("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */), categoryController.getAllCategories);
router.get("/category/:id", auth2("ADMIN" /* ADMIN */), categoryController.getAllCategoryById);
router.patch("/category/:id", auth2("ADMIN" /* ADMIN */), categoryController.updateCategory);
router.delete("/category/:id", auth2("ADMIN" /* ADMIN */), categoryController.deleteCategory);
var categoryRouter = router;

// src/modules/user/user.route.ts
import { Router as Router2 } from "express";

// src/modules/user/user.services.ts
var getAllUser = () => {
  return prisma.user.findMany();
};
var getUserById = (id) => {
  return prisma.user.findUnique({
    where: { id }
  });
};
var updateUserStatus = (id, data) => {
  return prisma.user.update({
    where: { id },
    data
  });
};
var updateUserRole = (id, data) => {
  return prisma.user.update({
    where: { id },
    data
  });
};
var deleteUser = (id) => {
  return prisma.user.delete({
    where: { id }
  });
};
var userServices = {
  getAllUser,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser
};

// src/modules/user/user.controller.ts
var getAllUser2 = async (req, res) => {
  try {
    const data = await userServices.getAllUser();
    res.status(201).json({
      success: true,
      message: "All user retrieved successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: err.message
    });
  }
};
var getUserById2 = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await userServices.getUserById(id);
    res.status(201).json({
      success: true,
      message: " User retrieved by id successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: err.message
    });
  }
};
var updateUserStatus2 = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await userServices.updateUserStatus(id, req.body);
    res.status(201).json({
      success: true,
      message: " User status updated successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: err.message
    });
  }
};
var updateUserRole2 = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await userServices.updateUserRole(id, req.body);
    res.status(201).json({
      success: true,
      message: " User role updated successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: err.message
    });
  }
};
var deleteUser2 = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await userServices.deleteUser(id);
    res.status(201).json({
      success: true,
      message: " User deleted successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: err.message
    });
  }
};
var userController = {
  getAllUser: getAllUser2,
  getUserById: getUserById2,
  updateUserStatus: updateUserStatus2,
  updateUserRole: updateUserRole2,
  deleteUser: deleteUser2
};

// src/modules/user/user.route.ts
var router2 = Router2();
router2.get("/user", auth2("ADMIN" /* ADMIN */), userController.getAllUser);
router2.get("/user/:id", auth2("ADMIN" /* ADMIN */), userController.getUserById);
router2.patch("/user/:id", auth2("ADMIN" /* ADMIN */), userController.updateUserStatus);
router2.patch("/user/role/:id", auth2("ADMIN" /* ADMIN */), userController.updateUserRole);
router2.delete("/user/:id", auth2("ADMIN" /* ADMIN */), userController.deleteUser);
var userRoute = router2;

// src/modules/meal/meal.route.ts
import { Router as Router3 } from "express";

// src/modules/meal/meal.services.ts
var createMeal = (data) => {
  return prisma.meal.create({ data });
};
var getAllMeal = async (params) => {
  const {
    search,
    page = 1,
    limit = 10,
    categoryId,
    isAvailable,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = params;
  const skip = (page - 1) * limit;
  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { categoryName: { contains: search, mode: "insensitive" } } }
      ]
    });
  }
  if (categoryId) {
    andConditions.push({ categoryId });
  }
  if (isAvailable !== void 0) {
    andConditions.push({ isAvailable });
  }
  const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
  const [data, total] = await Promise.all([
    prisma.meal.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        category: {
          select: {
            categoryName: true
          }
        }
      }
    }),
    prisma.meal.count({ where: whereConditions })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    data
  };
};
var getMealById = (id) => {
  return prisma.meal.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          categoryName: true
        }
      }
    }
  });
};
var updateMeal = (id, data) => {
  return prisma.meal.update({
    where: { id },
    data
  });
};
var deleteMeal = (id) => {
  return prisma.meal.delete({
    where: { id }
  });
};
var mealServices = {
  createMeal,
  getAllMeal,
  updateMeal,
  getMealById,
  deleteMeal
};

// src/modules/meal/meal.controller.ts
var createMeal2 = async (req, res) => {
  try {
    const mealData = { ...req.body, price: Number(req.body.price) };
    const data = await mealServices.createMeal(mealData);
    res.status(201).json({
      success: true,
      message: "New menu added successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to add new menu",
      error: err.message
    });
  }
};
var getAllMeal2 = async (req, res) => {
  try {
    const { search, page, limit, categoryId, isAvailable, sortBy, sortOrder } = req.query;
    const params = {
      search,
      page: page ? Number(page) : void 0,
      limit: limit ? Number(limit) : void 0,
      categoryId,
      isAvailable: isAvailable !== void 0 ? isAvailable === "true" : void 0,
      sortBy,
      sortOrder
    };
    const result = await mealServices.getAllMeal(params);
    res.status(200).json({
      success: true,
      message: "Menu list retrieved successfully",
      meta: result.meta,
      data: result.data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch menus",
      error: err.message
    });
  }
};
var getMealById2 = async (req, res) => {
  try {
    const data = await mealServices.getMealById(req.params.id);
    res.status(201).json({
      success: true,
      message: "Menu  retrieved successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch menus",
      error: err.message
    });
  }
};
var updateMeal2 = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await mealServices.updateMeal(id, req.body);
    res.status(201).json({
      success: true,
      message: "Menu updated successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update menus",
      error: err.message
    });
  }
};
var deleteMeal2 = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await mealServices.deleteMeal(id);
    res.status(201).json({
      success: true,
      message: "Menu deleted successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete menu",
      error: err.message
    });
  }
};
var mealController = {
  createMeal: createMeal2,
  getAllMeal: getAllMeal2,
  updateMeal: updateMeal2,
  getMealById: getMealById2,
  deleteMeal: deleteMeal2
};

// src/modules/meal/meal.route.ts
var router3 = Router3();
router3.get("/meal", mealController.getAllMeal);
router3.get("/meal/:id", mealController.getMealById);
router3.post("/meal", auth2("PROVIDER" /* PROVIDER */), mealController.createMeal);
router3.patch("/meal/update/:id", auth2("PROVIDER" /* PROVIDER */), mealController.updateMeal);
router3.delete("/meal/:id", auth2("PROVIDER" /* PROVIDER */), mealController.deleteMeal);
var mealRoute = router3;

// src/modules/addCard/addCard.route.ts
import { Router as Router4 } from "express";

// src/modules/addCard/addCard.services.ts
var addItemCard = async (data) => {
  const isAxist = await prisma.cardItem.findFirst({
    where: { mealId: data.mealId, userId: data.userId }
  });
  if (isAxist) {
    throw new Error("This item already exist in you card");
  }
  return prisma.cardItem.create({ data });
};
var getAllItemCard = async (id) => {
  return prisma.cardItem.findMany({
    where: { userId: id },
    include: {
      meal: {
        include: { category: { select: { categoryName: true } } }
      }
    }
  });
};
var geItemCardById = async (id) => {
  return prisma.cardItem.findUnique({
    where: { id },
    include: {
      meal: {
        include: { category: { select: { id: true, categoryName: true } } }
      }
    }
  });
};
var deleteItemCard = async (id) => {
  return prisma.cardItem.delete({
    where: { id }
  });
};
var addCardServices = {
  addItemCard,
  getAllItemCard,
  deleteItemCard,
  geItemCardById
};

// src/modules/addCard/addCard.controller.ts
var addItemCard2 = async (req, res) => {
  try {
    const cardData = req.body;
    const data = await addCardServices.addItemCard(cardData);
    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err?.message || "Failed to add item to cart",
      error: err.message
    });
  }
};
var getAllItemCard2 = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await addCardServices.getAllItemCard(id);
    res.status(201).json({
      success: true,
      message: "Cart items retrieved successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cart items",
      error: err.message
    });
  }
};
var getItemCardById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await addCardServices.geItemCardById(id);
    res.status(201).json({
      success: true,
      message: "Cart item retrieved successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cart item",
      error: err.message
    });
  }
};
var deleteItemCard2 = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await addCardServices.deleteItemCard(id);
    res.status(201).json({
      success: true,
      message: "Cart item deleted successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete  item",
      error: err.message
    });
  }
};
var addCardController = {
  addItemCard: addItemCard2,
  getAllItemCard: getAllItemCard2,
  deleteItemCard: deleteItemCard2,
  getItemCardById
};

// src/modules/addCard/addCard.route.ts
var router4 = Router4();
router4.get("/card-item/:id", auth2("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */), addCardController.getAllItemCard);
router4.get("/card-item/single/:id", auth2("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */), addCardController.getItemCardById);
router4.delete("/card-item/:id", auth2("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */), addCardController.deleteItemCard);
router4.post("/add-item", auth2("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */), addCardController.addItemCard);
var addItemRotuer = router4;

// src/modules/order/order.routes.ts
import { Router as Router5 } from "express";

// src/modules/order/order.services.ts
import { v7 as uuidv7 } from "uuid";

// src/config/stripe.config.ts
import Stripe from "stripe";
var envbar = loadEnv;
var stripe = new Stripe(envbar.STRIPE_SECRET_KEY);

// src/modules/order/order.services.ts
var envVar = loadEnv;
var createOrder = async (data) => {
  const meal = await prisma.meal.findUnique({
    where: { id: data.mealId }
  });
  if (!meal) {
    throw new Error("Meal not found");
  }
  const user = await prisma.user.findUnique({
    where: { id: data.userId }
  });
  if (!user) {
    throw new Error("User not found");
  }
  const isCashOnDelivery = data.paymentMethod.trim().toLowerCase() === "cash on delivery";
  if (isCashOnDelivery) {
    const { order: order2, payment: payment2 } = await prisma.$transaction(async (tx) => {
      const order3 = await tx.order.create({
        data
      });
      const transactionId = uuidv7();
      const payment3 = await tx.payment.create({
        data: {
          orderId: order3.id,
          amount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          transactionId
        }
      });
      return { order: order3, payment: payment3 };
    });
    return {
      order: order2,
      payment: payment2,
      paymentUrl: null
    };
  }
  const { order, payment } = await prisma.$transaction(async (tx) => {
    const order2 = await tx.order.create({
      data
    });
    const transactionId = uuidv7();
    const payment2 = await tx.payment.create({
      data: {
        orderId: order2.id,
        amount: data.totalAmount,
        paymentMethod: data.paymentMethod,
        transactionId
      }
    });
    return { order: order2, payment: payment2 };
  });
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
              name: meal.name
            }
          }
        }
      ],
      metadata: {
        orderId: order.id,
        paymentId: payment.id,
        transactionId: payment.transactionId ?? ""
      },
      success_url: `${envVar.APP_URL}/payment/success}`,
      cancel_url: `${envVar.APP_URL}/payment/cancel`
    });
    return {
      order,
      payment,
      paymentUrl: session.url
    };
  } catch (err) {
    console.error(
      `Stripe session creation failed for order ${order.id}:`,
      err
    );
    try {
      await prisma.$transaction([
        prisma.payment.delete({ where: { id: payment.id } }),
        prisma.order.delete({ where: { id: order.id } })
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
var getSingleOrder = (id) => {
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
  });
};
var getOrderById = (userId) => {
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
  });
};
var updateOrderStatus = (id, data) => {
  return prisma.order.update({
    where: { id },
    data
  });
};
var getAllOrders = () => {
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
  });
};
var orderServices = {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getSingleOrder
};

// src/modules/order/order.controller.ts
var createOrder2 = async (req, res) => {
  try {
    const orderData = req.body;
    orderData.totalAmount = Number(orderData.totalAmount);
    orderData.quantity = Number(orderData.quantity);
    const data = await orderServices.createOrder(orderData);
    res.status(201).json({
      success: true,
      message: "Your order has been successfully placed.",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to process your order. Please try again.",
      error: err.message
    });
  }
};
var getOrderById2 = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await orderServices.getOrderById(id);
    res.status(201).json({
      success: true,
      message: "Your order retrived successfully .",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrived orders",
      error: err.message
    });
  }
};
var updateOrderStatus2 = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await orderServices.updateOrderStatus(id, req.body);
    res.status(201).json({
      success: true,
      message: "Order updated  successfully.",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: err.message
    });
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const data = await orderServices.getAllOrders();
    res.status(201).json({
      success: true,
      message: "Orders retrived  successfully.",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrived orders",
      error: err.message
    });
  }
};
var getSingleOrder2 = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await orderServices.getSingleOrder(id);
    res.status(201).json({
      success: true,
      message: "order retrived successfully .",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrived orders",
      error: err.message
    });
  }
};
var orderController = {
  createOrder: createOrder2,
  getOrderById: getOrderById2,
  updateOrderStatus: updateOrderStatus2,
  getAllOrders: getAllOrders2,
  getSingleOrder: getSingleOrder2
};

// src/modules/order/order.routes.ts
var router5 = Router5();
router5.get("/order", auth2("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */), orderController.getAllOrders);
router5.get("/order/:id", auth2("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */), orderController.getOrderById);
router5.get("/single-order/:id", auth2("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */), orderController.getSingleOrder);
router5.patch("/order/:id", auth2("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */), orderController.updateOrderStatus);
router5.post("/order", auth2("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */), orderController.createOrder);
var orderRouter = router5;

// src/modules/comments/comment.routes.ts
import { Router as Router6 } from "express";

// src/modules/comments/comment.services.ts
var createComment = (data) => {
  return prisma.review.create({ data });
};
var getReviewByMealId = (id) => {
  return prisma.review.findMany({
    where: { mealId: id }
  });
};
var commentServices = {
  createComment,
  getReviewByMealId
};

// src/modules/comments/comment.controller.ts
var createComment2 = async (req, res) => {
  try {
    const commentData = req.body;
    commentData.rating = Number(commentData.rating);
    const data = await commentServices.createComment(commentData);
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Review creation failed",
      error: err.message
    });
  }
};
var getReviewByMealId2 = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await commentServices.getReviewByMealId(id);
    res.status(201).json({
      success: true,
      message: "Review retrived successfully",
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Review retrived failed",
      error: err.message
    });
  }
};
var commentController = {
  createComment: createComment2,
  getReviewByMealId: getReviewByMealId2
};

// src/modules/comments/comment.routes.ts
var router6 = Router6();
router6.post("/review", auth2("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */), commentController.createComment);
router6.get("/review/:id", commentController.getReviewByMealId);
var commentRoutes = router6;

// src/modules/payment/payment.controller.ts
import status from "http-status";

// prisma/generated/prisma/enums.ts
var PaymentStatus = {
  PAID: "PAID",
  UNPAID: "UNPAID"
};

// src/modules/payment/payment.services.ts
var handlerStripeWebhookEvent = async (event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      if (!orderId) {
        return { message: "Missing orderId in session metadata" };
      }
      const payment = await prisma.payment.findUnique({
        where: {
          orderId
        }
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
            id: orderId
          },
          data: {
            paymentStatus: PaymentStatus.PAID
          }
        });
        await tx.payment.update({
          where: {
            orderId
          },
          data: {
            paymentStatus: PaymentStatus.PAID,
            paymentIntentId: session.payment_intent,
            paidAt: /* @__PURE__ */ new Date()
          }
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
        `Payment intent ${paymentIntent.id} failed for order ${orderId}: ${paymentIntent.last_payment_error?.message ?? "unknown reason"}`
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
          data: { paymentStatus: PaymentStatus.UNPAID, status: "CANCELLED" }
        });
        await tx.payment.update({
          where: { orderId },
          data: { paymentStatus: PaymentStatus.UNPAID }
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
            data: { status: "CANCELLED" }
          });
          await tx.payment.update({
            where: { orderId },
            data: { paymentStatus: PaymentStatus.UNPAID }
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
var PaymentService = {
  handlerStripeWebhookEvent
};

// src/modules/payment/payment.controller.ts
var handleStripeWebhookEvent = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const webhookSecret = loadEnv.STRIPE_WEBHOOK_SECRETE;
  if (!signature || typeof signature !== "string") {
    console.error("Missing or invalid Stripe signature header");
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: "Missing or invalid Stripe signature header"
    });
  }
  if (!webhookSecret) {
    console.error("Missing Stripe webhook secret in environment config");
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Webhook secret is not configured"
    });
  }
  if (!req.body || !Buffer.isBuffer(req.body)) {
    console.error("Webhook request body is not a raw Buffer");
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: "Invalid webhook payload"
    });
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error("Error verifying Stripe webhook signature:", error.message);
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: `Webhook signature verification failed: ${error.message}`
    });
  }
  if (!event || !event.type) {
    console.error("Malformed Stripe event received");
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: "Malformed Stripe event received"
    });
  }
  try {
    const result = await PaymentService.handlerStripeWebhookEvent(event);
    return res.status(status.OK).json({
      success: true,
      message: "Stripe webhook event processed successfully",
      data: result
    });
  } catch (error) {
    console.error("Error handling Stripe webhook event:", error);
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Error handling Stripe webhook event"
    });
  }
};
var PaymentController = {
  handleStripeWebhookEvent
};

// src/app.ts
var origin = loadEnv.APP_URL || "http://localhost:3000";
var app = express();
app.use(express.json());
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent
);
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_API_URL || "https://b6-a4-frontend-client.vercel.app",
  "http://localhost:4000",
  "http://localhost:6000"
].filter(Boolean);
app.use(cors({
  origin: (origin2, callback) => {
    if (!origin2) return callback(null, true);
    const isAllowed = allowedOrigins.includes(origin2) || /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin2) || /^https:\/\/.*\.vercel\.app$/.test(origin2);
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"]
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api", categoryRouter);
app.use("/api", userRoute);
app.use("/api", mealRoute);
app.use("/api", addItemRotuer);
app.use("/api", orderRouter);
app.use("/api", commentRoutes);
app.get("/", (req, res) => {
  res.send("HELLO WORLD");
});

// src/index.ts
var index_default = app;
export {
  index_default as default
};
