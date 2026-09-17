# Figures from the XPACE technical report

Source: [`../papers/xpace.pdf`](../papers/xpace.pdf).

These PNGs are cropped renders of the original PDF figures. Figure contents are unchanged; surrounding paper text and captions are omitted for use with HTML captions. Page numbers are one-based PDF page numbers.

The website renders Figures 7, 8, 10, 11, and 12 as native inline SVG charts. The unused bar-chart PNGs and Overview placeholder SVGs have been removed; the original figures remain available in the PDF for verification. The transcribed values and original colors are maintained in `../data/charts.json`; `../../scripts/render_charts.py` generates the markup. Figure 7's mean success rates use the prose values 6.7% and 68.3%, rather than the original figure's rounded labels 7 and 68. Figure 10 (page 18) uses the original blue line; Figure 11 (page 20) preserves the yellow/blue method order and the negative loss-reduction value.

Tables 1–4 (pages 14, 15, and 19) are native HTML tables, with exact printed precision and provenance in `../data/experiment-tables.json`. `../../scripts/render_tables.py` generates their markup. No quantitative experimental table or plot is embedded as a screenshot.

| File | Source | Dimensions |
| --- | --- | --- |
| `report-overview.png` | Figure 1, page 1: unified world/action model, heterogeneous data, and joint training; full original caption rendered in HTML | 2200 × 1252 |
| `report-data.png` | Figure 2, page 6: heterogeneous data pyramid | 2000 × 916 |
| `report-model.png` | Figure 4, page 8: architecture and operating modes | 2000 × 797 |
| `report-training.png` | Figure 5, page 10: training stages | 2000 × 562 |
| `report-transfer.png` | Figure 9, page 17: qualitative human-to-robot skill transfer | 2000 × 1273 |
| `report-simulation.png` | Figure 13, page 21: policy–simulation closed loop, including failed target selections | 2000 × 1145 |
