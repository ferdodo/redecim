FROM node
WORKDIR /redecim/compressor
COPY --from=core /redecim/core /redecim/core
COPY package.json /redecim/compressor/package.json
RUN npm install
RUN npm audit --audit-level=critical
COPY . /redecim/compressor
RUN npm run build
