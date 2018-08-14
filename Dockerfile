FROM node:8.11.3

COPY . .

RUN npm --unsafe-perm install

EXPOSE 8080

CMD PORT=8080 NODE_ENV=production ./scripts/start-client
