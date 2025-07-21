# Servicios de API

## TutorService

El `TutorService` es un servicio que maneja todos los endpoints relacionados con tutores y usuarios sin autenticación.

### Configuración

El servicio utiliza la configuración centralizada en `config.ts`:

```typescript
BASE_API: {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  endpoints: {
    users: '/users',
    user: (id: string) => `/users/${id}`,
    usersByType: (type: string) => `/users/type/${type}`,
    tutors: '/tutors',
    codes: '/codes',
    send: '/send',
  }
}
```

### Métodos Disponibles

#### 1. Obtener Todos los Usuarios
```typescript
static async getAllUsers(): Promise<User[]>
```
- **Endpoint**: `GET /users`
- **Descripción**: Obtiene todos los usuarios del sistema
- **Respuesta**: Array de usuarios
- **Errores**: 500 - Error interno del servidor

#### 2. Obtener Todos los Tutores
```typescript
static async getAllTutors(): Promise<User[]>
```
- **Endpoint**: `GET /tutors`
- **Descripción**: Obtiene todos los tutores del sistema
- **Respuesta**: Array de tutores
- **Errores**: 500 - Error interno del servidor

#### 3. Obtener Usuario por ID
```typescript
static async getUserById(userId: string): Promise<User>
```
- **Endpoint**: `GET /users/{userId}`
- **Descripción**: Obtiene un usuario específico por su ID
- **Parámetros**: `userId` (string, requerido)
- **Respuesta**: Usuario individual
- **Errores**: 
  - 400 - ID de usuario requerido
  - 404 - Usuario no encontrado
  - 500 - Error interno del servidor

#### 4. Obtener Usuarios por Tipo
```typescript
static async getUsersByType(userType: 'tutor' | 'alumno'): Promise<User[]>
```
- **Endpoint**: `GET /users/type/{userType}`
- **Descripción**: Obtiene usuarios filtrados por tipo
- **Parámetros**: `userType` (string, requerido) - debe ser 'tutor' o 'alumno'
- **Respuesta**: Array de usuarios del tipo especificado
- **Errores**:
  - 400 - Tipo de usuario inválido
  - 500 - Error interno del servidor

#### 5. Crear Códigos de Tutores
```typescript
static async createTutorCodes(emails: string[]): Promise<Array<{ email: string; code: string }>>
```
- **Endpoint**: `POST /codes`
- **Descripción**: Genera códigos de acceso para tutores
- **Body**: `{ emails: string[] }`
- **Respuesta**: Array de objetos con email y código generado
- **Errores**:
  - 400 - Lista de emails requerida
  - 500 - Error interno del servidor

#### 6. Enviar Códigos de Tutores
```typescript
static async sendTutorCodes(emails: string[]): Promise<{ sent: string[]; failed: string[] }>
```
- **Endpoint**: `POST /send`
- **Descripción**: Envía códigos por correo electrónico
- **Body**: `{ emails: string[] }`
- **Respuesta**: Objeto con arrays de emails enviados y fallidos
- **Errores**:
  - 400 - Lista de emails requerida
  - 500 - Error interno del servidor

#### 7. Crear y Enviar Códigos (Combinado)
```typescript
static async createAndSendTutorCodes(emails: string[]): Promise<{
  codes: Array<{ email: string; code: string }>;
  sent: string[];
  failed: string[];
}>
```
- **Descripción**: Combina la creación y envío de códigos en una sola operación
- **Respuesta**: Objeto con códigos generados y resultados del envío

#### 8. Obtener Estadísticas Generales
```typescript
static async getGeneralStats(): Promise<{
  totalUsers: number;
  totalTutors: number;
  totalStudents: number;
  activeUsers: number;
  inactiveUsers: number;
}>
```
- **Descripción**: Obtiene estadísticas generales del sistema
- **Respuesta**: Objeto con estadísticas de usuarios

#### 9. Validación de Emails
```typescript
static validateEmail(email: string): boolean
static validateEmails(emails: string[]): { valid: string[]; invalid: string[] }
```
- **Descripción**: Métodos de utilidad para validar emails
- **Respuesta**: Boolean o objeto con emails válidos e inválidos

### Uso en Componentes

```typescript
import { TutorService } from '@/lib/api/tutorService';

// En un componente React
const loadTutors = async () => {
  try {
    const tutors = await TutorService.getAllTutors();
    setTutors(tutors);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Generar códigos
const generateCodes = async (emails: string[]) => {
  try {
    const result = await TutorService.createAndSendTutorCodes(emails);
    console.log('Códigos generados:', result.codes);
    console.log('Enviados:', result.sent);
    console.log('Fallidos:', result.failed);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### Manejo de Errores

El servicio incluye manejo de errores robusto con mensajes en español:

- Validación de parámetros de entrada
- Manejo de códigos de estado HTTP
- Mensajes de error descriptivos
- Logging de errores en consola

### Variables de Entorno

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Interfaces TypeScript

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface CodeGenerationRequest {
  emails: string[];
}

interface CodeGenerationResponse {
  success: boolean;
  data: {
    codes: Array<{
      email: string;
      code: string;
    }>;
  };
  message?: string;
}

interface SendCodesRequest {
  emails: string[];
}

interface SendCodesResponse {
  success: boolean;
  data: {
    sent: string[];
    failed: string[];
  };
  message?: string;
}
``` 