FROM node:20-alpine

# Set environment to production for optimized Node.js execution
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies using a clean install for exact versions
RUN npm ci --omit=dev

# Copy the rest of the backend source code to the working directory
COPY . .

# Change ownership of the app directory to the unprivileged 'node' user
RUN chown -R node:node /usr/src/app

# Use the unprivileged user for better security (prevents root access inside container)
USER node

# Expose the port that the Express app will run on
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]
