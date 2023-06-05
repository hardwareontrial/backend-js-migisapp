FROM node:16.17-bullseye-slim as backendjs-stage

RUN mkdir -p /home/node/backend-js/node_modules
WORKDIR /home/node/backend-js
COPY ./ ./
COPY ./.env.example ./.env
RUN chown -R node:node /home/node/backend-js/
USER node
RUN npm install
USER root

EXPOSE 3000/tcp

COPY ./entrypoint.sh /usr/bin/backendjs-entrypoint.sh
RUN chmod +x /usr/bin/backendjs-entrypoint.sh
ENTRYPOINT ["backendjs-entrypoint.sh"]