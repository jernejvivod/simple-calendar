FROM node:20-alpine3.16
WORKDIR /app
COPY . /app
RUN npm install
RUN npm install -g npm@latest
RUN npm install -g @angular/cli
RUN npm run build
EXPOSE 4200
CMD ["npm", "run", "start"]
