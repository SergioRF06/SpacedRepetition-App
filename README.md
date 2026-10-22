# Spaced Repetition App 🎓

Aplicación web **mobile-first** para la gestión del estudio universitario mediante **repetición espaciada**. 
Sin backend: todos los datos persisten localmente en el navegador mediante `localStorage` utilizando **Zustand**.

---

## 🚀 Tecnologías

- **React 19** + **TypeScript**
- **Vite** para desarrollo y empaquetado ultrarrápido
- **Tailwind CSS v4** para diseño mobile-first y componentes táctiles de alta ergonomía
- **Zustand** con middleware `persist` para sincronización automática con `localStorage`
- **Lucide React** para iconografía moderna
- **Vitest** para tests unitarios del algoritmo y estado

---

## 📐 Modelo de Datos

### `Subject` (Asignatura)
- `id`: Identificador único (`string`)
- `title`: Nombre de la asignatura (`string`)
- `color`: Código de color identificativo opcional (`string`)

### `Topic` (Tema)
- `id`: Identificador único (`string`)
- `subjectId`: ID de la asignatura a la que pertenece (`string`)
- `title`: Título o concepto a estudiar (`string`)
- `interval`: Días transcurridos entre repasos (`number`, default `1`)
- `nextReviewDate`: Fecha del siguiente repaso en formato ISO (`string`)

---

## 🧠 Algoritmo de Repetición Espaciada

La función utilitaria `calculateNextReview(currentInterval, difficulty)` calcula el nuevo intervalo y la fecha del próximo repaso:

- **Difícil (`hard`)**:
  - `interval = 1` día (el tema vuelve a programarse para mañana)
- **Bien (`good`)**:
  - `interval = Math.max(1, Math.round(currentInterval * 1.5))`
- **Fácil (`easy`)**:
  - `interval = Math.max(1, Math.round(currentInterval * 2.5))`

La fecha `nextReviewDate` se calcula sumando el nuevo intervalo en días a la fecha actual.

---

## 📱 Vistas e Interacciones

1. **Dashboard de Repasos de Hoy (`TodayReviewView`)**:
   - Vista principal con los temas cuyo repaso está programado para hoy o días anteriores.
   - Muestra el nombre del tema, la asignatura con su color distintivo y el intervalo actual.
   - Al tocar un tema, se despliega el modal de calificación.

2. **Modal de Calificación (`ReviewModal`)**:
   - Ofrece tres botones táctiles grandes: **Difícil**, **Bien** y **Fácil**.
   - Muestra de antemano el cálculo exacto del nuevo intervalo y la fecha del próximo repaso.
   - Al pulsar un botón, actualiza el estado en LocalStorage, cierra el modal y el tema desaparece automáticamente de los pendientes.

3. **Gestión de Asignaturas (`SubjectsListView`)**:
   - Listado de materias con contador de temas totales y pendientes.
   - Formulario para añadir nuevas asignaturas con selector de paleta de colores.
   - Opciones para eliminar asignaturas (con confirmación y eliminación en cascada).

4. **Detalle de Asignatura (`SubjectDetailView`)**:
   - Listado de todos los temas de la asignatura con su estado (al día / pendiente).
   - Formulario directo con input grande para añadir nuevos temas a estudiar.
   - Botón para adelantar o realizar el repaso directamente.

---

## 🛠️ Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Ejecutar tests unitarios
npm test

# Comprobar tipos y compilar para producción
npm run build

# Ejecutar linter
npm run lint
```
