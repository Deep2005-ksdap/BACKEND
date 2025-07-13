# Inventory Trackor API

A simple Node.js + Express + MongoDB backend for managing inventory items.  
This API supports adding, editing, deleting, searching, and filtering inventory stock.

---

## 📦 **Base URL**

```
http://localhost:3002/home
```

---

## 📚 **Routes & Methods**

### 1. **GET /**

- **Description:** Welcome route.
- **Request:** None
- **Response:**
  ```json
  {
    "message": "Welcome to the Inventory Tracker APP"
  }
  ```

---

### 2. **GET /dashboard**

- **Description:** Get all stock, or filter/search by `itemName` and/or `category`.
- **Query Parameters (optional):**
  - `itemName` (string, **exact match**)
  - `category` (string, exact match)
- **Example Requests:**
  - `/dashboard`
  - `/dashboard?category=electronics`
  - `/dashboard?itemName=phone`
  - `/dashboard?category=clothing&itemName=shirt`
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
          "createdAt": "...",
          "updatedAt": "..."
        },
        ...
      ],
      "totalItems": 1,
      "addTotal": 5000
    }
  }
  ```
  - `totalItems`: Number of items returned.
  - `addTotal`: Sum of `itemPrice * itemUnits` for all returned items.

---

### 3. **POST /add-item**

- **Description:** Add a new stock item.
- **Request Body (JSON):**
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
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

---

### 4. **PATCH /edit-item/:itemName**

- **Description:** Edit an existing stock item by its `itemName`.
- **Request Params:** `itemName` (string)
- **Request Body (JSON):** Any fields to update, e.g.:
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

### 5. **POST /delete-item/:id**

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

---

## 📝 **Notes**

- All responses are in JSON.
- For **searching**, `itemName` uses **exact match** (not partial).
- For **filtering**, `category` is an exact match.
- If no query parameters are provided to `/dashboard`, all stock items are returned.
- Error responses will include a `message` and `error` field.
- `addTotal` in `/dashboard` is the sum of all `itemPrice * itemUnits` for the returned items.

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

---

## 📬 **Contact**

For support, contact the developer or