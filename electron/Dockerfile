FROM node AS build
WORKDIR /redecim/electron
COPY --from=core /redecim/core /redecim/core
COPY --from=features /redecim/features /redecim/features
COPY --from=compressor /redecim/compressor /redecim/compressor
COPY --from=design-system /redecim/design-system /redecim/design-system
COPY package.json /redecim/electron/package.json
ENV ELECTRON_SKIP_BINARY_DOWNLOAD=1
RUN npm install
RUN npm audit --audit-level=critical
COPY . /redecim/electron
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /redecim/electron/release/*.AppImage /srv/redecim/
