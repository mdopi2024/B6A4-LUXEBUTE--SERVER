# LuxeButes 🍱
**"Discover & Order Delicious Meals"**

---

## **Main Highlights**

### 1️⃣ **Project Overview**
- Full-stack meal ordering platform  
- Customers, Providers, and Admins each have distinct roles  
- Users can browse meals, place orders, and track delivery  

### 2️⃣ **Roles & Permissions**
| Role | Key Actions |
|------|------------|
| **Customer** | Browse & order meals, track orders, leave reviews |
| **Provider** | Manage menu, view/update orders |
| **Admin** | Manage users, orders, and categories |

### 3️⃣ **Key Features**
- Browse meals & providers  
- Filter meals by cuisine, price, dietary preference  
- Add to cart & checkout  
- Real-time order tracking  
- Leave reviews for meals  
- Role-based dashboards  

### 4️⃣ **Tech Stack**
- **Frontend:** React, Tailwind CSS, Axios  
- **Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL  
- **Security:** JWT authentication, bcrypt password hashing  

### 5️⃣ **Backend API**
- **Auth:** Register, Login, Get Current User  
- **Meals & Providers:** List meals, Meal details, Manage meals (Provider)  
- **Orders:** Create, view, update orders  
- **Admin:** Manage users & categories  

### 6️⃣ **Database**
- **Users:** id, name, email, role  
- **ProviderProfiles:** Restaurant info  
- **Categories:** Cuisine types  
- **Meals:** Name, description, price, provider  
- **Orders:** User orders & status  
- **Reviews:** Customer ratings & comments  

### 7️⃣ **Frontend Example**
- **Latest Menus Section:** Shows 5 most recently added meals  

---



## Some examples  API Endpoints (Backend)
**Auth:**  
- POST `/api/auth/register` – Register  
- POST `/api/auth/login` – Login  
- GET `/api/auth/me` – Current user  

**Meals & Providers:**  
- GET `/api/meal` – List meals  
- GET `/api/meal/:id` – Meal details   

**Orders:**  
- POST `/api/order` – Create order  
- GET `/api/order` – User orders  
- PATCH `/api/order/:id` – Update status  

**Admin:**  
- GET/ PATCH `/api/user/:id` – Manage users  

---


## **Setup**
### Backend
```bash
git clone <repo-url>
cd backend
npm install
# Configure .env
npx prisma migrate dev --name init
npm run dev