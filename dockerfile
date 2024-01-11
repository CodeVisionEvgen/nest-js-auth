FROM node:16

WORKDIR /crud/backend

COPY ./package.json ./tsconfig.json  ./

CMD [ "npm", "i" ]