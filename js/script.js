// js/script.js
document.addEventListener('DOMContentLoaded', () => {

    // ---- Formulario de contacto principal (envío a Telegram) ----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            const feedback = document.getElementById('form-feedback');

            // Validaciones
            if (!nombre || !email || !mensaje) {
                feedback.innerHTML = '<span class="text-danger">❌ Por favor completa todos los campos.</span>';
                setTimeout(() => feedback.innerHTML = '', 5000);
                return;
            }
            if (!email.includes('@') || !email.includes('.')) {
                feedback.innerHTML = '<span class="text-danger">❌ Correo electrónico inválido.</span>';
                setTimeout(() => feedback.innerHTML = '', 5000);
                return;
            }

            // Mostrar estado "enviando"
            feedback.innerHTML = '<span class="text-info">📤 Enviando mensaje...</span>';

            try {
                // 🔁 Cambia la URL si tu endpoint está en otro dominio
                const response = await fetch('https://api.sitioz.com/contacto.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, mensaje })
                });

                const data = await response.json();

                if (data.success) {
                    feedback.innerHTML = '<span class="text-success">✅ ' + data.message + '</span>';
                    contactForm.reset();  // Limpia el formulario
                } else {
                    feedback.innerHTML = '<span class="text-danger">❌ ' + data.message + '</span>';
                }
            } catch (error) {
                console.error('Error de conexión:', error);
                feedback.innerHTML = '<span class="text-danger">❌ Error de conexión. Inténtalo más tarde.</span>';
            }

            setTimeout(() => feedback.innerHTML = '', 6000);
        });
    }

    // ---- Formulario de newsletter (lead magnet) ----
    // Por ahora es una simulación; si necesitas un endpoint real, lo creamos después.
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('leadEmail').value.trim();
            const leadFeedback = document.getElementById('lead-feedback');

            if (!email || !email.includes('@')) {
                leadFeedback.innerHTML = '<span class="text-danger">❌ Correo electrónico válido requerido.</span>';
                setTimeout(() => leadFeedback.innerHTML = '', 5000);
                return;
            }

            leadFeedback.innerHTML = '<span class="text-info">📤 Registrando...</span>';

            // Simulación de envío (cambia después por tu endpoint real)
            setTimeout(() => {
                leadFeedback.innerHTML = '<span class="text-success">✅ ¡Revisa tu bandeja! Te enviamos la checklist.</span>';
                leadForm.reset();
                setTimeout(() => leadFeedback.innerHTML = '', 5000);
            }, 800);
        });
    }

    // ---- Smooth scroll para los enlaces del navbar ----
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Cierra el menú en móvil después de hacer clic
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        new bootstrap.Collapse(navbarCollapse).toggle();
                    }
                }
            }
        });
    });

});