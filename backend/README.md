# Real Estate Buyer Portal — Backend

Node.js + Express + MongoDB + Mongoose REST API with JWT auth.

## Project Structure

```
backend/
├── src/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   └── Favourite.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── property.controller.js
│   │   └── favourite.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── property.routes.js
│   │   └── favourite.routes.js
│   └── middleware/
│       ├── auth.middleware.js
│       └── validation.middleware.js
├── .env.example
└── package.json
```

## How to Run

### 1. Prerequisites
- Node.js >= 18
- MongoDB running locally (`mongod`) or a MongoDB Atlas URI

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment
```bash
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET
```

### 4. Start the server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register a new buyer |
| POST | `/api/auth/login` | ❌ | Login and receive JWT |
| GET | `/api/auth/me` | ✅ | Get current user info |

### Properties
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/properties` | ❌ | List all properties |
| GET | `/api/properties/:id` | ❌ | Get single property |

### Favourites
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/favourites` | ✅ | Get my favourites |
| POST | `/api/favourites/:propertyId` | ✅ | Add to favourites |
| DELETE | `/api/favourites/:propertyId` | ✅ | Remove from favourites |
| GET | `/api/favourites/check/:propertyId` | ✅ | Check if favourited |

---

## Example Flows

### 1. Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'
# → returns { token: "eyJ..." }
```

### 3. Browse Properties
```bash
curl http://localhost:5000/api/properties
# Seeds 5 sample properties on first call if DB is empty
```

### 4. Add a Favourite
```bash
curl -X POST http://localhost:5000/api/favourites/<propertyId> \
  -H "Authorization: Bearer <token>"
```

### 5. List My Favourites
```bash
curl http://localhost:5000/api/favourites \
  -H "Authorization: Bearer <token>"
```

### 6. Remove a Favourite
```bash
curl -X DELETE http://localhost:5000/api/favourites/<propertyId> \
  -H "Authorization: Bearer <token>"
```

---

## Security Notes
- Passwords are hashed with **bcryptjs** (12 salt rounds) — never stored in plain text
- JWT tokens expire after **7 days**
- Favourites are scoped per user — users can only read/modify their own
- Validation errors return a `422` with a field-level `errors` array
