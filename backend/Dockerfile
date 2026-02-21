# Use the latest Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the TypeScript code
RUN npm run build

# Start the app
CMD [ "node", "dist/index.js" ]