# Panel de Administración - Sistema de Microservicios

Un panel de administración moderno y completo para gestionar todos los servicios del sistema de microservicios educativos.

## 🚀 Características

### Dashboard Principal
- **Estadísticas en tiempo real**: Visualización de métricas clave del sistema
- **Actividad reciente**: Seguimiento de acciones recientes en todos los servicios
- **Acciones rápidas**: Acceso directo a funciones principales
- **Gráficos interactivos**: Visualización de datos con Recharts

### Gestión de Citas
- **Vista completa**: Lista de todas las citas con filtros por estado
- **Gestión de estados**: Confirmar, cancelar, completar citas
- **Detalles completos**: Información detallada de cada cita
- **Creación y edición**: Formularios para crear y modificar citas

### Sistema de Chat
- **Conversaciones**: Vista de todas las conversaciones activas
- **Historial de mensajes**: Acceso al historial completo de chat
- **Estadísticas de chat**: Métricas de uso y actividad
- **Moderación**: Herramientas para administrar conversaciones

### Gestión de Usuarios
- **Estudiantes**: Administración de cuentas de estudiantes
- **Tutores**: Gestión completa de perfiles de tutores
- **Códigos de acceso**: Generación de códigos para tutores
- **Estados de cuenta**: Activación/desactivación de usuarios

### Foro
- **Publicaciones**: Gestión de contenido del foro
- **Moderación**: Aprobación y eliminación de posts
- **Búsqueda**: Herramientas de búsqueda avanzada
- **Estadísticas**: Métricas de engagement

### Estadísticas Avanzadas
- **Reportes detallados**: Análisis completo del sistema
- **Gráficos temporales**: Evolución de métricas en el tiempo
- **Exportación**: Generación de reportes en diferentes formatos

## 🛠️ Tecnologías Utilizadas

- **Next.js 14**: Framework de React con App Router
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS**: Framework de CSS utilitario
- **Heroicons**: Iconografía moderna
- **Recharts**: Biblioteca de gráficos
- **Axios**: Cliente HTTP para APIs
- **React Hook Form**: Gestión de formularios
- **Zod**: Validación de esquemas

## 📦 Instalación

1. **Clonar el repositorio**
```bash
cd admin-panel
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env.local
```

4. **Editar `.env.local`** con las URLs de tus microservicios:
```env
NEXT_PUBLIC_APPOINTMENT_API_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_API_URL=http://localhost:3002
NEXT_PUBLIC_CHAT_API_URL=http://localhost:3003
NEXT_PUBLIC_FORO_API_URL=http://localhost:3004
NEXT_PUBLIC_TUTOR_API_URL=http://localhost:3005
```

## 🚀 Desarrollo

### Ejecutar en modo desarrollo
```bash
npm run dev
```

### Construir para producción
```bash
npm run build
```

### Exportar como sitio estático
```bash
npm run export
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas de la aplicación
│   ├── appointments/       # Gestión de citas
│   ├── chats/             # Sistema de chat
│   ├── users/             # Gestión de usuarios
│   ├── foro/              # Administración del foro
│   ├── tutors/            # Gestión de tutores
│   ├── stats/             # Estadísticas avanzadas
│   └── settings/          # Configuración
├── components/            # Componentes reutilizables
│   ├── layout/           # Componentes de layout
│   ├── ui/               # Componentes de UI básicos
│   └── dashboard/        # Componentes específicos del dashboard
├── lib/                  # Utilidades y configuraciones
│   └── api/              # Servicios de API
├── types/                # Definiciones de tipos TypeScript
├── hooks/                # Custom hooks
└── utils/                # Funciones utilitarias
```

## 🔌 Integración con Microservicios

### Servicio de Citas (appointment-service)
- **Puerto**: 3001
- **Endpoints principales**:
  - `GET /api/appointments` - Listar citas
  - `POST /api/appointments` - Crear cita
  - `PUT /api/appointments/:id` - Actualizar cita
  - `PATCH /api/appointments/:id/status` - Cambiar estado

### Servicio de Autenticación (auth-service)
- **Puerto**: 3002
- **Endpoints principales**:
  - `GET /api/users` - Listar usuarios
  - `GET /api/users/tutors` - Listar tutores
  - `POST /api/users` - Crear usuario
  - `PUT /api/users/:id` - Actualizar usuario

### Servicio de Chat (chat-service)
- **Puerto**: 3003
- **Endpoints principales**:
  - `GET /api/conversations` - Listar conversaciones
  - `GET /api/conversations/:id/messages` - Obtener mensajes
  - `POST /api/conversations/:id/messages` - Enviar mensaje
  - `GET /api/chat-history` - Historial completo

### Servicio de Foro (foro-service)
- **Puerto**: 3004
- **Endpoints principales**:
  - `GET /api/posts` - Listar publicaciones
  - `POST /api/posts` - Crear publicación
  - `PUT /api/posts/:id` - Actualizar publicación
  - `GET /api/posts/search` - Buscar publicaciones

## 🎨 Diseño y UX

### Principios de Diseño
- **Backoffice moderno**: Interfaz limpia y profesional
- **Responsive**: Adaptable a todos los dispositivos
- **Accesibilidad**: Cumple estándares WCAG
- **Performance**: Optimizado para velocidad

### Paleta de Colores
- **Primario**: Azul (#3B82F6)
- **Secundario**: Verde (#10B981)
- **Acento**: Púrpura (#8B5CF6)
- **Neutral**: Gris (#6B7280)

## 🔒 Seguridad

- **Autenticación**: Sistema de tokens JWT
- **Autorización**: Control de acceso basado en roles
- **Validación**: Validación de datos en frontend y backend
- **HTTPS**: Comunicación segura con APIs

## 📊 Monitoreo y Analytics

- **Métricas de rendimiento**: Tiempo de carga y respuesta
- **Uso de recursos**: Consumo de memoria y CPU
- **Errores**: Captura y reporte de errores
- **Auditoría**: Log de acciones administrativas

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Subir carpeta out/ a Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación de la API

---

**Desarrollado con ❤️ para el sistema de microservicios educativos** # backoffice_institucion
