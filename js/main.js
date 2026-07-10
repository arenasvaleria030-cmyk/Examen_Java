// ============================================================
// MAIN - Vista de Clientes
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');
    let cart = [];

    // ===== MAPA DE IMÁGENES =====
    function getImageSrc(eventId) {
        const map = {
            1: 'img/crybabytour.jpg',
            2: 'img/melconciertoK-12.jpg',
            3: 'img/possesion.jpg',
            4: 'img/Hadesmelanie.jpg',
            5: 'img/otravezhades.jpg',
            6: 'img/thecreature.jpg'
        };
        return map[eventId] || 'https://via.placeholder.com/400x200/6a1b4d/fff?text=🎵+Concierto';
    }

    // ===== RENDER PRINCIPAL =====
    function render() {
        const events = Storage.getEvents();
        const categorias = Storage.getCategories();
        const ciudades = ['Barranquilla', 'Bogotá', 'Bucaramanga', 'Medellín'];

        let html = `
            <header class="app-header">
                <div class="logo">
                    <i class="fas fa-music"></i> melimarket
                </div>
                <div class="nav-links">
                    <a href="admin.html" class="admin-btn">
                        <i class="fas fa-user-cog"></i> Admin
                    </a>
                    <a href="#" class="cart-btn" id="openCart">
                        <i class="fas fa-shopping-cart"></i>
                        Carrito
                        <span class="badge" id="cartCount">${cart.length}</span>
                    </a>
                </div>
            </header>

            <section class="filters-section">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchInput" placeholder="Buscar por artista, evento...">
                </div>
                <div class="filter-group">
                    <select id="filterCiudad">
                        <option value="">Todas las ciudades</option>
                        ${ciudades.map(c => `<option value="${c}">${c}</option>`).join('')}
                    </select>
                    <select id="filterCategoria">
                        <option value="">Todas las categorías</option>
                        ${categorias.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('')}
                    </select>
                </div>
            </section>

            <div class="event-grid" id="eventGrid"></div>

            <div class="quote-decoration">
                "Cry Baby" · "K-12" · "Portals" · "Hades" · "After School"
            </div>
        `;

        app.innerHTML = html;

        renderEvents(events);

        document.getElementById('searchInput').addEventListener('input', filterEvents);
        document.getElementById('filterCiudad').addEventListener('change', filterEvents);
        document.getElementById('filterCategoria').addEventListener('change', filterEvents);

        document.getElementById('openCart').addEventListener('click', function(e) {
            e.preventDefault();
            openCartModal();
        });
    }

    // ===== RENDER EVENTOS =====
    function renderEvents(events) {
        const grid = document.getElementById('eventGrid');
        if (!grid) return;

        if (!events || events.length === 0) {
            grid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:3rem;color:#d4a5c4;">
                    <i class="fas fa-music" style="font-size:2rem;display:block;margin-bottom:1rem;"></i>
                    No se encontraron eventos disponibles.
                </div>
            `;
            return;
        }

        grid.innerHTML = events.map(function(event) {
            const date = new Date(event.fecha);
            const formattedDate = date.toLocaleDateString('es', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });

            const imgSrc = getImageSrc(event.id);
            const precio = event.precio || 0;

            return `
                <div class="event-card" data-id="${event.id}">
                    <div class="card-image">
                        <img src="${imgSrc}" 
                             alt="${event.nombre}"
                             loading="lazy"
                             onerror="this.src='https://via.placeholder.com/400x200/6a1b4d/fff?text=🎵+Concierto'">
                        <div class="date-badge">
                            <i class="fas fa-calendar-alt"></i>
                            ${formattedDate}
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="event-name">${event.nombre}</div>
                        <div class="event-venue">
                            <i class="fas fa-map-marker-alt"></i> ${event.ciudad || 'Ciudad'}
                        </div>
                        <div class="event-meta">
                            <span>
                                <i class="fas fa-clock"></i> ${event.hora || '20:00'}
                            </span>
                            <span class="category-tag">${event.categoria || 'Concierto'}</span>
                        </div>
                        <div class="event-price">$${precio.toLocaleString()}</div>
                        <button class="btn-add" onclick="addToCart(${event.id})">
                            <i class="fas fa-cart-plus"></i> Agregar
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.event-card').forEach(function(card) {
            card.addEventListener('click', function(e) {
                if (e.target.closest('.btn-add')) return;
                const eventId = parseInt(this.dataset.id);
                const event = Storage.getEvents().find(function(ev) { return ev.id === eventId; });
                if (event) showEventDetail(event);
            });
        });
    }

    // ===== AGREGAR AL CARRITO =====
    window.addToCart = function(eventId) {
        const event = Storage.getEvents().find(function(e) { return e.id === eventId; });
        if (!event) return;

        if (!cart.find(function(i) { return i.id === event.id; })) {
            const item = { ...event, imagen: getImageSrc(event.id) };
            cart.push(item);
            showToast(`"${event.nombre}" agregado al carrito`, 'success');
            updateCartBadge();
        } else {
            showToast('Este evento ya está en el carrito', 'error');
        }
    };

    // ===== FILTRAR EVENTOS =====
    function filterEvents() {
        const search = document.getElementById('searchInput').value.toLowerCase().trim();
        const ciudad = document.getElementById('filterCiudad').value;
        const categoria = document.getElementById('filterCategoria').value;

        let filtered = Storage.getEvents();

        if (search) {
            filtered = filtered.filter(function(e) {
                return e.nombre.toLowerCase().includes(search) ||
                       (e.descripcion && e.descripcion.toLowerCase().includes(search));
            });
        }
        if (ciudad) {
            filtered = filtered.filter(function(e) { return e.ciudad === ciudad; });
        }
        if (categoria) {
            filtered = filtered.filter(function(e) { return e.categoria === categoria; });
        }

        renderEvents(filtered);
    }

    // ===== ACTUALIZAR BADGE =====
    function updateCartBadge() {
        const count = document.getElementById('cartCount');
        if (count) count.textContent = cart.length;
    }

    // ===== DETALLE DEL EVENTO =====
    function showEventDetail(event) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        const imgSrc = getImageSrc(event.id);

        modal.innerHTML = `
            <div class="modal-box">
                <button class="close-modal" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                <img src="${imgSrc}" 
                     style="width:100%;max-height:300px;object-fit:cover;border-radius:12px;margin:1rem 0;"
                     onerror="this.src='https://via.placeholder.com/600x300/6a1b4d/fff?text=🎵+Concierto'">
                <h2 style="color:#ffb3c6;margin:0.5rem 0;">${event.nombre}</h2>
                <p style="margin:0.5rem 0;color:#d4a5c4;">${event.descripcion || 'Sin descripción disponible.'}</p>
                <div style="display:flex;flex-wrap:wrap;gap:1rem;margin:0.5rem 0;color:#a07e92;">
                    <span><i class="fas fa-calendar-alt" style="color:#ffb3c6;"></i> ${event.fecha} ${event.hora || ''}</span>
                    <span><i class="fas fa-map-marker-alt" style="color:#ffb3c6;"></i> ${event.ciudad}</span>
                    <span><i class="fas fa-tag" style="color:#ffb3c6;"></i> ${event.categoria}</span>
                </div>
                <div style="font-size:1.8rem;font-weight:700;color:#d4af37;margin:1rem 0;">
                    $${(event.precio || 0).toLocaleString()}
                </div>
                <button class="btn-add" style="background:rgba(255,255,255,0.1);color:white;" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-arrow-left"></i> Volver
                </button>
                <button class="btn-add" style="margin-top:0.5rem;" onclick="
                    window.addToCart(${event.id});
                    this.closest('.modal-overlay').remove();
                ">
                    <i class="fas fa-cart-plus"></i> Agregar al carrito
                </button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.remove();
        });
    }

    // ============================================================
    // CARRITO - VERSIÓN ÚNICA Y FUNCIONAL
    // ============================================================

    function openCartModal() {
        const total = cart.reduce(function(sum, i) { return sum + Number(i.precio); }, 0);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'cartModalContainer';
        modal.innerHTML = `
            <div class="modal-box cart-modal">
                <button class="close-modal" onclick="document.getElementById('cartModalContainer').remove()">&times;</button>
                
                <div class="cart-header">
                    <i class="fas fa-shopping-cart"></i>
                    <h2>Carrito</h2>
                    <span class="cart-count">${cart.length} ${cart.length === 1 ? 'item' : 'items'}</span>
                </div>

                ${cart.length === 0 ? `
                    <div class="cart-empty">
                        <i class="fas fa-shopping-bag"></i>
                        <p>Tu carrito está vacío</p>
                        <p style="font-size:0.8rem;color:#6a5b66;margin-top:0.3rem;">Explora nuestros conciertos y agrega tus favoritos</p>
                    </div>
                ` : `
                    <div class="cart-items">
                        ${cart.map(function(item) {
                            const imgSrc = item.imagen || 'https://via.placeholder.com/55/6a1b4d/fff?text=🎵';
                            return `
                                <div class="cart-item">
                                    <img src="${imgSrc}" alt="${item.nombre}" onerror="this.src='https://via.placeholder.com/55/6a1b4d/fff?text=🎵'">
                                    <div class="item-info">
                                        <span class="item-name">${item.nombre}</span>
                                        <span class="item-price">$${(item.precio || 0).toLocaleString()}</span>
                                    </div>
                                    <button class="item-remove" onclick="removeFromCart(${item.id})" title="Eliminar">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <div class="cart-footer">
                        <div class="cart-total">
                            <span class="total-label">Total</span>
                            <span class="total-amount">$${total.toLocaleString()}</span>
                        </div>
                        <button class="btn-buy" id="buyBtn">
                            <i class="fas fa-credit-card"></i> Comprar
                        </button>
                        <div class="checkout-form" id="checkoutForm">
                            <div class="form-group full-width">
                                <label>N° identificación</label>
                                <input type="text" id="doc" placeholder="Ej: 123456789">
                            </div>
                            <div class="form-group full-width">
                                <label>Nombre completo</label>
                                <input type="text" id="name" placeholder="Ej: Melanie Martinez">
                            </div>
                            <div class="form-group full-width">
                                <label>Dirección</label>
                                <input type="text" id="address" placeholder="Ej: Calle 123 #45-67">
                            </div>
                            <div class="form-group">
                                <label>Teléfono</label>
                                <input type="text" id="phone" placeholder="Ej: 3001234567">
                            </div>
                            <div class="form-group">
                                <label>E-mail</label>
                                <input type="email" id="email" placeholder="Ej: melanie@mail.com">
                            </div>
                            <button class="btn-confirm full-width" id="confirmBtn">
                                <i class="fas fa-check-circle"></i> Confirmar compra
                            </button>
                        </div>
                    </div>
                `}
            </div>
        `;
        document.body.appendChild(modal);

        // ===== Botón Comprar =====
        const buyBtn = modal.querySelector('#buyBtn');
        if (buyBtn) {
            buyBtn.addEventListener('click', function() {
                const form = modal.querySelector('#checkoutForm');
                if (form) {
                    form.classList.toggle('active');
                    if (form.classList.contains('active')) {
                        setTimeout(function() {
                            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                    }
                }
            });
        }

        // ===== Botón Confirmar compra =====
        const confirmBtn = modal.querySelector('#confirmBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                const doc = modal.querySelector('#doc')?.value?.trim() || '';
                const name = modal.querySelector('#name')?.value?.trim() || '';
                const address = modal.querySelector('#address')?.value?.trim() || '';
                const phone = modal.querySelector('#phone')?.value?.trim() || '';
                const email = modal.querySelector('#email')?.value?.trim() || '';

                if (!doc || !name || !address || !phone || !email) {
                    alert('⚠️ Por favor complete todos los campos');
                    return;
                }

                if (cart.length === 0) {
                    alert('⚠️ El carrito está vacío');
                    return;
                }

                const venta = {
                    id: Date.now(),
                    fecha: new Date().toISOString(),
                    items: cart.map(function(i) { 
                        return { id: i.id, nombre: i.nombre, precio: i.precio }; 
                    }),
                    total: cart.reduce(function(s, i) { return s + Number(i.precio); }, 0),
                    cliente: { doc, name, address, phone, email },
                    ciudad: cart[0]?.ciudad || 'N/A'
                };

                const ventas = Storage.getVentas();
                ventas.push(venta);
                Storage.setVentas(ventas);

                cart = [];
                updateCartBadge();

                modal.remove();

                alert('🎫 ¡Compra realizada con éxito! Boleta asignada.');
                showToast('🎫 ¡Compra realizada con éxito!', 'success');
            });
        }

        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.remove();
        });
    }

    // ===== ELIMINAR DEL CARRITO =====
    window.removeFromCart = function(eventId) {
        cart = cart.filter(function(item) { return item.id !== eventId; });
        updateCartBadge();
        const modal = document.getElementById('cartModalContainer');
        if (modal) {
            modal.remove();
        }
        openCartModal();
        showToast('🗑️ Evento eliminado del carrito', 'success');
    };

    // ===== TOAST =====
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(function() { toast.remove(); }, 3000);
    }

    // ===== INICIAR =====
    render();
});