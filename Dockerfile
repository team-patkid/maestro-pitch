# dev stage
FROM node:18-alpine
WORKDIR /usr/src/app
ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}
COPY --from=build /usr/src/app/dist/src ./dist
COPY package*.json ./
COPY tsconfig*.json ./
COPY jest.config.js ./
COPY src ./src
RUN npm install
EXPOSE 3001
CMD ["node", "dist/main.js"]