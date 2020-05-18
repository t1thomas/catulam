FROM node:lts-alpine as build

WORKDIR /catulam-frontend

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./
COPY ./nginx ./

# install project dependencies
RUN npm install

RUN npm install @vue/cli -g

COPY ./ .

RUN npm run build

FROM nginx:1.17.6-alpine

# copy project files and folders to the nginx directory (i.e. 'catulam' folder)
COPY --from=build /catulam-frontend/dist /var/www/catulam
COPY --from=build /catulam-frontend/nginx/conf /etc/nginx

CMD ["nginx", "-g", "daemon off;"]
