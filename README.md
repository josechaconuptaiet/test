# AC Components 🚀

Librería de componentes premium para React, diseñada para ser altamente flexible, robusta y fácil de usar por desarrolladores de todos los niveles. Incluye validaciones integradas, manejo de formularios y una estética moderna.

## 📦 Instalación

Para instalar la librería en tu proyecto, ejecuta:

```bash
npm install ac-components
```

## 🚀 Uso Básico

No necesitas importar el CSS por separado, ¡ya viene incluido en la librería!

```jsx
import { Inpux, Select, Table } from 'ac-components';

function App() {
  return (
    <div>
      <Inpux label="Nombre" placeholder="Escribe tu nombre" required />
      <Select label="País" options={[{value: 'es', label: 'España'}]} />
    </div>
  );
}
```

---

## 🎨 Componentes

### 1. Inpux (Entradas de Texto)
![Inpux Showcase](./docs/inpux.png)

Entrada de texto avanzada con soporte para validación en tiempo real, prefijos, sufijos y estados de error/advertencia.

#### Props de Inpux
| Propiedad | Descripción | Tipo | Por defecto |
|-----------|-------------|------|-------------|
| `name` | Nombre único para el campo y validación | `string` | - |
| `label` | Etiqueta que aparece arriba del input | `string` | - |
| `type` | Tipo de input (text, password, number, email, etc.) | `string` | `'text'` |
| `size` | Tamaño del componente | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `variant` | Estilo visual del input | `'outlined' \| 'filled' \| 'underlined' \| 'borderless'` | `'outlined'` |
| `width` | Ancho del componente (px, %, etc) | `string \| number` | `'100%'` |
| `color` | Color principal (foco y acento) | `string` | `'#6366f1'` |
| `required` | Si el campo es obligatorio | `boolean` | `false` |
| `textOnly` | Bloquea todo lo que no sea letras | `boolean` | `false` |
| `showCounter` | Muestra contador si hay maxLength | `boolean` | `false` |

### 2. Select (Selector Premium)
![Select Showcase](./docs/select.png)

Selector personalizable que soporta búsqueda, selección múltiple y limpieza de datos.

#### Props de Select
| Propiedad | Descripción | Tipo | Por defecto |
|-----------|-------------|------|-------------|
| `options` | Lista de opciones para el menú | `{value, label}[]` | `[]` |
| `searchable` | Habilita búsqueda interna | `boolean` | `false` |
| `multiple` | Permite seleccionar varias opciones | `boolean` | `false` |
| `clearable` | Muestra botón para limpiar selección | `boolean` | `false` |
| `color` | Color de realce y foco | `string` | `'#6366f1'` |
| `width` | Ancho total | `string \| number` | `'100%'` |

### 3. Table (Grid de Datos Avanzado)
![Table Showcase](./docs/table.png)

Potente grid de datos con ordenamiento lógico, filtrado por columna y búsqueda global.

#### Props de Table
| Propiedad | Descripción | Tipo | Por defecto |
|-----------|-------------|------|-------------|
| `columns` | Configuración de columnas | `ColumnDef[]` | `[]` |
| `data` | Arreglo de objetos con la información | `object[]` | `[]` |
| `pagination` | Activa la paginación inferior | `boolean` | `true` |
| `searchable` | Muestra el buscador global | `boolean` | `true` |
| `color` | Color para indicadores y paginación | `string` | `'#4f46e5'` |
| `height` | Alto máximo de la caja de datos | `string \| number` | - |

### 4. DateRange (Selector de Fechas)
![DateRange Showcase](./docs/daterange.png)

Calendario interactivo para selección de rangos de fechas con soporte para límites de tiempo.

#### Props de DateRange
| Propiedad | Descripción | Tipo | Por defecto |
|-----------|-------------|------|-------------|
| `value` | Objeto con fecha inicio y fin | `{start, end}` | - |
| `allowPastDates` | Habilita selección de fechas pasadas | `boolean` | `true` |
| `color` | Color del rango seleccionado | `string` | `'#6366f1'` |
| `placeholder` | Texto de ayuda cuando no hay selección | `string` | `'Seleccionar rango'` |

### 5. Modal (Ventanas Emergentes)
![Modal Showcase](./docs/modal.png)

Modales elegantes con tipos predefinidos (info, success, error) y contenido personalizado.

#### Props de Modal
| Propiedad | Descripción | Tipo | Por defecto |
|-----------|-------------|------|-------------|
| `isOpen` | Controla si el modal está visible | `boolean` | `false` |
| `type` | Tipo visual predefinido | `'info' \| 'success' \| 'error' \| 'custom'` | `'info'` |
| `title` | Título del modal | `string` | `'Aviso'` |
| `maxWidth` | Ancho máximo del modal | `string \| number` | `500` |
| `onClose` | Función al cerrar el modal | `function` | - |

---

## ✨ Características Especiales

- **Validaciones Inteligentes**: Soporta validaciones complejas que se disparan al escribir o al enviar el formulario.
- **Inyección Automática**: No requiere configuración de CSS adicional.
- **Personalización Total**: Soporte universal para `className`, `style`, `width` y `height`.
- **Accesibilidad**: Diseñado siguiendo estándares de usabilidad modernos.

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
