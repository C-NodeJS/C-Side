FROM node:18-alpine AS development

RUN mkdir /usr/app
WORKDIR /usr/app

COPY . /usr/app
RUN yarn install --frozen-lockfile
RUN yarn build
CMD ["yarn", "start"]