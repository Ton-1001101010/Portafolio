document.addEventListener("DOMContentLoaded", () => {
  let zIndexGlobal = 10;

  // 1. Reloj en la barra de tareas
  function actualizarReloj() {
    const ahora = new Date();
    let horas = ahora.getHours();
    let minutos = ahora.getMinutes();
    const ampm = horas >= 12 ? "PM" : "AM";
    horas = horas % 12 || 12;
    minutos = minutos < 10 ? "0" + minutos : minutos;
    const relojEl = document.getElementById("reloj");
    if (relojEl) relojEl.textContent = `${horas}:${minutos} ${ampm}`;
  }
  setInterval(actualizarReloj, 1000);
  actualizarReloj();

  // 2. Física de Ventanas (Arrastrar, Foco y Cerrar)
  const ventanas = document.querySelectorAll(".window");

  ventanas.forEach((ventana) => {
    const barraTitulo = ventana.querySelector(".title-bar");
    const btnCerrar = ventana.querySelector(".win-btn");
    let isDragging = false,
      offsetX,
      offsetY;

    // Traer al frente al hacer clic
    ventana.addEventListener("mousedown", () => {
      zIndexGlobal++;
      ventana.style.zIndex = zIndexGlobal;
    });

    // Iniciar arrastre
    barraTitulo.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - ventana.offsetLeft;
      offsetY = e.clientY - ventana.offsetTop;
    });

    // Mover ventana
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      ventana.style.left = `${e.clientX - offsetX}px`;
      ventana.style.top = `${e.clientY - offsetY}px`;
    });

    // Soltar ventana
    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Botón de cerrar (X)
    if (btnCerrar) {
      btnCerrar.addEventListener("click", () => {
        ventana.style.display = "none";
      });
    }
  });

  // 3. Iconos del Escritorio
  const iconProyectos = document.getElementById("icon-proyectos");
  const winProyectos = document.getElementById("win-projects");

  const abrirProyectos = () => {
    winProyectos.style.display = "flex";
    zIndexGlobal++;
    winProyectos.style.zIndex = zIndexGlobal;
  };

  if (iconProyectos) {
    iconProyectos.addEventListener("click", abrirProyectos);
    iconProyectos.addEventListener("touchstart", abrirProyectos);
  }

  const iconPapelera = document.getElementById("icon-papelera");
  if (iconPapelera) {
    iconPapelera.addEventListener("dblclick", () => {
      alert("La papelera está vacía.");
    });
  }

  // 4. Lógica del Menú de Inicio
  const startBtn = document.getElementById("start-btn");
  const startMenu = document.getElementById("start-menu");

  if (startBtn && startMenu) {
    startBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (startMenu.style.display === "none") {
        startMenu.style.display = "flex";
        startBtn.classList.add("active");
      } else {
        startMenu.style.display = "none";
        startBtn.classList.remove("active");
      }
    });

    // Cierra el menú si se hace clic fuera de él
    document.addEventListener("click", (e) => {
      if (!startMenu.contains(e.target) && e.target !== startBtn) {
        startMenu.style.display = "none";
        startBtn.classList.remove("active");
      }
    });
  }

  // 5. Opciones dentro del Menú de Inicio
  const abrirVentanaMenu = (idBoton, idVentana) => {
    const boton = document.getElementById(idBoton);
    const ventana = document.getElementById(idVentana);

    if (boton && ventana) {
      boton.addEventListener("click", () => {
        ventana.style.display = "flex";
        zIndexGlobal++;
        ventana.style.zIndex = zIndexGlobal;

        // Ocultar menú tras hacer clic
        if (startMenu) startMenu.style.display = "none";
        if (startBtn) startBtn.classList.remove("active");
      });
    }
  };

  abrirVentanaMenu("menu-stack", "win-stack");
  abrirVentanaMenu("menu-perfil", "win-hero");

  // Botón de Apagar Sistema
  const menuApagar = document.getElementById("menu-apagar");
  if (menuApagar) {
    menuApagar.addEventListener("click", () => {
      // Paso 1: Pantalla azul clásica de XP con tu despedida
      document.body.innerHTML = `
                <div style="height: 100vh; width: 100vw; background-color: #003399; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; font-family: 'Tahoma', sans-serif; cursor: wait; margin: 0; padding: 0;">
                    <h1 id="shutdown-msg" style="font-size: 2.2rem; font-weight: normal; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.6);">Cerrando sesión...</h1>
                    <p style="font-size: 1.2rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.6); color: #d3e5fa;">Fue un placer, Ricardo Luna.</p>
                </div>
            `;

      // Paso 2: Cambiar texto después de 2.5 segundos
      setTimeout(() => {
        const msg = document.getElementById("shutdown-msg");
        if (msg) msg.textContent = "Apagando el equipo...";
      }, 2500);

      // Paso 3: Pantalla negra final (después de 5.5 segundos en total)
      setTimeout(() => {
        document.body.innerHTML = `
                    <div style="height: 100vh; width: 100vw; background-color: black; display: flex; align-items: center; justify-content: center; color: #444; font-family: 'Tahoma', sans-serif; margin: 0;">
                        <p style="font-size: 0.9rem;">Es seguro cerrar esta ventana.</p>
                    </div>
                `;

        // Intenta forzar el cierre de la pestaña (funciona según la configuración del navegador)
        setTimeout(() => {
          window.close();
        }, 1500);
      }, 5500);
    });
  }

  // 6. Contacto: Enlace seguro de WhatsApp (Protección anti-bots)
  const btnWhatsapp = document.getElementById("btn-whatsapp");
  if (btnWhatsapp) {
    // Dividimos el número en partes para romper el patrón que buscan los bots
    const codigoPais = "52"; // Cambia por el de tu país
    const numeroTel = "5512345678"; // Reemplaza con tu número real de 10 dígitos

    // Unimos las partes en una variable
    const urlSegura = "https://wa.me/" + codigoPais + numeroTel;

    // Escuchamos cuando alguien hace clic en el botón
    btnWhatsapp.addEventListener("click", function (event) {
      event.preventDefault(); // Evita que la página salte al inicio
      window.open(urlSegura, "_blank"); // Abre el WhatsApp en una pestaña nueva
    });
  }
});
