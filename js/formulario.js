// Módulo de validación de formularios
const FormValidator = {
    // Expresiones regulares para validación
    patterns: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        telefono: /^[\+]?[0-9\s\-\(\)]{10,}$/,
        nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
        texto: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\.,;:!?()\-]{10,500}$/
    },
    
    // Mensajes de error
    messages: {
        required: 'Este campo es obligatorio',
        email: 'Por favor ingresa un email válido',
        telefono: 'Por favor ingresa un teléfono válido (10 dígitos)',
        nombre: 'El nombre debe tener entre 2 y 50 caracteres',
        texto: 'El mensaje debe tener entre 10 y 500 caracteres'
    },
    
    // Inicializar validación
    init: function() {
        this.setupEventListeners();
        this.loadSavedData();
        this.setupAutoSave();
    },
    
    // Configurar event listeners
    setupEventListeners: function() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(contactForm);
            });
            
            // Validación en tiempo real
            this.setupRealTimeValidation(contactForm);
        }
    },
    
    // Validación en tiempo real
    setupRealTimeValidation: function(form) {
        const fields = form.querySelectorAll('input, textarea');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                this.clearFieldError(field);
            });
        });
    },
    
    // Configurar guardado automático
    setupAutoSave: function() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        const fields = form.querySelectorAll('input, textarea');
        let saveTimeout;
        
        fields.forEach(field => {
            field.addEventListener('input', () => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    this.saveTemporaryData();
                }, 1000);
            });
        });
    },
    
    // Validar campo individual
    validateField: function(field) {
        const value = field.value.trim();
        const type = field.type || field.getAttribute('name');
        
        // Validar campo requerido
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, this.messages.required);
            return false;
        }
        
        // Validaciones específicas por tipo
        switch (type) {
            case 'email':
                if (value && !this.patterns.email.test(value)) {
                    this.showFieldError(field, this.messages.email);
                    return false;
                }
                break;
                
            case 'tel':
                if (value && !this.patterns.telefono.test(value.replace(/\s/g, ''))) {
                    this.showFieldError(field, this.messages.telefono);
                    return false;
                }
                break;
                
            case 'text':
                if (field.id === 'nombre' && value && !this.patterns.nombre.test(value)) {
                    this.showFieldError(field, this.messages.nombre);
                    return false;
                }
                break;
                
            case 'textarea':
                if (value && !this.patterns.texto.test(value)) {
                    this.showFieldError(field, this.messages.texto);
                    return false;
                }
                break;
        }
        
        this.clearFieldError(field);
        return true;
    },
    
    // Mostrar error en campo
    showFieldError: function(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = 'var(--error)';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.id = `error-${field.id}`;
        
        field.parentNode.appendChild(errorDiv);
        errorDiv.style.display = 'block';
    },
    
    // Limpiar error de campo
    clearFieldError: function(field) {
        field.style.borderColor = '';
        
        const existingError = document.getElementById(`error-${field.id}`);
        if (existingError) {
            existingError.remove();
        }
    },
    
    // Manejar envío del formulario
    handleSubmit: function(form) {
        const fields = form.querySelectorAll('input, textarea');
        let isValid = true;
        
        // Validar todos los campos
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            this.submitForm(form);
        } else {
            this.showFormError('Por favor corrige los errores en el formulario');
        }
    },
    
    // Enviar formulario
    submitForm: function(form) {
        const formData = this.collectFormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Mostrar estado de carga
        this.setLoadingState(submitButton, true);
        
        // Simular envío (en un caso real, aquí iría una petición AJAX)
        setTimeout(() => {
            this.setLoadingState(submitButton, false);
            
            // Guardar en localStorage
            this.saveFormData(formData);
            
            // Mostrar mensaje de éxito
            this.showSuccessMessage(form);
            
            // Limpiar formulario
            form.reset();
            
            // Limpiar datos guardados
            this.clearSavedData();
            
        }, 1500);
    },
    
    // Recolectar datos del formulario
    collectFormData: function(form) {
        const formData = {
            timestamp: new Date().toISOString(),
            data: {}
        };
        
        const fields = form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            if (field.name && field.value.trim()) {
                formData.data[field.name] = field.value.trim();
            }
        });
        
        return formData;
    },
    
    // Guardar datos en localStorage
    saveFormData: function(formData) {
        try {
            const existingData = JSON.parse(localStorage.getItem('formulariosContacto') || '[]');
            existingData.push(formData);
            
            // Mantener solo los últimos 5 formularios
            if (existingData.length > 5) {
                existingData.shift();
            }
            
            localStorage.setItem('formulariosContacto', JSON.stringify(existingData));
        } catch (error) {
            console.error('Error al guardar formulario:', error);
        }
    },
    
    // Cargar datos guardados
    loadSavedData: function() {
        try {
            const savedData = JSON.parse(localStorage.getItem('formularioDatos') || '{}');
            
            Object.keys(savedData).forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = savedData[fieldId];
                }
            });
        } catch (error) {
            console.error('Error al cargar datos guardados:', error);
        }
    },
    
    // Guardar datos temporalmente mientras se escribe
    saveTemporaryData: function() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        const tempData = {};
        const fields = form.querySelectorAll('input, textarea');
        
        fields.forEach(field => {
            if (field.value.trim()) {
                tempData[field.id] = field.value;
            }
        });
        
        try {
            localStorage.setItem('formularioDatos', JSON.stringify(tempData));
        } catch (error) {
            console.error('Error al guardar datos temporales:', error);
        }
    },
    
    // Limpiar datos guardados
    clearSavedData: function() {
        localStorage.removeItem('formularioDatos');
    },
    
    // Mostrar estado de carga
    setLoadingState: function(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = 'Enviando...';
            button.classList.add('loading');
        } else {
            button.disabled = false;
            button.innerHTML = 'Solicitar Asesoría Gratuita';
            button.classList.remove('loading');
        }
    },
    
    // Mostrar mensaje de éxito
    showSuccessMessage: function(form) {
        // Remover mensajes existentes
        const existingMessage = form.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const existingError = form.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Crear mensaje de éxito
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message active';
        successDiv.innerHTML = `
            <h4>¡Formulario enviado con éxito!</h4>
            <p>Hemos recibido tu solicitud de asesoría. Nos pondremos en contacto contigo en un plazo de 24 horas.</p>
            <p><strong>Gracias por tu interés en la captación de agua pluvial.</strong></p>
        `;
        
        form.appendChild(successDiv);
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    },
    
    // Mostrar error general del formulario
    showFormError: function(message) {
        const form = document.getElementById('contact-form');
        const existingError = form.querySelector('.form-error-message');
        
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.innerHTML = `
            <h4>Error en el formulario</h4>
            <p>${message}</p>
        `;
        
        form.insertBefore(errorDiv, form.firstChild);
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    },
    
    // Obtener historial de formularios enviados
    getFormHistory: function() {
        try {
            return JSON.parse(localStorage.getItem('formulariosContacto') || '[]');
        } catch (error) {
            console.error('Error al obtener historial:', error);
            return [];
        }
    },
    
    // Limpiar historial de formularios
    clearFormHistory: function() {
        localStorage.removeItem('formulariosContacto');
    }
};

// Inicializar el validador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    FormValidator.init();
});

// Exportar para pruebas
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}