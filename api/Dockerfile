FROM node:lts-alpine

WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

RUN npm install

# copy project files and folders to the current working directory (i.e. 'catulam-backend-api' folder)
COPY . .

EXPOSE 4000

CMD ["npm", "run", "start"]
