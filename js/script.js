// Simulación de envío de formularios (demo)
document.addEventListener('DOMContentLoaded', () => {
    // Formulario de contacto principal
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            const feedback = document.getElementById('form-feedback');
            
            if (!nombre || !email || !mensaje) {
                feedback.innerHTML = '<span class="text-danger">Por favor completa todos los campos.</span>';
                return;
            }
            if (!email.includes('@')) {
                feedback.innerHTML = '<span class="text-danger">Correo electrónico inválido.</span>';
                return;
            }
            
            // Aquí normalmente se enviaría a una API, pero simulamos éxito
            feedback.innerHTML = '<span class="text-success">¡Mensaje enviado! Te responderé en breve.</span>';
            contactForm.reset();
            setTimeout(() => feedback.innerHTML = '', 5000);
        });
    }
    
    // Formulario de lead magnet (checklist)
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('leadEmail').value.trim();
            const leadFeedback = document.getElementById('lead-feedback');
            if (!email || !email.includes('@')) {
                leadFeedback.innerHTML = '<span class="text-danger">Correo válido requerido.</span>';
                return;
            }
            leadFeedback.innerHTML = '<span class="text-success">¡Revisa tu bandeja de entrada! Enviamos la checklist.</span>';
            leadForm.reset();
            setTimeout(() => leadFeedback.innerHTML = '', 5000);
        });
    }
    
    // Smooth scroll para los enlaces del navbar
    document.querySelectorAll('.navbar-nav .nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Cerrar menú móvil después de clic
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        new bootstrap.Collapse(navbarCollapse).toggle();
                    }
                }
            }
        });
    });
});