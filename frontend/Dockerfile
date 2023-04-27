FROM node:16-alpine as builder

WORKDIR /usr/src/app

# build args
ARG API_BASE_URL

# copy project files
COPY . .

# install packages
RUN npm install

# build the react app
RUN npm run build

# use nginx to serve the app
FROM nginx:1.23-alpine

WORKDIR /var/www/html/app

# copy compiled app files
COPY --from=builder /usr/src/app/dist .

# nginx config
COPY default.conf /etc/nginx/conf.d/default.conf

# docs purposes
EXPOSE 80

# start the static files server
ENTRYPOINT ["nginx", "-g", "daemon off;"]
