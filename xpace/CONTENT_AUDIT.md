# XPACE 页面与 Technical Report 核查记录

核查日期：2026-09-17。范围：Overview 之后、Contributors 之前的演示区、Method、Results，以及相关图注、弹窗说明、替代文本和网页图表。

依据：`/Users/yuexy/Code/web/xpace_paper/main.pdf`。网站中的 [xpace.pdf](assets/papers/xpace.pdf) 与原件 SHA-256 完全相同：`14d4ba73930484af2455609435e9b5dbe00b7754bbfae64885436b10ec1e8956`。

## 章节顺序

正式研究章节与报告的逻辑顺序一致，未将 PDF 浮动图表的位置误当作章节顺序。

| 网页内容 | 报告位置 | 结果 |
| --- | --- | --- |
| Method / Data | §3.1，pp5–7 | 一致 |
| Model Architecture | §3.2，pp7–9 | 一致 |
| Training Paradigm：Stage I → Stage II | §3.3，pp9–10 | 一致 |
| Post Training：III-sim → 恢复数据合成 → III-policy | §3.4，pp10–13 | 一致 |
| Results / Experimental Setup | §4.1，p13 | 一致 |
| Simulation / Skeleton conditioning | §4.2.1，p14；Table 1 | 一致 |
| Simulation / SGF → Final simulator | §4.2.2，pp14–15；Tables 2–3 | 一致 |
| Policy / Real-robot performance and robustness | §4.3.1，pp15–17；Figures 7–8 | 一致 |
| Human-to-robot skill transfer | §4.3.2，pp17–18；Figure 9 | 一致 |
| Contribution of video pretraining | §4.3.3，p18；Figure 10 | 一致 |
| Human supervision during robot adaptation | §4.3.4，pp18–19；Table 4 | 一致 |
| Cross-embodiment generalization | §4.3.5，pp19–20；Figure 11 | 一致 |
| Policy self-improvement → Closed-loop diagnosis | §4.3.6，pp20–22；Figures 12–13 | 一致 |

五段前置视频沿用此前要求，作为 Overview 后的展示区，不是报告的独立章节。红绿苹果视频与指令来自用户提供的真实机器人素材，不能与 Figure 13 的模拟失败案例混同。抽屉、面包、叠碗三段视频按 Figure 9 的顺序组织。视频的任务指令保持用户给定文本；抽屉的结果说明仅描述 approach/contact/push，不将指令 “Close the drawer” 当作完整关闭的成功率证据。

## 文案修正

本轮修正聚焦术语与实验口径，没有改动实验数值或交互样式：

- **§3.1–3.2：** 使用报告的 end-effector poses、asymmetric mixture-of-transformers (MoT)、Video Transformer / Action Transformer 等术语；区分视频分支的视觉／语言条件与动作分支的当前状态输入，明确模拟模式不使用语言、动作分支不激活。
- **§3.3：** 将容易被理解为确定性交替的 “alternates equally” 改为每次更新等概率采样两种模式；明确 L1 保留描述性 caption，以及 F 从 Phase II-b 起仅进入模拟更新。
- **§3.4：** 明确 skeleton controls 与 camera poses；恢复控制返回 expert pivot pose。保留模拟器与策略分别从 Phase II-c 初始化、固定模拟器、8% 恢复数据的说明。
- **§4.1：** 补充 480 × 832 的高宽顺序、归一化动作空间中的 teacher-forced MSE、进度分数的逐试验里程碑均值，以及 collection-based 分组边界。
- **§4.3.1：** 外部比较明确包含完整模型与训练配方；干扰物实验明确为独立的 block-to-box 任务，避免误认为仍是香蕉任务。
- **§4.3.3 / Figure 10：** 补充 tail-window average 与 normalized-action MSE，保留视频曝光量与预训练计算量共同变化的限定。
- **§4.3.4–5 / Figure 11：** 明确损失变化以 robot-only 为基准；补充 19 个 subsets → 8 个 task-semantic families 的二次分析分层，及负值表示损失增加。
- **§4.3.6 / Figure 12：** 补充香蕉与倒水 Before DAgger 复用 Figure 7 试验、阴影列为未加权任务均值，以及该三任务集合用 cola handover 替代 bowl stacking。
- **Figure 13：** 替代文本明确错误选中了哪一个对象，与报告图注一致。

保留报告的重要归因边界：XPACE 独有 Stage I 视频适配；robot-only/full-data 同时改变人类动作监督与无监督视频；SGF 的推理步数为 50 对 8；DAgger 前后比较包含额外优化预算。未将离线动作损失、定性示例表述为真实机器人成功率。

## 表格数值

从 PDF 页图独立读取后，对照 JSON、HTML 可见文本与 `data-value`。共 **117 个数值和 1 个未报告值**，无转录、精度、分组或指标方向错误。

| 来源 | 测量数值 | 未报告值 | 最优值标记 |
| --- | ---: | ---: | ---: |
| Table 1，p14 | 48 | 0 | 8 |
| Table 2，p15 | 48 | 0 | 16 |
| Table 3，p15 | 16 | 0 | 0 |
| Table 4，p19 | 5 | 1 | 1 |
| 合计 | 117 | 1 | 25 |

Table 3 的 97/193 帧行标签另行核对。单位正确：PSNR 为 dB，Latency 为秒，Memory 为 GB。Table 4 的 2.7、2.8 是百分点（pp）标准差，描述同一训练过程九个后期 checkpoints 的波动；不是相对百分比，也不是跨独立随机种子的误差。Robot-only 没有报告标准差，网页显示 “—”。表头按当前设计不显示单位，百分号跟随相应数值，其余单位由表下注明。

## 图表数值

从 PDF 第 16、18、20 页独立读取 Figures 7、8、10、11、12，并核对 JSON、HTML 可见标签和 SVG 几何。共 **61 个数据点**，无转录或比例错误。图 7/8/12 的进度与成功率使用不同坐标上限；图 10 保持原图的等间隔曝光类别；图 11 的 −9.3 柱向左、0.3 柱向右。

唯一精度差异已在 Figure 7 网页图注说明：原图将平均成功率标成 **7% / 68%**，同页正文给出 **6.7% / 68.3%**，网页采用正文较精确值。其余均值直接保留报告值。例如 XPACE 平均进度保留 **0.84**，不对已经四舍五入的各任务标签重新求均值。

Figure 10 的变化依次为 `0, −8.1, −9.0, −9.0, −12.5 (%)`。Figure 11 按 robot/human coverage 顺序 Dense/Dense、Absent/Dense、Absent/Sparse、Absent/Absent：mid-training → robot-only FT 为 `5.1, 14.9, 7.3, −9.3`，co-training 为 `10.0, 22.7, 10.8, 0.3`。没有将所有覆盖分层概括为均有提升。

数据来源文件：[charts.json](assets/data/charts.json)、[experiment-tables.json](assets/data/experiment-tables.json)。定性配图来源记录：[report-sources.md](assets/figures/report-sources.md)。
