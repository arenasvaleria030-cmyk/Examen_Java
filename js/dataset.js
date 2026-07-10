// ============================================================
// DATASET - Datos iniciales (sin imágenes, solo datos)
// ============================================================

(function seed() {
    // ===== EVENTOS =====
    if (!localStorage.getItem('eventos')) {
        const eventos = [
            {
                id: 1,
                nombre: 'Cry Baby Tour',
                categoria: 'Pop',
                precio: 85000,
                fecha: '2026-10-24',
                hora: '20:00',
                ciudad: 'Bogotá',
                descripcion: 'El tour más icónico de Melanie Martinez.'
            },
            {
                id: 2,
                nombre: 'K-12 Tour',
                categoria: 'Pop',
                precio: 92000,
                fecha: '2026-10-25',
                hora: '19:30',
                ciudad: 'Bogotá',
                descripcion: 'Escuela, fantasía y música.'
            },
            {
                id: 3,
                nombre: 'Portals Tour',
                categoria: 'Alternativo',
                precio: 78000,
                fecha: '2026-10-26',
                hora: '21:00',
                ciudad: 'Bogotá',
                descripcion: 'Un viaje a través de portales dimensionales.'
            },
            {
                id: 4,
                nombre: 'Hades Tour',
                categoria: 'Rock',
                precio: 67000,
                fecha: '2026-07-12',
                hora: '18:00',
                ciudad: 'Medellín',
                descripcion: 'El inframundo musical.'
            },
            {
                id: 5,
                nombre: 'After School Tour',
                categoria: 'Pop',
                precio: 54000,
                fecha: '2026-08-20',
                hora: '17:00',
                ciudad: 'Barranquilla',
                descripcion: 'La fiesta después de clases.'
            },
            {
                id: 6,
                nombre: 'Salts Dom',
                categoria: 'Alternativo',
                precio: 72000,
                fecha: '2026-07-12',
                hora: '22:00',
                ciudad: 'Bogotá',
                descripcion: 'Noche de sal y dom en Bogotá.'
            }
        ];
        localStorage.setItem('eventos', JSON.stringify(eventos));
    }

    // ===== CATEGORÍAS =====
    if (!localStorage.getItem('categorias')) {
        localStorage.setItem('categorias', JSON.stringify([
            { id: 1, nombre: 'Pop', descripcion: 'Música pop y comercial' },
            { id: 2, nombre: 'Alternativo', descripcion: 'Sonidos alternativos y experimentales' },
            { id: 3, nombre: 'Rock', descripcion: 'Rock y sus variantes' }
        ]));
    }

    // ===== VENTAS =====
    if (!localStorage.getItem('ventas')) {
        localStorage.setItem('ventas', JSON.stringify([]));
    }

    // ===== ADMIN =====
    if (!localStorage.getItem('admin')) {
        localStorage.setItem('admin', JSON.stringify({ email: 'admin@mail.com', password: '123456' }));
    }

    console.log('✅ Dataset cargado correctamente');
})();