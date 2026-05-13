# Docker & Backend Architecture Guide

This document contains instructions for using the backend Docker container, explanations of the Dockerfile, and recommendations for improving the backend folder structure for a production-ready DevOps environment.

---

## 🛠️ Docker Build & Run Commands

You can build and test your Dockerized backend locally using the following commands.

### 1. Build the Docker Image
Navigate to the `server` directory and run:
```bash
docker build -t teer-brand-backend .
```
*(This builds an image named `teer-brand-backend` using the `Dockerfile` in the current directory)*

### 2. Run the Docker Container
Since the container needs access to environment variables (like `MONGO_URL`), you can pass them via an environment file (`--env-file`) or directly.

**Option A: Using your existing `.env` file**
```bash
docker run -p 5000:5000 --env-file .env -d --name teer-backend-container teer-brand-backend
```

**Option B: Passing variables explicitly**
```bash
docker run -p 5000:5000 -e PORT=5000 -e MONGO_URL="your_mongodb_uri" -e JWT_SEC="your_secret" -d --name teer-backend-container teer-brand-backend
```

### 3. Check Container Logs
If you need to debug or verify the server started successfully:
```bash
docker logs -f teer-backend-container
```

### 4. Stop the Container
```bash
docker stop teer-backend-container
```

---

## 📄 Dockerfile Steps Explained

*   **`FROM node:20-alpine`**: We use the `alpine` version of Node.js 20. Alpine Linux is incredibly lightweight (~5MB), drastically reducing the final image size and reducing security vulnerabilities.
*   **`ENV NODE_ENV=production`**: Sets Node.js into production mode, optimizing Express.js performance and preventing dev-only dependencies from being loaded.
*   **`WORKDIR /usr/src/app`**: Sets the standard working directory inside the container for our application files.
*   **`COPY package*.json ./`**: We copy *only* package files first. Docker caches layers; by doing this, if your code changes but dependencies do not, Docker will skip `npm install` and use the cache, making builds lightning fast.
*   **`RUN npm ci --omit=dev`**: Uses `npm ci` (Clean Install) instead of `npm install` for strict adherence to `package-lock.json`. `--omit=dev` ensures no heavy development dependencies (like Nodemon or testing frameworks) are installed in production.
*   **`COPY . .`**: Copies the rest of the application files. Files listed in `.dockerignore` (like `node_modules` or `.env`) are automatically excluded.
*   **`RUN chown -R node:node /usr/src/app`**: Changes the file ownership to the `node` user built into the Alpine image.
*   **`USER node`**: Switches execution to the non-root `node` user. Running containers as `root` is a major security risk; this ensures the app runs with the least privileges necessary.
*   **`EXPOSE 5000`**: Documents that the container listens on port 5000. *(Note: This doesn't actually publish the port; `-p 5000:5000` does that at runtime).*
*   **`CMD ["node", "server.js"]`**: The default command that starts our application using the native Node runtime.

---

## 🏗️ Suggested Backend Folder Structure Improvements

Currently, your backend structure (`models/`, `routes/`, `middleware/`, `server.js`) is decent for a small app. However, to scale for a true microservices or robust monolith production environment, you should refactor it to separate business logic and configuration.

### Recommended Production Architecture:

```text
server/
├── config/              # Centralized configuration (Database, third-party APIs)
│   ├── db.js            # MongoDB connection logic
│   └── razorpay.js      # Razorpay instance setup
├── controllers/         # Core business logic (keeps routes clean)
│   ├── authController.js
│   ├── productController.js
│   └── orderController.js
├── middleware/          # Request interception
│   ├── verifyToken.js   # JWT authentication
│   └── errorHandler.js  # Global error handling
├── models/              # Mongoose Schemas (Data layer)
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/              # Pure route definitions pointing to controllers
│   ├── auth.js
│   ├── products.js
│   └── orders.js
├── utils/               # Reusable helper functions
│   ├── generateToken.js # JWT generation
│   └── hashPassword.js  # Bcrypt wrappers
├── server.js            # Express app setup and initialization
├── Dockerfile
├── .dockerignore
├── .env                 # (Gitignored) Local secrets
├── .env.example         # Template for environment variables
└── package.json
```

**Why this is better:**
1.  **Separation of Concerns**: Routes only handle HTTP pathways, while Controllers handle the actual logic (saving to DB, logic checks). This makes testing controllers individually much easier.
2.  **Maintainability**: As the team grows, developers know exactly where database connections are (`config/`) vs business rules (`controllers/`).
3.  **Readability**: `server.js` becomes extremely clean, typically just importing routes and starting the listener.
