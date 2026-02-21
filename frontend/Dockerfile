FROM node:14
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile 
COPY . .
CMD ["yarn", "start"]