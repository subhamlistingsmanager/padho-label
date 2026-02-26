FROM node:20-alpine

WORKDIR /app

# Install git and other global dependencies
RUN apk add --no-cache git
RUN npm install -g expo-cli @expo/ngrok

# Expose ports for Expo dev server
EXPOSE 19000 19001 19002 8081

CMD ["sh"]
