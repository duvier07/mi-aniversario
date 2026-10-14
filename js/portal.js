// =========================================
// PORTAL — EL CORAZÓN QUE SE LLENA (10 toques = 10 años)
// =========================================
(function() {

    const portal = document.getElementById("portal");
    const corazon = document.getElementById("portalCorazon");
    const liquido = document.getElementById("portalLiquido");
    const frase = document.getElementById("portalFrase");
    const barra = document.getElementById("portalBarra");
    const contador = document.getElementById("portalContador");
    const brillo = portal ? portal.querySelector(".portal-brillo") : null;

    if (!portal || !corazon) {
        return;
    }

    const FRASES = [
        "Todo empezó con un día cualquiera…",
        "…que dejó de serlo cuando te conocí.",
        "Un primer beso que nunca olvidaré",
        "Un sí frente a Dios",
        "Viajes, risas y mil aventuras",
        "Dos princesas que nos cambiaron la vida",
        "Días difíciles que nos hicieron más fuertes",
        "Y aun así, siempre juntos",
        "Un toque más, mi amor… ❤️"
    ];

    const TOTAL = 10;
    let toques = 0;
    let terminado = false;

    document.body.style.overflow = "hidden";

    function cambiarFrase(texto) {
        frase.classList.add("cambia");
        setTimeout(function() {
            frase.textContent = texto;
            frase.classList.remove("cambia");
        }, 300);
    }

    function flotarCorazones(cantidad) {

        const caja = corazon.getBoundingClientRect();

        for (let i = 0; i < cantidad; i++) {
            const c = document.createElement("span");
            c.className = "portal-flota";
            c.textContent = ["❤️", "💗", "💕", "✨"][Math.floor(Math.random() * 4)];
            c.style.left = (caja.left + caja.width * (0.25 + Math.random() * 0.5)) + "px";
            c.style.top = (caja.top + caja.height * (0.3 + Math.random() * 0.4)) + "px";
            c.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
            c.style.animationDelay = (i * 0.07) + "s";
            document.body.appendChild(c);
            setTimeout(function() { c.remove(); }, 2200);
        }
    }

    function actualizar() {

        const avance = toques / TOTAL;

        liquido.style.transform = "translateY(" + ((1 - avance) * 95) + "px)";
        barra.style.width = (avance * 100) + "%";
        contador.textContent = toques + " de " + TOTAL + " años";

        if (brillo) {
            brillo.style.opacity = 0.25 + avance * 0.75;
            brillo.style.transform = "translate(-50%,-50%) scale(" + (0.6 + avance * 0.5) + ")";
        }
    }

    function terminar() {

        terminado = true;
        corazon.classList.remove("toque");
        corazon.classList.add("lleno");
        cambiarFrase("Diez años… y todavía me late por ti ❤️");

        if (navigator.vibrate) {
            try { navigator.vibrate([60, 80, 60, 80, 120]); } catch (e) {}
        }

        flotarCorazones(18);

        // La música empieza aquí, con el toque de ella
        if (typeof musicaIniciada !== "undefined" && !musicaIniciada) {
            musicaIniciada = true;
            iniciarMusica();
        }

        setTimeout(function() {
            portal.classList.add("saliendo");
            document.body.style.overflow = "";
            setTimeout(function() { portal.classList.add("oculto-total"); }, 1200);
        }, 3000);
    }

    corazon.addEventListener("click", function() {

        if (terminado) {
            return;
        }

        toques++;

        corazon.classList.remove("toque");
        void corazon.offsetWidth;
        corazon.classList.add("toque");

        if (navigator.vibrate) {
            try { navigator.vibrate(30); } catch (e) {}
        }

        actualizar();
        flotarCorazones(3);

        if (toques >= TOTAL) {
            terminar();
        } else {
            cambiarFrase(FRASES[toques - 1]);
        }
    });

})();

// Precarga todas las fotos mientras ella llena el corazón,
// para que los capítulos aparezcan al instante.
window.addEventListener("load", function() {
    document.querySelectorAll("img[src]").forEach(function(img) {
        const copia = new Image();
        copia.src = img.getAttribute("src");
    });
});
