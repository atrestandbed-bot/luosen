import { createEngine, loadBrandAssets } from './reference-engine.js';

const root = document.querySelector('#root');
const icons = {
  volumeOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>',
  volumeOn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
  camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"/><circle cx="12" cy="13" r="3"/></svg>',
  scanEye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="1"/><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0"/></svg>',
  eyeOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49M14.084 14.158a3 3 0 0 1-4.242-4.242M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143M2 2l20 20"/></svg>',
  moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.985 12.486A9 9 0 0 1 11.514 3a7 7 0 1 0 9.471 9.486z"/></svg>',
  sunset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 10V2M4.93 10.93 3.52 9.52M2 16h20M5 20h14M17.07 10.93l1.41-1.41M12 6a4 4 0 0 1 4 4"/></svg>',
  sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
  cloudSun: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M4.93 19.07l1.41-1.41M12 20v2M17.66 17.66l1.41 1.41M20 12h2M17.66 6.34l1.41-1.41"/><circle cx="12" cy="12" r="4"/><path d="M5 17.5a4.5 4.5 0 1 1 8.5-2.15A3.5 3.5 0 1 1 15.5 21H5a3.5 3.5 0 0 1 0-7"/></svg>',
  cloudRain: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M16 14v6M8 14v6M12 16v6"/></svg>',
  snow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.5 3.5L17 4l-1.5 3.5L19 9l-3.5 1.5L17 14l-3.5-1.5L12 16l-1.5-3.5L7 14l1.5-3.5L5 9l3.5-1.5L7 4l3.5 1.5zM12 16v6M9 20h6"/></svg>',
  layers: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83zM2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/></svg>',
  door: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 12h.01M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14M2 20h20"/></svg>',
  rain: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M16 14v6M8 14v6M12 16v6"/></svg>'
};
const roofMarkup = (open) => `${open ? icons.layers.replace('<svg ', '<svg class="roof-icon" ') : icons.layers.replace('<svg ', '<svg class="roof-icon" ')}<span>${open ? '还原屋顶' : '展开屋顶'}</span>`;
root.innerHTML = `
  <main class="mini-world night" data-time="night" data-weather="sunny">
    <div class="world-canvas" id="worldCanvas" aria-label="LAWSON MINI WORLD 3D街景"></div>
    <header class="world-header">
      <div class="brand">
        <div class="brand-rule"></div>
        <div>
          <h1>转角的罗森<span class="title-dot">。</span></h1>
          <p>LAWSON MINI WORLD</p>
        </div>
      </div>
      <div class="utility-bar glass" aria-label="工具">
        <button class="utility-button" id="soundToggle" aria-label="开启环境声" title="开启环境声">${icons.volumeOff}</button>
        <span class="utility-divider"></span>
        <button class="utility-button" id="screenshot" aria-label="保存截图" title="保存截图">${icons.camera}</button>
        <button class="utility-button" id="perspectiveToggle" aria-label="切换透视镜头" title="切换透视镜头">${icons.scanEye}</button>
        <button class="utility-button" id="uiToggle" aria-label="隐藏所有按钮文字" title="隐藏界面">${icons.eyeOff}</button>
      </div>
    </header>

    <div class="scene-caption">
      <span class="scene-index">01 / 街角日常</span>
      <div class="condition"><span id="timeIcon">◔</span><span><span id="timeLabel">夜晚</span><b>·</b><span id="weatherLabel">晴天</span></span></div>
    </div>
    <div class="right-caption"><span>营业中</span><strong>24<span> / </span>7</strong></div>

    <div class="scene-loader" id="sceneLoader">
      <p>正在布置这个小小的街角</p><span>建筑 · 灯光 · 生活的细节</span>
    </div>
    <div class="scene-error glass" id="sceneError" hidden>
      <h2>暂时无法打开小世界</h2><p id="errorText">三维场景加载失败。</p><button id="reloadScene">重新加载</button>
    </div>
    <div class="scene-hint" id="sceneHint"><span class="hint-mouse">⌁</span><span id="hintText">拖动旋转 <span class="hint-sep">/</span> 滚轮缩放 <span class="hint-sep">/</span> Shift＋左键平移 <span class="hint-sep">/</span> 点击探索</span></div>

    <div class="bottom-dock">
      <div class="control-bar glass" aria-label="场景控制">
        <div class="control-section">
          <span class="control-label">昼夜</span>
          <div class="choice-row" id="timeChoices">
            <label class="scene-choice"><input class="choice-input" type="radio" name="time" value="night" checked>${icons.moon}<span>夜晚</span></label>
            <label class="scene-choice"><input class="choice-input" type="radio" name="time" value="dusk">${icons.sunset}<span>黄昏</span></label>
            <label class="scene-choice"><input class="choice-input" type="radio" name="time" value="day">${icons.sun}<span>白天</span></label>
          </div>
        </div>
        <div class="dock-separator"></div>
        <div class="control-section">
          <span class="control-label">天气</span>
          <div class="choice-row" id="weatherChoices">
            <label class="scene-choice"><input class="choice-input" type="radio" name="weather" value="sunny" checked>${icons.cloudSun}<span>晴天</span></label>
            <label class="scene-choice"><input class="choice-input" type="radio" name="weather" value="rain">${icons.cloudRain}<span>雨天</span></label>
            <label class="scene-choice"><input class="choice-input" type="radio" name="weather" value="snow">${icons.snow}<span>雪天</span></label>
          </div>
        </div>
        <div class="dock-separator"></div>
        <div class="control-section explore-section">
          <span class="control-label">探索</span>
          <div class="choice-row">
            <button class="dock-button" id="roofToggle" aria-pressed="false">${roofMarkup(false)}</button>
            <button class="dock-button door-button" id="doorToggle" aria-label="打开玻璃门" aria-pressed="false">${icons.door}</button>
          </div>
        </div>
      </div>
      <button class="mobile-roof-button glass" id="mobileRoof" aria-pressed="false">${roofMarkup(false)}</button>
      <button class="rain-night-button" id="rainNight">${icons.rain}<span>一键雨夜<small>RAINY NIGHT</small></span></button>
    </div>

    <button class="restore-ui glass" id="restoreUI" aria-label="显示界面">◉</button>
    <div class="toast" id="toast" role="status"></div>
  </main>`;

const app = document.querySelector('.mini-world');
const canvasHost = document.querySelector('#worldCanvas');
const loader = document.querySelector('#sceneLoader');
const errorPanel = document.querySelector('#sceneError');
const errorText = document.querySelector('#errorText');
const hint = document.querySelector('#hintText');
const toast = document.querySelector('#toast');
const state = { time: 'night', weather: 'sunny', roof: false, door: false };
let engine = null;
let audioContext = null;
let audioGain = null;
let toastTimer;

const labels = { time: { day: '白天', dusk: '黄昏', night: '夜晚' }, weather: { sunny: '晴天', rain: '雨天', snow: '雪天' } };
function showToast(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2400); }
function syncUI() {
  app.dataset.time = state.time; app.dataset.weather = state.weather; app.classList.toggle('night', state.time === 'night');
  document.querySelector('#timeLabel').textContent = labels.time[state.time];
  document.querySelector('#weatherLabel').textContent = labels.weather[state.weather];
  document.querySelector('#timeIcon').innerHTML = state.time === 'night' ? icons.moon : state.time === 'dusk' ? icons.sunset : icons.sun;
  document.querySelectorAll('input[name="time"]').forEach((input) => { input.checked = input.value === state.time; input.dataset.state = input.checked ? 'checked' : 'unchecked'; });
  document.querySelectorAll('input[name="weather"]').forEach((input) => { input.checked = input.value === state.weather; input.dataset.state = input.checked ? 'checked' : 'unchecked'; });
  for (const button of [document.querySelector('#roofToggle'), document.querySelector('#mobileRoof')]) { button.setAttribute('aria-pressed', String(state.roof)); button.innerHTML = roofMarkup(state.roof); }
  const door = document.querySelector('#doorToggle'); door.setAttribute('aria-pressed', String(state.door)); door.setAttribute('aria-label', state.door ? '关闭玻璃门' : '打开玻璃门'); door.innerHTML = icons.door;
  document.querySelector('#rainNight').classList.toggle('rain-active', state.time === 'night' && state.weather === 'rain');
  document.documentElement.style.setProperty('--scene-background', state.time === 'night' ? '#142b3e' : state.time === 'dusk' ? '#d7c5be' : '#d9e4e8');
}
function pushState(patch) { Object.assign(state, patch); syncUI(); engine?.setState(state); }
function toggleRoof() { pushState({ roof: !state.roof }); showToast(state.roof ? '屋顶展开，室内陈列可见' : '屋顶还原'); }
function toggleDoor() { pushState({ door: !state.door }); showToast(state.door ? '玻璃门打开了' : '玻璃门合上了'); }
function toggleSound() {
  if (!audioContext) { audioContext = new AudioContext(); audioGain = audioContext.createGain(); audioGain.gain.value = 0; audioGain.connect(audioContext.destination); const osc = audioContext.createOscillator(); osc.type = 'sine'; osc.frequency.value = 174; osc.connect(audioGain); osc.start(); }
  const enabled = audioGain.gain.value < 0.01; audioContext.resume(); audioGain.gain.setTargetAtTime(enabled ? 0.035 : 0, audioContext.currentTime, .15);
  const button = document.querySelector('#soundToggle'); button.classList.toggle('is-active', enabled); button.innerHTML = enabled ? icons.volumeOn : icons.volumeOff; button.setAttribute('aria-label', enabled ? '关闭环境声' : '开启环境声'); showToast(enabled ? '环境声已开启' : '环境声已关闭');
}
function setHint(action) {
  if (!action) { hint.innerHTML = '拖动旋转 <span class="hint-sep">/</span> 滚轮缩放 <span class="hint-sep">/</span> Shift＋左键平移 <span class="hint-sep">/</span> 点击探索'; return; }
  const text = action === 'door' ? (state.door ? '点击关闭玻璃门' : '点击打开玻璃门') : action === 'cat' ? '点击叫醒街角小猫' : action === 'vending' ? '点击随机掉落一瓶饮料' : action.startsWith('bin') ? '点击打开垃圾桶盖' : '点击让扭蛋弹跳滚动';
  hint.textContent = text;
}

document.querySelectorAll('input[name="time"]').forEach((input) => input.addEventListener('change', () => pushState({ time: input.value })));
document.querySelectorAll('input[name="weather"]').forEach((input) => input.addEventListener('change', () => pushState({ weather: input.value })));
document.querySelector('#roofToggle').addEventListener('click', toggleRoof);
document.querySelector('#mobileRoof').addEventListener('click', toggleRoof);
document.querySelector('#doorToggle').addEventListener('click', toggleDoor);
document.querySelector('#rainNight').addEventListener('click', () => pushState({ time: 'night', weather: 'rain' }));
document.querySelector('#soundToggle').addEventListener('click', toggleSound);
document.querySelector('#perspectiveToggle').addEventListener('click', () => { const active = document.querySelector('#perspectiveToggle').classList.toggle('is-active'); engine?.setPerspective(active); document.querySelector('#perspectiveToggle').setAttribute('aria-label', active ? '切换正交镜头' : '切换透视镜头'); showToast(active ? '透视镜头' : '正交镜头'); });
document.querySelector('#screenshot').addEventListener('click', async () => { if (!engine) return; try { await engine.screenshot(); showToast('截图已导出为 PNG'); } catch { showToast('截图生成失败，请重试'); } });
document.querySelector('#uiToggle').addEventListener('click', () => { app.classList.add('ui-hidden'); });
document.querySelector('#restoreUI').addEventListener('click', () => { app.classList.remove('ui-hidden'); });
document.querySelector('#reloadScene').addEventListener('click', () => window.location.reload());

syncUI();
loadBrandAssets().then((assets) => {
  engine = createEngine(canvasHost, {
    ready: () => { loader.remove(); },
    error: (message) => { loader.remove(); errorPanel.hidden = false; errorText.textContent = message; },
    select: (action) => { if (action === 'door') { state.door = !state.door; syncUI(); showToast(state.door ? '玻璃门打开了' : '玻璃门合上了'); } },
    hover: setHint,
  }, assets);
  engine.setState(state);
}).catch((error) => { loader.remove(); errorPanel.hidden = false; errorText.textContent = error?.message || '品牌资源加载失败，请刷新重试。'; });
