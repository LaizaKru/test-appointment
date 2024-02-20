FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Make the entrypoint script executable
RUN chmod +x entrypoint.sh

# Make port 5000 available to the world outside this container
EXPOSE 4000

# Define environment variable
ENV NODE_ENV development

# Run the app when the container launches
CMD ["node", "app.js"]
