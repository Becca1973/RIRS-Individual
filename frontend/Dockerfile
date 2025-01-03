# Prva faza gradnje
FROM node:20-alpine as build

WORKDIR /app

# Kopiraj package.json in package-lock.json
COPY package.json package-lock.json ./

# Namesti odvisnosti, brez izvajanja skriptov
RUN npm ci --ignore-scripts

# Kopiraj preostale datoteke
COPY . .

# Gradnja aplikacije
RUN npm run build

# Druga faza (NGINX strežnik)
FROM nginx:alpine

# Spremeni uporabnika v manj privilegiranega uporabnika "nginx"
USER nginx

# Kopiraj buildane statične datoteke v NGINX strežniško mapo
COPY --from=build /app/build /usr/share/nginx/html

# Izpostavi vrata za strežnik
EXPOSE 80

# Zaženi NGINX strežnik
CMD ["nginx", "-g", "daemon off;"]
