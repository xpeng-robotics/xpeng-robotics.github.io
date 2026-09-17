# XPACE

纯静态项目首页，无 Vue、构建步骤或运行时 CDN 依赖。目录组织与 `anyworld` 一致。

## 预览

直接打开 `index.html`，或在仓库根目录运行 `python3 -m http.server 8000`，访问 `http://localhost:8000/xpace/`。

## 文件

- `index.html`：研究首屏、Overview 与能力视频、按报告顺序组织的 Method 和 Results，以及末尾 Contributors 作者与引用区。禁用 JavaScript 时也可浏览内容、图表和表格。
- `styles.css`：黑白分区、圆角悬浮主体卡片、深浅主题及响应式布局。颜色变量位于文件顶部。
- `charts.css` / `charts.js`：网页图表的响应式布局、鼠标悬停高亮及数值提示。
- `script.js`：主题保存、移动导航与当前章节指示、视频自动播放管理、视频/图片预览弹窗及 BibTeX 复制。
- `assets/fe0/`：从 `anyworld` 复制的 XPENG 标识、favicon 和两张 IRON 首屏背景。
- `assets/figures/`：报告的 Figure 1 总览图，以及数据、模型、训练、技能迁移、模拟诊断五张配图。图表数据可对照保留的 PDF 原件核查。
- `assets/data/charts.json`：图 7、8、10、11、12 的逐项数值、原图颜色和来源说明。
- `assets/data/experiment-tables.json`：表 1–4 的全部数据、实验配置、章节顺序和来源说明，保留报告的小数精度。
- `scripts/render_charts.py` / `scripts/render_tables.py`：修改数据后可运行的开发辅助脚本，将图表和表格写入 `index.html`；正常打开页面无需运行脚本或启动服务。
- `assets/videos/`：五段真实机器人演示；红绿苹果组成指令对照，抽屉、面包和叠碗组成技能迁移展示。
- `assets/posters/`：从五段演示视频提取的本地封面，用于加载中或自动播放受限时。
- `assets/papers/xpace.pdf`：technical report，首屏和顶部导航均可打开下载窗口。
- `assets/licenses/`：参考项目的 MIT 许可。

默认采用浅色主题和黑色页脚，也可通过导航栏按钮切换深色主题。浅色首屏显示 `iron-david-stance.webp`，深色首屏显示 `iron-front-hand.webp`，背景和文字颜色随主题同步切换。研究章节在桌面采用左侧固定标题、右侧内容，800px 及以下上下排列；第一章及后续章节前均有分隔线。顶部导航为 Overview / Method / Results，另有报告与 Github 入口；1100px 及以下折叠为菜单。

Overview 使用报告 abstract 的精简文案、从 PDF 直接提取的 Figure 1 及其完整原图注，图片样式和放大方式与 Method 一致。Method 按报告 3.1–3.4 组织为 Data / Model Architecture / Training Paradigm / Post Training。Results 按第 4 章排列：Experimental Setup → Simulation（短时预测、SGF 长时预测与最终模拟器）→ Policy（真实机器人性能与鲁棒性、技能迁移、视频预训练、人类监督保留、跨形态泛化、策略自改进）。配图对应图 1、2、4、5、9、13；全部实验结果覆盖表 1–4、图 7–13。图注保留实验范围、来源与必要的归因限制。图片与图表均可放大查看，支持 Escape 关闭。

图表参考 Fe0 的内联 SVG 外观：悬停柱体或图例强调同一方法，悬停图 10 的单个点时仅保留该点高亮，其他点与折线同步淡化；移开鼠标恢复原状。数据点、柱体和图例均无点击操作，数值直接标注于图中，另有悬停提示；放大按钮可打开图表弹窗。窄屏上下排列指标和覆盖层级标签。柱体保留原图的蓝色 `#6086b0`、黄色 `#dfc985`、绿色 `#9eb19e`，图 10 的折线保留原色 `#0068b8`。图 7 的平均成功率采用正文精度 6.7% 和 68.3%，其余数值遵循报告图上的精度。静态 SVG 不依赖网络、运行时数据请求或第三方图表库。四张实验表使用语义化 HTML，宽表在卡片内横向滚动，手机不会撑宽整页。

报告、图片、图表和视频弹窗统一使用 300ms 淡入下滑与淡出过渡，遮罩同步渐变；关闭按钮、Escape 和点击遮罩共用同一过渡。视频资源在退出动画结束后释放；系统开启减少动态效果时关闭过渡。

Contributors 参考 Fe0 的姓名、角色脚注和引用代码框格式。16 位作者的顺序及 `*`（Core contribution）、`§`（Equal contribution）、`†`（Project lead）、`‡`（Supervision）来自报告第 22 页，BibTeX 作者字段仅含姓名。条目使用 `@techreport`、XPENG Robotics 机构及报告首页的项目 URL；2026 年依据当前 PDF 元数据，未添加报告中没有给出的 arXiv 编号或发表刊物。复制按钮支持 Clipboard API 和本地文件下的选择复制回退。

设计参考 [Vue Material Kit](https://www.creative-tim.com/product/vue-material-kit)，Copyright (c) 2022 Creative Tim；保留许可及页面署名。未使用的模板预览图、Overview 占位 SVG 和旧柱状图截图已移除。

## 能力演示

五段视频预览默认静音自动循环播放，不提供暂停预览按钮，也不因滚动或打开弹窗主动暂停。浏览器仍可能根据自身的自动播放与后台节能策略限制播放，回到页面时会重新尝试播放。点击视频或用键盘激活卡片即可打开有原生播放控件的大视频，支持关闭按钮、Escape、点击遮罩关闭；关闭时释放播放资源并恢复卡片焦点。禁用 JavaScript 时，点击链接可直接打开视频文件。

桌面苹果组双列、技能组三列；平板技能组双列；手机所有视频单列。黑白主题通过统一颜色变量适配。
