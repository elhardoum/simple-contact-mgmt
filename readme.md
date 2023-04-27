# Simple Contact Management

[![docker ci](https://github.com/elhardoum/simple-contact-mgmt/actions/workflows/push.yml/badge.svg)](https://github.com/elhardoum/simple-contact-mgmt/actions/workflows/push.yml)

A simple web app written in React.js and Nest.js featuring a contact management system (completed as part of a job candidature).

## Prerequisites

Have docker? Cool - skip to the install step.

- A MySQL connection up and running. To initiate the tables, please check the [`./init-db.sql`](./init-db.sql) file
- Node.js 14+ (may need npm 8.7+ to enforce some dependency overrides as part of a recent `yaml` CVE fix)

## Install with Docker

To run the app with docker, copy `.env.sample` to `.env` and change the configurations if not done previously.

Then, start the containers:

```sh
docker compose up -d
```

Now you should be able to access the app at `http://localhost:9097`

## Standard Install (without docker)

As a first step, please copy `.env.sample` to `.env.` if not done previously and customize your configurations.

### Backend Service

You will need to build the typescript nest app, in your favorite terminal:

```sh
cd backend
npm install
npm run build
```

Then start the service:

```sh
npm start
```

The API should be accessible at `http://localhost:3000` if you haven't changed the `HTTP_PORT` in the `.env` file.

### Web App

To build the react app, run the following commands in your terminal:

```sh
# set the api service url
export API_BASE_URL="http://localhost:3000"

# install depenedencies
npm install

# start the app server
npm run start:prod
```

The web app should then be accessible at `http://localhost:9000`

## Test

### Using Docker

To run the backend service tests with docker:

```sh
# start mariadb container
docker compose up -d mariadb

# run tests
docker compose run --rm --entrypoint='npm test' backend

# optionally terminate the mariadb container
docker compose down mariadb
```

### Standard Install

To run the backend service tests with docker, assuming your MySQL service is working:

```sh
# install dependencies if not done already
npm install

# run tests
npm test
```
