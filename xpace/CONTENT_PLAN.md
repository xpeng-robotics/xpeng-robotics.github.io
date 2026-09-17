# XPACE 主页内容方案

依据：`/Users/yuexy/Code/web/xpace_paper/main.pdf`，28 页（正文与贡献者到第 22 页）。章节与数字以本次本地报告为准。

## 当前实施状态

Overview 标题现为 “Overview”，正文为 abstract 的精简版，保留双模式、共享视频骨干、异构监督、保留人类经验的课程学习、模拟恢复数据生成和 IRON 实验结论。配图使用报告 Figure 1 的高分辨率裁剪，完整原图注以 HTML 呈现；边框、阴影与放大交互沿用 Method 配图。

首页现为 Hero → Overview 与 Demo → Method → Results → Contributors。Method 按报告 3.1–3.4 分为 Data、Model Architecture、Training Paradigm、Post Training。Results 按第 4 章顺序组织 Experimental Setup、Simulation（2 个子节）、Policy（6 个子节），覆盖表 1–4 和图 7–13：实验表格为原生 HTML，数值图为原生 SVG，定性关键帧直接提取报告。图表保留原图配色、数值提示、图例高亮与放大查看。章节采用左侧标题、右侧内容，且从 Method 开始每章前均保留横线。顶部导航为 Overview / Method / Results，另保留 Technical Report 与 Github。Demo 没有单独导航项，模板小导航已删除。

Results 后现已增加 Contributors 章节，包含报告第 22 页的 16 位作者、四类角色脚注及可复制的 `@techreport{wei2026xpace}` 引用。Contributors 仅在页尾展示，不加入顶部导航。

以下保留早期内容研究笔记和来源索引；其中旧首屏文案、导航建议和实施顺序已由当前页面取代。后续可在现有章节中替换正式配图、加入模拟视频或精简文案，无需恢复模板列表。

## 叙事与视觉原则

核心句：XPACE 从异构人类与机器人经验中学习，用共享的视频骨干支持动作生成与世界模拟，再用模拟器生成的恢复经验改进真实机器人策略。

建议英文导语：

> Learn from heterogeneous experience. Predict actions and their consequences. Improve with simulated recoveries.

沿用 AnyWorld 的“研究论点 → 可见能力 → 方法解释 → 实验证据”结构。XPACE 的重点是人类经验迁移和模拟驱动的策略改进。保留现有黑白主题、机器人首屏、悬浮导航、圆角主体卡片、返回顶部按钮；将 Material Kit 的五组演示列表替换为研究内容。

章节沿用“左侧简短标题与说明，右侧证据”的布局。真实机器人视频用三列卡片；流程图、模型图和图表跨满右侧区域，避免将全部内容压成等宽小卡片。手机端先说明后素材，比较视频上下排列并保留清楚标签。内容默认可见，不以轮播或分页隐藏核心结果。

导航建议：Overview / Capabilities / Method / Simulation / Self-improvement / Results；右侧继续放 Github ↗。资源与贡献者位于页尾。

## 0. Hero：项目身份

- 标题：XPACE。
- 正式副标题：Joint World and Action Modeling from Heterogeneous Experience。
- 团队：World Model Team, XPENG Robotics。
- 短导语使用上面的三句英文。
- 主按钮：Technical Report；次按钮：Watch Demos（跳到能力区）。顶部 Github 当前仍是组织主页，项目仓库地址确认后替换。
- 保持目前机器人背景；不在首屏堆放全体作者或摘要全文。
- 首屏下沿三个简短要点：Heterogeneous experience / Shared world–action model / Simulation-driven improvement。

来源：摘要、图 1，第 1–3 页。

## 1. Overview：一眼理解研究主张

标题：One model to act, simulate, and improve.

说明建议：

> XPACE connects diverse human and robot experience through a shared video backbone. It jointly predicts actions and future video, simulates prescribed motions, and generates recovery supervision for policy improvement.

中心图重绘为四个节点：

Human + robot experience → Shared world–action model → Simulated recoveries → Improved robot policy

模型节点向下展开两个模式：

- Policy：视觉历史 + 当前状态 + 指令 → 可执行动作 + 未来视频。
- Simulator：视觉历史 + 指定骨架动作 + 相机位姿 → 未来视频。

可用小字给出 5,000 hours of embodied video，但不要称为 5,000 小时机器人遥操，也不要推算未公开的数据层占比。

素材：参考图 1（第 1 页）重新组织网页流程图；技术结构在 Method 展开，避免在这里重复铺满网络模块。

## 2. Capabilities：优先展示人类经验如何落地

标题：Human experience expands robot capabilities.

副标题：Transfer manipulation behaviors beyond robot demonstrations.

三张大视频卡按能力递进排列，逐张写清指令、已有数据覆盖及可见结果：

| 卡片 | 指令 | 主要说明 | 当前候选素材 |
| --- | --- | --- | --- |
| Unseen-object interaction | Close the drawer. | 抽屉未出现在机器人训练数据中；展示接近、接触、向内推动，不扩大为所有抽屉均可可靠关闭。 | `assets/videos/drawer_graded.mp4` |
| Manipulation transfer | Put the bread in the plate. | 面包在两类数据中均出现，但烤面包机到盘子的任务未出现在机器人示范中。 | `assets/videos/bread_graded.mp4` |
| Sequential composition | Stack three bowls. | 一个指令下连续完成两次放置，后一动作依赖前一动作产生的状态。 | `assets/videos/three_bowls_graded.mp4` |

来源：图 9，§4.3.2，第 17–18 页。这里是定性示例，不给视频卡添加未经报告支持的成功率。后续已通过本地 Chrome 验证五段视频均可解码播放，并提取封面；三个迁移任务的指令由用户确认。

若可提供对应的人类示范，将卡片扩展为 Human demonstration / IRON execution 对照；没有人类视频时，只放机器人视频，不构造对应关系。

## 3. Method：数据、模型与训练如何共同工作

标题：Shared prediction connects heterogeneous experience to control.

在一个章节下按三块展开，先简图后短解释：

### 3A. Complementary experience

重绘四层数据金字塔（图 2，第 6 页）：

- L1：无动作标注的第一视角视频——学习视觉动态。
- L2：带手腕、手部动作标注的人类示范——学习操作行为。
- L3：任务或外观对齐的桥接数据——缩小人类与机器人经验差异。
- L4：IRON 遥操——提供可执行的机器人动作监督。
- F 在金字塔旁单独显示：失败与恢复数据，仅训练模拟器，不用于模仿失败动作。

### 3B. One backbone, two modes

采用图 4（第 8 页）的精简版：共享 Video Transformer + Action Transformer，两种模式并列。突出视频到动作的多层特征读取及具身专用输入输出投影。模拟模式不输入语言、动作分支不活跃；策略模式不能画成已知未来骨架的条件输入。

多层语言描述、动作维度和具体模块层数放进“Technical details”折叠区或留在报告中。

### 3C. Broad experience to robot control

参考图 5、6（第 10–11 页）绘制时间轴：

Video pretraining → Broad joint training → Bridge & robot emphasis → Target-robot adaptation with human replay

强调最终适配仍保留人类经验。SGF 模拟器与后续策略都是从 Phase II-c 分别初始化；它们之间传递的是恢复数据，而不是把 SGF 模拟器权重继续训练为策略。细节在 Self-improvement 展开。

## 4. Simulation：可控预测与策略诊断

标题：Predict consequences. Inspect behavior.

分为两种不同证据：

1. **Control-conditioned prediction**：指定骨架与相机控制 / Ground truth / Predicted video 三栏对照。再用 Baseline / + SGF 对照展示长时滚动改进。来源：§4.2、表 2–3，第 14–15 页。需要补充源视频；没有时先用清晰指标图，不拿真实机器人执行视频代替模拟视频。
2. **Policy–simulation diagnosis**：指令 → 策略动作 → 模拟画面 → 下一步观察。使用图 13（第 21 页）的成功与失败案例成对展示：正确红色水果选择与错误绿色水果选择等。这里是定性诊断，不能宣传为已校准的真实成功率预测器。

用户已确认：`red_apple_graded.mp4`、`green_apple_graded.mp4` 是真实机器人的指令目标选择对照，分别按指令抓取红/绿苹果放入篮子。已放入 Capabilities，不能用于图 13 的模拟失败展示。

可突出 SGF 在表 2 的 193 帧实验中获得 ID 3.00×、OOD 3.30× 推理加速，质量指标也提升；明确对应 L4+F 消融基线和 50→8 步采样设置，不称为实时机器人控制速度。最终生成恢复数据的模拟器来自完整 Phase II-c + SGF，对应表 3。

## 5. Self-improvement：主页重点证据

标题：Simulated recoveries improve real-world execution.

用一个流程解释闭环：

Expert demonstration → Deviation–recovery controls → Simulator rendering → Consistency filtering → Recovery + expert continuation → Policy fine-tuning

展示一组时间序列：专家状态 / 偏离状态 / 恢复状态 / 继续完成任务。若有视频，下面放 Before / After 真实机器人对照，倒水任务优先。

图 12（第 20 页）、§4.3.6（第 21–22 页）的成功率：

| 任务 | Before DAgger | After DAgger |
| --- | ---: | ---: |
| Banana pick-and-place | 80% | 90% |
| Water pouring | 50% | 95% |
| Cola handover | 55% | 75% |
| 三任务平均 | 61.7% | 86.7% |

醒目数字：**+25 percentage points**；注明每任务、每方法 20 次真实机器人试验。配套小字：8% filtered synthetic recoveries in the fine-tuning mixture。

这是固定模拟器生成恢复监督、再微调独立策略的过程。不要写成在线自主强化学习、无限自我迭代或无需专家示范；也不要将增益完全归因于恢复数据本身，因为报告未隔离额外优化预算的作用。

## 6. Results：主实验与训练贡献

标题：Measured on the IRON humanoid.

### Primary real-robot benchmark

来源：图 7，第 16 页。用网站原生条形图显示平均成功率：

| 方法 | 平均成功率 | 平均任务进度 |
| --- | ---: | ---: |
| GR00T | 6.7% | 0.36 |
| DreamZero | 40.0% | 0.68 |
| XPACE | 68.3% | 0.84 |

注释：香蕉搬运、倒水、叠碗三个任务；每任务每方法 20 次试验。叠碗相对机器人训练集为 task OOD，但在人类及桥接数据中有覆盖。外部对比衡量完整模型与训练方案；XPACE 独有 Stage I 视频适配，不能表述为严格架构消融。

### Robustness from heterogeneous experience

来源：图 8，第 16–17 页。小型并列图：

- 五个固定物体位置：Robot-only 50% → Full data 80%。
- 未见干扰物：Robot-only 30% → Full data 50%。

### Why the training recipe matters

用简洁说明卡或可展开图表收纳：

- Stage I 完整视频预训练：离线动作损失降低 12.5%（图 10，第 18 页）。
- 持续人类—机器人共训：离线动作损失降低 14.0%；先人类 mid-training 后 robot-only FT 为 8.5%（表 4，第 19 页）。
- 机器人未覆盖、人类密集覆盖的行为：共训的离线动作损失降低 22.7%（图 11，第 20 页）。

以上百分比均为各自实验定义下的动作损失改善，不能标为真实任务成功率，也不宜与主实验成功率混排成无说明的数字墙。

## 7. Report, contributors, and citation

- Technical Report 下载入口；确认可以随主页公开后，将 PDF 放入 `assets/papers/`。
- Github 项目仓库地址待提供，目前仍是组织地址。
- 团队署名与贡献者参考第 22 页，保留贡献标记含义。
- BibTeX 根据正式发表信息填写；当前不编造 arXiv 编号、会议或 DOI。
- 用一小段说明当前评估范围，并把更长时、接触密集交互及真实反馈驱动的持续改进列为未来方向。

## 素材准备优先级

1. 核实并接入 drawer / bread / three_bowls 三段真实机器人视频，建立能力区。
2. 从报告图 1、2、4、5 重绘网页友好的总览、金字塔、架构与训练图；不直接把整页 PDF 当图放入主页。
3. 将图 7、8、12 的数字重绘成可响应式显示的图表，附实验口径。
4. 补充 SGF 前后模拟视频、恢复轨迹生成过程、DAgger 前后倒水视频。
5. 核实 red_apple / green_apple 素材用途，补齐模拟闭环诊断区。
6. 替换并清理 Material Kit 演示图与文案，保留适用许可记录。

## 实施顺序

第一轮：更新 Hero、Overview、Capabilities、Self-improvement 和 Resources，先明确研究主线及主要证据。

第二轮：完善 Method、Simulation、Results，补上图表、对照视频与细节展开区。

发布前核对：所有指标对应来源、真实/模拟视频标签、OOD 的数据覆盖含义、报告与仓库链接、贡献者名单。
