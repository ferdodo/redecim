FROM node:slim
WORKDIR /redecim/core
COPY package.json .
RUN npm install
RUN npm audit --audit-level=critical
COPY . .
RUN npm run build
