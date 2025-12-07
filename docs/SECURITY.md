# 🔐 Guía de Seguridad - Planta Linda

## ⚠️ Vulnerabilidades Actuales (Desarrollo)

### 1. **Autenticación y Autorización**
- ✅ **Implementado**: JWT tokens, BCrypt para passwords
- ⚠️ **Falta**: 
  - Rate limiting (prevenir brute force)
  - Refresh tokens (tokens de larga duración)
  - 2FA (autenticación de dos factores)
  - Password reset seguro

### 2. **Base de Datos**
- ✅ **Implementado**: Conexión con credenciales
- ⚠️ **Falta**:
  - Encriptación de datos sensibles en reposo
  - Backups automáticos
  - Auditoría de accesos
  - Variables de entorno para credenciales (actualmente hardcodeadas)

### 3. **API Security**
- ✅ **Implementado**: CORS configurado
- ⚠️ **Falta**:
  - Rate limiting por IP
  - API key para servicios externos
  - Input validation exhaustiva
  - SQL injection protection (Spring JPA lo maneja parcialmente)
  - XSS protection headers

### 4. **File Upload**
- ⚠️ **CRÍTICO**: 
  - No hay validación de tipo de archivo real (solo MIME type)
  - No hay límite de tamaño de archivo
  - No hay escaneo de malware
  - Archivos se guardan con nombres predecibles

### 5. **Servicio de IA**
- ⚠️ **Riesgos**:
  - Sin autenticación (cualquiera puede llamar a localhost:8000)
  - Sin rate limiting
  - Puede consumir mucha memoria/CPU

### 6. **Secretos y Configuración**
- ⚠️ **CRÍTICO**:
  - JWT secret hardcodeado en `application.properties`
  - Credenciales de DB hardcodeadas
  - No usa variables de entorno

---

## 🛡️ Mejoras de Seguridad Recomendadas

### **Prioridad ALTA (Antes de producción)**

1. **Variables de Entorno**
```bash
# Crear archivo .env (NO subir a Git)
DB_PASSWORD=tu_password_seguro
JWT_SECRET=tu_secret_muy_largo_y_aleatorio
AI_SERVICE_API_KEY=clave_para_ai_service
```

2. **Rate Limiting**
```java
// Agregar dependencia en pom.xml
<dependency>
    <groupId>com.bucket4j</groupId>
    <artifactId>bucket4j-core</artifactId>
</dependency>
```

3. **File Upload Validation**
```java
// Validar tipo real de archivo (no solo MIME)
// Limitar tamaño a 5MB
// Escanear con antivirus
```

4. **HTTPS/TLS**
```bash
# Usar certificados SSL en producción
# Nunca HTTP en producción
```

### **Prioridad MEDIA**

5. **Logging y Monitoreo**
```java
// Log de intentos de login fallidos
// Alertas de actividad sospechosa
// Monitoreo de uso de recursos
```

6. **Backup Automático**
```bash
# Backup diario de PostgreSQL
# Encriptación de backups
```

### **Prioridad BAJA (Nice to have)**

7. **2FA (Two-Factor Authentication)**
8. **Captcha en login/registro**
9. **Auditoría completa de acciones**

---

## 🚨 Riesgos Específicos

### **¿Pueden hackear el sistema?**

**SÍ, actualmente hay varios vectores de ataque:**

1. **Brute Force en Login**
   - Sin rate limiting, un atacante puede probar miles de passwords
   - **Solución**: Implementar rate limiting y captcha

2. **File Upload Malicioso**
   - Un atacante podría subir un archivo ejecutable disfrazado de imagen
   - **Solución**: Validar tipo real, escanear malware, sandbox

3. **JWT Token Theft**
   - Si alguien roba el token (XSS, MITM), puede suplantar al usuario
   - **Solución**: HTTPS, HttpOnly cookies, tokens de corta duración

4. **SQL Injection**
   - Parcialmente protegido por JPA, pero inputs no validados son riesgosos
   - **Solución**: Validación estricta de inputs

5. **DoS (Denial of Service)**
   - Sin rate limiting, alguien puede saturar el servidor
   - **Solución**: Rate limiting, WAF (Web Application Firewall)

6. **Acceso a AI Service**
   - Cualquiera en localhost puede llamar al puerto 8000
   - **Solución**: API key, firewall, solo permitir desde backend

---

## ✅ Checklist de Seguridad para Producción

- [ ] Mover secretos a variables de entorno
- [ ] Implementar rate limiting
- [ ] Validar uploads de archivos correctamente
- [ ] Habilitar HTTPS/TLS
- [ ] Configurar firewall (solo puertos necesarios)
- [ ] Implementar logging y monitoreo
- [ ] Backups automáticos encriptados
- [ ] Escaneo de vulnerabilidades (OWASP ZAP, Burp Suite)
- [ ] Penetration testing
- [ ] Auditoría de código (SonarQube)
- [ ] Documentar políticas de seguridad
- [ ] Plan de respuesta a incidentes

---

## 📚 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Best Practices](https://spring.io/guides/topicals/spring-security-architecture)
- [JWT Security Best Practices](https://tools.ietf.org/html/rfc8725)

---

## ⚖️ Consideraciones Legales

### **GDPR / Protección de Datos**
- Encriptar datos personales
- Derecho al olvido (eliminar datos de usuario)
- Consentimiento explícito para uso de datos
- Política de privacidad clara

### **Regulaciones de plantalinda**
- Verificar legalidad en tu jurisdicción
- Cumplir con regulaciones locales
- Trazabilidad según normativa

---

**IMPORTANTE**: Este sistema está en **DESARROLLO**. NO usar en producción sin implementar las mejoras de seguridad mencionadas.
