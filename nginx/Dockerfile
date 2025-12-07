FROM nginx:alpine

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Crear directorio para certificados de Certbot
RUN mkdir -p /var/www/certbot

# Exponer puertos
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
