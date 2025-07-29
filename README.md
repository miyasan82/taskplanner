# TaskPlanner Pro - Organizador de Tareas

Una aplicación web moderna y completa para la gestión de tareas con todas las funcionalidades esenciales que necesitas para organizar tu trabajo y vida personal.

## 🚀 Características Principales

### Funcionalidades Esenciales
- ✅ **Creación y edición de tareas** - Agrega nuevas tareas con descripciones detalladas
- 📁 **Organización por proyectos** - Agrupa tareas en proyectos con colores personalizados
- 🏷️ **Sistema de etiquetas** - Organiza tareas con etiquetas personalizables
- ⚡ **Priorización** - Asigna niveles de prioridad (Alta, Media, Baja)
- 📅 **Fechas de vencimiento** - Establece fechas y horas límite
- ✔️ **Marcar como completadas** - Seguimiento del progreso de tareas
- 🔍 **Búsqueda avanzada** - Encuentra tareas rápidamente
- 📱 **Diseño responsivo** - Funciona perfectamente en todos los dispositivos

### Funcionalidades Avanzadas
- 🔄 **Tareas recurrentes** - Automatiza tareas que se repiten (diario, semanal, mensual)
- 📋 **Subtareas** - Divide tareas complejas en pasos más pequeños
- 🔔 **Recordatorios** - Notificaciones del navegador para tareas próximas
- 📊 **Vistas múltiples** - Hoy, Próximas, Todas, Completadas
- 🎨 **Interfaz moderna** - Diseño limpio y profesional
- 💾 **Almacenamiento local** - Tus datos se guardan automáticamente
- 📤 **Exportar/Importar** - Respaldo y migración de datos

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica moderna
- **CSS3** - Diseño responsivo con variables CSS y Flexbox/Grid
- **JavaScript ES6+** - Funcionalidad interactiva con clases y módulos
- **Font Awesome** - Iconografía profesional
- **Google Fonts (Inter)** - Tipografía moderna y legible
- **LocalStorage API** - Persistencia de datos local
- **Notifications API** - Recordatorios del navegador

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere servidor ni instalación adicional

### Instalación
1. Descarga o clona este repositorio
2. Abre el archivo `index.html` en tu navegador
3. ¡Comienza a organizar tus tareas!

### Uso Básico
1. **Crear una tarea**: Haz clic en "Nueva Tarea" y completa los campos
2. **Organizar por proyectos**: Crea proyectos y asigna tareas a ellos
3. **Usar etiquetas**: Agrega etiquetas separadas por comas
4. **Establecer prioridades**: Selecciona Alta, Media o Baja prioridad
5. **Fechas de vencimiento**: Establece fechas y horas específicas
6. **Marcar como completada**: Haz clic en el ícono de check
7. **Buscar**: Usa la barra de búsqueda para encontrar tareas específicas

## 📁 Estructura del Proyecto

```
todotask/
├── index.html          # Página principal
├── styles.css          # Estilos y diseño
├── app.js             # Lógica de la aplicación
└── README.md          # Documentación
```

## 🎯 Funcionalidades Detalladas

### Gestión de Tareas
- **CRUD completo**: Crear, leer, actualizar y eliminar tareas
- **Campos personalizables**: Título, descripción, proyecto, prioridad, fecha, etiquetas
- **Subtareas**: Divide tareas grandes en pasos manejables
- **Estados**: Pendiente, completada, vencida

### Organización
- **Proyectos**: Agrupa tareas relacionadas con colores personalizados
- **Etiquetas**: Sistema flexible de categorización
- **Vistas filtradas**: Diferentes perspectivas de tus tareas
- **Ordenamiento**: Por fecha, prioridad, creación o alfabético

### Productividad
- **Recordatorios**: Notificaciones 15 minutos antes y al vencimiento
- **Tareas recurrentes**: Automatización para tareas repetitivas
- **Contadores**: Visualiza el número de tareas en cada categoría
- **Búsqueda inteligente**: Busca en títulos, descripciones y etiquetas

### Interfaz de Usuario
- **Diseño moderno**: Interfaz limpia y profesional
- **Responsive**: Optimizado para móviles, tablets y escritorio
- **Tema claro/oscuro**: Soporte automático según preferencias del sistema
- **Animaciones suaves**: Transiciones fluidas y feedback visual

## 🔧 Personalización

### Colores y Temas
Los colores se pueden personalizar modificando las variables CSS en `styles.css`:

```css
:root {
    --primary-color: #3b82f6;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --danger-color: #ef4444;
}
```

### Funcionalidades Adicionales
El código está estructurado de manera modular, facilitando la adición de nuevas características:

- Integración con APIs externas
- Sincronización en la nube
- Colaboración en tiempo real
- Análisis y reportes
- Integraciones con calendarios

## 📱 Compatibilidad

### Navegadores Soportados
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Características del Navegador
- LocalStorage (requerido)
- Notifications API (opcional)
- ES6+ JavaScript (requerido)
- CSS Grid y Flexbox (requerido)

## 🔒 Privacidad y Datos

- **Almacenamiento local**: Todos los datos se guardan en tu navegador
- **Sin servidor**: No se envían datos a servidores externos
- **Privacidad total**: Tus tareas permanecen completamente privadas
- **Exportación**: Puedes exportar tus datos en formato JSON

## 🚀 Futuras Mejoras

### Próximas Características
- [ ] Sincronización en la nube
- [ ] Aplicación móvil nativa
- [ ] Colaboración en equipo
- [ ] Integración con calendarios (Google, Outlook)
- [ ] Análisis de productividad
- [ ] Plantillas de tareas
- [ ] Automatización con webhooks
- [ ] API REST para integraciones

### Contribuciones
Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## 🤝 Soporte

Si encuentras algún problema o tienes sugerencias:

1. Abre un issue en GitHub
2. Describe el problema detalladamente
3. Incluye pasos para reproducir el error
4. Especifica tu navegador y versión

## 🎉 Agradecimientos

- **Font Awesome** por los iconos
- **Google Fonts** por la tipografía Inter
- **Comunidad de desarrolladores** por inspiración y mejores prácticas

---

**¡Disfruta organizando tus tareas con TaskPlanner Pro!** 🎯
