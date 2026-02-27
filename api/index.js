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

// prisma/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// prisma/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model CardItem {\n  id        String   @id @default(uuid())\n  userId    String\n  mealId    String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user User @relation(fields: [userId], references: [id])\n  meal Meal @relation(fields: [mealId], references: [id])\n\n  @@index([mealId])\n  @@index([userId])\n  @@map("CardItems")\n}\n\nmodel Category {\n  id           String   @id @default(uuid())\n  categoryName String   @db.VarChar(100)\n  description  String   @db.Text\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n  meals        Meal[]\n\n  @@map("categories")\n}\n\nmodel Meal {\n  id          String   @id @default(uuid())\n  categoryId  String\n  name        String   @db.VarChar(100)\n  description String   @db.Text\n  price       Decimal  @db.Decimal(10, 2)\n  image       String?\n  isAvailable Boolean  @default(true)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  orders   Order[]\n  reviews  Review[]\n  cardItem CardItem[]\n\n  @@map("meals")\n}\n\nmodel Order {\n  id              String      @id @default(uuid())\n  userId          String\n  mealId          String\n  delevaryAddress String      @db.Text\n  paymentMethod   String      @db.VarChar(100)\n  quantity        Int\n  totalAmount     Decimal     @db.Decimal(10, 2)\n  status          OrderStatus @default(PREPARING)\n  createdAt       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n\n  user User @relation(fields: [userId], references: [id])\n  meal Meal @relation(fields: [mealId], references: [id])\n\n  @@map("orders")\n}\n\nenum OrderStatus {\n  DELIVERED\n  READY\n  CANCELLED\n  PREPARING\n}\n\nmodel ProviderProfile {\n  id             String   @id @default(uuid())\n  userId         String   @unique\n  restaurantName String   @db.VarChar(100)\n  address        String\n  phone          String\n  image          String?\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n\n  user User @relation(fields: [userId], references: [id])\n\n  @@map("providerProfiles")\n}\n\nmodel Review {\n  id        String   @id @default(uuid())\n  mealId    String\n  userId    String\n  rating    Int\n  comment   String   @db.Text\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user User @relation(fields: [userId], references: [id])\n  meal Meal @relation(fields: [mealId], references: [id])\n\n  @@index([mealId])\n  @@index([userId])\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id               String           @id\n  name             String\n  email            String\n  emailVerified    Boolean          @default(false)\n  image            String?\n  createdAt        DateTime         @default(now())\n  updatedAt        DateTime         @updatedAt\n  role             UserRole         @default(CUSTOMER)\n  status           userStatus       @default(ACTIVE)\n  sessions         Session[]\n  accounts         Account[]\n  providerProfiles ProviderProfile?\n  orders           Order[]\n  reviews          Review[]\n  cardItem         CardItem[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum UserRole {\n  CUSTOMER\n  PROVIDER\n  ADMIN\n}\n\nenum userStatus {\n  ACTIVE\n  SUSPENDED\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"CardItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CardItemToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"CardItemToMeal"}],"dbName":"CardItems"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"categoryName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":"categories"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"image","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"orders","kind":"object","type":"Order","relationName":"MealToOrder"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"},{"name":"cardItem","kind":"object","type":"CardItem","relationName":"CardItemToMeal"}],"dbName":"meals"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"delevaryAddress","kind":"scalar","type":"String"},{"name":"paymentMethod","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrder"}],"dbName":"orders"},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"restaurantName","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"}],"dbName":"providerProfiles"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"}],"dbName":"reviews"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"userStatus"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"providerProfiles","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"cardItem","kind":"object","type":"CardItem","relationName":"CardItemToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// prisma/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// prisma/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.APP_URL, "https://b6-a4-frontend-client.vercel.app"],
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
  }
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
var getAllMeal = () => {
  return prisma.meal.findMany({
    include: {
      category: {
        select: {
          categoryName: true
        }
      }
    }
  });
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
    const data = await mealServices.getAllMeal();
    res.status(201).json({
      success: true,
      message: "Menu list retrieved successfully",
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
var createOrder = (data) => {
  return prisma.order.create({ data });
};
var getSingleOrder = (id) => {
  return prisma.order.findUnique({
    where: { id }
  });
};
var getOrderById = (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      meal: {
        include: { category: true }
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

// src/app.ts
var origin = process.env.APP_URL || "http://localhost:3000";
var app = express();
app.use(express.json());
app.use(cors({
  origin: [origin, "https://b6-a4-frontend-client.vercel.app"],
  credentials: true
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
