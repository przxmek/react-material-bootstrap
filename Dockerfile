######################
# Build helper image #
######################
FROM node:12.2.0-alpine as build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package*.json /app/
RUN npm install --silent
RUN npm install react-scripts@^3.1.1 -g --silent

# Build admin-dashboard-frontend
COPY . /app
RUN npm run build


######################
#  Production image  #
######################
FROM nginx:1.17-alpine

# Use build from docker build stage
COPY --from=build /app/build /usr/share/nginx/html