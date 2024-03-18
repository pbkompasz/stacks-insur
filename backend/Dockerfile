# Use a base image with Node.js installed
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy everything from the current directory to the /app directory inside the container
COPY . .

# Install dependencies
RUN npm i

# Expose port 5173
EXPOSE 5173

# Command to run your application
CMD ["node", "index.js"]
