// ============================================================
// STORAGE - Manejo de localStorage
// ============================================================

const Storage = {
    get(key, def = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : def;
        } catch {
            return def;
        }
    },

    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    },

    getEvents() {
        return this.get('eventos', []);
    },

    setEvents(e) {
        this.set('eventos', e);
    },

    getCategories() {
        return this.get('categorias', []);
    },

    setCategories(c) {
        this.set('categorias', c);
    },

    getVentas() {
        return this.get('ventas', []);
    },

    setVentas(v) {
        this.set('ventas', v);
    },

    getAdmin() {
        return this.get('admin', { email: 'admin@mail.com', password: '123456' });
    }
};