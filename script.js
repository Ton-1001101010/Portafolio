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

  // 2. Física de Ventanas (Arrastrar, Foco y Cerrar) - ¡ACTUALIZADO PARA MÓVILES!
  const ventanas = document.querySelectorAll(".window");

  ventanas.forEach((ventana) => {
    const barraTitulo = ventana.querySelector(".title-bar");
    const btnCerrar = ventana.querySelector(".win-btn");
    let isDragging = false,
      offsetX,
      offsetY;

    // Función para traer la ventana al frente
    const traerAlFrente = () => {
      zIndexGlobal++;
      ventana.style.zIndex = zIndexGlobal;
    };

    // Traer al frente al hacer clic (mouse) o tocar (móvil)
    ventana.addEventListener("mousedown", traerAlFrente);
    ventana.addEventListener("touchstart", traerAlFrente, { passive: true });

    // --- EVENTOS DE MOUSE (PC) ---
    barraTitulo.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - ventana.offsetLeft;
      offsetY = e.clientY - ventana.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      ventana.style.left = `${e.clientX - offsetX}px`;
      ventana.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // --- EVENTOS TÁCTILES (MÓVIL) ---
    barraTitulo.addEventListener(
      "touchstart",
      (e) => {
        isDragging = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - ventana.offsetLeft;
        offsetY = touch.clientY - ventana.offsetTop;
      },
      { passive: false },
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;

        // Crucial: Evita que la pantalla haga scroll al mover la ventana
        if (e.cancelable) {
          e.preventDefault();
        }

        const touch = e.touches[0];
        ventana.style.left = `${touch.clientX - offsetX}px`;
        ventana.style.top = `${touch.clientY - offsetY}px`;
      },
      { passive: false },
    );

    document.addEventListener("touchend", () => {
      isDragging = false;
    });

    // --- Botón de cerrar (X) ---
    if (btnCerrar) {
      btnCerrar.addEventListener("click", () => {
        ventana.style.display = "none";
      });
      // Soporte táctil extra para el botón de cerrar
      btnCerrar.addEventListener("touchend", (e) => {
        e.preventDefault();
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
    iconProyectos.addEventListener("touchstart", (e) => {
      // Evitamos doble disparo del evento
      e.preventDefault();
      abrirProyectos();
    });
  }

  const iconPapelera = document.getElementById("icon-papelera");
  if (iconPapelera) {
    iconPapelera.addEventListener("dblclick", () => {
      alert("La papelera está vacía.");
    });

    // Doble toque simulado para dispositivos móviles
    let lastTouchTime = 0;
    iconPapelera.addEventListener("touchend", (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTouchTime;
      if (tapLength < 500 && tapLength > 0) {
        alert("La papelera está vacía.");
        e.preventDefault();
      }
      lastTouchTime = currentTime;
    });
  }

  // 4. Lógica del Menú de Inicio
  const startBtn = document.getElementById("start-btn");
  const startMenu = document.getElementById("start-menu");

  if (startBtn && startMenu) {
    const alternarMenu = (e) => {
      e.stopPropagation();
      e.preventDefault(); // Mejor respuesta táctil
      if (
        startMenu.style.display === "none" ||
        startMenu.style.display === ""
      ) {
        startMenu.style.display = "flex";
        startBtn.classList.add("active");
      } else {
        startMenu.style.display = "none";
        startBtn.classList.remove("active");
      }
    };

    startBtn.addEventListener("click", alternarMenu);
    startBtn.addEventListener("touchstart", alternarMenu, { passive: false });

    // Cierra el menú si se hace clic fuera de él
    document.addEventListener("click", (e) => {
      if (!startMenu.contains(e.target) && e.target !== startBtn) {
        startMenu.style.display = "none";
        startBtn.classList.remove("active");
      }
    });
    document.addEventListener(
      "touchstart",
      (e) => {
        if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
          startMenu.style.display = "none";
          startBtn.classList.remove("active");
        }
      },
      { passive: true },
    );
  }

  // 5. Opciones dentro del Menú de Inicio
  const abrirVentanaMenu = (idBoton, idVentana) => {
    const boton = document.getElementById(idBoton);
    const ventana = document.getElementById(idVentana);

    const ejecutarApertura = (e) => {
      e.preventDefault();
      ventana.style.display = "flex";
      zIndexGlobal++;
      ventana.style.zIndex = zIndexGlobal;

      // Ocultar menú tras hacer clic
      if (startMenu) startMenu.style.display = "none";
      if (startBtn) startBtn.classList.remove("active");
    };

    if (boton && ventana) {
      boton.addEventListener("click", ejecutarApertura);
      boton.addEventListener("touchstart", ejecutarApertura, {
        passive: false,
      });
    }
  };

  abrirVentanaMenu("menu-stack", "win-stack");
  abrirVentanaMenu("menu-perfil", "win-hero");

  // Botón de Apagar Sistema
  const menuApagar = document.getElementById("menu-apagar");

  const ejecutarApagado = (e) => {
    if (e) e.preventDefault();
    document.body.innerHTML = `
      <div style="height: 100vh; width: 100vw; background-color: #003399; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; font-family: 'Tahoma', sans-serif; cursor: wait; margin: 0; padding: 0;">
          <h1 id="shutdown-msg" style="font-size: 2.2rem; font-weight: normal; margin-bottom: 15px; text-shadow: 2px 2px 4px rgba(0,0,0,0.6);">Cerrando sesión...</h1>
          <p style="font-size: 1.2rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.6); color: #d3e5fa;">Fue un placer, Ricardo Luna.</p>
      </div>
    `;

    setTimeout(() => {
      const msg = document.getElementById("shutdown-msg");
      if (msg) msg.textContent = "Apagando el equipo...";
    }, 2500);

    setTimeout(() => {
      document.body.innerHTML = `
        <div style="height: 100vh; width: 100vw; background-color: black; display: flex; align-items: center; justify-content: center; color: #444; font-family: 'Tahoma', sans-serif; margin: 0;">
            <p style="font-size: 0.9rem;">Es seguro cerrar esta ventana.</p>
        </div>
      `;
      setTimeout(() => {
        window.close();
      }, 1500);
    }, 5500);
  };

  if (menuApagar) {
    menuApagar.addEventListener("click", ejecutarApagado);
    menuApagar.addEventListener("touchstart", ejecutarApagado, {
      passive: false,
    });
  }

  // 6. Contacto: Enlace seguro de WhatsApp
  const btnWhatsapp = document.getElementById("btn-whatsapp");
  if (btnWhatsapp) {
    const codigoPais = "52";
    const numeroTel = "5534304784";
    const urlSegura = "https://wa.me/" + codigoPais + numeroTel;

    const abrirWhatsapp = (event) => {
      event.preventDefault();
      window.open(urlSegura, "_blank");
    };

    btnWhatsapp.addEventListener("click", abrirWhatsapp);
    btnWhatsapp.addEventListener("touchstart", abrirWhatsapp, {
      passive: false,
    });
  }
});
