# node:10 will be our base image to create this image
FROM node:10

# Set the /app directory as working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Clean previous build
# RUN rm -rf build/contracts/*

# Install libraries
RUN npm install

# Bundle app source
COPY . .

# Compile and deploy the contract
# CMD ["node_modules/.bin/truffle", "migrate"]
# CMD ["sh", "-c", "/app/node_modules/.bin/truffle migrate && touch /app/build/contracts/.SUCCESS"]
CMD ["sleep", "999d"]
