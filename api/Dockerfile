FROM node:10
WORKDIR /catulam-backend-api
COPY package.json /catulam-backend-api
RUN npm install
COPY . /catulam-backend-api
EXPOSE 7000

CMD ["npm", "start"]

