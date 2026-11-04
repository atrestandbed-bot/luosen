# 转角的罗森 · Three.js 学习指南

> 本文档基于本项目（luosen）的实际代码，把一个完整的 Three.js 交互场景拆成可学习的模块。适合有一点 JavaScript 基础、想入门 Three.js 的读者。

---

## 1. 项目是什么

一个可交互的 3D 微缩街景：罗森便利店 + 室外街景，支持昼夜/天气切换、镜头切换、点击交互。技术栈只有三样：

- **Three.js** ^0.186 —— 3D 渲染
- **Vite** ^8 —— 开发与构建
- **原生 JS/CSS** —— 没有任何框架

跑起来：

```bash
npm install
npm run dev        # http://localhost:5173
```

---

## 2. 架构分层

项目是清晰的三层结构，层与层之间只靠少量函数调用和回调连接：

```
┌─────────────── 浏览器页面 ───────────────┐
│  index.html（入口，挂载 #root）           │
│  styles.css（2D 界面样式，与 3D 无关）     │
└────────────────┬─────────────────────────┘
                 │ <script> 加载
┌────────────────▼─────────────────────────┐
│  UI 层 main.js                            │
│  · state 对象（time/weather/roof/door）    │
│  · 按钮事件绑定、toast、hint               │
│  · 引擎回调（ready/error/select/hover）    │
└────────────────┬─────────────────────────┘
                 │ createEngine / setState / setPerspective
┌────────────────▼─────────────────────────┐
│  引擎层 reference-engine.js（核心）        │
│  · 场景搭建（建筑/街景/人物/天气）          │
│  · 双相机 + OrbitControls                 │
│  · 渲染循环 requestAnimationFrame         │
│  · Raycaster 点击拾取                      │
└────────────────┬─────────────────────────┘
                 │ 调用 API
        ┌────────▼────────┐
        │ three.js        │──► WebGL Canvas 每帧输出
        └─────────────────┘
```

**数据流（正向）**：用户点按钮 → `pushState()` 改 state → `engine.setState(state)` → 渲染循环逐帧过渡到新状态。

**数据流（反向）**：用户点 3D 画面 → 引擎 Raycaster 求交 → 拿到 `userData.action` → 调 `select` 回调 → main.js 改 state 并回推引擎。

> 注意：`reference-engine.js` 是压缩过的代码（`bffunc.txt` 是它的备份），不要逐行读，把它当"可搜索的词典"。

---

## 3. 文件清单

| 文件/目录 | 作用 |
|-----------|------|
| `index.html` | 入口：一个空 div + 加载 main.js 模块 |
| `main.js` | UI 层：状态、事件、提示、引擎回调（**可读，先读这个**） |
| `reference-engine.js` | 3D 引擎全部逻辑（压缩代码，用 grep 定位概念） |
| `styles.css` | 界面样式：Tailwind 产物 + 本地补充规则 |
| `public/branding/` | 招牌贴图 PNG，由 `loadBrandAssets()` 加载 |
| `bffunc.txt` | 引擎压缩代码的纯文本备份 |
| `DESIGN.md` / `PRODUCT.md` | 设计系统 / 产品定位文档 |
| `qa-shots/` | 开发过程 QA 截图（未入库） |
| `dist/` | `npm run build` 的产物 |

---

## 4. 第一个概念：场景图（Scene Graph）

Three.js 中一切 3D 对象挂在一棵树上，和 DOM 一样。**移动一个 Group = 移动整棵子树**。

```
Scene 场景
├─ 建筑组（墙体 · 玻璃幕墙 · 货架收银 · 自动门 · 樱花树）
├─ 屋顶组（屋顶板 + 空调）      ← 整体上移 = "展开屋顶"
├─ 灯光（太阳平行光 · 半球光 · 店内点光）
├─ 天气粒子（雨线 · 雪花 · 涟漪 · 积雪）
├─ 角色（店员 · 顾客 · 行人 · 小猫）
└─ 地面基座（道路 · 人行道 · 盲道 · 斑马线）
```

项目里两个功能直接印证这个概念：

- **展开屋顶**：把屋顶 Group 的 `position.y` 抬高 + 材质 `opacity` 渐变，一行业务代码都不用改建筑
- **滑动门**：只改两个门子节点的 `position.x`

---

## 5. 核心概念对照表

学一个概念，来项目里找一个实例（第三列是去引擎里搜的关键词）：

| 概念 | 在项目里的体现 | grep 关键词 |
|------|--------------|------------|
| Mesh = Geometry + Material | 建筑/商品全是 Box/Cylinder + MeshStandardMaterial | `MeshStandardMaterial`、`roughness` |
| 正交相机 | 默认视角，微缩模型无近大远小 | `OrthographicCamera` |
| 透视相机 | 工具条一键切换，切换时保持取景 | `PerspectiveCamera` |
| 平行光 + 阴影 | 太阳光投影，地图 2048 阴影贴图 | `DirectionalLight`、`shadow.mapSize` |
| 半球光 | 天空/地面双色环境光 | `HemisphereLight` |
| InstancedMesh | 樱花 530 朵、雪堆、花瓣（一次 draw call） | `setMatrixAt`、`setColorAt` |
| CanvasTexture | LAWSON/DRINKS/STAFF 招牌字 | `createRadialGradient`、`CanvasTexture` |
| Raycaster | 点击门/售货机/扭蛋机/猫 | `setFromCamera`、`intersectObjects` |
| OrbitControls | 拖转/缩放/Shift 平移，带阻尼 | `enableDamping`、`maxPolarAngle` |
| 雾 | 远处物体融入背景色，氛围关键 | `Fog` |
| 色调映射 | ACESFilmic 电影感曝光 | `toneMapping`、`ACESFilmic` |
| 环境贴图 | 给玻璃/金属提供反射 | `PMREMGenerator`、`environment` |
| 粒子系统 | 雨（LineSegments）、雪（Points+贴图） | `Points`、`PointsMaterial` |
| 线段 | 雨滴用线段而非粒子，更像雨丝 | `LineSegments` |
| 透明材质 | 玻璃墙：transparent + opacity + depthWrite | `depthWrite` |
| 种子随机数 | 固定种子让场景每次刷新长得一样 | `mulberry32`（或搜 `=>` 附近的随机函数） |
| 阻尼动画 | 所有平滑过渡的通用公式（见 §7.3） | `Math.exp` |

---

## 6. 渲染循环：一帧的生命周期

所有 3D 动画的本质：**每帧改一点状态，然后重新渲染**。

```
requestAnimationFrame(Te)            // 1. 请求下一帧
  ↓
dt = min(实际间隔, 0.055)             // 2. 时间增量（封顶防切屏跳帧）
  ↓
昼夜/天气过渡                          // 3. 背景、雾、灯光、曝光逐帧 lerp
  ↓
动画更新                              // 4. 门开合、屋顶抬升、猫/行人、雨雪粒子
  ↓
controls.update()                     // 5. 相机阻尼
  ↓
renderer.render(scene, camera)        // 6. 出画面
```

---

## 7. 值得精读的五个实现

### 7.1 点击拾取链路（Raycaster）

```
pointerup（先判断位移 <5px 区分"点"和"拖"）
  → 把屏幕坐标换算成 NDC（-1..1）
  → raycaster.setFromCamera(NDC, 当前相机)
  → intersectObjects(可交互对象列表)
  → 命中 → 读 object.userData.action（'door'/'vending'/'cat'...）
  → 调用 main.js 传入的 select 回调
```

学习点：可交互对象在建模时就被塞进 `userData.action`，并注册进 `interactables` 数组——**数据和行为在搭建阶段就绑定好了**。

### 7.2 双相机切换（保持取景一致）

切换不是简单地换相机引用，而是做了取景换算：

- 正交 → 透视：按 `可视高度 / (2 × zoom × tan(fov/2))` 算出等效距离，把透视相机放到同方向该距离上
- 透视 → 正交：反向算出 `zoom`，让画面主体大小不变

切换后还要**重建 OrbitControls**（controls 在构造时绑定相机引用）。

### 7.3 阻尼动画公式（全项目通用）

```js
value += (target - value) * (1 - Math.exp(-dt * speed));
```

为什么不用线性插值 `value += (target-value)*0.1`？——这个指数公式**帧率无关**（dt 参与），任何刷新率下速度一致。项目里昼夜过渡、门开合、镜头切换全是它。

### 7.4 InstancedMesh（性能关键）

樱花 530 朵如果建 530 个 Mesh 会卡；InstancedMesh 只有一个几何体 + 一个材质，用矩阵控制每朵的位置/旋转/缩放：

```js
const mesh = new InstancedMesh(几何体, 材质, 530);
for (let i = 0; i < 530; i++) {
  dummy.position.set(...); dummy.rotation.set(...); dummy.scale.set(...);
  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);   // 每朵写进一个矩阵槽
  mesh.setColorAt(i, new Color(...));  // 还能逐实例变色
}
```

### 7.5 CanvasTexture（零美术资源做招牌）

用 2D canvas 画字/渐变 → `new CanvasTexture(canvas)` → 作为材质贴图贴到招牌板上。项目里所有 "LAWSON"、"DRINKS"、"24H" 文字都是这么来的，不需要任何图片文件。

---

## 8. 学习路径（建议三步）

**第一步：过官方基础（半天）**
threejs.org → Docs → Fundamentals：Scene、Camera、Mesh、Light、Animation、Resources 六篇。

**第二步：把本项目当词典**
每学一个概念，用 §5 的关键词在 `reference-engine.js` 里搜索，看真实工程里怎么用。注意工程代码和教程代码的差异：性能预算、降级（低核设备降阴影分辨率）、内存释放（dispose）。

**第三步：写 mini 版（最重要）**
新建空项目，按顺序实现：

1. 一块地面 + 一个盒子 + 一盏投影的灯
2. OrbitControls 拖转缩放
3. 渲染循环里让盒子自转（理解 dt）
4. Raycaster 点击盒子变色（理解 userData）
5. InstancedMesh 撒 100 个小球
6. CanvasTexture 做一块文字招牌
7. 双相机切换
8. 天气粒子（雨或雪选一个）

做完这八个，你已经能独立搭一个交互式 3D 场景了。

---

## 9. 资源

- 官方文档与手册：<https://threejs.org/manual/>
- 官方示例（按特性搜索，最好的学习库）：<https://threejs.org/examples/>
- 发现之旅（交互式教学，强烈推荐）：<https://threejs-journey.com/>
- MDN WebGL 概念（理解底层）：<https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API>
