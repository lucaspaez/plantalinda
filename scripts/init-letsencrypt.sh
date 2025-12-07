#!/bin/bash

# Script para obtener certificados SSL de Let's Encrypt
# Ejecutar SOLO en producción con un dominio real

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔐 Configuración de SSL con Let's Encrypt${NC}"
echo ""

# Verificar que se proporcionó un dominio
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Debes proporcionar un dominio${NC}"
    echo "Uso: ./init-letsencrypt.sh tu-dominio.com"
    exit 1
fi

DOMAIN=$1
EMAIL=${2:-"admin@$DOMAIN"}  # Email por defecto

echo -e "${GREEN}Dominio: $DOMAIN${NC}"
echo -e "${GREEN}Email: $EMAIL${NC}"
echo ""

# Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

# Descargar configuración recomendada de SSL
echo "📥 Descargando configuración SSL recomendada..."
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "./certbot/conf/options-ssl-nginx.conf"
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "./certbot/conf/ssl-dhparams.pem"

# Actualizar nginx.conf con el dominio correcto
echo "🔧 Actualizando configuración de Nginx..."
sed -i "s/tu-dominio.com/$DOMAIN/g" ./nginx/nginx.conf

# Iniciar Nginx en modo staging primero
echo "🚀 Iniciando Nginx..."
docker-compose -f docker-compose.prod.yml up -d nginx

# Esperar a que Nginx esté listo
echo "⏳ Esperando a que Nginx esté listo..."
sleep 5

# Obtener certificado (staging primero para testing)
echo "🔐 Obteniendo certificado SSL (modo staging)..."
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --staging \
    -d $DOMAIN \
    -d www.$DOMAIN

# Verificar si el certificado staging fue exitoso
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Certificado staging obtenido exitosamente${NC}"
    echo ""
    read -p "¿Deseas obtener el certificado REAL de producción? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        # Eliminar certificados staging
        docker-compose -f docker-compose.prod.yml run --rm certbot delete --cert-name $DOMAIN
        
        # Obtener certificado real
        echo "🔐 Obteniendo certificado SSL REAL..."
        docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
            --webroot \
            --webroot-path=/var/www/certbot \
            --email $EMAIL \
            --agree-tos \
            --no-eff-email \
            -d $DOMAIN \
            -d www.$DOMAIN
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Certificado SSL obtenido exitosamente${NC}"
            echo ""
            echo "🔄 Reiniciando Nginx..."
            docker-compose -f docker-compose.prod.yml restart nginx
            echo ""
            echo -e "${GREEN}🎉 ¡SSL configurado correctamente!${NC}"
            echo -e "Tu sitio ahora está disponible en: ${GREEN}https://$DOMAIN${NC}"
        else
            echo -e "${RED}❌ Error al obtener el certificado real${NC}"
            exit 1
        fi
    fi
else
    echo -e "${RED}❌ Error al obtener el certificado staging${NC}"
    echo "Verifica que:"
    echo "  - El dominio $DOMAIN apunte a la IP de este servidor"
    echo "  - Los puertos 80 y 443 estén abiertos"
    echo "  - No haya otro servicio usando esos puertos"
    exit 1
fi

echo ""
echo -e "${YELLOW}📝 Notas importantes:${NC}"
echo "  - Los certificados se renuevan automáticamente cada 12 horas"
echo "  - Los certificados de Let's Encrypt son válidos por 90 días"
echo "  - Asegúrate de que el dominio siempre apunte a este servidor"
