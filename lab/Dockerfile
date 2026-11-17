FROM node
WORKDIR /redecim/lab
COPY --from=design-system /redecim/design-system /redecim/design-system
COPY package.json /redecim/lab/package.json
RUN npm install
RUN npm audit --audit-level=critical
COPY . /redecim/lab
RUN npm run build
