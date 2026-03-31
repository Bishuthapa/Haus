# Haus — Real Estate Buyer Portal

A full-stack real estate web app with JWT auth, property browsing, and a personal favourites dashboard.

---

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── config/db.js
│   │   ├── models/        User, Property, Favourite
│   │   ├── controllers/   auth, property, favourite
│   │   ├── routes/        auth, property, favourite
│   │   └── middleware/    auth (JWT), validation
│   ├── constants.js
│   └── .env
│
└── frontend/
    └── index.html         (self-contained React app)
```

---

## How to Run

### 1. Backend

```bash
cd backend
npm install
```

Create or verify `.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv:/
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

```bash
node src/server.js
# → Server running on http://localhost:5000
# → MongoDB Connected
```

On first `/api/properties` request, 5 seed properties are automatically inserted.


## Example Flows

### Sign Up → Browse → Favourite

1. Open `index.html` → click **Create account**
2. Fill in name, email, password → submit
3. You're redirected to **Browse** — 5 properties are listed
4. Click ♡ on any card to save it to favourites
5. Click **Dashboard** in the nav → your saved properties appear

### Login → Dashboard

1. Click **Sign in**
2. Enter your registered email & password
3. Dashboard shows your name, role (`buyer`), and all saved properties
4. Click ♥ on a favourited card to remove it

### Property Detail

1. Click anywhere on a property card (not the heart button)
2. Full detail page shows — address, specs, price
3. Use the large **Save to favourites** button to toggle
4. Use **← Back to listings** to return

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register, returns JWT token |
| POST | `/api/auth/login` | — | Login (returns user; see note below) |
| GET | `/api/auth/me` | Bearer | Get current user |
| GET | `/api/properties` | — | List all available properties |
| GET | `/api/properties/:id` | — | Single property |
| GET | `/api/favourites` | Bearer | User's saved properties |
| POST | `/api/favourites/:propertyId` | Bearer | Add to favourites |
| DELETE | `/api/favourites/:propertyId` | Bearer | Remove from favourites |
| GET | `/api/favourites/check/:propertyId` | Bearer | Check if favourited |

---

## Auth Design

- Passwords are **bcrypt-hashed** (salt rounds: 12) — never stored raw
- JWTs are signed with `JWT_SECRET`, expire in 7 days
- The `protect` middleware reads `Authorization: Bearer <token>`
- Frontend stores the token in `localStorage` and sends it on every protected request
- Users can only read/modify **their own** favourites — enforced server-side by filtering on `req.user._id`

---

## Known Issue / Suggested Backend Fix

The `/api/auth/login` controller currently sets an `httpOnly` cookie but **does not return the JWT token in the response body**. The `protect` middleware, however, reads only the `Authorization: Bearer` header — not the cookie. This means after a normal login the token isn't available to the frontend.

**Fix:** Add `token` to the login response:

```js
// auth.controller.js — login()
res.json({
  success: true,
  message: 'Logged in successfully.',
  token,                          // ← add this line
  user: { id: user._id, name: user.name, email: user.email, role: user.role },
});
```

Until this is applied, users who register (which does return a token) will stay logged in. After a page refresh the `/api/auth/me` call re-authenticates from the stored token.f

---

## Security Notes

- Duplicate email → `409 Conflict`
- Invalid credentials → `401 Unauthorized` (no hint which field is wrong)
- All body inputs validated via `express-validator` before hitting controllers
- MongoDB unique index on `(user, property)` in Favourites prevents duplicate saves
- CORS restricted to `CLIENT_URL` only
