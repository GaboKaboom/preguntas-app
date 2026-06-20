document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------------------
    // 1. SISTEMA DE NAVEGACIÓN DE DIAPOSITIVAS
    // -------------------------------------------------------------
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const drawerItems = document.querySelectorAll(".drawer-item");
    
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const slideIndicatorNum = document.querySelector("#slideIndicator span");
    
    let currentSlideIndex = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
        // Asegurar límites
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;

        // Desactivar diapositiva anterior
        slides[currentSlideIndex].classList.remove("active");
        dots[currentSlideIndex].classList.remove("active");
        drawerItems[currentSlideIndex].classList.remove("active");

        // Guardar nuevo índice
        currentSlideIndex = index;

        // Activar nueva diapositiva
        slides[currentSlideIndex].classList.add("active");
        dots[currentSlideIndex].classList.add("active");
        drawerItems[currentSlideIndex].classList.add("active");

        // Actualizar número en el indicador inferior
        slideIndicatorNum.textContent = currentSlideIndex + 1;

        // Habilitar/Deshabilitar botones de navegación
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === totalSlides - 1;

        // Lógica de animaciones específicas de diapositivas
        handleSlideAnimations(currentSlideIndex + 1);
    }

    // Navegar al Siguiente/Anterior
    function nextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            showSlide(currentSlideIndex + 1);
        }
    }

    function prevSlide() {
        if (currentSlideIndex > 0) {
            showSlide(currentSlideIndex - 1);
        }
    }

    // Controladores de eventos de Botones
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    // Navegación por Teclado (Flechas y Espacio)
    document.addEventListener("keydown", (e) => {
        // Evitar el comportamiento por defecto si se presiona la barra espaciadora en campos de entrada
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
            return;
        }

        if (e.key === "ArrowRight") {
            nextSlide();
        } else if (e.key === "ArrowLeft") {
            prevSlide();
        } else if (e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            nextSlide();
        }
    });

    // Navegación por clics en los Puntos Inferiores
    dots.forEach((dot, idx) => {
        dot.addEventListener("click", () => showSlide(idx));
    });

    // -------------------------------------------------------------
    // 2. MENÚ LATERAL (DRAWER)
    // -------------------------------------------------------------
    const navDrawer = document.getElementById("navDrawer");
    const drawerToggle = document.getElementById("drawerToggle");
    const drawerClose = document.getElementById("drawerClose");

    function openDrawer() {
        navDrawer.classList.add("open");
    }

    function closeDrawer() {
        navDrawer.classList.remove("open");
    }

    drawerToggle.addEventListener("click", openDrawer);
    drawerClose.addEventListener("click", closeDrawer);

    // Cerrar el Drawer haciendo clic fuera del mismo
    document.addEventListener("click", (e) => {
        if (navDrawer.classList.contains("open") && 
            !navDrawer.contains(e.target) && 
            !drawerToggle.contains(e.target)) {
            closeDrawer();
        }
    });

    // Salto directo entre diapositivas desde el Drawer
    drawerItems.forEach((item, idx) => {
        item.addEventListener("click", () => {
            showSlide(idx);
            closeDrawer();
        });
    });

    // -------------------------------------------------------------
    // 3. DIAPOSITIVA 3: CALCULADORA INTERACTIVA DE ACUMULACIÓN
    // -------------------------------------------------------------
    const weeksSlider = document.getElementById("weeksSlider");
    const weeksVal = document.getElementById("weeksVal");
    const calcMin = document.getElementById("calcMin");
    const calcMax = document.getElementById("calcMax");

    // Constantes matemáticas de la presentación:
    // Cancha Verde Grande = 11 m3 de caucho.
    // Generación por m3 = de 0.02g a 2g por semana.
    // Mínimo semanal cancha = 11 * 0.02 = 0.22 g por semana
    // Máximo semanal cancha = 11 * 2.0 = 22.0 g por semana
    const MIN_WEEKLY = 0.22;
    const MAX_WEEKLY = 22.0;

    weeksSlider.addEventListener("input", (e) => {
        const weeks = parseInt(e.target.value);
        
        // Actualizar texto descriptivo
        weeksVal.textContent = weeks === 1 ? "1 semana" : `${weeks} semanas`;

        // Calcular valores
        const minVal = weeks * MIN_WEEKLY;
        const maxVal = weeks * MAX_WEEKLY;

        // Mostrar resultados con 2 decimales
        calcMin.textContent = `${minVal.toFixed(2)} g`;
        calcMax.textContent = `${maxVal.toFixed(2)} g`;
    });

    // -------------------------------------------------------------
    // 4. DIAPOSITIVA 4: INTERACTIVIDAD DE TABLA Y GRÁFICO
    // -------------------------------------------------------------
    const tableRows = document.querySelectorAll("#sourcesTable tbody tr");
    const chartRows = document.querySelectorAll("#barChart .chart-row");

    // Sincronizar Hover/Clic desde la Tabla hacia el Gráfico
    tableRows.forEach(row => {
        const sourceName = row.getAttribute("data-source");
        
        row.addEventListener("mouseenter", () => {
            highlightSource(sourceName);
        });

        row.addEventListener("mouseleave", () => {
            clearHighlight();
        });

        row.addEventListener("click", () => {
            highlightSource(sourceName, true);
        });
    });

    // Sincronizar Hover/Clic desde el Gráfico hacia la Tabla
    chartRows.forEach(row => {
        const sourceName = row.getAttribute("data-source");

        row.addEventListener("mouseenter", () => {
            highlightSource(sourceName);
        });

        row.addEventListener("mouseleave", () => {
            clearHighlight();
        });

        row.addEventListener("click", () => {
            highlightSource(sourceName, true);
        });
    });

    function highlightSource(source, persist = false) {
        // Limpiar estados anteriores si no es persistente
        if (!persist) {
            clearHighlight();
        }

        // Resaltar en Tabla
        tableRows.forEach(r => {
            if (r.getAttribute("data-source") === source) {
                r.classList.add("highlighted");
            } else if (persist) {
                r.classList.remove("highlighted");
            }
        });

        // Resaltar en Gráfico
        chartRows.forEach(r => {
            if (r.getAttribute("data-source") === source) {
                r.classList.add("highlighted");
            } else if (persist) {
                r.classList.remove("highlighted");
            }
        });
    }

    function clearHighlight() {
        tableRows.forEach(r => r.classList.remove("highlighted"));
        chartRows.forEach(r => r.classList.remove("highlighted"));
    }

    // -------------------------------------------------------------
    // 5. CONTROLADOR DE ANIMACIONES DE DIAPOSITIVAS AL ENTRAR
    // -------------------------------------------------------------
    const chartBars = document.querySelectorAll(".chart-bar");

    function handleSlideAnimations(slideNum) {
        if (slideNum === 4) {
            // Animar el Gráfico de Barras de la Diapositiva 4
            setTimeout(() => {
                chartBars.forEach(bar => {
                    const targetVal = bar.getAttribute("data-val");
                    bar.style.width = `${targetVal}%`;
                });
            }, 100);
        } else {
            // Reiniciar barras del gráfico si salimos de la diapositiva para re-animar al volver
            chartBars.forEach(bar => {
                bar.style.width = "0%";
            });
        }
    }

    // Inicializar la primera diapositiva al cargar
    showSlide(0);
});
