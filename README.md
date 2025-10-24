# API de Tecnoshare - Examen Backend

## ✅ Endpoints Implementados y Verificados

### Autenticación y Usuarios (100% Funcional)
- `POST /api/users/register` - Registro de nuevos usuarios
- `POST /api/users/login` - Login de usuarios existentes
- `GET /api/users` - Obtener todos los usuarios (requiere autenticación)
- `GET /api/users/:id` - Obtener usuario por ID (requiere autenticación)

### Listings/Propiedades 
- `GET /api/listings` - ✅ **FUNCIONANDO** - Obtener todas las propiedades (5,555 propiedades con paginación)
- `GET /api/listings/property-type/:type` - ✅ **FUNCIONANDO** - Filtrar por tipo de propiedad
- `GET /api/listings/host/:host_id` - ✅ **FUNCIONANDO** - Propiedades por host específico
- `GET /api/listings/with-total-price` - ⚠️ Con problemas técnicos
- `GET /api/listings/top-hosts` - ⚠️ Con problemas técnicos
- `PATCH /api/listings/:id/availability` - ⚠️ No probado

## 🎯 Lo Logrado
- ✅ Servidor Express con MongoDB funcionando correctamente
- ✅ Sistema de autenticación JWT completo y seguro
- ✅ Conexión a base de datos sample_airbnb con 5,555 propiedades reales
- ✅ 3 endpoints principales de listings funcionando correctamente
- ✅ Paginación implementada
- ✅ Middleware de autenticación protegiendo todas las rutas
- ✅ Estructura de código limpia y mantenible

## 🚀 Instrucciones de Uso

### 1. Registrar usuario
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"123456"}'