FROM gcr.io/google_appengine/nodejs

RUN apt-get update && apt-get install -y libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential g++

RUN install_node v6.9.5

COPY . /app/

# gcr.io/google_appengine/nodejs sets NODE_ENV=production by default,
# so we temporarily change it to pull in devDependencies for building
RUN npm config set production false && \
    npm --unsafe-perm install && \
    npm config set production true

EXPOSE 8080

CMD PORT=8080 NODE_ENV=production ./scripts/start-client
