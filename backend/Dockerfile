FROM node:16

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install
# RUN npm install --platform=linux --arch=arm64 sharp
# RUN npm install --platform=linuxmusl --arch=arm64
# npm install --platform=linuxmusl --arch=arm64 sharp on host

CMD ["npm", "start"]
