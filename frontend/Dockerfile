FROM node:lts-alpine

WORKDIR /catulam-frontend

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

RUN npm install @vue/cli -g

# copy project files and folders to the current working directory (i.e. 'catulam-frontend' folder)
COPY . .

EXPOSE 8080
CMD ["npm", "run", "serve"]
