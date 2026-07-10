// ============================================================
// ADMIN - Panel de Administración
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');

    // Verificar sesión
    const session = sessionStorage.getItem('adminSession');

    if (session === 'true') {
        renderDashboard();
    } else {
        renderLogin();
    }

    // ===== LOGIN (la imagen está en el HTML) =====
    function renderLogin() {
        app.innerHTML = `
            <div class="login-container">
                <h1><i class="fas fa-ticket-alt"></i> Admin</h1>
                <p class="subtitle">Conciertos Conectados</p>
                <!-- La imagen se carga desde el HTML oculto -->
                <img src="img/melanie-login.jpg" alt="Melanie" class="login-img" 
                     onerror="this.src='https://via.placeholder.com/120/6a1b4d/fff?text=🎵'">
                <form id="loginForm">
                    <input type="email" id="loginEmail" placeholder="Email" value="admin@mail.com">
                    <input type="password" id="loginPassword" placeholder="Contraseña" value="123456">
                    <button type="submit"><i class="fas fa-sign-in-alt"></i> Iniciar sesión</button>
                    <a href="#" class="forgot">¿Olvidaste tu contraseña?</a>
                </form>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const admin = Storage.getAdmin();

            if (email === admin.email && password === admin.password) {
                sessionStorage.setItem('adminSession', 'true');
                showToast('✅ Bienvenido administrador', 'success');
                renderDashboard();
            } else {
                showToast('❌ Credenciales incorrectas', 'error');
            }
        });
    }

    // ===== DASHBOARD =====
    function renderDashboard() {
        app.innerHTML = `
            <header class="app-header">
                <div class="logo">
                    <i class="fas fa-ticket-alt"></i> Admin · Conciertos
                </div>
                <div class="nav-links">
                    <a href="index.html" class="admin-btn">
                        <i class="fas fa-home"></i> Ver sitio
                    </a>
                    <a href="#" class="btn-logout" id="logoutBtn" style="background:rgba(220,53,69,0.8);color:white;padding:0.5rem 1.2rem;border-radius:40px;">
                        <i class="fas fa-sign-out-alt"></i> Cerrar sesión
                    </a>
                </div>
            </header>

            <div class="admin-panel">
                <div class="admin-tabs">
                    <button class="active" data-tab="categorias">
                        <i class="fas fa-tags"></i> Categorías
                    </button>
                    <button data-tab="eventos">
                        <i class="fas fa-calendar-alt"></i> Eventos
                    </button>
                    <button data-tab="ventas">
                        <i class="fas fa-shopping-cart"></i> Ventas
                    </button>
                </div>
                <div id="adminContent"></div>
            </div>
        `;

        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('adminSession');
            showToast('Sesión cerrada', 'success');
            renderLogin();
        });

        document.querySelectorAll('.admin-tabs button').forEach(function(btn) {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.admin-tabs button').forEach(function(b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
                renderAdminTab(btn.dataset.tab);
            });
        });

        renderAdminTab('categorias');
    }

    // ===== RENDER TAB =====
    function renderAdminTab(tab) {
        const container = document.getElementById('adminContent');
        if (tab === 'categorias') renderCategorias(container);
        else if (tab === 'eventos') renderEventos(container);
        else if (tab === 'ventas') renderVentas(container);
    }

    // ===== CATEGORÍAS =====
    function renderCategorias(container) {
        const cats = Storage.getCategories();

        container.innerHTML = `
            <div class="section-header">
                <h3><i class="fas fa-tags"></i> Categorías</h3>
                <button class="btn-add-cat" id="addCatBtn">
                    <i class="fas fa-plus"></i> Agregar categoría
                </button>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cats.length === 0 ? `
                            <tr class="empty-row">
                                <td colspan="4">No hay categorías registradas</td>
                            </tr>
                        ` : cats.map(function(c) {
                            return `
                                <tr>
                                    <td>${c.id}</td>
                                    <td><strong>${c.nombre}</strong></td>
                                    <td>${c.descripcion || '-'}</td>
                                    <td style="text-align:center;white-space:nowrap;">
                                        <button class="btn-action btn-edit" data-id="${c.id}">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-action btn-del" data-id="${c.id}">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('addCatBtn').addEventListener('click', function() {
            const nombre = prompt('Ingrese el nombre de la categoría:');
            if (!nombre) return;
            const desc = prompt('Ingrese una descripción (opcional):') || '';
            const cats = Storage.getCategories();
            const newId = cats.length ? Math.max.apply(null, cats.map(function(c) { return c.id; })) + 1 : 1;
            cats.push({ id: newId, nombre: nombre, descripcion: desc });
            Storage.setCategories(cats);
            showToast('✅ Categoría agregada', 'success');
            renderAdminTab('categorias');
        });

        container.querySelectorAll('.btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const id = Number(this.dataset.id);
                const cats = Storage.getCategories();
                const cat = cats.find(function(c) { return c.id === id; });
                if (!cat) return;
                const nuevoNombre = prompt('Nuevo nombre:', cat.nombre);
                if (nuevoNombre === null) return;
                const nuevaDesc = prompt('Nueva descripción:', cat.descripcion);
                cat.nombre = nuevoNombre || cat.nombre;
                cat.descripcion = nuevaDesc !== null ? nuevaDesc : cat.descripcion;
                Storage.setCategories(cats);
                showToast('✅ Categoría actualizada', 'success');
                renderAdminTab('categorias');
            });
        });

        container.querySelectorAll('.btn-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (!confirm('¿Eliminar esta categoría?')) return;
                const id = Number(this.dataset.id);
                let cats = Storage.getCategories().filter(function(c) { return c.id !== id; });
                Storage.setCategories(cats);
                showToast('🗑️ Categoría eliminada', 'success');
                renderAdminTab('categorias');
            });
        });
    }

    // ===== EVENTOS =====
    function renderEventos(container) {
        const evs = Storage.getEvents();

        container.innerHTML = `
            <div class="section-header">
                <h3><i class="fas fa-calendar-alt"></i> Eventos</h3>
                <button class="btn-add-cat" id="addEventBtn">
                    <i class="fas fa-plus"></i> Agregar evento
                </button>
            </div>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Fecha</th>
                            <th>Ciudad</th>
                            <th style="text-align:center;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${evs.length === 0 ? `
                            <tr class="empty-row">
                                <td colspan="7">No hay eventos registrados</td>
                            </tr>
                        ` : evs.map(function(e) {
                            return `
                                <tr>
                                    <td>${e.id}</td>
                                    <td><strong>${e.nombre}</strong></td>
                                    <td>${e.categoria}</td>
                                    <td>$${e.precio.toLocaleString()}</td>
                                    <td>${e.fecha}</td>
                                    <td>${e.ciudad}</td>
                                    <td style="text-align:center;white-space:nowrap;">
                                        <button class="btn-action btn-edit" data-id="${e.id}">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-action btn-del" data-id="${e.id}">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('addEventBtn').addEventListener('click', function() {
            const nombre = prompt('Nombre del evento:');
            if (!nombre) return;
            const categoria = prompt('Categoría:') || 'Pop';
            const precio = prompt('Precio (número):') || '0';
            const fecha = prompt('Fecha (YYYY-MM-DD):') || '2026-12-01';
            const hora = prompt('Hora (HH:MM):') || '20:00';
            const ciudad = prompt('Ciudad (Barranquilla, Bogotá, Bucaramanga, Medellín):') || 'Bogotá';
            const descripcion = prompt('Descripción breve:') || '';

            const evs = Storage.getEvents();
            const newId = evs.length ? Math.max.apply(null, evs.map(function(e) { return e.id; })) + 1 : 1;
            evs.push({
                id: newId,
                nombre: nombre,
                categoria: categoria,
                precio: Number(precio) || 0,
                fecha: fecha,
                hora: hora,
                ciudad: ciudad,
                descripcion: descripcion
                // NOTA: La imagen NO se guarda en localStorage,
                // se asigna en el HTML mediante el mapa de imágenes
            });
            Storage.setEvents(evs);
            showToast('✅ Evento creado', 'success');
            renderAdminTab('eventos');
        });

        container.querySelectorAll('.btn-edit').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const id = Number(this.dataset.id);
                let evs = Storage.getEvents();
                const ev = evs.find(function(e) { return e.id === id; });
                if (!ev) return;

                const nombre = prompt('Nombre:', ev.nombre) || ev.nombre;
                const categoria = prompt('Categoría:', ev.categoria) || ev.categoria;
                const precio = prompt('Precio:', ev.precio) || ev.precio;
                const fecha = prompt('Fecha (YYYY-MM-DD):', ev.fecha) || ev.fecha;
                const hora = prompt('Hora (HH:MM):', ev.hora) || ev.hora;
                const ciudad = prompt('Ciudad:', ev.ciudad) || ev.ciudad;
                const descripcion = prompt('Descripción:', ev.descripcion) || ev.descripcion;

                ev.nombre = nombre;
                ev.categoria = categoria;
                ev.precio = Number(precio) || 0;
                ev.fecha = fecha;
                ev.hora = hora;
                ev.ciudad = ciudad;
                ev.descripcion = descripcion;

                Storage.setEvents(evs);
                showToast('✅ Evento actualizado', 'success');
                renderAdminTab('eventos');
            });
        });

        container.querySelectorAll('.btn-del').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (!confirm('¿Eliminar este evento?')) return;
                const id = Number(this.dataset.id);
                let evs = Storage.getEvents().filter(function(e) { return e.id !== id; });
                Storage.setEvents(evs);
                showToast('🗑️ Evento eliminado', 'success');
                renderAdminTab('eventos');
            });
        });
    }

    // ===== VENTAS =====
    function renderVentas(container) {
        const ventas = Storage.getVentas().sort(function(a, b) {
            return new Date(b.fecha) - new Date(a.fecha);
        });

        if (ventas.length === 0) {
            container.innerHTML = `
                <div class="section-header">
                    <h3><i class="fas fa-shopping-cart"></i> Ventas</h3>
                </div>
                <div class="ventas-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>No hay ventas registradas aún.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="section-header">
                <h3><i class="fas fa-shopping-cart"></i> Ventas</h3>
                <span style="color:#d4a5c4;font-size:0.95rem;">Total: ${ventas.length} ventas</span>
            </div>
            ${ventas.map(function(v) {
                return `
                    <div class="venta-card">
                        <div class="venta-header">
                            <div>
                                <strong>#${v.id}</strong>
                                <span style="margin-left:1rem;">
                                    <i class="fas fa-calendar"></i> ${new Date(v.fecha).toLocaleString()}
                                </span>
                                <span style="margin-left:1rem;">
                                    <i class="fas fa-map-marker-alt"></i> ${v.ciudad}
                                </span>
                            </div>
                            <div style="font-weight:700;color:#d4af37;font-size:1.1rem;">
                                $${v.total.toLocaleString()}
                            </div>
                        </div>
                        <div class="venta-cliente">
                            <i class="fas fa-user"></i> ${v.cliente.name}
                            <span style="margin-left:1rem;"><i class="fas fa-id-card"></i> ${v.cliente.doc}</span>
                            <span style="margin-left:1rem;"><i class="fas fa-envelope"></i> ${v.cliente.email}</span>
                        </div>
                        <details>
                            <summary><i class="fas fa-eye"></i> Ver detalles del pedido</summary>
                            <div class="venta-detalle">
                                ${v.items.map(function(item) {
                                    return `
                                        <div class="item">
                                            <span>${item.nombre}</span>
                                            <span>$${item.precio.toLocaleString()}</span>
                                        </div>
                                    `;
                                }).join('')}
                                <div class="total-row">
                                    <span>Total</span>
                                    <span>$${v.total.toLocaleString()}</span>
                                </div>
                                <div class="cliente-info">
                                    <i class="fas fa-address-card"></i> ${v.cliente.address}
                                    <span style="margin-left:1rem;"><i class="fas fa-phone"></i> ${v.cliente.phone}</span>
                                </div>
                            </div>
                        </details>
                    </div>
                `;
            }).join('')}
        `;
    }

    // ===== TOAST =====
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(function() { toast.remove(); }, 3000);
    }
});

// ============================================================
// NUEVA FUNCIÓN - VENTAS MEJORADAS (Agregar al final)
// ============================================================

// ===== VENTAS - VERSIÓN MEJORADA =====
function renderVentas(container) {
    const ventas = Storage.getVentas().sort(function(a, b) {
        return new Date(b.fecha) - new Date(a.fecha);
    });

    // Calcular estadísticas
    const totalVentas = ventas.length;
    const totalIngresos = ventas.reduce(function(sum, v) { return sum + (v.total || 0); }, 0);
    const totalItems = ventas.reduce(function(sum, v) { return sum + (v.items ? v.items.length : 0); }, 0);

    if (ventas.length === 0) {
        container.innerHTML = `
            <div class="section-header">
                <h3><i class="fas fa-shopping-cart"></i> Ventas</h3>
            </div>
            <div class="ventas-empty">
                <i class="fas fa-shopping-bag"></i>
                <h3>No hay ventas registradas</h3>
                <p>Cuando los clientes realicen compras, aparecerán aquí.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="section-header">
            <h3><i class="fas fa-shopping-cart"></i> Ventas</h3>
        </div>

        <!-- Estadísticas -->
        <div class="ventas-stats">
            <div class="stat-card">
                <i class="fas fa-receipt"></i>
                <div class="stat-info">
                    <span class="stat-number">${totalVentas}</span>
                    <span class="stat-label">Ventas totales</span>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-dollar-sign"></i>
                <div class="stat-info">
                    <span class="stat-number">$${totalIngresos.toLocaleString()}</span>
                    <span class="stat-label">Ingresos totales</span>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-ticket-alt"></i>
                <div class="stat-info">
                    <span class="stat-number">${totalItems}</span>
                    <span class="stat-label">Boletas vendidas</span>
                </div>
            </div>
        </div>

        <!-- Lista de ventas -->
        ${ventas.map(function(v) {
            const fecha = new Date(v.fecha);
            const fechaFormateada = fecha.toLocaleDateString('es', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const numItems = v.items ? v.items.length : 0;
            const cliente = v.cliente || { name: 'N/A', doc: 'N/A', email: 'N/A', address: 'N/A', phone: 'N/A' };

            return `
                <div class="venta-card">
                    <div class="venta-header">
                        <div class="venta-id">
                            <strong>#${v.id}</strong>
                            <span class="venta-badge">${numItems} ${numItems === 1 ? 'boleta' : 'boletas'}</span>
                        </div>
                        <div class="venta-date">
                            <i class="fas fa-calendar-alt"></i>
                            ${fechaFormateada}
                        </div>
                        <div class="venta-total">$${v.total.toLocaleString()}</div>
                    </div>

                    <div class="venta-cliente">
                        <span class="cliente-info">
                            <i class="fas fa-user"></i>
                            <span class="cliente-name">${cliente.name}</span>
                        </span>
                        <span class="cliente-info">
                            <i class="fas fa-id-card"></i>
                            <span class="cliente-doc">${cliente.doc}</span>
                        </span>
                        <span class="cliente-info">
                            <i class="fas fa-envelope"></i>
                            <span class="cliente-email">${cliente.email}</span>
                        </span>
                        <span class="venta-ciudad">
                            <i class="fas fa-map-marker-alt"></i>
                            ${v.ciudad || 'N/A'}
                        </span>
                    </div>

                    <details>
                        <summary>
                            <i class="fas fa-eye"></i> Ver detalles del pedido
                        </summary>
                        <div class="venta-detalle">
                            <div class="detalle-header">
                                <span>Producto</span>
                                <span>Precio</span>
                            </div>
                            ${v.items && v.items.length > 0 ? v.items.map(function(item) {
                                return `
                                    <div class="item">
                                        <span class="item-name">
                                            <span class="item-dot"></span>
                                            ${item.nombre || 'Producto'}
                                        </span>
                                        <span class="item-price">$${(item.precio || 0).toLocaleString()}</span>
                                    </div>
                                `;
                            }).join('') : '<div class="item" style="color:#6a5b66;">No hay productos</div>'}
                            <div class="total-row">
                                <span class="total-label">Total</span>
                                <span class="total-amount">$${v.total.toLocaleString()}</span>
                            </div>
                            <div class="cliente-detalle">
                                <span><i class="fas fa-address-card"></i> ${cliente.address}</span>
                                <span><i class="fas fa-phone"></i> ${cliente.phone}</span>
                                <span><i class="fas fa-envelope"></i> ${cliente.email}</span>
                            </div>
                        </div>
                    </details>
                </div>
            `;
        }).join('')}
    `;
}

// --------------------------------------------//

// js/admin.js - Reemplaza la clase AdminSuggestions con esta versión mejorada

class AdminSuggestions {
    constructor() {
        this.suggestionsKey = 'melimarket_suggestions';
        this.init();
    }

    init() {
        this.createSection();
        this.render();
    }

    createSection() {
        // Buscar el contenedor principal
        const mainContainer = document.querySelector('.admin-content') || 
                            document.querySelector('main') || 
                            document.querySelector('#app') ||
                            document.body;

        // Crear el contenedor de sugerencias
        const container = document.createElement('div');
        container.className = 'suggestions-admin-container';
        container.id = 'suggestionsAdminContainer';
        container.innerHTML = `
            <div class="suggestions-admin-header">
                <h3>
                    <i class="fa fa-comments"></i> 
                    Buzón de Sugerencias
                </h3>
                <div class="suggestions-stats">
                    <span class="stat-badge pending">
                        <i class="fa fa-clock-o"></i> 
                        Pendientes: <span id="pendingCount">0</span>
                    </span>
                    <span class="stat-badge reviewed">
                        <i class="fa fa-check-circle"></i> 
                        Revisadas: <span id="reviewedCount">0</span>
                    </span>
                </div>
            </div>
            <div class="suggestions-list-admin" id="suggestionsList">
                <div class="suggestions-empty">
                    <i class="fa fa-inbox"></i>
                    <p>Cargando sugerencias...</p>
                </div>
            </div>
        `;

        // Insertar después del último section o al final
        const existingSections = mainContainer.querySelectorAll('section');
        if (existingSections.length > 0) {
            existingSections[existingSections.length - 1].after(container);
        } else {
            mainContainer.appendChild(container);
        }
    }

    render() {
        const suggestions = this.getSuggestions();
        const list = document.getElementById('suggestionsList');
        const pendingCount = document.getElementById('pendingCount');
        const reviewedCount = document.getElementById('reviewedCount');

        if (!list) return;

        // Actualizar contadores
        const pending = suggestions.filter(s => s.status === 'pending');
        const reviewed = suggestions.filter(s => s.status === 'reviewed');
        
        if (pendingCount) pendingCount.textContent = pending.length;
        if (reviewedCount) reviewedCount.textContent = reviewed.length;

        // Si no hay sugerencias
        if (suggestions.length === 0) {
            list.innerHTML = `
                <div class="suggestions-empty">
                    <i class="fa fa-inbox"></i>
                    <p><strong>No hay sugerencias aún</strong></p>
                    <small>Las sugerencias de los usuarios aparecerán aquí</small>
                </div>
            `;
            return;
        }

        // Ordenar por fecha (más reciente primero)
        const sorted = [...suggestions].sort((a, b) => b.id - a.id);
        
        // Renderizar
        list.innerHTML = sorted.map(s => this.createCard(s)).join('');
        
        // Agregar event listeners
        document.querySelectorAll('.btn-review-suggestion').forEach(btn => {
            btn.addEventListener('click', () => {
                this.markReviewed(parseInt(btn.dataset.id));
            });
        });

        document.querySelectorAll('.btn-delete-suggestion-admin').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de eliminar esta sugerencia?')) {
                    this.deleteSuggestion(parseInt(btn.dataset.id));
                }
            });
        });
    }

    createCard(suggestion) {
        const date = new Date(suggestion.date);
        const formattedDate = date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const isReviewed = suggestion.status === 'reviewed';
        const statusClass = isReviewed ? 'reviewed' : 'pending';
        const statusText = isReviewed ? '✓ Revisada' : 'Pendiente';
        const cardClass = isReviewed ? 'reviewed' : '';

        // Obtener iniciales para el avatar
        const initials = suggestion.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

        return `
            <div class="suggestion-item-admin ${cardClass}">
                <div class="suggestion-item-header">
                    <div class="suggestion-user-info">
                        <div class="suggestion-user-avatar">${initials}</div>
                        <div class="suggestion-user-details">
                            <h4>${this.escapeHTML(suggestion.name)}</h4>
                            <small>
                                <i class="fa fa-envelope"></i> 
                                ${this.escapeHTML(suggestion.email)}
                            </small>
                        </div>
                    </div>
                    <div class="suggestion-actions-admin">
                        <span class="suggestion-status ${statusClass}">${statusText}</span>
                        ${!isReviewed ? `
                            <button class="btn-review-suggestion" data-id="${suggestion.id}">
                                <i class="fa fa-check"></i> Revisar
                            </button>
                        ` : ''}
                        <button class="btn-delete-suggestion-admin" data-id="${suggestion.id}">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="suggestion-content-admin">
                    <i class="fa fa-quote-left"></i>
                    ${this.escapeHTML(suggestion.suggestion)}
                </div>
                <div class="suggestion-date-admin">
                    <i class="fa fa-clock-o"></i>
                    ${formattedDate}
                </div>
            </div>
        `;
    }

    getSuggestions() {
        try {
            const data = localStorage.getItem(this.suggestionsKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al cargar sugerencias:', error);
            return [];
        }
    }

    saveSuggestions(suggestions) {
        try {
            localStorage.setItem(this.suggestionsKey, JSON.stringify(suggestions));
        } catch (error) {
            console.error('Error al guardar sugerencias:', error);
        }
    }

    markReviewed(id) {
        const suggestions = this.getSuggestions();
        const index = suggestions.findIndex(s => s.id === id);
        if (index !== -1) {
            suggestions[index].status = 'reviewed';
            this.saveSuggestions(suggestions);
            this.render();
            this.showNotification('Sugerencia marcada como revisada ✅', 'success');
        }
    }

    deleteSuggestion(id) {
        const suggestions = this.getSuggestions().filter(s => s.id !== id);
        this.saveSuggestions(suggestions);
        this.render();
        this.showNotification('Sugerencia eliminada 🗑️', 'info');
    }

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: '#28a745',
            info: '#17a2b8',
            error: '#dc3545'
        };

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${colors[type] || '#333'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-weight: 500;
            font-size: 14px;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializar en la página de admin
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('admin.html')) {
        // Esperar un momento para asegurar que el DOM esté listo
        setTimeout(() => {
            new AdminSuggestions();
        }, 100);
    }
});