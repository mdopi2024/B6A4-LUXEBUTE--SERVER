# LuxeButes 🍱
**"Discover & Order Delicious Meals"**

---

## **Main Highlights**

### 1️⃣ **Project Overview**
- Full-stack meal ordering platform  
- Customers, Providers, and Admins each have distinct roles  
- Users can browse meals, place orders, and track deliveries  

### 2️⃣ **Roles & Permissions**
| Role | Key Actions |
|------|------------|
| **Customer** | Browse & order meals, track orders, leave reviews |
| **Provider** | Manage menu, view & update orders |
| **Admin** | Manage users, orders, and categories |

### 3️⃣ **Key Features**
- Browse meals & providers  
- Filter meals by cuisine, price, dietary preference  
- Add meals to cart & checkout  
- Real-time order tracking  
- Leave reviews for meals  
- Role-based dashboards for Customers, Providers, and Admins  

### 4️⃣ **Tech Stack**
- **Frontend:** React, Tailwind CSS, Axios  
- **Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL  
- **Security:** JWT authentication, bcrypt password hashing  

### 5️⃣ **Backend API Examples**
**Auth:**  
- POST `/api/auth/register` – Register new user  
- POST `/api/auth/login` – Login  
- GET `/api/auth/me` – Get current user  

**Meals & Providers:**  
- GET `/api/meal` – List all meals  
- GET `/api/meal/:id` – Meal details  
- POST/PUT/DELETE `/api/provider/meals` – Manage menu (Provider)  

**Orders:**  
- POST `/api/order` – Create order  
- GET `/api/order` – User orders  
- PATCH `/api/order/:id` – Update order status  

**Admin:**  
- GET `/api/user/:id` – View user  
- PATCH `/api/user/:id` – Update user status  

### 6️⃣ **Database Tables**
- **Users:** id, name, email, password, role  
- **ProviderProfiles:** Restaurant info linked to user  
- **Categories:** Cuisine types  
- **Meals:** Name, description, price, provider  
- **Orders:** User orders & status  
- **Reviews:** Customer ratings & comments  

### 7️⃣ **Frontend Example**
- **Latest Menus Section:** Displays 5 most recently added meals  

### 8️⃣ **Journeys**

**Customer Journey:**  
Register → Browse Meals → Add to Cart → Checkout → Track Order  

**Provider Journey:**  
Register → Add Menu Items → View Orders → Update Status  

**Order Status Flow:**  
PLACED → PREPARING → READY → DELIVERED  
          \
           → CANCELLED (by customer)  

---

## **Setup Instructions**

### Backend
```bash
git clone https://github.com/mdopi2024/B6A4-LUXEBUTE--SERVER
cd B6A4-LUXEBUTE--SERVER
npm install
# Configure .env with database and JWT settings
npx prisma migrate dev --name init
npm run dev