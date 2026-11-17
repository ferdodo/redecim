FROM node
WORKDIR /redecim/features
COPY --from=core /redecim/core /redecim/core
COPY package.json /redecim/features/package.json
RUN npm install
RUN npm audit --audit-level=critical
COPY . /redecim/features
RUN npm run build
