FROM node:10
WORKDIR /catulam-backend-api

COPY package.json /catulam-backend-api
RUN npm install
ADD src /catulam-backend-api/src


EXPOSE 7000

CMD ["npm", "start"]

