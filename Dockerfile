FROM node:16.20.0 AS base
WORKDIR /src
COPY package*.json /src /
EXPOSE 3000

FROM node:16.20.0 as production
RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_OPTIONS=--max_old_space_size=4096
COPY --chown=node:node package*.json ./
USER node
COPY --chown=node:node ./src /app
RUN npm install
EXPOSE 4000
CMD ["node", "index.js"]

FROM base as dev
ENV NODE_ENV=development
ENV PORT=PORT
ENV DB_USER=DB_USER
ENV DB_PASSWORD=DB_PASSWORD
ENV DB_NAME=DB_NAME
RUN npm install -g nodemon && npm install
COPY . /
CMD ["nodemon", "bin/www"]