FROM node:16-alpine

WORKDIR /usr/src/app

# copy project files
COPY . .

# install packages
RUN npm install

# build the nestjs app
RUN npm run build

# on the container level, listen on *:80
ENV HTTP_PORT=80

# docs purposes
EXPOSE 80

# start the app server
ENTRYPOINT ["npm", "run", "start:prod"]
