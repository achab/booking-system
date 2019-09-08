# node:10 will be our base image to create this image
FROM node:10

# Set the /app directory as working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Install libraries
RUN npm install

# Bundle app source
COPY . .

# Expose port 3000
EXPOSE 3000

# Start react app
CMD ["npm", "run", "dev"]
# CMD ["sleep", "999d"]
