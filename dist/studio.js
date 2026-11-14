const defaults = { stage: 6, height: 1, belly: 1, neck: 1, gloss: .65, light: -35, glaze: 'moss', tool: 'rotate', spin: false };
const stageNames = ['Raw earth', 'Find the center', 'Shape the vessel', 'Let it rest', 'Through fire', 'Finished object'];
const stages = ['Earth', 'Center', 'Shape', 'Rest', 'Fire', 'Object'];
const range = (key, label, min, max, step, value) => `<label class="studio-range"><span>${label}<output data-output="${key}"></output></span><input type="range" id="studio-${key}" data-key="${key}" aria-label="${label}" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;

export function initStudio({ onOpen = () => {}, onClose = () => {}, onChange = () => {}, onReset = () => {} } = {}) {
  const values = { ...defaults };
  let open = false, available = false, returnFocus = null;
  const launcher = document.createElement('button');
  launcher.className = 'studio-launcher';
  launcher.type = 'button';
  launcher.innerHTML = '<span aria-hidden="true">✳</span> Open pottery studio <span aria-hidden="true">↗</span>';
  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.setAttribute('aria-controls', 'pottery-studio');
  const backdrop = document.createElement('div');
  backdrop.className = 'studio-backdrop';
  backdrop.hidden = true;
  const shell = document.createElement('div');
  shell.id = 'pottery-studio';
  shell.className = 'studio-shell';
  shell.hidden = true;
  shell.setAttribute('role', 'dialog');
  shell.setAttribute('aria-modal', 'true');
  shell.setAttribute('aria-labelledby', 'studio-title');
  shell.setAttribute('aria-owns', 'scene');
  shell.innerHTML = `
    <div class="studio-header"><div><span class="studio-brand">EARTH / FORM</span><span class="studio-header-divider"></span><span class="studio-kicker">THE POTTERY STUDIO</span></div><button type="button" class="studio-close" aria-label="Close pottery studio">Back to the story <span aria-hidden="true">×</span></button></div>
    <div class="studio-panel">
      <div class="studio-intro"><span class="studio-kicker">YOUR HAND. YOUR FORM.</span><h2 id="studio-title">Make it <em>yours.</em></h2><p>A little curiosity changes everything.</p></div>
      <div class="studio-stage-section"><div class="studio-stage-label"><label for="studio-stage">The transformation</label><output id="studio-stage-name">Finished object</output></div><input type="range" id="studio-stage" data-key="stage" min="1" max="6" step="0.01" value="6" aria-label="Transformation stage"><div class="studio-stage-ticks">${stages.map((s, i) => `<button type="button" data-stage="${i + 1}" aria-label="Show ${s.toLowerCase()} stage">${s}</button>`).join('')}</div></div>
      <div class="studio-tools" role="group" aria-label="Interaction tool"><button type="button" data-tool="rotate" aria-pressed="true"><span aria-hidden="true">↔</span> Rotate</button><button type="button" data-tool="shape" aria-pressed="false"><span aria-hidden="true">⌁</span> Shape clay</button></div>
      <details class="studio-details" open><summary>Shape & finish <span class="studio-summary-icon" aria-hidden="true">+</span></summary><div class="studio-details-content">
        <div class="studio-section-head"><span class="studio-kicker">01 / THE SILHOUETTE</span><button type="button" class="studio-reset">Reset all ↺</button></div>
        <div class="studio-presets" role="group" aria-label="Vessel shape presets"><button type="button" data-preset="round">Round</button><button type="button" data-preset="tall">Tall</button><button type="button" data-preset="open">Open</button></div>
        ${range('height', 'Height', .8, 1.2, .01, 1)}${range('belly', 'Body width', .78, 1.22, .01, 1)}${range('neck', 'Opening', .7, 1.35, .01, 1)}
        <div class="studio-section-head"><span class="studio-kicker">02 / THE SURFACE</span></div>
        <div class="studio-glazes" role="group" aria-label="Studio glaze"><button type="button" data-glaze="moss" aria-pressed="true"><i style="--studio-swatch:#87967e"></i>Moss</button><button type="button" data-glaze="chalk" aria-pressed="false"><i style="--studio-swatch:#ddd2bc"></i>Chalk</button><button type="button" data-glaze="iron" aria-pressed="false"><i style="--studio-swatch:#6f3e2c"></i>Iron</button></div>
        ${range('gloss', 'Matte to gloss', 0, 1, .01, .65)}${range('light', 'Move the light', -180, 180, 1, -35)}
        <p class="studio-material-note">Glaze appears on the finished object.</p>
        <button type="button" class="studio-spin" aria-pressed="false"><span aria-hidden="true">↻</span> Turn the wheel <span class="studio-switch" aria-hidden="true"></span></button>
      </div></details>
    </div>
    <div class="studio-canvas-controls"><span class="studio-object-number">YOUR VESSEL / 001</span><div class="studio-zoom"><button type="button" data-zoom="-.15" aria-label="Studio zoom out">−</button><span></span><button type="button" data-zoom=".15" aria-label="Studio zoom in">+</button></div></div>
    <div class="studio-hint" role="status"><span id="studio-gesture-hint">Drag to turn. Scroll over the vessel to zoom.</span><small id="studio-keyboard-hint">Arrow keys rotate · + / − zoom · 0 resets the view</small></div>
  `;
  document.body.append(launcher, backdrop, shell);
  launcher.hidden=true;
  const closeButton = shell.querySelector('.studio-close');
  const details = shell.querySelector('.studio-details');
  const mobile = matchMedia('(max-width: 700px)');
  if (mobile.matches) details.open = false;
  mobile.addEventListener('change', () => { details.open = !mobile.matches; syncExpanded(); render(); });
  function syncExpanded() { document.body.classList.toggle('studio-controls-expanded', open && mobile.matches && details.open); }
  details.addEventListener('toggle', syncExpanded);
  function setOpen(next) {
    next = Boolean(next && available);
    if (open === next) return;
    open = next;
    if (open) returnFocus = document.activeElement;
    shell.hidden = backdrop.hidden = !open;
    launcher.hidden = open || !available;
    document.body.classList.toggle('studio-open', open);
    syncExpanded();
    if (open) closeButton.focus({ preventScroll: true });
    else (returnFocus?.isConnected ? returnFocus : launcher).focus({ preventScroll: true });
  }
  function close() { onClose(); setOpen(false); }
  launcher.addEventListener('click', () => { onOpen(); setOpen(true); });
  closeButton.addEventListener('click', close);
  function change(key, value) { values[key] = value; render(); onChange(key, value); }
  shell.querySelectorAll('input[data-key]').forEach(input => input.addEventListener('input', () => change(input.dataset.key, Number(input.value))));
  shell.querySelectorAll('[data-stage]').forEach(button => button.addEventListener('click', () => change('stage', Number(button.dataset.stage))));
  shell.querySelectorAll('[data-tool]').forEach(button => button.addEventListener('click', () => change('tool', button.dataset.tool)));
  shell.querySelectorAll('[data-glaze]').forEach(button => button.addEventListener('click', () => change('glaze', button.dataset.glaze)));
  shell.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => onChange('zoomDelta', Number(button.dataset.zoom))));
  shell.querySelector('.studio-spin').addEventListener('click', () => change('spin', !values.spin));
  shell.querySelector('.studio-reset').addEventListener('click', () => { Object.assign(values, defaults); render(); onReset(); });
  const presets = { round: { height: .88, belly: 1.15, neck: .9 }, tall: { height: 1.2, belly: .86, neck: .92 }, open: { height: .94, belly: 1.02, neck: 1.35 } };
  shell.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => {
    onChange('preset', button.dataset.preset);
    Object.entries(presets[button.dataset.preset]).forEach(([key, value]) => change(key, value));
    shell.querySelectorAll('[data-preset]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  }));
  function render() {
    shell.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(Object.entries(presets[b.dataset.preset]).every(([key,value])=>Math.abs(values[key]-value)<.001))));
    shell.querySelectorAll('input[data-key]').forEach(input => {
      const v = Number(values[input.dataset.key]);
      input.value = v;
      input.style.setProperty('--studio-fill', `${(v - Number(input.min)) / (Number(input.max) - Number(input.min)) * 100}%`);
    });
    shell.querySelectorAll('[data-output]').forEach(output => {
      const key = output.dataset.output;
      output.value = key === 'light' ? `${Math.round(values[key])}°` : `${Math.round(values[key] * 100)}%`;
    });
    const stageIndex = Math.max(0, Math.min(5, Math.round(values.stage) - 1));
    shell.querySelector('#studio-stage-name').value = stageNames[stageIndex];
    shell.querySelector('#studio-stage').setAttribute('aria-valuetext', stageNames[stageIndex]);
    shell.querySelectorAll('[data-stage]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.stage) === stageIndex + 1)));
    shell.querySelectorAll('[data-glaze]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.glaze === values.glaze)));
    shell.querySelectorAll('[data-tool]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tool === values.tool)));
    shell.querySelector('.studio-spin').setAttribute('aria-pressed', String(values.spin));
    shell.querySelector('#studio-gesture-hint').textContent = values.tool === 'shape' ? 'Drag the clay sideways to shape its profile.' : (mobile.matches ? 'Drag to turn. Pinch to zoom.' : 'Drag to turn. Scroll over the vessel to zoom.');
    shell.querySelector('#studio-keyboard-hint').textContent = values.tool === 'shape' ? 'Or use the silhouette sliders to shape your vessel.' : 'Arrow keys rotate · + / − zoom · 0 resets the view';
  }
  document.addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const targets = [...shell.querySelectorAll('button, input, summary'), document.querySelector('#pottery')].filter(el => el && !el.disabled && el.tabIndex >= 0 && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
    if (!targets.length) return;
    event.preventDefault();
    const index = targets.indexOf(document.activeElement);
    const next = index < 0 ? 0 : (index + (event.shiftKey ? -1 : 1) + targets.length) % targets.length;
    targets[next].focus({ preventScroll: true });
  });
  render();
  return {
    setOpen,
    update(patch) { Object.assign(values, patch); render(); },
    setAvailable(next) { available = Boolean(next); if (!available && open) close(); launcher.hidden = !available || open; }
  };
}
