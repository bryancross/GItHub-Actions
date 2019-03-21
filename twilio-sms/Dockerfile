FROM node:11.12
#VOLUME /usr/src/app/source
LABEL "com.github.actions.name"="Twilio SMS"
LABEL "com.github.actions.description"="Send SMS via Twilio"
LABEL "com.github.actions.icon"="message-circle"
LABEL "com.github.actions.color"="blue"

LABEL "repository"="http://github.com/bidnessforb/actions"
LABEL "homepage"="http://github.com/actions"
LABEL "maintainer"="bryancross <bryancross@github.com>"

COPY package*.json ./
RUN npm install
COPY . .

ENTRYPOINT ["node", "/twilio-node.js"]