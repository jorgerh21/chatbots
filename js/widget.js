(function () {
    // Configuración
    const API_URL = 'https://api.sitioz.com/chat.php';  // Ruta a tu api.php
    const STORAGE_KEY = 'sales_chat_history';
    const WELCOME_MESSAGE = '¡Hola! Soy tu asesor de ventas IA. ¿En qué puedo ayudarte hoy?';

    // Estado inicial del historial (incluye mensaje de bienvenida del asistente)
    let chatHistory = [];

    // Cargar historial desde localStorage
    function loadHistory() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            chatHistory = JSON.parse(stored);
        } else {
            // Inicializar con el mensaje del sistema y el de bienvenida
            chatHistory = [
                { role: 'system', content: 'Eres un agente de ventas...' } // En realidad el sistema se envía desde el backend, pero podemos mantenerlo aquí para referencia, aunque no se enviará.
            ];
            // Agregar mensaje de bienvenida del asistente (opcional, pero el backend lo generaría si no hay historial? Mejor ponerlo manual)
            // Para que el usuario vea algo al abrir el chat, añadimos un mensaje inicial del asistente.
            // Pero cuidado: el backend no lo sabrá a menos que se lo enviemos. En la primera interacción el historial tendrá solo el mensaje del usuario.
            // En lugar de guardar un mensaje de asistente falso, lo mostraremos directamente en la UI sin almacenarlo.
            // Entonces el historial enviado al backend empezará vacío (solo el mensaje del usuario tras el primer envío).
            // Para simplificar, no guardamos el mensaje de bienvenida en el historial; se muestra en la UI pero no se envía.
        }
    }

    // Guardar historial en localStorage (solo los mensajes de usuario y asistente, no el system)
    function saveHistory() {
        // Filtramos para no guardar mensajes con role 'system' si los hubiera
        const toStore = chatHistory.filter(m => m.role !== 'system');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    }

    // Añadir un mensaje al historial (local y UI)
    function addMessage(role, content, save = true) {
        chatHistory.push({ role, content });
        if (save) saveHistory();
        renderMessage(role, content);
    }

    // Renderizar un solo mensaje en el contenedor del chat
    function renderMessage(role, content) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role === 'user' ? 'user-message' : 'assistant-message'}`;
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Mostrar indicador de escritura
    let typingIndicator = null;
    function showTyping() {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        if (typingIndicator) return;
        typingIndicator = document.createElement('div');
        typingIndicator.className = 'message assistant-message typing-indicator';
        typingIndicator.textContent = '✍️ El agente está escribiendo...';
        container.appendChild(typingIndicator);
        container.scrollTop = container.scrollHeight;
    }
    function hideTyping() {
        if (typingIndicator && typingIndicator.remove) {
            typingIndicator.remove();
            typingIndicator = null;
        }
    }

    // Enviar mensaje del usuario al backend
    async function sendMessage(userMessage) {
        if (!userMessage.trim()) return;

        // Agregar mensaje del usuario al historial y UI
        addMessage('user', userMessage, true);

        // Mostrar indicador
        showTyping();

        // Preparar historial para enviar: solo user y assistant (sin system)
        const historyToSend = chatHistory.filter(m => m.role !== 'system');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: historyToSend })
            });
            const data = await response.json();
            hideTyping();

            if (data.error) {
                addMessage('assistant', `Error: ${data.error}`, true);
                return;
            }

            // Agregar respuesta del asistente al historial y UI
            addMessage('assistant', data.reply, true);

            // Si se detectaron datos de lead, podemos mostrarlos en consola o en un aviso
            if (data.lead && Object.keys(data.lead).length) {
                console.log('Lead capturado:', data.lead);
                // Opcional: mostrar un pequeño tooltip o notificación
            }
        } catch (error) {
            hideTyping();
            addMessage('assistant', 'Lo siento, hubo un problema de red. Intenta de nuevo.', true);
            console.error(error);
        }
    }

    // Crear la interfaz del widget flotante
    function createWidget() {
        // Contenedor principal
        const widgetDiv = document.createElement('div');
        widgetDiv.id = 'sales-chat-widget';
        widgetDiv.innerHTML = `
            <div id="chat-button" class="chat-button">
                💬
            </div>
            <div id="chat-container" class="chat-container">
                <div class="chat-header">
                    <span>🤖 Asesor de ventas IA</span>
                    <button id="close-chat">−</button>
                </div>
                <div id="chat-messages" class="chat-messages"></div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" placeholder="Escribe tu mensaje..." autocomplete="off">
                    <button id="chat-send">➤</button>
                </div>
            </div>
        `;
        document.body.appendChild(widgetDiv);

        // Estilos CSS (inline para evitar archivo externo)
        const style = document.createElement('style');
        style.textContent = `
            #sales-chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            .chat-button {
                width: 56px;
                height: 56px;
                border-radius: 28px;
                background: #1a73e8;
                color: white;
                font-size: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                transition: transform 0.2s;
            }
            .chat-button:hover {
                transform: scale(1.05);
            }
            .chat-container {
                position: absolute;
                bottom: 70px;
                right: 0;
                width: 350px;
                max-width: calc(100vw - 40px);
                background: white;
                border-radius: 16px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            .chat-container.closed {
                display: none;
            }
            .chat-header {
                background: #1a73e8;
                color: white;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
            }
            .chat-header button {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
            }
            .chat-messages {
                height: 350px;
                overflow-y: auto;
                padding: 12px;
                background: #f5f5f5;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .message {
                max-width: 80%;
                padding: 8px 12px;
                border-radius: 18px;
                font-size: 14px;
                line-height: 1.4;
                word-wrap: break-word;
            }
            .user-message {
                background: #1a73e8;
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
            }
            .assistant-message {
                background: #e4e6eb;
                color: #1e1e2f;
                align-self: flex-start;
                border-bottom-left-radius: 4px;
            }
            .typing-indicator {
                background: #e4e6eb;
                color: #555;
                font-style: italic;
            }
            .chat-input-area {
                display: flex;
                border-top: 1px solid #ddd;
                padding: 8px;
                background: white;
            }
            #chat-input {
                flex: 1;
                border: 1px solid #ddd;
                border-radius: 24px;
                padding: 8px 12px;
                outline: none;
                font-size: 14px;
            }
            #chat-send {
                background: #1a73e8;
                border: none;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 18px;
                margin-left: 8px;
                cursor: pointer;
                font-size: 16px;
            }
            #chat-send:hover {
                background: #0d47a1;
            }
        `;
        document.head.appendChild(style);

        // Elementos del DOM
        const chatContainer = document.getElementById('chat-container');
        const chatButton = document.getElementById('chat-button');
        const closeChat = document.getElementById('close-chat');
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('chat-send');

        // Abrir/cerrar chat
        chatButton.addEventListener('click', () => {
            chatContainer.classList.remove('closed');
            chatInput.focus();
        });
        closeChat.addEventListener('click', () => {
            chatContainer.classList.add('closed');
        });

        // Enviar mensaje
        function handleSend() {
            const message = chatInput.value.trim();
            if (message) {
                sendMessage(message);
                chatInput.value = '';
            }
        }
        sendButton.addEventListener('click', handleSend);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
            }
        });

        // Cargar historial y mostrar mensajes existentes
        loadHistory();
        // Mostrar mensajes previos en la UI
        chatHistory.forEach(msg => {
            if (msg.role !== 'system') {
                renderMessage(msg.role, msg.content);
            }
        });
        // Si no hay ningún mensaje en el historial (excepto system), mostrar bienvenida
        if (chatHistory.filter(m => m.role !== 'system').length === 0) {
            // Agregar un mensaje de bienvenida solo en UI, no lo guardamos en historial para no enviarlo al backend.
            // Pero mejor si lo guardamos? El backend necesita saber que el asistente ya dijo eso? No, porque el usuario aún no ha enviado nada.
            // Mostramos bienvenida pero no la persistimos.
            renderMessage('assistant', WELCOME_MESSAGE);
            // Opcional: también lo agregamos al historial? Si lo agregamos, al enviar el primer mensaje del usuario se enviaría también este mensaje de bienvenida como parte del historial, lo que está bien porque el contexto incluye que el asistente ya saludó.
            // Para que el asistente tenga contexto, es mejor guardarlo.
            // Entonces añadimos al historial y guardamos.
            addMessage('assistant', WELCOME_MESSAGE, true);
        }
    }

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidget);
    } else {
        createWidget();
    }
})();