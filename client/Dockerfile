# Dockerfile

# base image
FROM node:lts-alpine3.17

# create & set working directory
WORKDIR /app

#Change TimeZone
RUN apk add tzdata && RUN cp /usr/share/zoneinfo/Asia/Kolkata /etc/localtime && RUN echo "Asia/Kolkata" > /etc/timezone && RUN apk del tzdata

#Expose ports
EXPOSE 3000

# copy dependencies files
COPY package.json package-lock.json /app/

# install dependencies
RUN npm install

# copy source files
COPY . /app

# Build the client
RUN npm run build

#Change ownership
RUN chown -R node:node /app

#Switch User
USER node

# start app
CMD npm run start
