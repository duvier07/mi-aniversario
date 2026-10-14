
const boton = document.getElementById("btnComenzar");

const inicio = document.getElementById("inicio");

const capitulo1 = document.getElementById("capitulo1");
const capitulo2 = document.getElementById("capitulo2");
const capitulo3 = document.getElementById("capitulo3");
const capitulo4 = document.getElementById("capitulo4");
const capitulo5 = document.getElementById("capitulo5");
const capitulo6 = document.getElementById("capitulo6");
const carta = document.getElementById("carta");
const invitacion = document.getElementById("invitacion");
const pantallaFinal = document.getElementById("final");

const btnCapitulo2 = document.getElementById("btnCapitulo2");
const btnCapitulo3 = document.getElementById("btnCapitulo3");
const btnCapitulo4 = document.getElementById("btnCapitulo4");
const btnCapitulo5 = document.getElementById("btnCapitulo5");
const btnContinuarCarta = document.getElementById("btnContinuarCarta");
const btnContinuarCapitulo6 = document.getElementById("btnContinuarCapitulo6");
const btnFinal = document.getElementById("btnFinal");
const musica = document.getElementById("musica");
const btnUltimaSorpresa = document.getElementById("btnUltimaSorpresa");

// ==============================
// CONFIGURACIÓN DE LA INVITACIÓN
// ==============================
// Tu número de WhatsApp con código de país, sin "+" ni espacios.
// Ejemplo (Colombia): "573001234567".
// Si lo dejas vacío, el botón "Acepto tu invitación" no aparece.
const NUMERO_WHATSAPP = "573116026953";

const MENSAJE_ACEPTO =
    "Acepto tu invitación ❤️ Esta noche a las 7:00 p. m. " +
    "estaré hermosa y lista para mi sorpresa.";


// ==============================
// NAVEGACIÓN ENTRE CAPÍTULOS
// ==============================

const reducirMovimiento =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;


const ORDEN_CAPITULOS = [
    "capitulo1",
    "capitulo2",
    "capitulo3",
    "capitulo4",
    "capitulo5",
    "capitulo6",
    "carta",
    "final",
    "invitacion"
];

const ORDEN_SECCIONES = ["inicio"].concat(ORDEN_CAPITULOS);


const SECCIONES = {
    inicio: inicio,
    capitulo1: capitulo1,
    capitulo2: capitulo2,
    capitulo3: capitulo3,
    capitulo4: capitulo4,
    capitulo5: capitulo5,
    capitulo6: capitulo6,
    carta: carta,
    invitacion: invitacion,
    final: pantallaFinal
};

const barraProgreso = document.getElementById("barraProgreso");
const btnAtras = document.getElementById("btnAtras");

let seccionActual = "inicio";
let enTransicion = false;
let pausaCartaMostrada = false;

function actualizarBarra(id) {

    if (!barraProgreso) {
        return;
    }

    const indice = ORDEN_CAPITULOS.indexOf(id);

    if (indice < 0) {
        barraProgreso.classList.remove("visible");
        barraProgreso.firstElementChild.style.width = "0%";
        return;
    }

    barraProgreso.classList.add("visible");

    barraProgreso.firstElementChild.style.width =
        ((indice + 1) / ORDEN_CAPITULOS.length * 100) + "%";
}

// Lo que hay que apagar al salir de una pantalla
function alSalir(id) {

    if (id === "capitulo2") {
        limpiarCapitulo2();
    }

    if (id === "carta") {
        saltarCarta = true;
    }

    if (id === "final") {
        detenerCelebracion();
    }
}

// Lo que hay que encender al entrar a una pantalla
function alEntrar(id) {

    if (id === "capitulo2") {
        setTimeout(mostrarRecuerdosBeso, 100);
    }

    if (id === "carta" && !pausaCartaMostrada) {
        pausaCartaMostrada = true;
        secuenciaPausaCarta();
    }

    if (id === "final") {
        prepararFinal();
    }
}

// Sirve para avanzar y para volver atrás
function mostrarCapitulo(actual, siguiente) {

    if (enTransicion || actual === siguiente) {
        return;
    }

    enTransicion = true;

    actualizarBarra(siguiente.id);

    if (actual === carta && typeof hintCarta !== "undefined") {
        hintCarta.hidden = true;
    }

    actual.classList.add("salir");

    setTimeout(function() {

        actual.style.display = "none";
        actual.classList.remove("salir", "aparecer");

        alSalir(actual.id);

        siguiente.style.display = "";
        siguiente.classList.remove("oculto", "aparecer");

        // Reinicia la animación de entrada si ya se había visitado
        void siguiente.offsetWidth;

        siguiente.classList.add("aparecer");

        seccionActual = siguiente.id;
        btnAtras.hidden = (seccionActual === "inicio");

        window.scrollTo(0, 0);

        alEntrar(siguiente.id);

        setTimeout(function() {
            enTransicion = false;
        }, 150);

    }, 700);
}

btnAtras.addEventListener("click", function() {

    const indice = ORDEN_SECCIONES.indexOf(seccionActual);

    if (indice <= 0) {
        return;
    }

    mostrarCapitulo(
        SECCIONES[seccionActual],
        SECCIONES[ORDEN_SECCIONES[indice - 1]]
    );
});

// ==============================
// MÚSICA
// ==============================

const btnMusica = document.getElementById("btnMusica");
let musicaSonando = false;
let pausadaPorSegundoPlano = false;

function actualizarBotonMusica() {
    btnMusica.textContent = musicaSonando ? "🔊" : "🔇";
    btnMusica.classList.toggle("silenciada", !musicaSonando);
    btnMusica.setAttribute(
        "aria-label",
        musicaSonando ? "Pausar música" : "Reproducir música"
    );
}

function iniciarMusica() {
    btnMusica.hidden = false;

    const intento = musica.play();

    if (intento && typeof intento.then === "function") {
        intento.then(function() {
            musicaSonando = true;
            actualizarBotonMusica();
        }).catch(function() {
            musicaSonando = false;
            actualizarBotonMusica();
        });
    } else {
        musicaSonando = true;
        actualizarBotonMusica();
    }
}

btnMusica.addEventListener("click", function() {

    if (musicaSonando) {
        musica.pause();
        musicaSonando = false;
    } else {
        musica.play().catch(function() {});
        musicaSonando = true;
    }

    pausadaPorSegundoPlano = false;
    actualizarBotonMusica();
});

// Si ella cambia de app o bloquea el celular, la música se pausa
document.addEventListener("visibilitychange", function() {

    if (document.hidden && musicaSonando) {
        musica.pause();
        pausadaPorSegundoPlano = true;
    } else if (!document.hidden && pausadaPorSegundoPlano) {
        musica.play().catch(function() {});
        pausadaPorSegundoPlano = false;
    }

});

// ==============================
// INICIO
// ==============================

let musicaIniciada = false;

function secuenciaPausaCarta() {

    setTimeout(function() {
        pausaCarta.classList.add("mostrar");

        setTimeout(function() {
            pausaCarta.classList.add("ocultar");

            setTimeout(function() {
                pausaCarta.style.display = "none";
            }, 1000);

        }, 3500);

    }, 100);
}

boton.addEventListener("click", function() {

    // La música se enciende solo la primera vez, así respetamos
    // que ella la silencie si vuelve a la portada.
    if (!musicaIniciada) {
        musicaIniciada = true;
        iniciarMusica();
    }

    mostrarCapitulo(inicio, capitulo1);
});


btnCapitulo2.addEventListener("click", function() {

    mostrarCapitulo(capitulo1, capitulo2);

});


btnCapitulo3.addEventListener("click", function() {

    mostrarCapitulo(capitulo2, capitulo3);

});


btnCapitulo4.addEventListener("click", function() {

    mostrarCapitulo(capitulo3, capitulo4);

});


btnCapitulo5.addEventListener("click", function() {

    mostrarCapitulo(capitulo4, capitulo5);

});

btnContinuarCapitulo6.addEventListener("click", function() {

    mostrarCapitulo(capitulo5, capitulo6);

});

btnContinuarCarta.addEventListener("click", function() {
    mostrarCapitulo(capitulo6, carta);
});

btnFinal.addEventListener("click", function() {
    mostrarCapitulo(carta, pantallaFinal);
});

btnUltimaSorpresa.addEventListener("click", function() {
    mostrarCapitulo(pantallaFinal, invitacion);
});

// ==============================
// INVITACIÓN — LA VELA
// ==============================

const vela = document.getElementById("vela");
const btnInvitacion = document.getElementById("btnInvitacion");
const btnAceptar = document.getElementById("btnAceptar");
const botonesInvitacion = document.querySelector(".inv-botones");

let velaEncendida = false;

function encenderVela() {

    if (velaEncendida) {
        return;
    }

    velaEncendida = true;

    if (navigator.vibrate) {
        try { navigator.vibrate([25, 60, 25]); } catch (e) {}
    }

    invitacion.classList.add("encendida");

    setTimeout(function() {
        botonesInvitacion.classList.add("listos");
    }, reducirMovimiento ? 0 : 5800);

    // Cuando ya apareció todo, mostramos los botones si quedaron abajo
    setTimeout(function() {
        if (seccionActual === "invitacion") {
            botonesInvitacion.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }, reducirMovimiento ? 400 : 6800);
}

vela.addEventListener("click", encenderVela);

vela.addEventListener("keydown", function(evento) {
    if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        encenderVela();
    }
});


// Acepta el número con "+", espacios o guiones, y agrega el 57
// de Colombia si escribiste solo los 10 dígitos del celular.
function limpiarNumero(numero) {

    let digitos = String(numero).replace(/\D/g, "");

    if (digitos.length === 10 && digitos.charAt(0) === "3") {
        digitos = "57" + digitos;
    }

    return digitos;
}

const numeroWhatsapp = limpiarNumero(NUMERO_WHATSAPP);

if (numeroWhatsapp) {

    btnAceptar.href =
        "https://wa.me/" + numeroWhatsapp +
        "?text=" + encodeURIComponent(MENSAJE_ACEPTO);

    btnAceptar.hidden = false;
}


const recuerdos = document.querySelectorAll(".recuerdo");

const observador = new IntersectionObserver(
    function(entradas) {
        entradas.forEach(function(entrada) {

            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
            }

        });
    },
    {
        threshold: 0.2
    }
);

recuerdos.forEach(function(recuerdo) {
    observador.observe(recuerdo);
});

const hijas = document.querySelectorAll(".hija");

const observadorHijas = new IntersectionObserver(
    function(entradas) {
        entradas.forEach(function(entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
            }
        });
    },
    {
        threshold: 0.2
    }
);

hijas.forEach(function(hija) {
    observadorHijas.observe(hija);
});

const visorFoto = document.getElementById("visorFoto");
const fotoAmpliada = document.getElementById("fotoAmpliada");
const tituloFoto = document.getElementById("tituloFoto");
const descripcionFoto = document.getElementById("descripcionFoto");
const fotosRecuerdos = document.querySelectorAll(
    "#capitulo4 .recuerdo img"
);


fotosRecuerdos.forEach(function(foto) {

    foto.addEventListener("click", function() {

        fotoAmpliada.src = foto.src;
        fotoAmpliada.alt = foto.alt;

        const recuerdo = foto.parentElement;

        tituloFoto.textContent = recuerdo.querySelector("h3").textContent;
        descripcionFoto.textContent = recuerdo.querySelector(".descripcion-recuerdo").textContent;

        visorFoto.classList.add("activo");
        history.pushState({ visorFoto: true }, "");
    });

});

visorFoto.addEventListener("click", function(event) {

    if (event.target === visorFoto) {
        history.back();
    }

});

window.addEventListener("popstate", function() {

    visorFoto.classList.remove("activo");

});

// ==============================
// PAUSA ANTES DE LA CARTA Y APERTURA DEL SOBRE
// ==============================

const sobre = document.getElementById("sobre");
const sobreContenedor = document.getElementById("sobreContenedor");
const contenidoCarta = document.getElementById("contenidoCarta");
const pausaCarta = document.getElementById("pausaCarta");


let sobreAbierto = false;

sobre.addEventListener("click", function() {

    if (sobreAbierto) {
        return;
    }

    sobreAbierto = true;

    // Vibración corta, como un latido (solo en celulares que la permiten)
    if (navigator.vibrate) {
        try { navigator.vibrate([35, 70, 35]); } catch (e) {}
    }

    sobre.classList.add("abierto");

    setTimeout(function() {
        sobreContenedor.classList.add("sobre-abierto");

    }, 900);

    setTimeout(function() {

        const parrafos = prepararCarta();

        contenidoCarta.classList.add("escribiendo", "carta-visible");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        setTimeout(function() {
            escribirCarta(parrafos);
        }, 1100);

    }, 1500);

});

// =========================================
// CARTA QUE SE ESCRIBE SOLA
// =========================================

const hintCarta = document.getElementById("hintCarta");
let saltarCarta = false;

function pausa(ms) {
    return new Promise(function(resolver) {
        setTimeout(resolver, ms);
    });
}

function prepararCarta() {

    const parrafos = Array.from(
        contenidoCarta.querySelectorAll(".texto")
    );

    parrafos.forEach(function(p) {
        p.dataset.txt = p.textContent.replace(/\s+/g, " ").trim();
        p.textContent = "";
    });

    return parrafos;
}

function seguirEscritura(elemento) {

    const caja = elemento.getBoundingClientRect();
    const limite = window.innerHeight * 0.78;

    if (caja.bottom > limite) {
        window.scrollBy({
            top: caja.bottom - limite + 40,
            behavior: "smooth"
        });
    }
}

async function escribirCarta(parrafos) {

    hintCarta.hidden = false;

    contenidoCarta.addEventListener("click", function(evento) {
        if (!evento.target.closest("button")) {
            saltarCarta = true;
        }
    });

    const cursor = document.createElement("span");
    cursor.className = "cursor-carta";
    cursor.textContent = "|";

    for (const p of parrafos) {

        const texto = p.dataset.txt;
        const nodo = document.createTextNode("");

        p.append(nodo, cursor);

        if (saltarCarta || reducirMovimiento) {
            nodo.data = texto;
            continue;
        }

        const base = p.classList.contains("destacado") ? 34 : 24;

        for (let i = 0; i < texto.length; i++) {

            if (saltarCarta) {
                nodo.data = texto;
                break;
            }

            nodo.data = texto.slice(0, i + 1);

            if (i % 18 === 0) {
                seguirEscritura(p);
            }

            const letra = texto[i];
            let extra = 0;

            if (",;:".includes(letra)) {
                extra = 130;
            } else if (".!?…".includes(letra)) {
                extra = 300;
            }

            await pausa(base + extra);
        }

        seguirEscritura(p);

        if (!saltarCarta) {
            await pausa(p.classList.contains("destacado") ? 650 : 420);
        }
    }

    cursor.remove();
    hintCarta.hidden = true;
    contenidoCarta.classList.add("fin-escritura");

    btnFinal.scrollIntoView({ behavior: "smooth", block: "center" });
}

// =========================================
// CAPÍTULO 2 — RECUERDOS COMO DESTELLOS
// =========================================

const recuerdosBeso = document.querySelectorAll(".recuerdo-beso");
const escenaBeso = document.querySelector(".escena-beso");
const fotoPrincipalBeso =
    document.querySelector(".foto-beso-principal");

const canvasCorazon =
    document.getElementById("corazonParticulas");

const contextoCorazon =
    canvasCorazon ? canvasCorazon.getContext("2d") : null;


let animacionCorazon = null;
let particulasCorazon = [];
let temporizadoresBeso = [];


/* =========================================
   POSICIONES DE LOS RECUERDOS
   ========================================= */

const posicionesBeso = [
    { x: 8,  y: 10, r: -8 },
    { x: 92, y: 10, r: 7 },

    { x: 5,  y: 30, r: 6 },
    { x: 95, y: 30, r: -7 },

    { x: 7,  y: 52, r: -6 },
    { x: 93, y: 52, r: 7 },

    { x: 8,  y: 75, r: 5 },
    { x: 92, y: 75, r: -6 },

    { x: 23, y: 7,  r: -5 },
    { x: 77, y: 7,  r: 5 },

    { x: 22, y: 93, r: 6 },
    { x: 78, y: 93, r: -5 },

    { x: 5,  y: 42, r: -7 },
    { x: 95, y: 42, r: 7 }
];

/* =========================================
   MOSTRAR RECUERDOS
   ========================================= */

function mostrarRecuerdosBeso() {

    if (!escenaBeso || recuerdosBeso.length === 0) {
        return;
    }

    temporizadoresBeso.forEach(clearTimeout);
    temporizadoresBeso = [];

    // Primero aparece la fotografía principal
    mostrarFotoPrincipalBeso();

    // Después comienzan a aparecer los pequeños recuerdos
    recuerdosBeso.forEach(function(foto, indice) {

        const posicion = posicionesBeso[indice];

        temporizadoresBeso.push(setTimeout(function() {

            if (!posicion) {
                return;
            }

            foto.style.left = posicion.x + "%";
            foto.style.top = posicion.y + "%";

            foto.style.setProperty(
                "--rotacion",
                posicion.r + "deg"
            );

            foto.classList.remove("desaparecer");
            foto.classList.add("destello");

            // Cada recuerdo desaparece después de mostrarse
            temporizadoresBeso.push(setTimeout(function() {

                foto.classList.remove("destello");
                foto.classList.add("desaparecer");

            }, 2800));

        }, 1200 + indice * 1450));

    });
}


/* =========================================
   LIMPIAR EL CAPÍTULO 2 (al salir o volver atrás)
   ========================================= */

function limpiarCapitulo2() {

    temporizadoresBeso.forEach(clearTimeout);
    temporizadoresBeso = [];

    recuerdosBeso.forEach(function(foto) {
        foto.classList.remove("destello", "desaparecer");
    });

    if (animacionCorazon) {
        cancelAnimationFrame(animacionCorazon);
        animacionCorazon = null;
    }

    if (canvasCorazon) {
        canvasCorazon.classList.remove("activo");

        if (contextoCorazon) {
            contextoCorazon.clearRect(0, 0, anchoCorazon, altoCorazon);
        }
    }

    if (fotoPrincipalBeso) {
        fotoPrincipalBeso.classList.remove("protagonista-visible");
        fotoPrincipalBeso.style.removeProperty("--latido");
    }
}


/* =========================================
   FOTO PRINCIPAL
   ========================================= */

function mostrarFotoPrincipalBeso() {

    if (!fotoPrincipalBeso) {
        return;
    }


    fotoPrincipalBeso.classList.add(
        "protagonista-visible"
    );


    iniciarCorazonParticulas();
}


/* =========================================
   CORAZÓN DE PARTÍCULAS (grande y que late)
   ========================================= */

let spriteBrillo = null;
let anchoCorazon = 0;
let altoCorazon = 0;
let centroCorazon = { x: 0, y: 0 };

function crearSpriteBrillo() {

    if (spriteBrillo) {
        return spriteBrillo;
    }

    const lienzo = document.createElement("canvas");
    lienzo.width = lienzo.height = 48;

    const c = lienzo.getContext("2d");
    const degradado = c.createRadialGradient(24, 24, 0, 24, 24, 24);

    degradado.addColorStop(0, "rgba(255, 238, 247, 1)");
    degradado.addColorStop(0.25, "rgba(255, 150, 195, 0.85)");
    degradado.addColorStop(1, "rgba(255, 110, 180, 0)");

    c.fillStyle = degradado;
    c.fillRect(0, 0, 48, 48);

    spriteBrillo = lienzo;
    return spriteBrillo;
}

function iniciarCorazonParticulas() {

    if (!canvasCorazon || !contextoCorazon || !escenaBeso) {
        return;
    }

    const ancho = escenaBeso.clientWidth;
    const alto = escenaBeso.clientHeight;

    if (!ancho || !alto) {
        return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvasCorazon.width = Math.round(ancho * dpr);
    canvasCorazon.height = Math.round(alto * dpr);
    contextoCorazon.setTransform(dpr, 0, 0, dpr, 0, 0);

    anchoCorazon = ancho;
    altoCorazon = alto;

    // Corazón alto, que llena la escena y rodea la foto
    const estiramiento = 1.15;

    const escala = Math.min(
        ancho / 33,
        (alto * 0.9) / (29.5 * estiramiento)
    );

    centroCorazon = {
        x: ancho / 2,
        y: alto / 2 - 2.4 * escala * estiramiento
    };

    particulasCorazon = [];

    const total = ancho < 500 ? 320 : 460;

    for (let i = 0; i < total; i++) {

        const t = Math.random() * Math.PI * 2;

        const x = 16 * Math.pow(Math.sin(t), 3);

        const y = -(
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t)
        );

        // La mayoría sobre el contorno; el resto, destellos adentro
        const enBorde = Math.random() < 0.68;

        const profundidad = enBorde
            ? 0.94 + Math.random() * 0.1
            : Math.sqrt(Math.random()) * 0.9;

        particulasCorazon.push({
            dx: x * escala * profundidad,
            dy: y * escala * profundidad * estiramiento,
            radio: enBorde ? Math.random() * 2.2 + 1.2 : Math.random() * 1.6 + 0.8,
            velocidad: Math.random() * 0.9 + 0.4,
            fase: Math.random() * Math.PI * 2,
            alfa: enBorde ? 0.55 + Math.random() * 0.4 : 0.25 + Math.random() * 0.3
        });
    }

    canvasCorazon.classList.add("activo");

    if (animacionCorazon) {
        cancelAnimationFrame(animacionCorazon);
    }

    animarCorazon();
}

function animarCorazon() {

    if (!canvasCorazon || !contextoCorazon) {
        return;
    }

    const ctx = contextoCorazon;
    const sprite = crearSpriteBrillo();

    ctx.clearRect(0, 0, anchoCorazon, altoCorazon);

    const segundos = Date.now() * 0.001;

    // Latido de dos golpes: "lub-dub"
    let latido = 1;

    if (!reducirMovimiento) {
        const fase = (segundos % 1.4) / 1.4;

        latido +=
            0.07 * Math.exp(-Math.pow((fase - 0.1) / 0.07, 2)) +
            0.045 * Math.exp(-Math.pow((fase - 0.3) / 0.07, 2));
    }

    ctx.globalCompositeOperation = "lighter";

    particulasCorazon.forEach(function(p) {

        const x = centroCorazon.x + p.dx * latido +
            Math.sin(segundos * p.velocidad * 1.6 + p.fase) * 2.2;

        const y = centroCorazon.y + p.dy * latido +
            Math.cos(segundos * p.velocidad * 1.4 + p.fase) * 2.2;

        const tam = p.radio * 7;

        ctx.globalAlpha = Math.min(1, p.alfa * (1 + (latido - 1) * 4));

        ctx.drawImage(sprite, x - tam / 2, y - tam / 2, tam, tam);
    });

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    // La foto late y brilla al mismo ritmo que el corazón
    if (fotoPrincipalBeso) {
        fotoPrincipalBeso.style.setProperty(
            "--latido",
            (latido - 1).toFixed(4)
        );
    }

    animacionCorazon = requestAnimationFrame(animarCorazon);
}

let temporizadorRedimension = null;

window.addEventListener("resize", function() {

    clearTimeout(temporizadorRedimension);

    temporizadorRedimension = setTimeout(function() {
        if (animacionCorazon) {
            iniciarCorazonParticulas();
        }
        ajustarLienzoCelebracion();
    }, 200);
});

/* =========================================
   FINAL — CONTADOR Y CELEBRACIÓN
   ========================================= */

function plural(n, singular, pluralTxt) {
    return n + " " + (n === 1 ? singular : pluralTxt);
}

function textoContador() {

    const inicioBoda = new Date(2016, 11, 17);
    const hoy = new Date();

    let anios = hoy.getFullYear() - inicioBoda.getFullYear();
    let meses = hoy.getMonth() - inicioBoda.getMonth();
    let dias = hoy.getDate() - inicioBoda.getDate();

    if (dias < 0) {
        meses--;
        dias += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
    }

    if (meses < 0) {
        anios--;
        meses += 12;
    }

    const hoyFijo = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const totalDias = Math.round((hoyFijo - inicioBoda) / 86400000);

    const diasTxt = totalDias.toLocaleString("es-CO") + " días de la mano";

    if (anios >= 1 && meses === 0 && dias === 0) {
        return "Hoy cumplimos <strong>exactamente " +
            plural(anios, "año", "años") +
            "</strong> de casados ❤️<small>" + diasTxt + "</small>";
    }

    return "Llevamos <strong>" +
        plural(anios, "año", "años") + ", " +
        plural(meses, "mes", "meses") + " y " +
        plural(dias, "día", "días") +
        "</strong> de casados<small>" + diasTxt + "</small>";
}

const lienzoCelebracion = document.getElementById("celebracion");
const ctxCelebracion = lienzoCelebracion ? lienzoCelebracion.getContext("2d") : null;

const COLORES_CONFETI = ["#ff7eb6", "#ffc2dc", "#f5d28a", "#ffffff", "#e84a8a", "#ffa6c9"];

let confeti = [];
let petalos = [];
let animacionCelebracion = null;
let celebracionActiva = false;
let anchoCel = 0;
let altoCel = 0;
let ultimoPetalo = 0;
let ultimoCuadro = 0;

function ajustarLienzoCelebracion() {

    if (!lienzoCelebracion) {
        return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    anchoCel = window.innerWidth;
    altoCel = window.innerHeight;

    lienzoCelebracion.width = Math.round(anchoCel * dpr);
    lienzoCelebracion.height = Math.round(altoCel * dpr);

    ctxCelebracion.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function lanzarConfeti(posX, anguloGrados, cantidad) {

    const velocidadBase = Math.sqrt(0.26 * altoCel) * 1.15;

    for (let i = 0; i < cantidad; i++) {

        const angulo = (anguloGrados + (Math.random() - 0.5) * 55) * Math.PI / 180;
        const velocidad = velocidadBase * (0.55 + Math.random() * 0.55);

        confeti.push({
            x: posX * anchoCel,
            y: altoCel + 10,
            vx: Math.cos(angulo) * velocidad,
            vy: Math.sin(angulo) * velocidad,
            rot: Math.random() * Math.PI * 2,
            vr: (Math.random() - 0.5) * 0.3,
            tam: Math.random() * 6 + 5,
            color: COLORES_CONFETI[Math.floor(Math.random() * COLORES_CONFETI.length)],
            corazon: Math.random() < 0.3,
            vida: 1
        });
    }
}

function nuevoPetalo() {

    petalos.push({
        x: Math.random() * anchoCel,
        y: -20,
        vy: Math.random() * 0.7 + 0.5,
        deriva: Math.random() * Math.PI * 2,
        velDeriva: Math.random() * 0.02 + 0.01,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.04,
        tam: Math.random() * 6 + 6,
        corazon: Math.random() < 0.4,
        alfa: Math.random() * 0.3 + 0.5
    });
}

function trazarCorazon(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.9);
    ctx.bezierCurveTo(-s * 1.2, s * 0.1, -s * 0.7, -s * 0.8, 0, -s * 0.25);
    ctx.bezierCurveTo(s * 0.7, -s * 0.8, s * 1.2, s * 0.1, 0, s * 0.9);
    ctx.fill();
}

function bucleCelebracion(ahora) {

    const dt = Math.min(3, (ahora - ultimoCuadro) / 16.67 || 1);
    ultimoCuadro = ahora;

    const ctx = ctxCelebracion;

    ctx.clearRect(0, 0, anchoCel, altoCel);

    if (celebracionActiva && petalos.length < 26 && ahora - ultimoPetalo > 420) {
        nuevoPetalo();
        ultimoPetalo = ahora;
    }

    confeti = confeti.filter(function(p) {

        p.vx *= Math.pow(0.992, dt);
        p.vy = p.vy * Math.pow(0.992, dt) + 0.22 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;

        if (p.vy > 0) {
            p.vida -= 0.006 * dt;
        }

        if (p.vida <= 0 || p.y > altoCel + 30) {
            return false;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.vida * 1.5));
        ctx.fillStyle = p.color;

        if (p.corazon) {
            trazarCorazon(ctx, p.tam * 0.8);
        } else {
            ctx.fillRect(-p.tam / 2, -p.tam / 4, p.tam, p.tam / 2);
        }

        ctx.restore();
        return true;
    });

    petalos = petalos.filter(function(p) {

        p.deriva += p.velDeriva * dt;
        p.x += Math.sin(p.deriva) * 0.6 * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;

        if (p.y > altoCel + 30) {
            return false;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alfa;
        ctx.fillStyle = p.corazon ? "#ff7eb6" : "#ffc2dc";

        if (p.corazon) {
            trazarCorazon(ctx, p.tam * 0.7);
        } else {
            ctx.beginPath();
            ctx.ellipse(0, 0, p.tam * 0.45, p.tam, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
        return true;
    });

    ctx.globalAlpha = 1;

    animacionCelebracion = requestAnimationFrame(bucleCelebracion);
}

function detenerCelebracion() {

    celebracionActiva = false;
    confeti = [];
    petalos = [];

    if (animacionCelebracion) {
        cancelAnimationFrame(animacionCelebracion);
        animacionCelebracion = null;
    }

    if (ctxCelebracion) {
        ctxCelebracion.clearRect(0, 0, anchoCel, altoCel);
    }
}

function iniciarCelebracion() {

    if (!ctxCelebracion || reducirMovimiento || celebracionActiva) {
        return;
    }

    // Si ella ya salió de la pantalla final, no hacemos nada
    if (seccionActual !== "final") {
        return;
    }

    celebracionActiva = true;
    confeti = [];
    petalos = [];

    ajustarLienzoCelebracion();

    lanzarConfeti(0.1, -62, 70);
    lanzarConfeti(0.9, -118, 70);

    setTimeout(function() {
        if (celebracionActiva) {
            lanzarConfeti(0.1, -65, 40);
            lanzarConfeti(0.9, -115, 40);
        }
    }, 1600);

    setTimeout(function() {
        if (celebracionActiva) {
            lanzarConfeti(0.5, -90, 60);
        }
    }, 4200);

    if (!animacionCelebracion) {
        animacionCelebracion = requestAnimationFrame(bucleCelebracion);
    }
}

function prepararFinal() {

    const contador = document.getElementById("contadorFinal");

    if (contador) {
        contador.innerHTML = textoContador();
    }

    setTimeout(iniciarCelebracion, 900);
}
