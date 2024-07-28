FROM node:22.1.0

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install && npm install typescript -g
COPY . .
RUN tsc
COPY lib/openapi.yaml ./dist/lib
EXPOSE 8080
CMD ["node", "./dist/lib/index.js"]
