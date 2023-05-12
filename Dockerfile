FROM node:16.20.0

RUN mkdir -p /app/node_modules && chown -R node:node /app

RUN mkdir -p /etc/certificates/aws/
# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# java heap
ENV NODE_OPTIONS=--max_old_space_size=4096

# add app
COPY --chown=node:node package*.json ./

USER node

COPY --chown=node:node ./src /app

RUN npm install

EXPOSE 4000

# start app
#CMD ng serve --host 0.0.0.0 --publicHost api-edi.feel.com.gt
#CMD ["npm", "start"]
CMD ["node", "app.js"]