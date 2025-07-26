# Inventory Trackor API

A Node.js + Express + MongoDB backend for managing inventory items and users.  
This API supports user registration/login, adding, editing, deleting, searching, and filtering inventory stock.

---

## 📦 **Base URL**

```
http://localhost:3002/home
```

---

## 📚 **Routes & Methods**

### **User Routes**

#### 1. **POST /user/register**

- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Validation:**
  - `fullname.firstname` (min 3 chars)
  - `email` (valid email)
  - `password` (min 6 chars)
- **Response:**
  ```json
  {
    "message": "Registration successful"
  }
  ```
  *(or validation errors / user exists)*

---

#### 2. **POST /user/login**

- **Description:** Login a user.
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful"
  }
  ```
  - Sets a `token` cookie (JWT) for authentication.

---

### **Inventory Routes (All require authentication via JWT token in cookie or Authorization header)**

#### 3. **GET /home/dashboard**

- **Description:** Get all stock, or filter/search by `itemname` and/or `category`.
- **Query Parameters (optional):**
  - `itemname` (string, **exact match**)
  - `category` (string, exact match)
- **Example Requests:**
  - `/home/dashboard`
  - `/home/dashboard?category=electronics`
  - `/home/dashboard?itemname=phone`
  - `/home/dashboard?category=clothing&itemname=shirt`
- **Response:**
  ```json
  {
    "message": "You are in the dashboard",
    "data": {
      "message": "Items found", // or "No items found"
      "lowStockItems": [
        {
          "_id": "...",
          "itemname": "Pen",
          "itemprice": 10,
          "itemunits": 2,
          "category": "stationery",
          "ownerId": "...",
          "createdAt": "...",
          "updatedAt": "..."
        }
        // ...more items with itemunits < 5
      ],
      "lowStockItemsCount": 1,
      "totalStockValue": 5000,
      "allStock": [
        {
          "_id": "...",
          "itemname": "Shirt",
          "itemprice": 500,
          "itemunits": 10,
          "itembrand": null,
          "itemsize": "M",
          "category": "clothing",
          "ownerId": "...",
          "createdAt": "...",
          "updatedAt": "..."
        }
        // ...more items
      ]
    }
  }
  ```
  - `lowStockItems`: Array of items with less than 5 units.
  - `lowStockItemsCount`: Number of low stock items.
  - `totalStockValue`: Sum of `itemprice * itemunits` for all returned items.
  - `allStock`: All items matching the filter.

---

#### 4. **POST /home/add-item**

- **Description:** Add a new stock item.
- **Request Body:**
  ```json
  {
    "itemname": "Laptop",
    "itemprice": 50000,
    "itemunits": 5,
    "category": "electronics",
    "itembrand": "Dell",      // required if category is electronics
    "itemsize": "M"           // required if category is clothing
  }
  ```
- **Response:**
  ```json
  {
    "message": "New stock added successfully"
  }
  ```

---

#### 5. **PATCH /home/edit-item/:stockId**

- **Description:** Edit an existing stock item by its MongoDB `_id`.
- **Request Params:** `stockId` (string)
- **Request Body:** Any fields to update, e.g.:
  ```json
  {
    "itemprice": 60000,
    "itemunits": 7
  }
  ```
- **Response:**
  ```json
  {
    "message": "Stock updated successfully"
  }
  ```

---

#### 6. **DELETE /home/delete-item/:id**

- **Description:** Delete a stock item by its MongoDB `_id`.
- **Request Params:** `id` (string)
- **Response:**
  ```json
  {
    "message": "Stock deleted successfully"
  }
  ```

---

## 🗃️ **Data Model (Stock)**

| Field      | Type    | Required | Description                        |
|------------|---------|----------|------------------------------------|
| itemname   | String  | Yes      | Name of the item                   |
| itemprice  | Number  | Yes      | Price of the item                  |
| itemunits  | Number  | Yes      | Number of units in stock           |
| itembrand  | String  | No       | Brand (for electronics)            |
| itemsize   | String  | No       | Size (for clothing)                |
| category   | String  | Yes      | Category (e.g., electronics, clothing) |
| ownerId    | ObjectId| Yes      | Reference to user                  |

---

## 📝 **Notes**

- All responses are in JSON.
- All `/home/*` routes require authentication (JWT in cookie or `Authorization` header).
- For **searching**, `itemname` uses **exact match** (not partial).
- For **filtering**, `category` is an exact match.
- If no query parameters are provided to `/home/dashboard`, all stock items are returned for the authenticated user.
- Error responses will include a `message` and `error` field.
- `totalStockValue` in `/dashboard` is the sum of all `itemprice * itemunits` for the returned items.
- Passwords are hashed before storing in the database.
- JWT secret should be set in your `.env` as `JWT_SECRET`.

---

## 🚀 **How to Run**

1. Install dependencies:  
   `npm install`
2. Set up your `.env` file with:
   ```
   MONGO_URI=<your-mongodb-uri>
   PORT=3002
   JWT_SECRET=<your-secret>
   ```
3. Start the server:  
   `node index.js`
4. The API will be available at `http://localhost:3002/home`

---

## 🛠️ **Tech Stack**

- Node.js
- Express
- MongoDB (Mongoose)
- CORS enabled
- JWT authentication
- bcrypt password hashing

---

## 📬 **Contact**

For support, contact the developer or open an