// js/components.js
// Web Component: EventCard
class EventCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set data(event) {
        this._event = event;
        this.render();
    }

    render() {
        const e = this._event;
        if (!e) {
            this.shadowRoot.innerHTML = `<div>Cargando...</div>`;
            return;
        }

        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 8px 30px rgba(106, 27, 77, 0.15);
                }
                .card-image {
                    position: relative;
                    height: 200px;
                    overflow: hidden;
                    background: #f0e8ec;
                }
                .card-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }
                .card:hover .card-image img {
                    transform: scale(1.03);
                }
                .card-image .date-badge {
                    position: absolute;
                    bottom: 12px;
                    left: 12px;
                    background: rgba(106, 27, 77, 0.9);
                    backdrop-filter: blur(4px);
                    color: white;
                    padding: 0.4rem 0.8rem;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }
                .card-image .date-badge i {
                    font-size: 0.7rem;
                }
                .card-body {
                    padding: 1rem 1.2rem 1.2rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                .card-body .event-name {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #2d1b2b;
                    margin: 0 0 0.2rem;
                    line-height: 1.3;
                }
                .card-body .event-venue {
                    font-size: 0.85rem;
                    color: #6a5b66;
                    margin-bottom: 0.3rem;
                }
                .card-body .event-venue i {
                    margin-right: 0.3rem;
                    color: #9f3b7a;
                }
                .card-body .event-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 0.5rem 0 0.8rem;
                    font-size: 0.85rem;
                    color: #6a5b66;
                }
                .card-body .event-meta .city {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }
                .card-body .event-meta .city i {
                    color: #9f3b7a;
                }
                .card-body .event-price {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #6a1b4d;
                    margin: 0.3rem 0 0.5rem;
                }
                .card-body .btn-add {
                    background: #f2c94c;
                    border: none;
                    padding: 0.7rem 1rem;
                    border-radius: 40px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    width: 100%;
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    color: #2d1b2b;
                }
                .card-body .btn-add:hover {
                    background: #e5b73a;
                    transform: scale(1.02);
                }
                .card-body .btn-add i {
                    font-size: 0.9rem;
                }
                .category-tag {
                    display: inline-block;
                    font-size: 0.7rem;
                    padding: 0.2rem 0.6rem;
                    border-radius: 20px;
                    background: #f0e8ec;
                    color: #6a1b4d;
                    font-weight: 600;
                    margin-top: 0.2rem;
                }
            </style>
            <div class="card">
                <div class="card-image">
                    <img src="${e.imagen || 'https://via.placeholder.com/400x200/6a1b4d/fff?text=🎵+Concierto'}" 
                         alt="${e.nombre}"
                         loading="lazy">
                    <div class="date-badge">
                        <i class="fas fa-calendar-alt"></i>
                        ${e.fecha ? new Date(e.fecha).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Próximo'}
                    </div>
                </div>
                <div class="card-body">
                    <div class="event-name">${e.nombre}</div>
                    <div class="event-venue">
                        <i class="fas fa-map-marker-alt"></i> ${e.ciudad || 'Ciudad'}
                    </div>
                    <div class="event-meta">
                        <span class="city">
                            <i class="fas fa-clock"></i> ${e.hora || '20:00'}
                        </span>
                        <span class="category-tag">${e.categoria || 'Concierto'}</span>
                    </div>
                    <div class="event-price">$${e.precio.toLocaleString()}</div>
                    <button class="btn-add" data-id="${e.id}">
                        <i class="fas fa-cart-plus"></i> Agregar
                    </button>
                </div>
            </div>
        `;

        this.shadowRoot.querySelector('.btn-add').addEventListener('click', (ev) => {
            ev.stopPropagation();
            window.dispatchEvent(new CustomEvent('add-to-cart', {
                detail: this._event,
                bubbles: true
            }));
        });

        this.shadowRoot.querySelector('.card').addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('view-detail', {
                detail: this._event,
                bubbles: true
            }));
        });
    }
}
customElements.define('event-card', EventCard);

// Web Component: CartModal
class CartModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.items = [];
        this.isOpen = false;
    }

    set cartItems(val) {
        this.items = val || [];
        this.render();
    }

    open() {
        this.isOpen = true;
        this.style.display = 'block';
        this.render();
    }

    close() {
        this.isOpen = false;
        this.style.display = 'none';
    }

    render() {
        const total = this.items.reduce((sum, i) => sum + Number(i.precio), 0);

        this.shadowRoot.innerHTML = `
            <style>
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(4px);
                    display: ${this.isOpen ? 'flex' : 'none'};
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-box {
                    background: white;
                    max-width: 520px;
                    width: 90%;
                    border-radius: 32px;
                    padding: 1.8rem;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    position: relative;
                }
                .close-btn {
                    position: absolute;
                    right: 1.2rem;
                    top: 1rem;
                    background: none;
                    border: none;
                    font-size: 1.8rem;
                    cursor: pointer;
                    color: #7a5f6e;
                }
                h2 {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    border-bottom: 1px solid #ede5ea;
                    padding-bottom: 0.8rem;
                    margin-bottom: 0.8rem;
                }
                .empty {
                    text-align: center;
                    color: #7a5f6e;
                    padding: 1.5rem 0;
                }
                .item {
                    display: flex;
                    gap: 1rem;
                    padding: 0.6rem 0;
                    border-bottom: 1px solid #f0e8ec;
                    align-items: center;
                }
                .item img {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 10px;
                }
                .item-info {
                    flex: 1;
                }
                .item-info strong {
                    display: block;
                }
                .total {
                    font-size: 1.4rem;
                    font-weight: 700;
                    text-align: right;
                    margin: 1rem 0;
                }
                .btn-buy {
                    background: #6a1b4d;
                    color: white;
                    border: none;
                    padding: 0.8rem;
                    border-radius: 60px;
                    width: 100%;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 1.1rem;
                    transition: 0.2s;
                }
                .btn-buy:hover {
                    background: #9f3b7a;
                }
                .btn-buy:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .form {
                    display: none;
                    grid-template-columns: 1fr;
                    gap: 0.6rem;
                    margin-top: 1rem;
                }
                .form.active {
                    display: grid;
                }
                .form input {
                    padding: 0.7rem 1rem;
                    border: 1px solid #ddd;
                    border-radius: 40px;
                    font-size: 0.95rem;
                }
                .form .confirm-btn {
                    background: #2e7d32;
                    color: white;
                    border: none;
                    padding: 0.7rem;
                    border-radius: 40px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .form .confirm-btn:hover {
                    background: #1b5e20;
                }
            </style>
            <div class="modal-overlay">
                <div class="modal-box">
                    <button class="close-btn" id="closeCart">&times;</button>
                    <h2><i class="fas fa-shopping-cart"></i> Carrito</h2>
                    ${this.items.length === 0 ? '<div class="empty">No hay eventos en el carrito.</div>' : ''}
                    ${this.items.map(item => `
                        <div class="item">
                            <img src="${item.imagen || 'https://via.placeholder.com/50/6a1b4d/fff?text=🎵'}" alt="${item.nombre}">
                            <div class="item-info">
                                <strong>${item.nombre}</strong>
                                <span>$${item.precio.toLocaleString()}</span>
                            </div>
                        </div>
                    `).join('')}
                    <div class="total">Total: $${total.toLocaleString()}</div>
                    <button class="btn-buy" id="buyBtn" ${this.items.length === 0 ? 'disabled' : ''}>
                        <i class="fas fa-credit-card"></i> Comprar
                    </button>
                    <div class="form" id="checkoutForm">
                        <input type="text" id="doc" placeholder="N° identificación" required>
                        <input type="text" id="name" placeholder="Nombre completo" required>
                        <input type="text" id="address" placeholder="Dirección" required>
                        <input type="text" id="phone" placeholder="Teléfono" required>
                        <input type="email" id="email" placeholder="E-mail" required>
                        <button class="confirm-btn" id="confirmBuy">Confirmar compra</button>
                    </div>
                </div>
            </div>
        `;

        this.shadowRoot.getElementById('closeCart').addEventListener('click', () => this.close());
        this.shadowRoot.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.close();
        });

        const buyBtn = this.shadowRoot.getElementById('buyBtn');
        const form = this.shadowRoot.getElementById('checkoutForm');

        buyBtn.addEventListener('click', () => {
            form.classList.toggle('active');
        });

        this.shadowRoot.getElementById('confirmBuy').addEventListener('click', () => {
            const doc = this.shadowRoot.getElementById('doc').value.trim();
            const name = this.shadowRoot.getElementById('name').value.trim();
            const address = this.shadowRoot.getElementById('address').value.trim();
            const phone = this.shadowRoot.getElementById('phone').value.trim();
            const email = this.shadowRoot.getElementById('email').value.trim();

            if (!doc || !name || !address || !phone || !email) {
                alert('⚠️ Por favor complete todos los campos');
                return;
            }

            const venta = {
                id: Date.now(),
                fecha: new Date().toISOString(),
                items: this.items.map(i => ({ ...i })),
                total: this.items.reduce((s, i) => s + Number(i.precio), 0),
                cliente: { doc, name, address, phone, email },
                ciudad: this.items[0]?.ciudad || 'N/A'
            };

            const ventas = Storage.getVentas();
            ventas.push(venta);
            Storage.setVentas(ventas);

            alert('🎫 ¡Compra realizada con éxito! Boleta asignada.');

            this.items = [];
            this.close();
            window.dispatchEvent(new Event('cart-updated'));
        });
    }
}
customElements.define('cart-modal', CartModal);