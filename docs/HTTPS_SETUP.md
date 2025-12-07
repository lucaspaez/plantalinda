# 🔐 Guía de Configuración HTTPS/SSL

## ¿Por qué es necesario HTTPS?

**CRÍTICO**: Sin HTTPS, toda la información viaja en texto plano, incluyendo:
- Contraseñas de usuarios
- Tokens JWT
- Datos personales
- Información de cultivos

Un atacante en la red podría interceptar esta información fácilmente.

---

## 📋 Requisitos Previos

1. **Dominio registrado**: Necesitas un dominio (ej: `mi-app-plantalinda.com`)
2. **Servidor con IP pública**: El dominio debe apuntar a la IP de tu servidor
3. **Puertos abiertos**: 
   - Puerto 80 (HTTP) - Para validación de Let's Encrypt
   - Puerto 443 (HTTPS) - Para tráfico seguro

---

## 🚀 Opción 1: Producción con Dominio Real (Let's Encrypt)

### Paso 1: Configurar DNS
Apunta tu dominio a la IP de tu servidor:
```
Tipo A: mi-app-plantalinda.com → TU_IP_PUBLICA
Tipo A: www.mi-app-plantalinda.com → TU_IP_PUBLICA
```

### Paso 2: Ejecutar script de inicialización
```bash
chmod +x init-letsencrypt.sh
./init-letsencrypt.sh mi-app-plantalinda.com tu-email@ejemplo.com
```

Este script:
1. Crea los directorios necesarios
2. Descarga configuración SSL recomendada
3. Obtiene certificados de Let's Encrypt (primero staging, luego producción)
4. Configura renovación automática

### Paso 3: Verificar
Visita `https://mi-app-plantalinda.com` y verifica:
- ✅ Candado verde en el navegador
- ✅ Certificado válido
- ✅ Sin warnings de seguridad

---

## 🧪 Opción 2: Desarrollo Local (Certificado Auto-firmado)

**ADVERTENCIA**: Solo para desarrollo. Los navegadores mostrarán advertencias.

### Generar certificado auto-firmado:
```bash
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/selfsigned.key \
  -out nginx/ssl/selfsigned.crt \
  -subj "/C=AR/ST=BuenosAires/L=CABA/O=plantalindaApp/CN=localhost"
```

### Actualizar nginx.conf:
```nginx
ssl_certificate /etc/nginx/ssl/selfsigned.crt;
ssl_certificate_key /etc/nginx/ssl/selfsigned.key;
```

### Agregar volumen en docker-compose:
```yaml
nginx:
  volumes:
    - ./nginx/ssl:/etc/nginx/ssl
```

---

## 🔄 Renovación Automática

Los certificados de Let's Encrypt son válidos por **90 días**.

El contenedor `certbot` en `docker-compose.prod.yml` se encarga de:
- Verificar certificados cada 12 horas
- Renovarlos automáticamente cuando falten menos de 30 días
- Recargar Nginx después de renovar

**No necesitas hacer nada manualmente**.

---

## 🛡️ Configuración de Seguridad Implementada

### Headers de Seguridad
```nginx
Strict-Transport-Security: max-age=63072000
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

### Protocolos SSL
- ✅ TLS 1.2
- ✅ TLS 1.3
- ❌ TLS 1.0 y 1.1 (deshabilitados por inseguros)

### Cifrados
Solo cifrados modernos y seguros (ECDHE con AES-GCM).

---

## 🔍 Verificar Configuración SSL

### Desde el navegador:
1. Visita `https://tu-dominio.com`
2. Click en el candado
3. Ver certificado

### Desde la terminal:
```bash
curl -I https://tu-dominio.com
```

### Test de seguridad SSL:
Visita: https://www.ssllabs.com/ssltest/analyze.html?d=tu-dominio.com

**Objetivo**: Obtener calificación **A** o **A+**

---

## 🐛 Troubleshooting

### Error: "Timeout during connect"
- Verifica que los puertos 80 y 443 estén abiertos en el firewall
- Verifica que el dominio apunte a la IP correcta

### Error: "Certificate verification failed"
- Espera unos minutos para que el DNS se propague
- Verifica que el dominio sea accesible desde internet

### Error: "Too many certificates already issued"
Let's Encrypt tiene límites de rate:
- 50 certificados por dominio por semana
- Usa el modo `--staging` para testing

### Renovación falla:
```bash
# Ver logs de certbot
docker-compose -f docker-compose.prod.yml logs certbot

# Renovar manualmente
docker-compose -f docker-compose.prod.yml run --rm certbot renew
```

---

## 📊 Checklist de Producción

- [ ] Dominio registrado y apuntando al servidor
- [ ] Puertos 80 y 443 abiertos
- [ ] Certificado SSL obtenido (Let's Encrypt)
- [ ] HTTPS funcionando correctamente
- [ ] Renovación automática configurada
- [ ] Headers de seguridad verificados
- [ ] Test SSL con calificación A o superior
- [ ] Redirección HTTP → HTTPS funcionando

---

## 🔗 Recursos Adicionales

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [SSL Labs Test](https://www.ssllabs.com/ssltest/)

---

**IMPORTANTE**: No despliegues en producción sin HTTPS. Es un riesgo de seguridad crítico.
