import React, { useState } from 'react';
import {
  Inpux,
  Select,
  DateRange,
  Modal,
  Table,
  useValidationStore,
} from '../src';

export default function App() {
  const { errors } = useValidationStore();

  // Modal States
  const [modalType, setModalType] = useState('info');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Inpux States
  const [inpuxVal, setInpuxVal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const { setTouched } = useValidationStore.getState();

    // Mark all fields as touched to show errors in UI
    const fieldNames = [
      'basico', 'solo-texto', 'limite', 'password', 
      'required-demo', 'textonly-demo', 'minlength-demo', 
      'maxlength-demo', 'no-special-demo', 'allowed-chars-demo', 'custom-error-demo'
    ];
    fieldNames.forEach(name => setTouched(name));

    const errorList = Object.entries(errors).filter(([_, errs]) => errs.length > 0);

    if (errorList.length > 0) {
      alert(`⚠️ Formulario inválido. Revisa los mensajes en rojo.`);
    } else {
      alert('✅ Formulario válido! Enviando datos...');
    }
  };

  // Select States
  const [selectedSingle, setSelectedSingle] = useState('');
  const [selectedMulti, setSelectedMulti] = useState([]);
  const [selectedMultiSearch, setSelectedMultiSearch] = useState([]);

  // DateRange State
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };


  // Table Data
  const tableColumns = [
    { key: 'id', header: 'ID', sortable: true, width: 60 },
    { key: 'name', header: 'Nombre', sortable: true, filterable: true },
    { key: 'role', header: 'Rol', filterable: true },
    {
      key: 'priority',
      header: 'Prioridad',
      sortable: true,
      sortType: 'priority',
      priorityOrder: ['Alta', 'Media', 'Baja'],
      render: (val) => {
        const colors = { Alta: '#ef4444', Media: '#f59e0b', Baja: '#22c55e' };
        return <span style={{ color: colors[val], fontWeight: 'bold' }}>{val}</span>;
      }
    },
    { key: 'date', header: 'Fecha', sortable: true, sortType: 'date' }
  ];

  const tableData = [
    { id: 1, name: 'Jose AC', role: 'Admin', priority: 'Alta', date: '2025-05-10' },
    { id: 2, name: 'Ana Lopez', role: 'Editor', priority: 'Media', date: '2025-05-11' },
    { id: 3, name: 'Carlos Ruiz', role: 'Viewer', priority: 'Baja', date: '2025-05-09' },
    { id: 4, name: 'Maria Garcia', role: 'Admin', priority: 'Alta', date: '2025-05-12' },
    { id: 5, name: 'Luis Perez', role: 'Editor', priority: 'Baja', date: '2025-05-08' },
    { id: 6, name: 'Elena Sans', role: 'Viewer', priority: 'Media', date: '2025-05-13' },
  ];

  const selectOptions = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'nextjs', label: 'Next.js' },
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fdfdfd' }}>
      <header style={{ marginBottom: '40px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1e293b', marginBottom: '10px' }}>Escaparate de Componentes AC</h1>
        <p style={{ color: '#64748b' }}>Demostración completa de todos los componentes y sus variantes.</p>
      </header>

      {/* SECTION: INPUTS */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#334155', marginBottom: '24px' }}>1. Inpux (Text Inputs)</h2>
        <form onSubmit={handleSubmit}>
          
          <h3 style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '16px' }}>1.1. Tamaños</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            <Inpux label="Grande (40px)" size="large" placeholder="Escribe algo..." prefix={<span>👤</span>} />
            <Inpux label="Mediano (32px - Por defecto)" size="medium" placeholder="Escribe algo..." prefix={<span>👤</span>} />
            <Inpux label="Pequeño (24px)" size="small" placeholder="Escribe algo..." prefix={<span>👤</span>} />
          </div>

          <h3 style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '16px' }}>1.2. Variantes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            <Inpux label="Delineado (Por defecto)" variant="outlined" placeholder="Borde completo" />
            <Inpux label="Relleno" variant="filled" placeholder="Fondo gris" />
            <Inpux label="Subrayado" variant="underlined" placeholder="Solo línea inferior" />
            <Inpux label="Sin bordes" variant="borderless" placeholder="Sin bordes ni fondo" />
          </div>

          <h3 style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '16px' }}>1.3. Colores y Tamaños Personalizados</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            <Inpux label="Ancho Personalizado (200px)" width={200} placeholder="Ancho fijo" />
            <Inpux label="Color Verde Personalizado" color="#22c55e" placeholder="Foco verde" />
            <Inpux label="Naranja Personalizado y Grande" color="#f59e0b" size="large" placeholder="Naranja y grande" />
            <Inpux label="Rosa Personalizado y Subrayado" color="#ec4899" variant="underlined" placeholder="Rosa subrayado" />
          </div>

          <h3 style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '16px' }}>1.4. Estados</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            <Inpux label="Estado de Error" status="error" errorMessage="Este campo tiene un error" prefix={<span>❌</span>} />
            <Inpux label="Estado de Advertencia" status="warning" errorMessage="Revisa los datos ingresados" prefix={<span>⚠️</span>} />
          </div>

          <h3 style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '16px' }}>1.5. Prefijos y Sufijos</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            <Inpux label="Prefijo de Búsqueda" prefix={<span>🔍</span>} placeholder="Buscar..." />
            <Inpux label="Sufijo de Contraseña" type="password" suffix={<span>👁️</span>} placeholder="Contraseña" />
            <Inpux label="Ranura Doble" prefix={<span>💰</span>} suffix={<span>USD</span>} placeholder="Monto" />
          </div>

          <h3 style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '16px' }}>1.6. Tipos de Validación</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <Inpux 
              name="required-demo" 
              label="Obligatorio" 
              required 
              placeholder="Este campo es obligatorio" 
            />
            <Inpux 
              name="textonly-demo" 
              label="Solo Texto" 
              textOnly 
              placeholder="Solo letras y espacios" 
            />
            <Inpux 
              name="minlength-demo" 
              label="Longitud Mínima (5)" 
              minLength={5} 
              placeholder="Escribe al menos 5 caracteres" 
            />
            <Inpux 
              name="maxlength-demo" 
              label="Longitud Máxima (10) + Contador" 
              maxLength={10} 
              showCounter 
              placeholder="Máximo 10 caracteres" 
            />
            <Inpux 
              name="no-special-demo" 
              label="Sin Caracteres Especiales" 
              allowSpecialChars={false} 
              placeholder="Solo letras y números" 
            />
            <Inpux 
              name="allowed-chars-demo" 
              label="Caracteres Permitidos (0-9 / .)" 
              allowedChars="0-9." 
              placeholder="Solo números y puntos" 
            />
            <Inpux 
              name="custom-error-demo" 
              label="Mensaje de Error Personalizado" 
              required 
              errorMessage="¡Oye! Este campo es súper importante" 
              placeholder="Mensaje personalizado" 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '40px' }}>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: '#1e293b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Probar todas las validaciones (Submit)
            </button>
          </div>
        </form>
      </section>


      {/* SECTION: SELECTS */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#334155', marginBottom: '24px' }}>2. Selects</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          <Select
            label="Selección Simple"
            options={selectOptions}
            value={selectedSingle}
            onChange={(val) => setSelectedSingle(val)}
            clearable
          />
          <Select
            label="Buscable"
            options={selectOptions}
            searchable
            placeholder="Busca un framework..."
          />
          <Select
            label="Selección Múltiple"
            options={selectOptions}
            multiple
            value={selectedMulti}
            onChange={(val) => setSelectedMulti(val)}
            placeholder="Elige varios..."
          />
          <Select
            label="Múltiple con Buscador"
            options={selectOptions}
            multiple
            searchable
            value={selectedMultiSearch}
            onChange={(val) => setSelectedMultiSearch(val)}
            placeholder="Busca y selecciona..."
          />
        </div>
      </section>

      {/* SECCIÓN: DATE RANGE */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#334155', marginBottom: '24px' }}>3. DateRange (Rango de Fechas)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          <div>
            <DateRange
              label="Rango de Fechas (Por defecto)"
              value={dateRange}
              onChange={setDateRange}
            />
          </div>
          <div>
            <DateRange
              label="Solo Fechas Futuras"
              allowPastDates={false}
              rangeColor="#6366f1"
            />
          </div>
        </div>
      </section>

      {/* SECTION: MODALS */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#334155', marginBottom: '24px' }}>4. Modals</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => openModal('info')} style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Abrir Info</button>
          <button onClick={() => openModal('success')} style={{ padding: '10px 20px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Abrir Success</button>
          <button onClick={() => openModal('error')} style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Abrir Error</button>
          <button onClick={() => openModal('custom')} style={{ padding: '10px 20px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Abrir Custom</button>
          <button onClick={() => setIsFormModalOpen(true)} style={{ padding: '10px 20px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Abrir Modal Formulario</button>
        </div>

        <Modal
          type="custom"
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          title="Registro de Usuario"
          icon={<span style={{ fontSize: '24px' }}>👤</span>}
          color="#1e293b"
          footer={
            <>
              <button onClick={() => setIsFormModalOpen(false)} style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: 'white' }}>Cerrar</button>
              <button onClick={() => { alert('Guardado!'); setIsFormModalOpen(false); }} style={{ padding: '8px 16px', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Guardar Cambios</button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Inpux label="Nombre Completo" placeholder="Ej: Juan Pérez" required name="modal-nombre" />
            <Inpux label="Correo Electrónico" type="email" placeholder="juan@ejemplo.com" required name="modal-email" />
            <Select
              label="Departamento"
              options={[
                { value: 'it', label: 'Sistemas / IT' },
                { value: 'hr', label: 'Recursos Humanos' },
                { value: 'sales', label: 'Ventas' },
              ]}
              placeholder="Selecciona área..."
            />
          </div>
        </Modal>

        <Modal
          type={modalType}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalType === 'custom' ? 'Mi Título Personalizado' : `Modal de ${modalType === 'info' ? 'Información' : modalType === 'success' ? 'Éxito' : 'Error'}`}
          icon={modalType === 'custom' ? <span style={{ fontSize: '24px' }}>🚀</span> : undefined}
          color={modalType === 'custom' ? '#6366f1' : undefined}
          footer={
            <>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: 'white' }}>Cancelar</button>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Aceptar</button>
            </>
          }
        >
          {modalType === 'custom' ? (
            <div style={{ textAlign: 'left' }}>
              <p>Este es un contenido totalmente libre.</p>
              <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          ) : (
            <p>Este es un ejemplo de mensaje para el modal de {modalType === 'info' ? 'información' : modalType === 'success' ? 'éxito' : 'error'}. Puedes personalizar el contenido como quieras.</p>
          )}
        </Modal>
      </section>

      {/* SECCIÓN: TABLE */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#334155', marginBottom: '24px' }}>5. Tablas (Avanzadas)</h2>
        
        <h3 style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '16px' }}>5.1. Tabla Estándar</h3>
        <Table
          columns={tableColumns}
          data={tableData}
          pagination
          pageSize={5}
          searchable
          height={400}
          onRowClick={(row) => alert(`Click en: ${row.name}`)}
        />

        <h3 style={{ fontSize: '1.1rem', color: '#64748b', margin: '40px 0 16px 0' }}>5.2. Tabla con Muchas Columnas (Scroll Horizontal)</h3>
        <Table
          columns={[
            { key: 'id', header: 'ID', width: 60 },
            { key: 'col1', header: 'Nombre Completo' },
            { key: 'col2', header: 'Correo Electrónico' },
            { key: 'col3', header: 'Teléfono' },
            { key: 'col4', header: 'Dirección' },
            { key: 'col5', header: 'Ciudad' },
            { key: 'col6', header: 'País' },
            { key: 'col7', header: 'Código Postal' },
            { key: 'col8', header: 'Empresa' },
            { key: 'col9', header: 'Cargo' },
            { key: 'col10', header: 'Departamento' },
            { key: 'col11', header: 'Fecha de Alta' },
            { key: 'col12', header: 'Último Acceso' },
            { key: 'col13', header: 'Estado' },
            { key: 'col14', header: 'Saldo' },
            { key: 'col15', header: 'Acciones' },
          ]}
          data={Array.from({ length: 5 }).map((_, i) => ({
            id: i + 1,
            col1: `Usuario Test ${i + 1}`,
            col2: `test${i + 1}@example.com`,
            col3: `+54 9 11 1234-${5678 + i}`,
            col4: `Calle Falsa ${123 + i}`,
            col5: 'Buenos Aires',
            col6: 'Argentina',
            col7: 'C1001',
            col8: 'AC Corp',
            col9: 'Developer',
            col10: 'Sistemas',
            col11: '2025-01-01',
            col12: '2025-05-16',
            col13: i % 2 === 0 ? 'Activo' : 'Inactivo',
            col14: `$${(i + 1) * 100}.00`,
            col15: '...'
          }))}
          pagination
          pageSize={5}
        />
      </section>



      {/* SECCIÓN: DOCUMENTACIÓN */}
      <section style={{ marginTop: '100px', paddingBottom: '60px' }}>
        <h2 style={{ fontSize: '1.8rem', color: '#1e293b', marginBottom: '32px', borderBottom: '2px solid #eee', paddingBottom: '12px' }}>
          Documentación de la API
        </h2>

        {/* INPUX PROPS */}
        <div style={{ marginBottom: '60px' }}>
          <h3 style={{ fontSize: '1.4rem', color: '#334155', marginBottom: '20px' }}>Inpux</h3>
          <div style={{ overflowX: 'auto', backgroundColor: '#111827', borderRadius: '12px', padding: '1px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#d1d5db', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#1f2937', color: '#9ca3af', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                <tr>
                  <th style={{ padding: '16px' }}>Propiedad</th>
                  <th style={{ padding: '16px' }}>Descripción</th>
                  <th style={{ padding: '16px' }}>Tipo</th>
                  <th style={{ padding: '16px' }}>Por defecto</th>
                </tr>
              </thead>
              <tbody style={{ divideY: '1px solid #374151' }}>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>name</td><td style={{ padding: '16px' }}>Nombre único para el campo y validación</td><td style={{ padding: '16px', color: '#818cf8' }}>string</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>label</td><td style={{ padding: '16px' }}>Etiqueta que aparece arriba del input</td><td style={{ padding: '16px', color: '#818cf8' }}>string</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>type</td><td style={{ padding: '16px' }}>Tipo de input (text, password, number, email, etc.)</td><td style={{ padding: '16px', color: '#818cf8' }}>string</td><td style={{ padding: '16px' }}>'text'</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>size</td><td style={{ padding: '16px' }}>Tamaño del componente</td><td style={{ padding: '16px', color: '#fb7185' }}>'small' | 'medium' | 'large'</td><td style={{ padding: '16px' }}>'medium'</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>width</td><td style={{ padding: '16px' }}>Ancho (px, %, etc)</td><td style={{ padding: '16px', color: '#818cf8' }}>string | number</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>height</td><td style={{ padding: '16px' }}>Alto del campo</td><td style={{ padding: '16px', color: '#818cf8' }}>string | number</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>color</td><td style={{ padding: '16px' }}>Color principal (accent)</td><td style={{ padding: '16px', color: '#818cf8' }}>string</td><td style={{ padding: '16px' }}>#6366f1</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>className</td><td style={{ padding: '16px' }}>Clases CSS adicionales</td><td style={{ padding: '16px', color: '#818cf8' }}>string</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>style</td><td style={{ padding: '16px' }}>Estilos inline adicionales</td><td style={{ padding: '16px', color: '#818cf8' }}>object</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>variant</td><td style={{ padding: '16px' }}>Estilo visual del input</td><td style={{ padding: '16px', color: '#fb7185' }}>'outlined' | 'filled' | 'underlined' | 'borderless'</td><td style={{ padding: '16px' }}>'outlined'</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>required</td><td style={{ padding: '16px' }}>Si el campo es obligatorio</td><td style={{ padding: '16px', color: '#818cf8' }}>boolean</td><td style={{ padding: '16px' }}>false</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>prefix</td><td style={{ padding: '16px' }}>Elemento o icono al inicio</td><td style={{ padding: '16px', color: '#818cf8' }}>ReactNode</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>suffix</td><td style={{ padding: '16px' }}>Elemento o icono al final</td><td style={{ padding: '16px', color: '#818cf8' }}>ReactNode</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>textOnly</td><td style={{ padding: '16px' }}>Bloquea todo lo que no sea letras</td><td style={{ padding: '16px', color: '#818cf8' }}>boolean</td><td style={{ padding: '16px' }}>false</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>showCounter</td><td style={{ padding: '16px' }}>Muestra contador si hay maxLength</td><td style={{ padding: '16px', color: '#818cf8' }}>boolean</td><td style={{ padding: '16px' }}>false</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SELECT PROPS */}
        <div style={{ marginBottom: '60px' }}>
          <h3 style={{ fontSize: '1.4rem', color: '#334155', marginBottom: '20px' }}>Select</h3>
          <div style={{ overflowX: 'auto', backgroundColor: '#111827', borderRadius: '12px', padding: '1px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#d1d5db', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#1f2937', color: '#9ca3af', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                <tr>
                  <th style={{ padding: '16px' }}>Propiedad</th>
                  <th style={{ padding: '16px' }}>Descripción</th>
                  <th style={{ padding: '16px' }}>Tipo</th>
                  <th style={{ padding: '16px' }}>Por defecto</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>options</td><td style={{ padding: '16px' }}>Lista de opciones para el menú</td><td style={{ padding: '16px', color: '#818cf8' }}>{'{value, label}'}[]</td><td style={{ padding: '16px' }}>[]</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>width</td><td style={{ padding: '16px' }}>Ancho total</td><td style={{ padding: '16px', color: '#818cf8' }}>string | number</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>height</td><td style={{ padding: '16px' }}>Alto del selector</td><td style={{ padding: '16px', color: '#818cf8' }}>string | number</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>color</td><td style={{ padding: '16px' }}>Color de realce y foco</td><td style={{ padding: '16px', color: '#818cf8' }}>string</td><td style={{ padding: '16px' }}>#6366f1</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>className</td><td style={{ padding: '16px' }}>Clases CSS adicionales</td><td style={{ padding: '16px', color: '#818cf8' }}>string</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>style</td><td style={{ padding: '16px' }}>Estilos inline adicionales</td><td style={{ padding: '16px', color: '#818cf8' }}>object</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>multiple</td><td style={{ padding: '16px' }}>Permite seleccionar varias opciones</td><td style={{ padding: '16px', color: '#818cf8' }}>boolean</td><td style={{ padding: '16px' }}>false</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>searchable</td><td style={{ padding: '16px' }}>Habilita búsqueda interna</td><td style={{ padding: '16px', color: '#818cf8' }}>boolean</td><td style={{ padding: '16px' }}>false</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>clearable</td><td style={{ padding: '16px' }}>Muestra botón para limpiar selección</td><td style={{ padding: '16px', color: '#818cf8' }}>boolean</td><td style={{ padding: '16px' }}>false</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE PROPS */}
        <div style={{ marginBottom: '60px' }}>
          <h3 style={{ fontSize: '1.4rem', color: '#334155', marginBottom: '20px' }}>Table</h3>
          <div style={{ overflowX: 'auto', backgroundColor: '#111827', borderRadius: '12px', padding: '1px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#d1d5db', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#1f2937', color: '#9ca3af', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                <tr>
                  <th style={{ padding: '16px' }}>Propiedad</th>
                  <th style={{ padding: '16px' }}>Descripción</th>
                  <th style={{ padding: '16px' }}>Tipo</th>
                  <th style={{ padding: '16px' }}>Por defecto</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>columns</td><td style={{ padding: '16px' }}>Configuración de columnas</td><td style={{ padding: '16px', color: '#818cf8' }}>ColumnDef[]</td><td style={{ padding: '16px' }}>[]</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>width</td><td style={{ padding: '16px' }}>Ancho total</td><td style={{ padding: '16px', color: '#818cf8' }}>string | number</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>height</td><td style={{ padding: '16px' }}>Alto máximo de la caja de datos</td><td style={{ padding: '16px', color: '#818cf8' }}>string | number</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>color</td><td style={{ padding: '16px' }}>Color para indicadores y paginación</td><td style={{ padding: '16px', color: '#818cf8' }}>string</td><td style={{ padding: '16px' }}>#4f46e5</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>className</td><td style={{ padding: '16px' }}>Clases CSS adicionales</td><td style={{ padding: '16px', color: '#818cf8' }}>string</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>style</td><td style={{ padding: '16px' }}>Estilos inline adicionales</td><td style={{ padding: '16px', color: '#818cf8' }}>object</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>data</td><td style={{ padding: '16px' }}>Arreglo de objetos con la información</td><td style={{ padding: '16px', color: '#818cf8' }}>object[]</td><td style={{ padding: '16px' }}>[]</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>pagination</td><td style={{ padding: '16px' }}>Activa la paginación inferior</td><td style={{ padding: '16px', color: '#818cf8' }}>boolean</td><td style={{ padding: '16px' }}>true</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>searchable</td><td style={{ padding: '16px' }}>Muestra el buscador global</td><td style={{ padding: '16px', color: '#818cf8' }}>boolean</td><td style={{ padding: '16px' }}>true</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* MODAL PROPS */}
        <div style={{ marginBottom: '60px' }}>
          <h3 style={{ fontSize: '1.4rem', color: '#334155', marginBottom: '20px' }}>Modal</h3>
          <div style={{ overflowX: 'auto', backgroundColor: '#111827', borderRadius: '12px', padding: '1px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#d1d5db', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#1f2937', color: '#9ca3af', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                <tr>
                  <th style={{ padding: '16px' }}>Propiedad</th>
                  <th style={{ padding: '16px' }}>Descripción</th>
                  <th style={{ padding: '16px' }}>Tipo</th>
                  <th style={{ padding: '16px' }}>Por defecto</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>isOpen</td><td style={{ padding: '16px' }}>Controla si el modal está visible</td><td style={{ padding: '16px', color: '#818cf8' }}>boolean</td><td style={{ padding: '16px' }}>false</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>width</td><td style={{ padding: '16px' }}>Ancho del modal</td><td style={{ padding: '16px', color: '#818cf8' }}>string | number</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>color</td><td style={{ padding: '16px' }}>Color del tema/icono personalizado</td><td style={{ padding: '16px', color: '#818cf8' }}>string</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>className</td><td style={{ padding: '16px' }}>Clases CSS adicionales</td><td style={{ padding: '16px', color: '#818cf8' }}>string</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>style</td><td style={{ padding: '16px' }}>Estilos inline adicionales</td><td style={{ padding: '16px', color: '#818cf8' }}>object</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>onClose</td><td style={{ padding: '16px' }}>Función al cerrar el modal</td><td style={{ padding: '16px', color: '#818cf8' }}>function</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>type</td><td style={{ padding: '16px' }}>Tipo visual predefinido</td><td style={{ padding: '16px', color: '#fb7185' }}>'info' | 'success' | 'error' | 'custom'</td><td style={{ padding: '16px' }}>'info'</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>title</td><td style={{ padding: '16px' }}>Título del modal</td><td style={{ padding: '16px', color: '#818cf8' }}>string</td><td style={{ padding: '16px' }}>-</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* DATERANGE PROPS */}
        <div style={{ marginBottom: '60px' }}>
          <h3 style={{ fontSize: '1.4rem', color: '#334155', marginBottom: '20px' }}>DateRange</h3>
          <div style={{ overflowX: 'auto', backgroundColor: '#111827', borderRadius: '12px', padding: '1px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#d1d5db', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#1f2937', color: '#9ca3af', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                <tr>
                  <th style={{ padding: '16px' }}>Propiedad</th>
                  <th style={{ padding: '16px' }}>Descripción</th>
                  <th style={{ padding: '16px' }}>Tipo</th>
                  <th style={{ padding: '16px' }}>Por defecto</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>value</td><td style={{ padding: '16px' }}>Objeto con fecha inicio y fin</td><td style={{ padding: '16px', color: '#818cf8' }}>{'{start, end}'}</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>width</td><td style={{ padding: '16px' }}>Ancho total</td><td style={{ padding: '16px', color: '#818cf8' }}>string | number</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>height</td><td style={{ padding: '16px' }}>Alto del campo de texto</td><td style={{ padding: '16px', color: '#818cf8' }}>string | number</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>color</td><td style={{ padding: '16px' }}>Color del rango seleccionado</td><td style={{ padding: '16px', color: '#818cf8' }}>string</td><td style={{ padding: '16px' }}>#6366f1</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>className</td><td style={{ padding: '16px' }}>Clases CSS adicionales</td><td style={{ padding: '16px', color: '#818cf8' }}>string</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>style</td><td style={{ padding: '16px' }}>Estilos inline adicionales</td><td style={{ padding: '16px', color: '#818cf8' }}>object</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>onChange</td><td style={{ padding: '16px' }}>Callback al seleccionar rango</td><td style={{ padding: '16px', color: '#818cf8' }}>function(range)</td><td style={{ padding: '16px' }}>-</td></tr>
                <tr style={{ borderTop: '1px solid #1f2937' }}><td style={{ padding: '16px', color: '#f3f4f6' }}>allowPastDates</td><td style={{ padding: '16px' }}>Habilita selección de fechas pasadas</td><td style={{ padding: '16px', color: '#818cf8' }}>boolean</td><td style={{ padding: '16px' }}>true</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#94a3b8', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        AC Components — 2025
      </footer>
    </div>
  );
}
