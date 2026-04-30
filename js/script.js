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

    // js/script.js
    document.addEventListener('DOMContentLoaded', () => {

        // ---- Formulario de contacto principal ----
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const nombre = document.getElementById('nombre').value.trim();
                const email = document.getElementById('email').value.trim();
                const mensaje = document.getElementById('mensaje').value.trim();
                const feedback = document.getElementById('form-feedback');

                // Validaciones rápidas
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

                // Mostrar mensaje de "enviando"
                feedback.innerHTML = '<span class="text-info">📤 Enviando mensaje...</span>';

                try {
                    const response = await fetch('https://chats.sitioz.com/contacto.php', {
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

                try {
                    // Puedes crear otro endpoint para newsletter, o reutilizar el mismo con un campo extra.
                    // Por ahora simulamos éxito (o si prefieres, descomenta la llamada real)
                    // const response = await fetch('https://api.sitioz.com/newsletter.php', {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify({ email })
                    // });
                    // const data = await response.json();

                    // Simulación (cambia después por tu endpoint real)
                    setTimeout(() => {
                        leadFeedback.innerHTML = '<span class="text-success">✅ ¡Revisa tu bandeja! Te enviamos la checklist.</span>';
                        leadForm.reset();
                        setTimeout(() => leadFeedback.innerHTML = '', 5000);
                    }, 800);

                } catch (error) {
                    leadFeedback.innerHTML = '<span class="text-danger">❌ Error, intenta de nuevo.</span>';
                }
            });
        }

        // ---- Smooth scroll para los enlaces del navbar ----
        document.querySelectorAll('.navbar-nav .nav-link').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(targetId);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        // Cerrar menú en móvil
                        const navbarCollapse = document.querySelector('.navbar-collapse');
                        if (navbarCollapse.classList.contains('show')) {
                            new bootstrap.Collapse(navbarCollapse).toggle();
                        }
                    }
                }
            });
        });
    });


    // Smooth scroll para los enlaces del navbar
    document.querySelectorAll('.navbar-nav .nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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