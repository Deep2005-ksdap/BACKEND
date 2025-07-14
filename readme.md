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
    "message": "Login successful",
    "userId": "<user_id>"
  }
  ```
  - Sets a `token` cookie (JWT) for authentication.

---

### **Inventory Routes (All require authentication via JWT token in cookie or Authorization header)**

#### 3. **GET /home/dashboard**

- **Description:** Get all stock, or filter/search by `itemName` and/or `category`.
- **Query Parameters (optional):**
  - `itemName` (string, **exact match**)
  - `category` (string, exact match)
- **Example Requests:**
  - `/home/dashboard`
  - `/home/dashboard?category=electronics`
  - `/home/dashboard?itemName=phone`
  - `/home/dashboard?category=clothing&itemName=shirt`
- **Response:**
  ```json
  {
    "message": "You are in the dashboard",
    "data": {
      "message": "Items found", // or "No items found"
      "allStock": [
        {
          "_id": "...",
          "itemName": "Shirt",
          "itemPrice": 500,
          "itemUnits": 10,
          "itemBrand": null,
          "itemSize": "M",
          "category": "clothing",
          "ownerId": "...",
          "createdAt": "...",
          "updatedAt": "..."
        },
        ...
      ],
      "lowStockItems": [ ... ], // items with itemUnits < 5
      "totalItems": 1,
      "addTotal": 5000
    }
  }
  ```
  - `totalItems`: Number of items returned.
  - `addTotal`: Sum of `itemPrice * itemUnits` for all returned items.
  - `lowStockItems`: Array of items with less than 5 units.

---

#### 4. **POST /home/add-item**

- **Description:** Add a new stock item.
- **Request Body:**
  ```json
  {
    "itemName": "Laptop",
    "itemPrice": 50000,
    "itemUnits": 5,
    "category": "electronics",
    "itemBrand": "Dell",      // required if category is electronics
    "itemSize": "M"           // required if category is clothing
  }
  ```
- **Response:**
  ```json
  {
    "message": "New stock added successfully",
    "data": {
      "_id": "...",
      "itemName": "Laptop",
      "itemPrice": 50000,
      "itemUnits": 5,
      "category": "electronics",
      "itemBrand": "Dell",
      "itemSize": null,
      "ownerId": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

---

#### 5. **PATCH /home/edit-item/:itemName**

- **Description:** Edit an existing stock item by its `itemName`.
- **Request Params:** `itemName` (string)
- **Request Body:** Any fields to update, e.g.:
  ```json
  {
    "itemPrice": 60000,
    "itemUnits": 7
  }
  ```
- **Response:**
  ```json
  {
    "message": "Stock updated successfully",
    "data": {
      "itemPrice": 60000,
      "itemUnits": 7
    }
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
| itemName   | String  | Yes      | Name of the item                   |
| itemPrice  | Number  | Yes      | Price of the item                  |
| itemUnits  | Number  | Yes      | Number of units in stock           |
| itemBrand  | String  | No       | Brand (for electronics)            |
| itemSize   | String  | No       | Size (for clothing)                |
| category   | String  | Yes      | Category (e.g., electronics, clothing) |
| ownerId    | ObjectId| Yes      | Reference to user                  |

---

## 📝 **Notes**

- All responses are in JSON.
- All `/home/*` routes require authentication (JWT in cookie or `Authorization` header).
- For **searching**, `itemName` uses **exact match** (not partial).
- For **filtering**, `category` is an exact match.
- If no query parameters are provided to `/home/dashboard`, all stock items are returned.
- Error responses will include a `message` and `error` field.
- `addTotal` in `/dashboard` is the sum of all `itemPrice * itemUnits` for the returned items.
- Passwords are hashed before storing in the database.
- JWT secret is hardcoded as `"secrets"` for demo; use environment variables in production.

---

## 🚀 **How to Run**

1. Install dependencies:  
   `npm install`
2. Start the server:  
   `node index.js`
3. The API will be available at `http://localhost:3002/home`

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

For support, contact the developer or open