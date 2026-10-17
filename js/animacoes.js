// nav
(() => {
    const navbar = document.getElementById('portfolioNavbar');
    const toggle = document.getElementById('navbarToggle');
    const content = document.getElementById('navbarContent');

    if (!navbar || !toggle || !content) return;

    // Alterar o aspecto da navbar ao fazer scroll.
    const updateNavbar = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    };

    updateNavbar();

    window.addEventListener('scroll', updateNavbar, {
        passive: true
    });

    // Abrir e fechar o menu em dispositivos móveis.
    const closeMenu = () => {
        content.classList.remove('menu-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
    };

    toggle.addEventListener('click', () => {
        const isOpen = content.classList.toggle('menu-open');

        toggle.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute(
            'aria-label',
            isOpen ? 'Fechar menu' : 'Abrir menu'
        );
    });

    // Fechar o menu depois de selecionar uma secção.
    content.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fechar o menu com a tecla Escape.
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeMenu();
    });

    // Fechar o menu ao regressar ao ecrã desktop.
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) closeMenu();
    });
})();

// button-up
document.addEventListener('DOMContentLoaded', function () {
    const botaoTopo = document.getElementById('voltarTopo');

    if (!botaoTopo) return;

    // Mostrar o botão depois de descer 300px
    function verificarScroll() {
        if (window.scrollY > 300) {
            botaoTopo.classList.add('visivel');
        } else {
            botaoTopo.classList.remove('visivel');
        }
    }

    // Voltar suavemente ao início da página
    botaoTopo.addEventListener('click', function () {
        const movimentoReduzido = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        window.scrollTo({
            top: 0,
            behavior: movimentoReduzido ? 'auto' : 'smooth'
        });
    });

    window.addEventListener('scroll', verificarScroll, {
        passive: true
    });

    // Verificar também a posição inicial da página
    verificarScroll();
});

// sobre
document.addEventListener('DOMContentLoaded', function () {
    const sobre = document.querySelector('#Sobre');

    if (!sobre) return;

    const conteudo = sobre.querySelector('.sobre-conteudo');
    const elementosAnimados = sobre.querySelectorAll('[data-animate]');
    const contadores = sobre.querySelectorAll('.contador');

    const movimentoReduzido = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    let contadoresIniciados = false;

    // Animação dos números
    function animarContadores() {
        if (contadoresIniciados) return;

        contadoresIniciados = true;

        contadores.forEach(function (contador) {
            const destino = Number(contador.dataset.target);

            if (!Number.isFinite(destino) || destino < 0) return;

            if (movimentoReduzido) {
                contador.textContent = destino;
                return;
            }

            const duracao = 1600;
            const inicio = performance.now();

            function actualizarNumero(agora) {
                const progresso = Math.min(
                    (agora - inicio) / duracao,
                    1
                );

                const suavizacao = 1 - Math.pow(1 - progresso, 4);

                contador.textContent = Math.round(
                    destino * suavizacao
                );

                if (progresso < 1) {
                    requestAnimationFrame(actualizarNumero);
                } else {
                    contador.textContent = destino;
                }
            }

            requestAnimationFrame(actualizarNumero);
        });
    }

    // Se o navegador não suportar IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        elementosAnimados.forEach(function (elemento) {
            elemento.classList.add('is-visible');
        });

        if (conteudo) {
            conteudo.classList.add('is-visible');
        }

        animarContadores();
        return;
    }

    // Activar as animações apenas quando o JavaScript estiver disponível
    sobre.classList.add('js-animada');

    // Observar a fotografia e a coluna de apresentação
    const observadorAnimacoes = new IntersectionObserver(
        function (entradas, observador) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;

                entrada.target.classList.add('is-visible');
                observador.unobserve(entrada.target);
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -35px 0px'
        }
    );

    elementosAnimados.forEach(function (elemento) {
        observadorAnimacoes.observe(elemento);
    });

    // CORRECÇÃO: observar também o conteúdo das estatísticas
    if (conteudo) {
        observadorAnimacoes.observe(conteudo);
    }

    // Iniciar os contadores quando as caixas entrarem no ecrã
    const estatisticas = sobre.querySelector('.sobre-estatisticas');

    if (estatisticas) {
        const observadorContadores = new IntersectionObserver(
            function (entradas, observador) {
                entradas.forEach(function (entrada) {
                    if (!entrada.isIntersecting) return;

                    animarContadores();
                    observador.disconnect();
                });
            },
            {
                threshold: 0.2
            }
        );

        observadorContadores.observe(estatisticas);
    } else {
        animarContadores();
    }
});

// projectos
document.addEventListener('DOMContentLoaded', function () {
    const projectos = document.querySelector('#Projectos');

    if (!projectos) return;

    const elementos = projectos.querySelectorAll('[data-animar]');
    const movimentoReduzido = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    // Apresentar tudo normalmente se o utilizador preferir
    // movimento reduzido ou se o navegador não suportar o observador.
    if (
        movimentoReduzido ||
        !('IntersectionObserver' in window)
    ) {
        elementos.forEach(function (elemento) {
            elemento.classList.add('visivel');
        });

        return;
    }

    // Activar as animações apenas quando o JavaScript estiver disponível.
    projectos.classList.add('js-animacoes');

    const observador = new IntersectionObserver(
        function (entradas, observadorActual) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;

                entrada.target.classList.add('visivel');
                observadorActual.unobserve(entrada.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -30px 0px'
        }
    );

    elementos.forEach(function (elemento) {
        observador.observe(elemento);
    });
});

// serviços
document.addEventListener('DOMContentLoaded', function () {
    const secao = document.querySelector('#Servicos');
    if (!secao) return;

    /* =====================================
    ANIMAÇÕES AO FAZER SCROLL
    ===================================== */
    const elementos = secao.querySelectorAll('[data-servico-animar]');
    const movimentoReduzido = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (movimentoReduzido || !('IntersectionObserver' in window)) {
        elementos.forEach(el => el.classList.add('visivel'));
    } else {
        secao.classList.add('js-animacoes');

        const observador = new IntersectionObserver((entradas, observer) => {
            entradas.forEach(entrada => {
                if (!entrada.isIntersecting) return;

                entrada.target.classList.add('visivel');
                observer.unobserve(entrada.target);
            });
        }, { threshold: 0.1 });

        elementos.forEach(el => observador.observe(el));
    }

    /* =====================================
    CONFIGURAÇÃO DO CAROUSEL
    ===================================== */
    const carousel = secao.querySelector('[data-servicos-carousel]');
    if (!carousel) return;

    const viewport = carousel.querySelector('.servicos-viewport');
    const track = carousel.querySelector('.servicos-track');

    if (!viewport || !track) return;

    const slides = [...track.querySelectorAll('.servicos-slide')];
    const anterior = carousel.querySelector('[data-servicos-anterior]');
    const seguinte = carousel.querySelector('[data-servicos-seguinte]');
    const actual = carousel.querySelector('[data-servicos-atual]');
    const total = carousel.querySelector('[data-servicos-total]');

    if (!slides.length || !anterior || !seguinte) return;

    let indice = 0;
    let temporizador = null;
    let pausaHover = false;
    let pausaFoco = false;
    let arrastando = false;
    let inicioX = 0;
    let diferencaX = 0;
    let deslocamentoInicial = 0;
    let arrastou = false;
    let ignorarCliqueAte = 0;
    let ponteiroActivo = null;

    const intervalo = 3000;
    const limiteArrastamento = 45;

    /* =====================================
    SLIDES VISÍVEIS CONFORME O ECRÃ
    ===================================== */
    function visiveis() {
        if (window.matchMedia('(max-width: 575.98px)').matches) {
            return 1;
        }

        if (window.matchMedia('(max-width: 991.98px)').matches) {
            return 2;
        }

        return 3;
    }

    function maximo() {
        return Math.max(0, slides.length - visiveis());
    }

    /* =====================================
    POSICIONAMENTO E CONTADOR
    ===================================== */
    function actualizar() {
        indice = Math.max(0, Math.min(indice, maximo()));

        const primeiro = slides[0];
        const seleccionado = slides[indice];

        if (!primeiro || !seleccionado) return;

        const deslocamento =
            seleccionado.offsetLeft - primeiro.offsetLeft;

        track.style.transform = `translateX(-${deslocamento}px)`;

        anterior.disabled = indice === 0;
        seguinte.disabled = indice >= maximo();

        if (actual) {
            actual.textContent = String(indice + 1).padStart(2, '0');
        }

        if (total) {
            total.textContent = String(maximo() + 1).padStart(2, '0');
        }
    }

    /* =====================================
    ROTAÇÃO AUTOMÁTICA
    ===================================== */
    function podeRodar() {
        return !movimentoReduzido &&
            !pausaHover &&
            !pausaFoco &&
            !arrastando &&
            !document.hidden &&
            maximo() > 0;
    }

    function avancarAutomaticamente() {
        if (!podeRodar()) return;

        if (indice >= maximo()) {
            indice = 0;
        } else {
            indice++;
        }

        actualizar();
    }

    function iniciarRotacao() {
        pararRotacao();

        if (podeRodar()) {
            temporizador = window.setInterval(
                avancarAutomaticamente,
                intervalo
            );
        }
    }

    function pararRotacao() {
        if (temporizador !== null) {
            window.clearInterval(temporizador);
            temporizador = null;
        }
    }

    function actualizarRotacao() {
        if (podeRodar()) {
            iniciarRotacao();
        } else {
            pararRotacao();
        }
    }

    /* =====================================
    NAVEGAÇÃO MANUAL
    ===================================== */
    function irPara(novoIndice) {
        indice = Math.max(0, Math.min(novoIndice, maximo()));
        actualizar();
        actualizarRotacao();
    }

    anterior.addEventListener('click', function () {
        if (indice > 0) {
            irPara(indice - 1);
        }
    });

    seguinte.addEventListener('click', function () {
        if (indice < maximo()) {
            irPara(indice + 1);
        }
    });

    /* =====================================
    PAUSA AO PASSAR O RATO
    ===================================== */
    carousel.addEventListener('mouseenter', function () {
        pausaHover = true;
        actualizarRotacao();
    });

    carousel.addEventListener('mouseleave', function () {
        pausaHover = false;
        actualizarRotacao();
    });

    /* Pausa enquanto o utilizador navega por teclado */
    carousel.addEventListener('focusin', function () {
        pausaFoco = true;
        actualizarRotacao();
    });

    carousel.addEventListener('focusout', function () {
        window.setTimeout(function () {
            pausaFoco = carousel.contains(document.activeElement);
            actualizarRotacao();
        }, 0);
    });

    /* Pausa quando o separador deixa de estar visível */
    document.addEventListener('visibilitychange', actualizarRotacao);

    /* =====================================
    ARRASTAR COM RATO OU DEDO
    ===================================== */
    viewport.addEventListener('dragstart', function (evento) {
        evento.preventDefault();
    });

    viewport.addEventListener('pointerdown', function (evento) {
        if (!evento.isPrimary) return;
        if (evento.pointerType === 'mouse' && evento.button !== 0) return;

        /* Não iniciar o arrastamento sobre as setas */
        if (evento.target.closest('.servicos-seta')) return;

        arrastando = true;
        arrastou = false;
        inicioX = evento.clientX;
        diferencaX = 0;
        ponteiroActivo = evento.pointerId;

        const primeiro = slides[0];
        const seleccionado = slides[indice];

        deslocamentoInicial = -(
            seleccionado.offsetLeft - primeiro.offsetLeft
        );

        viewport.classList.add('arrastando');
        pararRotacao();

        try {
            viewport.setPointerCapture(evento.pointerId);
        } catch (erro) {
            /* O navegador pode não permitir capturar o ponteiro */
        }
    });

    viewport.addEventListener('pointermove', function (evento) {
        if (!arrastando || evento.pointerId !== ponteiroActivo) return;

        diferencaX = evento.clientX - inicioX;

        if (Math.abs(diferencaX) > 5) {
            arrastou = true;
        }

        if (arrastou) {
            track.style.transform =
                `translateX(${deslocamentoInicial + diferencaX}px)`;
        }
    });

    function terminarArrastamento(evento) {
        if (!arrastando) return;

        if (
            evento &&
            ponteiroActivo !== null &&
            evento.pointerId !== ponteiroActivo
        ) {
            return;
        }

        const diferencaFinal = diferencaX;
        const houveArrastamento = arrastou;

        arrastando = false;
        ponteiroActivo = null;
        viewport.classList.remove('arrastando');

        if (houveArrastamento) {
            ignorarCliqueAte = Date.now() + 400;

            if (
                diferencaFinal < -limiteArrastamento &&
                indice < maximo()
            ) {
                indice++;
            } else if (
                diferencaFinal > limiteArrastamento &&
                indice > 0
            ) {
                indice--;
            }
        }

        diferencaX = 0;
        arrastou = false;

        actualizar();
        actualizarRotacao();
    }

    viewport.addEventListener('pointerup', terminarArrastamento);
    viewport.addEventListener('pointercancel', terminarArrastamento);
    viewport.addEventListener('lostpointercapture', function () {
        if (arrastando) {
            terminarArrastamento();
        }
    });

    /* Impede abrir um link por acidente depois de arrastar */
    viewport.addEventListener('click', function (evento) {
        if (Date.now() < ignorarCliqueAte) {
            evento.preventDefault();
            evento.stopPropagation();
        }
    }, true);

    /* =====================================
    NAVEGAÇÃO POR TECLADO
    ===================================== */
    carousel.addEventListener('keydown', function (evento) {
        if (evento.key === 'ArrowLeft') {
            evento.preventDefault();
            irPara(indice - 1);
        }

        if (evento.key === 'ArrowRight') {
            evento.preventDefault();
            irPara(indice + 1);
        }
    });

    /* =====================================
    REDIMENSIONAMENTO DO ECRÃ
    ===================================== */
    let temporizadorResize = null;

    window.addEventListener('resize', function () {
        window.clearTimeout(temporizadorResize);

        temporizadorResize = window.setTimeout(function () {
            actualizar();
            actualizarRotacao();
        }, 120);
    });

    /* Inicialização */
    actualizar();
    actualizarRotacao();
});

// experiencia
document.addEventListener('DOMContentLoaded', () => {

    /* Ler mais / Ler menos */

    document.querySelectorAll('.experiencia-ler-mais').forEach((botao) => {
        botao.addEventListener('click', () => {
            const texto = botao.previousElementSibling;

            if (!texto || !texto.classList.contains('experiencia-texto')) {
                return;
            }

            const expandido =
                botao.getAttribute('aria-expanded') === 'true';

            texto.classList.toggle(
                'experiencia-texto-recolhido',
                expandido
            );

            botao.setAttribute(
                'aria-expanded',
                String(!expandido)
            );

            const rotulo = botao.querySelector('span');

            if (rotulo) {
                rotulo.textContent = expandido
                    ? 'Ler mais'
                    : 'Ler menos';
            }
        });
    });

    /* Animações de entrada */

    const elementos = document.querySelectorAll(
        '[data-experiencia-animar]'
    );

    if (!('IntersectionObserver' in window)) {
        elementos.forEach((elemento) => {
            elemento.classList.add('experiencia-visivel');
        });

        return;
    }

    const observador = new IntersectionObserver((entradas, observer) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('experiencia-visivel');
                observer.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.12
    });

    elementos.forEach((elemento, indice) => {
        elemento.style.transitionDelay =
            `${(indice % 2) * 120}ms`;

        observador.observe(elemento);
    });
});

// contactos
document.addEventListener('DOMContentLoaded', function () {
    const secao = document.querySelector('#Contactos');

    if (!secao) return;

    /* Animações ao entrar no ecrã */
    const elementos = secao.querySelectorAll('[data-contacto-animar]');
    const movimentoReduzido = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (
        movimentoReduzido ||
        !('IntersectionObserver' in window)
    ) {
        elementos.forEach(function (elemento) {
            elemento.classList.add('visivel');
        });
    } else {
        secao.classList.add('js-animacoes');

        const observador = new IntersectionObserver(function (
            entradas,
            observer
        ) {
            entradas.forEach(function (entrada) {
                if (!entrada.isIntersecting) return;

                entrada.target.classList.add('visivel');
                observer.unobserve(entrada.target);
            });
        }, {
            threshold: 0.12
        });

        elementos.forEach(function (elemento) {
            observador.observe(elemento);
        });
    }

    /* Contador de caracteres da mensagem */
    const mensagem = secao.querySelector('#contactoMensagem');
    const contador = secao.querySelector('#contactoCaracteres');

    if (mensagem && contador) {
        function actualizarContador() {
            contador.textContent = mensagem.value.length;
        }

        mensagem.addEventListener('input', actualizarContador);
        actualizarContador();
    }
});

// certificações
document.addEventListener('DOMContentLoaded', () => {
    const elementos = document.querySelectorAll(
        '[data-certificacao-animar]'
    );

    if (!('IntersectionObserver' in window)) {
        elementos.forEach((elemento) => {
            elemento.classList.add('certificacao-visivel');
        });

        return;
    }

    const observador = new IntersectionObserver((entradas, observer) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('certificacao-visivel');
                observer.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.12
    });

    elementos.forEach((elemento, indice) => {
        elemento.style.transitionDelay = `${(indice % 3) * 100}ms`;
        observador.observe(elemento);
    });
});

// rodapé
document.addEventListener('DOMContentLoaded', () => {
    const anoRodape = document.getElementById('anoRodape');

    if (anoRodape) {
        anoRodape.textContent = new Date().getFullYear();
    }
});