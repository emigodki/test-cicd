const express = require('express');
const { version } = require('./package.json');

const app = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');

app.get('/health', (req, res) => {
  res.set('Cache-Control', 'no-store').json({
    status: 'ok',
    version,
    uptime: Math.floor(process.uptime()),
    node: process.version,
    port
  });
});

app.get('/', (req, res) => {
  res.type('html').send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#080b0a">
  <title>Emiliano Ávila | Infrastructure Lab</title>

  <style>
    :root {
      color-scheme: dark;
      --bg: #080b0a;
      --surface: #101512;
      --line: rgba(255,255,255,.09);
      --text: #edf2ed;
      --muted: #91a095;
      --accent: #bcff70;
      --mono: ui-monospace, SFMono-Regular, Consolas, monospace;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-width: 320px;
      background: var(--bg);
      color: var(--text);
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background:
        radial-gradient(ellipse at 85% 5%, #bcff7011, transparent 45%),
        linear-gradient(#ffffff03 1px, transparent 1px),
        linear-gradient(90deg, #ffffff03 1px, transparent 1px);
      background-size: auto, 64px 64px, 64px 64px;
    }

    ::selection { background: var(--accent); color: var(--bg); }

    button, a { -webkit-tap-highlight-color: transparent; }
    button { font: inherit; }
    a { color: inherit; text-decoration: none; }
    button:focus-visible, a:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 5px;
    }

    .container { width: min(1200px, calc(100% - 64px)); margin: auto; }

    header {
      min-height: 94px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--line);
      gap: 20px;
    }

    .brand { display: flex; align-items: center; gap: 13px; }
    .brand-icon {
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      background: var(--accent);
      border-radius: 12px;
      color: var(--bg);
      font: 800 17px var(--mono);
    }
    .brand-name { font-size: 14px; font-weight: 800; letter-spacing: 2px; }
    .brand-name span { color: var(--muted); font-weight: 400; }

    .header-meta { display: flex; align-items: center; gap: 24px; }
    .mono { font-family: var(--mono); }
    .tiny { font-size: 11px; letter-spacing: 1px; color: var(--muted); }

    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font: 11px var(--mono);
      color: var(--muted);
    }
    .dot {
      width: 7px;
      height: 7px;
      flex-shrink: 0;
      border-radius: 50%;
      background: currentColor;
    }
    .status.online { color: var(--accent); }
    .status.online .dot { box-shadow: 0 0 14px #bcff7080; }
    .status.offline { color: #ff8a8a; }

    .hero {
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 68px;
      padding: 82px 0 58px;
      align-items: center;
    }

    .eyebrow {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--accent);
      font: 10px var(--mono);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .eyebrow::before {
      content: "";
      width: 22px;
      height: 1px;
      background: var(--accent);
    }

    h1 {
      margin: 23px 0;
      font-size: clamp(48px, 6.4vw, 82px);
      line-height: 1.04;
      letter-spacing: -5px;
      font-weight: 800;
    }
    h1 span { color: var(--accent); }

    .intro {
      max-width: 440px;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.8;
    }

    .stack { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 27px; }
    .chip {
      padding: 8px 12px;
      border: 1px solid var(--line);
      background: #ffffff03;
      border-radius: 7px;
      color: #c7d0c9;
      font: 11px var(--mono);
    }
    .chip b { color: var(--accent); margin-right: 6px; }

    .terminal {
      position: relative;
      min-width: 0;
      border: 1px solid #ffffff14;
      border-radius: 18px;
      background: #0c100e;
      box-shadow: 0 24px 80px #0005, 0 0 60px #bcff7005;
      overflow: hidden;
    }
    .terminal-top {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 17px 20px;
      background: #ffffff03;
      border-bottom: 1px solid var(--line);
    }
    .traffic { display: flex; gap: 6px; }
    .traffic i { width: 9px; height: 9px; border-radius: 50%; background: #ff625a; }
    .traffic i:nth-child(2) { background: #ffbd44; }
    .traffic i:nth-child(3) { background: #00ca4e; }
    .terminal-title { color: var(--muted); font: 10px var(--mono); }
    .demo-tag {
      margin-left: auto;
      color: var(--accent);
      background: #bcff700b;
      border: 1px solid #bcff701f;
      padding: 4px 7px;
      border-radius: 4px;
      font: 9px var(--mono);
      letter-spacing: 1px;
    }
    .terminal-body { padding: 24px; }
    .command { font: 12px var(--mono); color: #d5dfd8; }
    .command span { color: var(--accent); margin-right: 8px; }

    .logs {
      height: 190px;
      margin: 22px 0 0;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #344536 transparent;
      font: 11px/1.9 var(--mono);
      color: var(--muted);
    }
    .log { margin-bottom: 5px; overflow-wrap: anywhere; }
    .log.success { color: var(--accent); }
    .log.info { color: #8cc9ff; }
    .log.dim { color: #718075; }

    .terminal-bottom {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 13px 20px;
      border-top: 1px solid var(--line);
      color: #829387;
      font: 10px var(--mono);
    }

    .identity {
      display: grid;
      grid-template-columns: 1.3fr .5fr 1.2fr;
      border: 1px solid var(--line);
      background: linear-gradient(115deg, #151c16, #0d120f);
      border-radius: 16px;
      overflow: hidden;
    }
    .identity-cell { padding: 25px 28px; }
    .identity-cell + .identity-cell { border-left: 1px solid var(--line); }
    .label {
      display: block;
      margin-bottom: 11px;
      font: 9px var(--mono);
      letter-spacing: 1.6px;
      text-transform: uppercase;
      color: var(--muted);
    }
    .student { font-size: 19px; font-weight: 650; line-height: 1.5; }
    .group { color: var(--accent); font: 19px/1.5 var(--mono); }
    .subject { font-size: 15px; line-height: 1.6; }

    .pipeline-section { padding: 54px 0 40px; }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      margin-bottom: 28px;
    }
    h2 { font-size: 25px; letter-spacing: -.8px; margin: 0 0 9px; }
    .section-description { color: var(--muted); font-size: 13px; margin: 0; line-height: 1.6; }

    .run-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 11px;
      white-space: nowrap;
      border: 0;
      border-radius: 9px;
      padding: 14px 20px;
      background: var(--accent);
      color: #14200a;
      cursor: pointer;
      font-size: 12px;
      font-weight: 750;
      transition: transform .2s, box-shadow .2s;
    }
    .run-button:hover { transform: translateY(-2px); box-shadow: 0 7px 25px #bcff7022; }
    .run-button:disabled { opacity: .6; cursor: wait; transform: none; }

    .pipeline {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }
    .stage {
      position: relative;
      padding: 22px;
      border: 1px solid var(--line);
      background: var(--surface);
      border-radius: 13px;
      transition: border-color .3s, background .3s, transform .3s;
    }
    .stage-top { display: flex; align-items: center; justify-content: space-between; }
    .stage-number { color: #607064; font: 11px var(--mono); }
    .stage-icon {
      width: 33px;
      height: 33px;
      display: grid;
      place-items: center;
      border: 1px solid var(--line);
      border-radius: 9px;
      font: 13px var(--mono);
      color: var(--muted);
    }
    .stage h3 { margin: 20px 0 7px; font-size: 17px; font-weight: 650; }
    .stage p { margin: 0; color: var(--muted); font: 10px var(--mono); }
    .stage-state {
      display: block;
      margin-top: 23px;
      color: #75857a;
      font: 10px var(--mono);
    }
    .stage.active {
      background: #bcff7009;
      border-color: #bcff7070;
      transform: translateY(-3px);
    }
    .stage.active .stage-icon { color: var(--accent); border-color: #bcff7050; }
    .stage.active .stage-state { color: var(--accent); }
    .stage.done { border-color: #bcff702a; }
    .stage.done .stage-icon { color: #14200a; background: var(--accent); }
    .stage.done .stage-state { color: var(--accent); }

    .progress-track {
      height: 3px;
      margin-top: 22px;
      border-radius: 4px;
      background: #ffffff08;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      width: 0;
      background: var(--accent);
      transition: width .5s ease;
      box-shadow: 0 0 15px var(--accent);
    }
    .pipeline-summary {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-top: 12px;
      color: var(--muted);
      font: 10px var(--mono);
    }

    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      padding: 25px 0 40px;
    }
    .metric {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 18px 0;
      border-bottom: 1px solid var(--line);
    }
    .metric span { color: var(--muted); font: 10px var(--mono); }
    .metric strong { font: 13px var(--mono); font-weight: 500; }

    footer {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      padding: 22px 0 30px;
      color: #7c8d81;
      font: 10px/1.6 var(--mono);
    }
    footer a:hover { color: var(--accent); }

    @media (max-width: 1000px) {
      .hero { gap: 30px; }
      h1 { letter-spacing: -3px; }
      .identity-cell { padding: 22px; }
      .student { font-size: 17px; }
      .group { font-size: 16px; }
    }

    @media (max-width: 760px) {
      .container { width: min(580px, calc(100% - 36px)); }
      header { min-height: 78px; }
      .header-meta > .tiny { display: none; }
      .hero { grid-template-columns: 1fr; padding: 48px 0 32px; gap: 35px; }
      h1 { font-size: clamp(47px, 10vw, 68px); }
      .intro { max-width: 100%; }
      .identity { grid-template-columns: 1fr; }
      .identity-cell + .identity-cell { border-left: 0; border-top: 1px solid var(--line); }
      .identity-cell { padding: 20px 23px; }
      .label { margin-bottom: 7px; }
      .pipeline-section { padding-top: 40px; }
      .section-header { align-items: flex-start; flex-direction: column; }
      .pipeline { grid-template-columns: repeat(2, 1fr); }
      .metrics { grid-template-columns: 1fr; gap: 0; padding-bottom: 20px; }
      footer { flex-direction: column; gap: 7px; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { transition: none !important; animation: none !important; }
    }
  </style>
</head>

<body>
  <div class="container">
    <header>
      <div class="brand">
        <div class="brand-icon" aria-hidden="true">&lt;/&gt;</div>
        <div class="brand-name">INFRA<span> / LAB</span></div>
      </div>

      <div class="header-meta">
        <span class="tiny mono">LEARNING ENVIRONMENT</span>
        <span class="status" id="server-status" role="status">
          <span class="dot"></span>
          <span id="server-label">CONECTANDO</span>
        </span>
      </div>
    </header>

    <main>
      <section class="hero">
        <div>
          <div class="eyebrow">Docker + Jenkins / CI/CD</div>
          <h1>Del código<br>a <span>producción.</span></h1>
          <p class="intro">
            Construir. Integrar. Desplegar. Un laboratorio para convertir
            cada commit en una nueva versión y la infraestructura en código.
          </p>

          <div class="stack">
            <span class="chip"><b>◈</b> Docker</span>
            <span class="chip"><b>↻</b> Jenkins</span>
            <span class="chip"><b>⬡</b> Node.js</span>
            <span class="chip"><b>→</b> Express</span>
          </div>
        </div>

        <div class="terminal">
          <div class="terminal-top">
            <div class="traffic" aria-hidden="true"><i></i><i></i><i></i></div>
            <span class="terminal-title">pipeline.preview</span>
            <span class="demo-tag">SIMULACIÓN</span>
          </div>

          <div class="terminal-body">
            <div class="command"><span>❯</span> run infrastructure-lab</div>
            <div class="logs" id="logs" role="log" aria-label="Consola de demostración">
              <div class="log info">[lab] Infrastructure Lab inicializado.</div>
              <div class="log">[app] Interfaz cargada correctamente.</div>
              <div class="log dim">[demo] Listo para simular un pipeline.</div>
              <div class="log dim">[demo] Pulsa “Ejecutar demo” para comenzar.</div>
            </div>
          </div>

          <div class="terminal-bottom">
            <span>MODE: EDUCATIONAL</span>
            <span id="run-id">RUN / 000</span>
          </div>
        </div>
      </section>

      <section class="identity" aria-label="Información del proyecto">
        <div class="identity-cell">
          <span class="label">01 / Desarrollado por</span>
          <div class="student">Rogelio Emiliano Ávila Rodríguez</div>
        </div>
        <div class="identity-cell">
          <span class="label">02 / Grupo</span>
          <div class="group">IRIC10A11</div>
        </div>
        <div class="identity-cell">
          <span class="label">03 / Materia</span>
          <div class="subject">Automatización de<br>Infraestructura Digital II</div>
        </div>
      </section>

      <section class="pipeline-section" aria-labelledby="pipeline-heading">
        <div class="section-header">
          <div>
            <h2 id="pipeline-heading">Un commit. Cuatro etapas.</h2>
            <p class="section-description">
              Simulación interactiva del flujo CI/CD, sin conexión a Jenkins.
            </p>
          </div>
          <button class="run-button" id="run-button" type="button">
            <span aria-hidden="true">▶</span> Ejecutar demo
          </button>
        </div>

        <div class="pipeline" id="pipeline">
          <article class="stage">
            <div class="stage-top">
              <span class="stage-number">01 / SOURCE</span>
              <span class="stage-icon" aria-hidden="true">↗</span>
            </div>
            <h3>Commit</h3>
            <p>git checkout</p>
            <span class="stage-state">○ En espera</span>
          </article>

          <article class="stage">
            <div class="stage-top">
              <span class="stage-number">02 / BUILD</span>
              <span class="stage-icon" aria-hidden="true">◈</span>
            </div>
            <h3>Construcción</h3>
            <p>docker build</p>
            <span class="stage-state">○ En espera</span>
          </article>

          <article class="stage">
            <div class="stage-top">
              <span class="stage-number">03 / TEST</span>
              <span class="stage-icon" aria-hidden="true">✓</span>
            </div>
            <h3>Validación</h3>
            <p>health check</p>
            <span class="stage-state">○ En espera</span>
          </article>

          <article class="stage">
            <div class="stage-top">
              <span class="stage-number">04 / DEPLOY</span>
              <span class="stage-icon" aria-hidden="true">↗</span>
            </div>
            <h3>Despliegue</h3>
            <p>docker run</p>
            <span class="stage-state">○ En espera</span>
          </article>
        </div>

        <div class="progress-track" id="progress"
             role="progressbar" aria-label="Progreso de la simulación"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="progress-fill" id="progress-fill"></div>
        </div>

        <div class="pipeline-summary" role="status">
          <span id="pipeline-state">Esperando ejecución</span>
          <span id="pipeline-percent">0 / 4 etapas</span>
        </div>
      </section>

      <section class="metrics" aria-label="Datos reales del servidor Express">
        <div class="metric">
          <span>RUNTIME</span>
          <strong id="runtime">Consultando...</strong>
        </div>
        <div class="metric">
          <span>SERVER UPTIME</span>
          <strong id="uptime">--:--:--</strong>
        </div>
        <div class="metric">
          <span>APP VERSION</span>
          <strong id="version">--</strong>
        </div>
      </section>
    </main>

    <footer>
      <span>REA / IRIC10A11 · Aprender construyendo.</span>
      <a href="/health" target="_blank" rel="noopener noreferrer">
        Estado real del servidor · GET /health ↗
      </a>
    </footer>
  </div>

  <script>
    const button = document.getElementById('run-button');
    const stages = Array.from(document.querySelectorAll('.stage'));
    const logs = document.getElementById('logs');
    const progress = document.getElementById('progress');
    const progressFill = document.getElementById('progress-fill');
    const pipelineState = document.getElementById('pipeline-state');
    const pipelinePercent = document.getElementById('pipeline-percent');

    let runs = 0;
    let serverUptime = null;

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function addLog(message, tone) {
      const line = document.createElement('div');
      line.className = 'log' + (tone ? ' ' + tone : '');
      line.textContent = message;
      logs.appendChild(line);
      logs.scrollTop = logs.scrollHeight;
    }

    function renderUptime() {
      if (serverUptime === null) return;

      const seconds = serverUptime.seconds
        + Math.floor((performance.now() - serverUptime.receivedAt) / 1000);

      const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const remaining = String(seconds % 60).padStart(2, '0');

      document.getElementById('uptime').textContent =
        hours + ':' + minutes + ':' + remaining;
    }

    async function refreshStatus() {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch('/health', {
          cache: 'no-store',
          signal: controller.signal
        });

        if (!response.ok) throw new Error('Servidor no disponible');

        const data = await response.json();

        if (data.status !== 'ok') throw new Error('Estado inesperado');

        serverUptime = {
          seconds: data.uptime,
          receivedAt: performance.now()
        };

        document.getElementById('runtime').textContent = 'Node.js ' + data.node;
        document.getElementById('version').textContent = 'v' + data.version;
        document.getElementById('server-status').className = 'status online';
        document.getElementById('server-label').textContent = 'APP ONLINE';

        renderUptime();
      } catch (error) {
        serverUptime = null;
        document.getElementById('uptime').textContent = '--:--:--';
        document.getElementById('server-status').className = 'status offline';
        document.getElementById('server-label').textContent = 'SIN CONEXIÓN';
      } finally {
        clearTimeout(timeout);
      }
    }

    button.addEventListener('click', async () => {
      if (button.disabled) return;

      runs += 1;
      button.disabled = true;
      button.textContent = 'Ejecutando demo...';
      document.getElementById('pipeline').setAttribute('aria-busy', 'true');
      document.getElementById('run-id').textContent =
        'RUN / ' + String(runs).padStart(3, '0');

      logs.replaceChildren();
      progressFill.style.width = '0%';
      progress.setAttribute('aria-valuenow', '0');
      pipelinePercent.textContent = '0 / 4 etapas';

      stages.forEach((stage) => {
        stage.classList.remove('active', 'done');
        stage.querySelector('.stage-state').textContent = '○ En espera';
      });

      const steps = [
        {
          title: 'Obteniendo código',
          message: '[source] Simulando checkout de la rama main...',
          result: '[source] Código preparado.',
          duration: 850
        },
        {
          title: 'Construyendo imagen',
          message: '[build] Simulando construcción de mi-app-web:latest...',
          result: '[build] Imagen de demostración construida.',
          duration: 1400
        },
        {
          title: 'Validando aplicación',
          message: '[test] Simulando pruebas y health check...',
          result: '[test] Validación de demostración completada.',
          duration: 1000
        },
        {
          title: 'Desplegando contenedor',
          message: '[deploy] Simulando despliegue del contenedor...',
          result: '[deploy] Despliegue de demostración completado.',
          duration: 1150
        }
      ];

      addLog('[demo] Iniciando ejecución #' + runs, 'info');
      addLog('[demo] Esta vista no ejecuta comandos ni modifica contenedores.', 'dim');

      for (let index = 0; index < steps.length; index += 1) {
        const stage = stages[index];
        const step = steps[index];

        stage.classList.add('active');
        stage.querySelector('.stage-state').textContent = '◉ Ejecutando';
        pipelineState.textContent = step.title + '...';

        addLog(step.message);
        await wait(step.duration);

        stage.classList.remove('active');
        stage.classList.add('done');
        stage.querySelector('.stage-state').textContent = '✓ Completado';

        addLog(step.result, 'success');

        const percent = (index + 1) * 25;
        progressFill.style.width = percent + '%';
        progress.setAttribute('aria-valuenow', String(percent));
        pipelinePercent.textContent = (index + 1) + ' / 4 etapas';
      }

      addLog('[demo] ✓ Pipeline de demostración finalizado.', 'success');
      pipelineState.textContent = '✓ Simulación completada';
      document.getElementById('pipeline').setAttribute('aria-busy', 'false');

      button.disabled = false;
      button.textContent = '↻ Ejecutar otra vez';
    });

    refreshStatus();
    setInterval(refreshStatus, 15000);
    setInterval(renderUptime, 1000);
  </script>
</body>
</html>
  `);
});

app.listen(port, '0.0.0.0', () => {
  console.log('Servidor corriendo en http://localhost:' + port);
  console.log('Health check disponible en /health');
});
