(function () {

  /* ==========================================================
     1. ATALHOS
     $  = pega UM elemento da página
     A  = pega TODOS os elementos e devolve uma lista
     ========================================================== */
  var $ = function (seletor, base) {
    return (base || document).querySelector(seletor);
  };

  var A = function (seletor, base) {
    return [].slice.call((base || document).querySelectorAll(seletor));
  };


  /* ==========================================================
     2. TÍTULO DO TOPO
     Separa o título em palavras e faz cada uma aparecer
     com um pequeno atraso, uma depois da outra.
     ========================================================== */
  var titulo = $('#h1');
  var palavras = titulo.textContent.split(' ');

  titulo.textContent = '';

  palavras.forEach(function (palavra, i) {
    var span = document.createElement('span');
    span.className = 'wd';
    span.style.animationDelay = (1.45 + i * 0.07) + 's';
    if (i >= palavras.length - 2) span.className = 'wd gr';   // últimas palavras com brilho
    span.textContent = palavra;
    titulo.appendChild(span);
    titulo.appendChild(document.createTextNode(' '));
  });


  /* ==========================================================
     3. FAIXA QUE CORRE (nomes dos serviços)
     Repete a lista 4 vezes para a faixa nunca ficar vazia.
     ========================================================== */
  var servicos = [
    'Produção audiovisual',
    'Design gráfico',
    'Gestão de redes sociais',
    'Captação presencial',
    'Planejamento de conteúdo'
  ];
  var faixa = '';

  for (var k = 0; k < 4; k++) {
    servicos.forEach(function (nome) {
      faixa += '<span>' + nome + '</span>';
    });
  }

  $('#mq').innerHTML = faixa;


  /* ==========================================================
     4. LOGO QUE INCLINA
     O bloco da logo gira de leve seguindo o mouse.
     ========================================================== */
  var logo = $('#tile');

  addEventListener('pointermove', function (e) {
    var x = e.clientX / innerWidth;
    var y = e.clientY / innerHeight;
    var girarX = (0.5 - y) * 20;
    var girarY = (x - 0.5) * 26;

    logo.style.transform = 'rotateX(' + girarX + 'deg) rotateY(' + girarY + 'deg)';
  });


  /* ==========================================================
     5. CARREGAR VÍDEOS
     Lê o caminho escrito em data-src e coloca no vídeo.
     - Enquanto o vídeo não carrega, o aviso continua na tela.
     - Se o arquivo não for encontrado, o aviso mostra o caminho.
     ========================================================== */
  function carregarVideos() {
    A('video[data-src]').forEach(function (v) {

      // pula vídeos sem caminho ou que já foram carregados
      if (!v.dataset.src || v.dataset.on) return;
      v.dataset.on = 1;

      var aviso = v.previousElementSibling;

      // quando o vídeo carrega, esconde o aviso
      v.addEventListener('loadeddata', function () {
        aviso.hidden = true;
      });

      // se der erro, mostra qual arquivo não foi encontrado
      v.addEventListener('error', function () {
        if (aviso.classList.contains('ph')) {
          aviso.hidden = false;
          aviso.textContent = 'Vídeo não encontrado: ' + v.dataset.src;
        }
      });

      v.src = v.dataset.src;
    });
  }

  carregarVideos();


  /* ==========================================================
     6. PAINÉIS DE SERVIÇOS (abrem ao passar o mouse ou tocar)
     ========================================================== */
  var paineis = A('.p');

  function abrirPainel(painel) {
    paineis.forEach(function (p) {
      p.classList.toggle('on', p === painel);
    });
  }

  paineis.forEach(function (painel) {
    painel.addEventListener('mouseenter', function () {
      if (innerWidth > 820) abrirPainel(painel);
    });
    painel.addEventListener('click', function () {
      abrirPainel(painel);
    });
    painel.addEventListener('focus', function () {
      abrirPainel(painel);
    });
  });


  /* ==========================================================
     7. APARECER AO ROLAR
     Elementos com a classe "rv" surgem quando entram na tela.
     ========================================================== */
  var observador = new IntersectionObserver(function (itens) {
    itens.forEach(function (item) {
      if (item.isIntersecting) {
        item.target.classList.add('in');
        observador.unobserve(item.target);
      }
    });
  }, { threshold: 0.15 });

  A('.rv').forEach(function (el) {
    observador.observe(el);
  });


  /* ==========================================================
     8. FRASE QUE ACENDE + LINHA DO PROCESSO
     Conforme a página rola, as palavras da frase acendem
     e a linha do processo vai se preenchendo.
     ========================================================== */
  var frase = $('#big');
  var palavrasFrase = frase.textContent.split(' ');

  frase.textContent = '';

  var spansFrase = palavrasFrase.map(function (palavra) {
    var span = document.createElement('span');
    span.textContent = palavra + ' ';
    frase.appendChild(span);
    return span;
  });

  var secaoEstrategia = $('#estrategia');
  var linhaProcesso = $('#tl');
  var etapas = A('.st');

  function aoRolar() {
    // quanto da seção "estratégia" já foi rolado (de 0 a 1)
    var r = secaoEstrategia.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));

    spansFrase.forEach(function (span, i) {
      span.classList.toggle('on', i / spansFrase.length < p * 1.15);
    });

    // quanto da linha do processo já está visível (de 0 a 1)
    var q = linhaProcesso.getBoundingClientRect();
    var f = Math.min(1, Math.max(0, (innerHeight * 0.85 - q.top) / (innerHeight * 0.5)));

    linhaProcesso.style.setProperty('--pf', f);

    etapas.forEach(function (etapa, i) {
      etapa.classList.toggle('on', f >= i / 3.2);
    });
  }

  addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();


  /* ==========================================================
     9. COMPARADORES "BRUTO x FINAL"
     Cria os 3 comparadores e liga a linha que se arrasta.
     ========================================================== */
  var videoHtml = '<video muted loop playsinline autoplay data-src=""></video>';
  var comparadores = '';

  for (var j = 1; j < 4; j++) {
    comparadores +=
      '<div class="cmp">' +
        '<div class="bot"><div class="ph">Resultado final</div>' + videoHtml + '</div>' +
        '<div class="top"><div class="ph raw">Vídeo bruto</div>' + videoHtml + '</div>' +
        '<span class="tag" style="left:14px">Bruto</span>' +
        '<span class="tag" style="right:14px">Final</span>' +
        '<div class="ln2"></div>' +
        '<input type="range" min="0" max="100" value="50" aria-label="Comparar bruto e final, vídeo ' + j + '">' +
      '</div>';
  }

  $('#tri').innerHTML = comparadores;
  carregarVideos();

  A('.cmp').forEach(function (cmp) {
    var barra = $('input', cmp);
    var videos = A('video', cmp);

    // arrastar a barra move a linha
    barra.addEventListener('input', function () {
      cmp.style.setProperty('--p', barra.value);
    });

    // mantém o vídeo bruto e o final sincronizados
    setInterval(function () {
      var temOsDois = videos[0].src && videos[1].src;
      if (temOsDois && Math.abs(videos[0].currentTime - videos[1].currentTime) > 0.15) {
        videos[1].currentTime = videos[0].currentTime;
      }
    }, 500);
  });


  /* ==========================================================
     10. FORMULÁRIO -> WHATSAPP
     Monta a mensagem com as respostas e coloca no botão.
     ========================================================== */
  var campoNome = $('#n');
  var campoObjetivo = $('#o');
  var campoExperiencia = $('#x');
  var botaoWhats = $('#wa');

  function montarMensagem() {
    var nome = campoNome.value.trim();
    var texto =
      'Oi! ' + (nome ? 'Aqui é ' + nome + '. ' : '') +
      'Quero conversar com a Seven. ' +
      'Meu principal objetivo hoje é ' + campoObjetivo.value + '. ' +
      'Já trabalhei com conteúdo ou gestão antes: ' + campoExperiencia.value + '.';

    botaoWhats.href = 'https://wa.me/5511926344500?text=' + encodeURIComponent(texto);
  }

  [campoNome, campoObjetivo, campoExperiencia].forEach(function (campo) {
    campo.addEventListener('input', montarMensagem);
    campo.addEventListener('change', montarMensagem);
  });

  montarMensagem();


  /* ==========================================================
     11. CONTROLES DO VÍDEO "O QUE A SEVEN FAZ"
     Recomeçar, pausar/tocar, som, volume e barra de progresso.
     ========================================================== */
  var video = $('.vs video');
  var caixaVideo = $('.vs');
  var controles = null;

  if (video && caixaVideo) {

    // remove botões antigos, se existirem, para não duplicar
    A('#vc, #pg', caixaVideo).forEach(function (antigo) {
      antigo.remove();
    });

    // estilo dos botões (uma propriedade por linha)
    var regras = `
      .vc {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px;
        border-radius: 99px;
        background: rgba(4,10,61,.5);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(255,255,255,.3);
        box-shadow: 0 14px 34px -12px rgba(0,8,110,.9);
      }

      .cb {
        width: 40px;
        height: 40px;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: #fff;
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: background .2s,transform .2s;
      }

      .cb:hover {
        background: rgba(255,255,255,.2);
        transform: scale(1.08);
      }

      .cb.main {
        width: 48px;
        height: 48px;
        background: #fff;
        color: #0a2bd8;
        box-shadow: 0 6px 18px -6px rgba(0,180,255,.9);
      }

      .cb.main:hover {
        background: #eaf2ff;
      }

      .cb svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }

      .vg2 {
        display: flex;
        align-items: center;
      }

      .vg2 input {
        -webkit-appearance: none;
        appearance: none;
        width: 0;
        opacity: 0;
        margin: 0;
        height: 4px;
        border-radius: 4px;
        border: 0;
        outline: 0;
        cursor: pointer;
        background: linear-gradient(90deg,#fff var(--f,80%),rgba(255,255,255,.3) var(--f,80%));
        transition: width .25s,opacity .25s,margin .25s;
      }

      .vg2:hover input,
      .vg2:focus-within input {
        width: 90px;
        opacity: 1;
        margin: 0 12px 0 4px;
      }

      .vg2 input::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #fff;
        border: 0;
        box-shadow: 0 0 0 4px rgba(255,255,255,.22),0 2px 6px rgba(0,0,40,.45);
      }

      .vg2 input::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #fff;
        border: 0;
        box-shadow: 0 0 0 4px rgba(255,255,255,.22),0 2px 6px rgba(0,0,40,.45);
      }

      .vg2 input::-moz-range-track {
        background: transparent;
      }

      .pg {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 5px;
        background: rgba(255,255,255,.2);
        cursor: pointer;
      }

      .pg i {
        display: block;
        height: 100%;
        width: 0;
        background: linear-gradient(90deg,#00b4ff,#fff);
      }

      @media (max-width: 820px) {
        .vg2 input {
          display: none;
        }
      }
    `;

    if (!$('#estilo-controles')) {
      var estilo = document.createElement('style');
      estilo.id = 'estilo-controles';
      estilo.textContent = regras;
      document.head.appendChild(estilo);
    }

    // cria os botões dentro do espaço do vídeo
    caixaVideo.insertAdjacentHTML('beforeend',
      '<div class="vc" id="vc">' +
        '<button type="button" class="cb" id="rs"></button>' +
        '<button type="button" class="cb main" id="pp2"></button>' +
        '<div class="vg2">' +
          '<button type="button" class="cb" id="mt2"></button>' +
          '<input type="range" id="vol2" min="0" max="1" step="0.05" value="0.15" aria-label="Volume">' +
        '</div>' +
      '</div>' +
      '<div class="pg" id="pg" aria-hidden="true"><i id="pgb"></i></div>'
    );

    controles = $('#vc');

    // mostra o vídeo INTEIRO, sem cortar as legendas de baixo
    // (vale mesmo que o style.css esteja desatualizado)
    video.style.objectFit = 'contain';
    video.style.height = 'calc(100% - 8px)';   // deixa uma faixa de 8px embaixo para a barra de progresso
    caixaVideo.style.maxWidth = '900px';
    caixaVideo.style.margin = '34px auto 0';

    // o quadro assume o formato real do vídeo (ex.: 960 / 720)
    var ajustarQuadro = function () {
      if (video.videoWidth) {
        caixaVideo.style.aspectRatio = video.videoWidth + ' / ' + video.videoHeight;
      }
    };

    video.addEventListener('loadedmetadata', ajustarQuadro);
    ajustarQuadro();
  }

  if (video && controles) {

    var botaoRecomecar = $('#rs');
    var botaoPlay = $('#pp2');
    var botaoSom = $('#mt2');
    var barraVolume = $('#vol2');
    var trilhaProgresso = $('#pg');
    var preenchimento = $('#pgb');
    var ultimoVolume = 0.15;   // volume inicial: 15%
    var somJaLigado = false;   // vira true depois da primeira vez que o som é ligado

    // moldura que envolve cada ícone
    var icone = function (desenho) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true">' + desenho + '</svg>';
    };

    // estilo dos ícones feitos só de linha
    var linha = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

    // desenhos dos ícones
    var desenhos = {
      tocar: '<path d="M8 5v14l11-7z"/>',
      pausar: '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>',
      somLigado:
        '<path d="M4 9v6h4l5 4V5L8 9H4z"/>' +
        '<path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" ' + linha + '/>',
      somDesligado:
        '<path d="M4 9v6h4l5 4V5L8 9H4z"/>' +
        '<path d="M16.5 9.5l5 5M21.5 9.5l-5 5" ' + linha + '/>',
      recomecar:
        '<path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" ' + linha + '/>' +
        '<path d="M3 3v5h5" ' + linha + '/>'
    };

    // atualiza ícones, textos de acessibilidade e barra de volume
    function atualizarControles() {
      var semSom = video.muted || video.volume === 0;
      var nivel = semSom ? 0 : video.volume;

      botaoRecomecar.innerHTML = icone(desenhos.recomecar);
      botaoRecomecar.setAttribute('aria-label', 'Recomeçar vídeo');

      botaoPlay.innerHTML = icone(video.paused ? desenhos.tocar : desenhos.pausar);
      botaoPlay.setAttribute('aria-label', video.paused ? 'Tocar vídeo' : 'Pausar vídeo');

      botaoSom.innerHTML = icone(semSom ? desenhos.somDesligado : desenhos.somLigado);
      botaoSom.setAttribute('aria-label', semSom ? 'Ligar o som' : 'Desligar o som');

      barraVolume.value = nivel;
      barraVolume.style.setProperty('--f', (nivel * 100) + '%');
    }

    video.volume = ultimoVolume;

    // na primeira vez que você tocar/despausar, liga o som em 15%
    // (depois disso, o volume é o que você escolher)
    function ligarSomInicial() {
      if (!somJaLigado && video.muted) {
        video.muted = false;
        video.volume = 0.15;
        ultimoVolume = 0.15;
      }
      somJaLigado = true;
    }

    // botão recomeçar: volta ao início e toca
    botaoRecomecar.addEventListener('click', function () {
      ligarSomInicial();
      video.currentTime = 0;
      video.play();
    });

    // botão pausar / tocar
    botaoPlay.addEventListener('click', function () {
      if (video.paused) {
        ligarSomInicial();
        video.play();
      } else {
        video.pause();
      }
    });

    // botão de som: liga e desliga
    botaoSom.addEventListener('click', function () {
      somJaLigado = true;   // respeita a sua escolha
      video.muted = !video.muted;
      if (!video.muted && video.volume === 0) video.volume = ultimoVolume;
      atualizarControles();
    });

    // barra de volume
    barraVolume.addEventListener('input', function () {
      somJaLigado = true;   // respeita a sua escolha
      video.volume = +barraVolume.value;
      video.muted = video.volume === 0;
      if (video.volume > 0) ultimoVolume = video.volume;
      atualizarControles();
    });

    // clicar na barra de progresso pula para aquele ponto
    trilhaProgresso.addEventListener('click', function (e) {
      var caixa = trilhaProgresso.getBoundingClientRect();
      if (video.duration) {
        video.currentTime = (e.clientX - caixa.left) / caixa.width * video.duration;
      }
    });

    // a barra de progresso acompanha o vídeo
    video.addEventListener('timeupdate', function () {
      preenchimento.style.width = (video.currentTime / (video.duration || 1) * 100) + '%';
    });

    // mantém os ícones certos quando o vídeo toca, pausa ou muda de volume
    ['play', 'pause', 'volumechange'].forEach(function (evento) {
      video.addEventListener(evento, atualizarControles);
    });

    // garantia extra: qualquer "despausar" (botão, teclado, recomeçar)
    // também liga o som em 15%, na primeira vez
    var pausadoPorVoce = false;

    video.addEventListener('pause', function () {
      if (!video.ended) pausadoPorVoce = true;
    });

    video.addEventListener('play', function () {
      if (pausadoPorVoce) {
        pausadoPorVoce = false;
        ligarSomInicial();
        atualizarControles();
      }
    });

    atualizarControles();
  }

  /* ==========================================================
     12. EXTRAS: barra de progresso, menu do celular,
     link ativo no menu e brilho que segue o mouse no topo.
     ========================================================== */
  var barraProgresso = $('#sp');
  var botaoMenu = $('#mb');
  var menuCelular = $('#mn');
  var brilho = $('#spot');

  // barra fina no topo mostra quanto da página já foi rolado
  function progresso() {
    var total = document.documentElement.scrollHeight - innerHeight;
    barraProgresso.style.width = (total > 0 ? scrollY / total * 100 : 0) + '%';
  }

  addEventListener('scroll', progresso, { passive: true });
  progresso();

  // menu do celular: abre e fecha
  function menu(abrir) {
    menuCelular.hidden = !abrir;
    botaoMenu.setAttribute('aria-expanded', abrir);
    botaoMenu.classList.toggle('x', abrir);
    document.body.style.overflow = abrir ? 'hidden' : '';
  }

  botaoMenu.addEventListener('click', function () {
    menu(menuCelular.hidden);
  });

  A('a', menuCelular).forEach(function (link) {
    link.addEventListener('click', function () { menu(false); });
  });

  addEventListener('keydown', function (e) {
    if (e.key === 'Escape') menu(false);
  });

  addEventListener('resize', function () {
    if (innerWidth > 820) menu(false);
  });

  // destaca no menu a seção que está na tela
  var linksMenu = A('.lk a');
  var secoes = linksMenu.map(function (link) {
    return $(link.getAttribute('href'));
  });

  function linkAtivo() {
    var y = scrollY + innerHeight * 0.35;
    var atual = -1;

    secoes.forEach(function (secao, i) {
      if (secao && secao.offsetTop <= y) atual = i;
    });

    linksMenu.forEach(function (link, i) {
      link.classList.toggle('on', i === atual);
    });
  }

  addEventListener('scroll', linkAtivo, { passive: true });
  linkAtivo();

  // brilho de luz que segue o mouse no topo
  var topo = $('#topo');

  topo.addEventListener('pointermove', function (e) {
    var r = topo.getBoundingClientRect();
    brilho.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    brilho.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });

  /* ==========================================================
     13. DESTAQUES: cursor, brilho nos cartões, botões que
     "puxam", confete na logo e fundo que reage ao mouse.
     ========================================================== */
  var mouseFino = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var calmo = matchMedia('(prefers-reduced-motion:reduce)').matches;

  // --- confete: clique na logo do topo (ou no botão do formulário) ---
  var telaConfete = $('#cf');
  var pincel = telaConfete.getContext('2d');
  var pecas = [];

  function ajustarTela() {
    telaConfete.width = innerWidth;
    telaConfete.height = innerHeight;
  }

  ajustarTela();
  addEventListener('resize', ajustarTela);

  function confete(x, y) {
    if (calmo) return;
    var cores = ['#ffffff', '#00b4ff', '#3d6bff', '#8fd9ff', '#0a3cff'];

    for (var n = 0; n < 70; n++) {
      var ang = Math.random() * Math.PI * 2;
      var forca = 3 + Math.random() * 7;
      pecas.push({
        x: x, y: y,
        vx: Math.cos(ang) * forca,
        vy: Math.sin(ang) * forca - 3,
        t: 0,
        r: 3 + Math.random() * 4,
        cor: cores[n % cores.length]
      });
    }

    if (pecas.length === 70) desenharConfete();
  }

  function desenharConfete() {
    pincel.clearRect(0, 0, telaConfete.width, telaConfete.height);

    pecas = pecas.filter(function (p) { return p.t < 70; });

    pecas.forEach(function (p) {
      p.t++;
      p.vy += 0.25;
      p.x += p.vx;
      p.y += p.vy;
      pincel.globalAlpha = 1 - p.t / 70;
      pincel.fillStyle = p.cor;
      pincel.fillRect(p.x, p.y, p.r, p.r * 1.6);
    });

    pincel.globalAlpha = 1;

    if (pecas.length) requestAnimationFrame(desenharConfete);
    else pincel.clearRect(0, 0, telaConfete.width, telaConfete.height);
  }

  $('#tile').addEventListener('click', function (e) {
    confete(e.clientX, e.clientY);
  });

  $('#wa').addEventListener('click', function (e) {
    confete(e.clientX, e.clientY);
  });

  // --- brilho que segue o mouse dentro de cada painel de serviço ---
  paineis.forEach(function (painel) {
    painel.addEventListener('pointermove', function (e) {
      var caixa = painel.getBoundingClientRect();
      painel.style.setProperty('--x', (e.clientX - caixa.left) + 'px');
      painel.style.setProperty('--y', (e.clientY - caixa.top) + 'px');
    });
  });

  // --- fundo azul do topo reage ao mouse ---
  var fundoAzul = $('.aur');

  addEventListener('pointermove', function (e) {
    fundoAzul.style.setProperty('--px', (e.clientX / innerWidth - 0.5) * 2);
    fundoAzul.style.setProperty('--py', (e.clientY / innerHeight - 0.5) * 2);
  });

  // --- só no computador: cursor luminoso e botões que "puxam" ---
  if (mouseFino && !calmo) {
    var cursor = $('#cu');
    var cx = 0, cy = 0, alvoX = 0, alvoY = 0;

    addEventListener('pointermove', function (e) {
      alvoX = e.clientX;
      alvoY = e.clientY;
      cursor.classList.add('v');
      cursor.classList.toggle('h', !!e.target.closest('a, button, .p, .cmp, .tile'));
    });

    document.addEventListener('pointerleave', function () {
      cursor.classList.remove('v');
    });

    (function seguir() {
      cx += (alvoX - cx) * 0.18;
      cy += (alvoY - cy) * 0.18;
      cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      requestAnimationFrame(seguir);
    })();

    A('.btn').forEach(function (botao) {
      botao.addEventListener('pointermove', function (e) {
        var c = botao.getBoundingClientRect();
        var dx = e.clientX - (c.left + c.width / 2);
        var dy = e.clientY - (c.top + c.height / 2);
        botao.style.transform = 'translate(' + dx * 0.22 + 'px,' + dy * 0.32 + 'px)';
      });

      botao.addEventListener('pointerleave', function () {
        botao.style.transform = '';
      });
    });
  }

})();
