document.addEventListener('DOMContentLoaded', function () {

    /* ===================== NAVEGACIÓN ===================== */

    var nav = document.querySelector('.nav-principal');
    var hamburguesa = document.querySelector('.nav-hamburguesa');
    var navEnlaces = document.querySelector('.nav-enlaces');
    var enlaces = document.querySelectorAll('.nav-enlace');

    if (hamburguesa && navEnlaces) {
        hamburguesa.addEventListener('click', function () {
            hamburguesa.classList.toggle('activo');
            navEnlaces.classList.toggle('activo');
            document.body.style.overflow = navEnlaces.classList.contains('activo') ? 'hidden' : '';
        });

        enlaces.forEach(function (enlace) {
            enlace.addEventListener('click', function () {
                hamburguesa.classList.remove('activo');
                navEnlaces.classList.remove('activo');
                document.body.style.overflow = '';
            });
        });
    }

    window.addEventListener('scroll', function () {
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });

    /* ===================== SECCIÓN ACTIVA ===================== */

    var secciones = document.querySelectorAll('section[id]');

    function actualizarSeccionActiva() {
        var scrollPos = window.scrollY + 100;
        secciones.forEach(function (seccion) {
            var top = seccion.offsetTop;
            var altura = seccion.offsetHeight;
            var id = seccion.getAttribute('id');
            var enlace = document.querySelector('.nav-enlace[href="#' + id + '"], .nav-enlace[href*="' + id + '"]');

            if (enlace) {
                if (scrollPos >= top && scrollPos < top + altura) {
                    enlaces.forEach(function (e) { e.classList.remove('activo'); });
                    enlace.classList.add('activo');
                }
            }
        });
    }

    window.addEventListener('scroll', actualizarSeccionActiva);

    /* ===================== ANIMACIONES DE ENTRADA ===================== */

    var elementosAnimar = document.querySelectorAll('.animar-entrada');

    var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    elementosAnimar.forEach(function (el) {
        observador.observe(el);
    });

    /* ===================== PARTÍCULAS DORADAS ===================== */

    var contenedorParticulas = document.querySelector('.hero-particulas');

    if (contenedorParticulas) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        contenedorParticulas.appendChild(canvas);

        function ajustarCanvas() {
            canvas.width = contenedorParticulas.offsetWidth;
            canvas.height = contenedorParticulas.offsetHeight;
        }

        ajustarCanvas();
        window.addEventListener('resize', ajustarCanvas);

        var particulas = [];
        var numParticulas = 40;

        function Particula() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.tamano = Math.random() * 2 + 0.5;
            this.velocidadY = -Math.random() * 0.3 - 0.1;
            this.velocidadX = (Math.random() - 0.5) * 0.2;
            this.opacidad = Math.random() * 0.4 + 0.1;
            this.opacidadDir = Math.random() > 0.5 ? 0.005 : -0.005;
        }

        Particula.prototype.actualizar = function () {
            this.y += this.velocidadY;
            this.x += this.velocidadX;
            this.opacidad += this.opacidadDir;

            if (this.opacidad > 0.5 || this.opacidad < 0.05) {
                this.opacidadDir *= -1;
            }

            if (this.y < -10) {
                this.y = canvas.height + 10;
                this.x = Math.random() * canvas.width;
            }
        };

        Particula.prototype.dibujar = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.tamano, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(212, 175, 55, ' + this.opacidad + ')';
            ctx.fill();
        };

        for (var i = 0; i < numParticulas; i++) {
            particulas.push(new Particula());
        }

        function animarParticulas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particulas.forEach(function (p) {
                p.actualizar();
                p.dibujar();
            });
            requestAnimationFrame(animarParticulas);
        }

        animarParticulas();
    }

    /* ===================== VIDEO REPRODUCTOR ===================== */

    var videoPortada = document.querySelector('.video-portada');
    var video = document.querySelector('.video-marco video');

    if (videoPortada && video) {
        videoPortada.addEventListener('click', function () {
            videoPortada.classList.add('oculto');
            var playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(function (err) {
                    var marco = document.querySelector('.video-marco');
                    var avisoPrevio = document.querySelector('.video-aviso-pendiente');
                    if (!avisoPrevio && marco) {
                        var aviso = document.createElement('div');
                        aviso.className = 'video-aviso-pendiente';
                        aviso.innerHTML = '<span>🎬</span><div><strong>Archivo de video pendiente:</strong> Para visualizar tu video promocional, coloca el archivo <code>video-curia.mp4</code> (1920×1080) en la carpeta <code>videos/</code>.</div>';
                        marco.appendChild(aviso);
                        setTimeout(function () {
                            if (aviso && aviso.parentNode) {
                                aviso.parentNode.removeChild(aviso);
                            }
                            videoPortada.classList.remove('oculto');
                        }, 5500);
                    }
                });
            }
        });

        video.addEventListener('pause', function () {
            if (video.currentTime === 0 || video.ended) {
                videoPortada.classList.remove('oculto');
            }
        });

        video.addEventListener('ended', function () {
            videoPortada.classList.remove('oculto');
        });
    }

    /* ===================== MODAL DE PUBLICACIÓN ===================== */

    var modalOverlay = document.querySelector('.modal-overlay');
    var btnAbrirModal = document.querySelector('[data-abrir-modal]');
    var btnCerrarModal = document.querySelector('.modal-cerrar');

    if (modalOverlay && btnAbrirModal) {
        btnAbrirModal.addEventListener('click', function (e) {
            e.preventDefault();
            modalOverlay.classList.add('activo');
            document.body.style.overflow = 'hidden';
        });
    }

    if (modalOverlay && btnCerrarModal) {
        btnCerrarModal.addEventListener('click', function () {
            modalOverlay.classList.remove('activo');
            document.body.style.overflow = '';
        });

        modalOverlay.addEventListener('click', function (e) {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('activo');
                document.body.style.overflow = '';
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('activo')) {
            modalOverlay.classList.remove('activo');
            document.body.style.overflow = '';
        }
    });

    /* ===================== SCROLL SUAVE PARA ANCLAS ===================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (ancla) {
        ancla.addEventListener('click', function (e) {
            var destino = document.querySelector(this.getAttribute('href'));
            if (destino) {
                e.preventDefault();
                var offset = 70;
                var posicion = destino.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: posicion, behavior: 'smooth' });
            }
        });
    });

    /* ===================== AÑO DINÁMICO ===================== */

    var anioElemento = document.querySelector('.anio-actual');
    if (anioElemento) {
        anioElemento.textContent = new Date().getFullYear();
    }

});
