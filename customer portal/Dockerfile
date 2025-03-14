FROM node:20-alpine3.19 as build-stage

ARG REACT_APP_COMMIT_SHA
ENV REACT_APP_COMMIT_SHA=$REACT_APP_COMMIT_SHA

WORKDIR /app

COPY package.json /app/

RUN yarn

COPY ./ /app/

RUN yarn build

FROM nginx:1.13-alpine

RUN apk add --no-cache bash

COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
