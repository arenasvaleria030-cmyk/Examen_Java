// Buzon de sugferencias //

class SuggestionsManager {
    constructor() {
        this.suggestionsKey = 'melimarket_suggestions';
        this.init();
    }

    init() {
        this.createModal();
        this.createSuggestionButton();
        this.bindEvents();
    }

    createSuggestionButton() {
        const button = document.createElement('button');
        button.className = 'suggestion-btn floating-btn';
        button.innerHTML = '<i class="fa fa-comment"></i> <span>Buzón de Sugerencias</span>';
        button.id = 'openSuggestionBtn';
        document.body.appendChild(button);
    }

    createModal() {
        const modalHTML = `
            <div id="suggestionModal" class="suggestion-modal-overlay">
                <div class="suggestion-modal">
                    <div class="suggestion-modal-header">
                        <h2><i class="fa fa-lightbulb-o"></i> Buzón de Sugerencias</h2>
                        <button class="suggestion-modal-close" id="closeSuggestionModal">&times;</button>
                    </div>
                    <div class="suggestion-modal-body">
                        <p style="color: #666; margin-bottom: 25px;">
                            Tu opinión es muy importante para nosotros. 
                            Cuéntanos cómo podemos mejorar tu experiencia.
                        </p>
                        <form id="suggestionForm" class="suggestion-form">
                            <div class="form-group">
                                <label for="suggestionName">
                                    <i class="fa fa-user"></i> Nombre completo *
                                </label>
                                <input type="text" id="suggestionName" name="name" required 
                                       placeholder="Tu nombre completo" maxlength="100">
                            </div>
                            
                            <div class="form-group">
                                <label for="suggestionEmail">
                                    <i class="fa fa-envelope"></i> Correo electrónico *
                                </label>
                                <input type="email" id="suggestionEmail" name="email" required 
                                       placeholder="tu@email.com" maxlength="100">
                            </div>
                            
                            <div class="form-group">
                                <label for="suggestionText">
                                    <i class="fa fa-pencil"></i> Tu sugerencia *
                                </label>
                                <textarea id="suggestionText" name="suggestion" required 
                                          placeholder="Escribe tu sugerencia aquí..." 
                                          rows="5" maxlength="500"></textarea>
                                <small class="char-counter"><span id="charCount">0</span>/500</small>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary" id="cancelSuggestion">
                                    Cancelar
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fa fa-send"></i> Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = modalHTML;
        document.body.appendChild(container.firstElementChild);
    }

    bindEvents() {
        const modal = document.getElementById('suggestionModal');
        const openBtn = document.getElementById('openSuggestionBtn');
        const closeBtn = document.getElementById('closeSuggestionModal');
        const cancelBtn = document.getElementById('cancelSuggestion');
        const form = document.getElementById('suggestionForm');
        const textarea = document.getElementById('suggestionText');
        const charCount = document.getElementById('charCount');

        openBtn.addEventListener('click', () => this.openModal());
        closeBtn.addEventListener('click', () => this.closeModal());
        cancelBtn.addEventListener('click', () => this.closeModal());

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        textarea.addEventListener('input', () => {
            charCount.textContent = textarea.value.length;
            charCount.classList.toggle('warning', textarea.value.length > 450);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSuggestion(form);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal() {
        const modal = document.getElementById('suggestionModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.getElementById('suggestionForm').reset();
        document.getElementById('charCount').textContent = '0';
    }

    closeModal() {
        const modal = document.getElementById('suggestionModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    saveSuggestion(form) {
        const formData = new FormData(form);
        const suggestion = {
            id: Date.now(),
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            suggestion: formData.get('suggestion').trim(),
            date: new Date().toISOString(),
            status: 'pending'
        };

        if (!suggestion.name || !suggestion.email || !suggestion.suggestion) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(suggestion.email)) {
            alert('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        const suggestions = this.getSuggestions();
        suggestions.push(suggestion);
        localStorage.setItem(this.suggestionsKey, JSON.stringify(suggestions));

        const formContainer = form.parentElement;
        formContainer.innerHTML = `
            <div class="suggestion-success">
                <i class="fa fa-check-circle"></i>
                <h3>¡Gracias por tu sugerencia!</h3>
                <p>Tu opinión es muy valiosa para nosotros.</p>
            </div>
        `;

        setTimeout(() => this.closeModal(), 3000);
    }

    getSuggestions() {
        const data = localStorage.getItem(this.suggestionsKey);
        return data ? JSON.parse(data) : [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('admin.html')) {
        new SuggestionsManager();
    }
});

