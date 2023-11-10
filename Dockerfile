# Use the official Node.js runtime as the base image
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /api

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy source code to the container
COPY . .

# Transpile TypeScript to JavaScript
RUN npm run build

# Prepare for production build
FROM node:20 AS production

# Set the working directory and copy build artifacts
WORKDIR /api
COPY --from=build /api/dist /api/dist
COPY --from=build /api/node_modules /api/node_modules
COPY --from=build /api/serviceAccountKey.json /api/serviceAccountKey.json

# Expose port (e.g., 3000) that the api listens on
EXPOSE 3000

# Run the application
CMD ["node", "dist/api.js"]
