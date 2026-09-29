const benchmarkDataByModel = {
  llm: {
    // Kept for reference / any leftover metric lookups; LLM Results uses llmPerformanceBoard.
    ifeval: [
      { name: "Qwen3.5-0.8B", short: "Qwen3.5", score: 45.3 },
      { name: "MiniCPM5-1B", short: "MiniCPM", score: 70.4 },
      { name: "IronLLM-0.6B-Light", short: "Iron-Light", score: 69.5, iron: true },
      { name: "IronLLM-0.6B", short: "Iron", score: 75.6, iron: true },
    ],
  },
  vit: {
    linear_in1k: [
      { name: "C-RADIOv4", score: 87.33 },
      { name: "IronViT FA", score: 87.38, iron: true },
      { name: "IronViT HA", score: 86.81, iron: true },
    ],
    ade20k: [
      { name: "C-RADIOv4", score: 54.1 },
      { name: "IronViT FA", score: 53.61, iron: true },
      { name: "IronViT HA", score: 53.17, iron: true },
    ],
    vlm_general: [
      { name: "SigLIP2", score: 67.97 },
      { name: "IronViT FA", score: 68.16, iron: true },
      { name: "IronViT HA", score: 68.24, iron: true },
    ],
    vlm_knowledge: [
      { name: "SigLIP2", score: 80.86 },
      { name: "IronViT FA", score: 80.79, iron: true },
      { name: "IronViT HA", score: 81.1, iron: true },
    ],
    coco_it: [
      { name: "PE-Core-L/14", score: 56.98 },
      { name: "IronViT FA", score: 56.14, iron: true },
      { name: "IronViT HA", score: 56.43, iron: true },
    ],
  },
};

/** Category averages + TPS from the IronLLM score & relative-efficiency figure. */
const llmPerformanceBoard = {
  categories: [
    {
      id: "long_context",
      title: "Long Context",
      rows: [
        { name: "IronLLM-0.6B", short: "0.6B", score: 57.4, model: "iron", iron: true },
        { name: "IronLLM-0.6B-Light", short: "0.6B", score: 54.7, model: "iron-light", iron: true },
        { name: "Qwen3-0.6B", short: "0.6B", score: 34.4, model: "qwen3" },
        { name: "LFM2-700M", short: "700M", score: 30.9, model: "lfm" },
        { name: "Qwen3.5-0.8B", short: "0.8B", score: 57.6, model: "qwen35" },
        { name: "MiniCPM5-1B", short: "1B", score: 41.9, model: "minicpm" },
      ],
    },
    {
      id: "general_knowledge",
      title: "General Knowledge",
      rows: [
        { name: "IronLLM-0.6B", short: "0.6B", score: 49.8, model: "iron", iron: true },
        { name: "IronLLM-0.6B-Light", short: "0.6B", score: 45.5, model: "iron-light", iron: true },
        { name: "Qwen3-0.6B", short: "0.6B", score: 39.6, model: "qwen3" },
        { name: "LFM2-700M", short: "700M", score: 36.2, model: "lfm" },
        { name: "Qwen3.5-0.8B", short: "0.8B", score: 37.9, model: "qwen35" },
        { name: "MiniCPM5-1B", short: "1B", score: 54.4, model: "minicpm" },
      ],
    },
    {
      id: "instruction",
      title: "Instruction Following",
      rows: [
        { name: "IronLLM-0.6B", short: "0.6B", score: 43.3, model: "iron", iron: true },
        { name: "IronLLM-0.6B-Light", short: "0.6B", score: 37.9, model: "iron-light", iron: true },
        { name: "Qwen3-0.6B", short: "0.6B", score: 34.3, model: "qwen3" },
        { name: "LFM2-700M", short: "700M", score: 35.5, model: "lfm" },
        { name: "Qwen3.5-0.8B", short: "0.8B", score: 33.7, model: "qwen35" },
        { name: "MiniCPM5-1B", short: "1B", score: 50.5, model: "minicpm" },
      ],
    },
    {
      id: "subjective",
      title: "Subjective Quality",
      rows: [
        { name: "IronLLM-0.6B", short: "0.6B", score: 11.1, model: "iron", iron: true },
        { name: "IronLLM-0.6B-Light", short: "0.6B", score: 6.6, model: "iron-light", iron: true },
        { name: "Qwen3-0.6B", short: "0.6B", score: 3.4, model: "qwen3" },
        { name: "LFM2-700M", short: "700M", score: 8.0, model: "lfm" },
        { name: "Qwen3.5-0.8B", short: "0.8B", score: 2.1, model: "qwen35" },
        { name: "MiniCPM5-1B", short: "1B", score: 5.1, model: "minicpm" },
      ],
    },
    {
      id: "mathematics",
      title: "Mathematics",
      rows: [
        { name: "IronLLM-0.6B", short: "0.6B", score: 35.0, model: "iron", iron: true },
        { name: "IronLLM-0.6B-Light", short: "0.6B", score: 29.4, model: "iron-light", iron: true },
        { name: "Qwen3-0.6B", short: "0.6B", score: 25.6, model: "qwen3" },
        { name: "LFM2-700M", short: "700M", score: 16.8, model: "lfm" },
        { name: "Qwen3.5-0.8B", short: "0.8B", score: 19.3, model: "qwen35" },
        { name: "MiniCPM5-1B", short: "1B", score: 26.7, model: "minicpm" },
      ],
    },
    {
      id: "code",
      title: "Code Generation",
      rows: [
        { name: "IronLLM-0.6B", short: "0.6B", score: 36.0, model: "iron", iron: true },
        { name: "IronLLM-0.6B-Light", short: "0.6B", score: 25.7, model: "iron-light", iron: true },
        { name: "Qwen3-0.6B", short: "0.6B", score: 25.4, model: "qwen3" },
        { name: "LFM2-700M", short: "700M", score: 19.1, model: "lfm" },
        { name: "Qwen3.5-0.8B", short: "0.8B", score: 10.2, model: "qwen35" },
        { name: "MiniCPM5-1B", short: "1B", score: 43.0, model: "minicpm" },
      ],
    },
    {
      id: "reasoning",
      title: "Reasoning",
      rows: [
        { name: "IronLLM-0.6B", short: "0.6B", score: 20.6, model: "iron", iron: true },
        { name: "IronLLM-0.6B-Light", short: "0.6B", score: 16.3, model: "iron-light", iron: true },
        { name: "Qwen3-0.6B", short: "0.6B", score: 17.3, model: "qwen3" },
        { name: "LFM2-700M", short: "700M", score: 11.5, model: "lfm" },
        { name: "Qwen3.5-0.8B", short: "0.8B", score: 20.1, model: "qwen35" },
        { name: "MiniCPM5-1B", short: "1B", score: 34.2, model: "minicpm" },
      ],
    },
    {
      id: "function_calling",
      title: "Function Calling",
      rows: [
        { name: "IronLLM-0.6B", short: "0.6B", score: 49.4, model: "iron", iron: true },
        { name: "IronLLM-0.6B-Light", short: "0.6B", score: 46.5, model: "iron-light", iron: true },
        { name: "Qwen3-0.6B", short: "0.6B", score: 47.9, model: "qwen3" },
        { name: "LFM2-700M", short: "700M", score: 37.7, model: "lfm" },
        { name: "Qwen3.5-0.8B", short: "0.8B", score: 38.8, model: "qwen35" },
        { name: "MiniCPM5-1B", short: "1B", score: 41.3, model: "minicpm" },
      ],
    },
  ],
  tps: [
    { name: "IronLLM-0.6B", short: "0.6B", score: 1.0, extra: 0.48, model: "iron", iron: true },
    { name: "IronLLM-0.6B-Light", short: "0.6B", score: 1.04, model: "iron-light", iron: true },
    { name: "Qwen3-0.6B", short: "0.6B", score: 0.44, model: "qwen3" },
    { name: "LFM2-700M", short: "700M", score: 1.10, model: "lfm" },
    { name: "Qwen3.5-0.8B", short: "0.8B", score: 0.93, model: "qwen35" },
    { name: "MiniCPM5-1B", short: "1B", score: 0.74, model: "minicpm" },
  ],
};

const llmBenchmarkSheet = {
  instruction: {
    desc: "Instruction following in non-thinking mode.",
    rows: [
      { name: "IFEval", iron: 75.6, light: 69.5, qwen3: [56.6, 55.1], lfm: 62.9, qwen35: [45.3, 57.3], minicpm: [70.4, 77.8] },
      { name: "IFBench", iron: 18.0, light: 16.3, qwen3: [15.7, 15.7], lfm: 17.0, qwen35: [15.7, 19.7], minicpm: [32.3, 43.2] },
      { name: "Multi-IF", iron: 36.3, light: 28.0, qwen3: [30.7, 33.1], lfm: 26.7, qwen35: [21.8, 32.3], minicpm: [30.2, 41.3] },
    ],
  },
  knowledge: {
    desc: "General knowledge benchmarks.",
    rows: [
      { name: "MMLU-Pro", iron: 42.1, light: 35.9, qwen3: [24.4, 37.6], lfm: 21.5, qwen35: [35.4, 45.9], minicpm: [36.8, 47.5] },
      { name: "MMLU-Redux", iron: 60.4, light: 56.2, qwen3: [46.5, 56.0], lfm: 47.1, qwen35: [54.2, 63.3], minicpm: [59.7, 69.5] },
      { name: "C-Eval", iron: 47.3, light: 44.7, qwen3: [42.3, 51.8], lfm: 37.8, qwen35: [29.0, 31.4], minicpm: [54.6, 66.6] },
      { name: "CMMLU", iron: 49.4, light: 45.2, qwen3: [45.3, 49.6], lfm: 38.3, qwen35: [33.0, 47.9], minicpm: [66.4, 72.2] },
    ],
  },
  math: {
    desc: "Mathematics and competition-style reasoning.",
    rows: [
      { name: "MATH-500", iron: 67.4, light: 57.4, qwen3: [52.2, 74.8], lfm: 27.6, qwen35: [43.8, 17.0], minicpm: [56.4, 89.0] },
      { name: "GSM8K", iron: 78.6, light: 73.6, qwen3: [61.8, 78.3], lfm: 52.5, qwen35: [49.4, 31.1], minicpm: [67.6, 86.4] },
      { name: "AIME 2025 (Avg@16)", iron: 10.2, light: 6.3, qwen3: [9.0, 16.3], lfm: 3.3, qwen35: [1.7, 0.0], minicpm: [0.0, 31.5] },
      { name: "AIME 2026 (Avg@16)", iron: 11.0, light: 4.4, qwen3: [2.1, 12.3], lfm: 0.2, qwen35: [0.0, 0.0], minicpm: [0.2, 36.0] },
      { name: "HMMT Feb. 2026 (Avg@16)", iron: 7.6, light: 5.3, qwen3: [3.0, 11.0], lfm: 0.4, qwen35: [1.5, 0.0], minicpm: [9.5, 26.5] },
    ],
  },
  longctx: {
    desc: "Long-context understanding and retrieval.",
    rows: [
      { name: "RULER", iron: 87.7, light: 82.1, qwen3: [40.4, 60.0], lfm: 56.2, qwen35: [87.5, 82.1], minicpm: [67.5, 78.2] },
      { name: "LongBench v2", iron: 27.0, light: 27.2, qwen3: [28.4, 28.2], lfm: 16.1, qwen35: [27.8, 25.8], minicpm: [24.3, 26.4] },
    ],
  },
  code: {
    desc: "Code generation benchmarks.",
    rows: [
      { name: "HumanEval", iron: 46.3, light: 31.7, qwen3: [32.9, 52.4], lfm: 30.5, qwen35: [15.2, 29.3], minicpm: [68.9, 83.5] },
      { name: "MBPP", iron: 45.0, light: 42.4, qwen3: [31.8, 39.6], lfm: 23.4, qwen35: [8.4, 14.6], minicpm: [48.8, 72.0] },
      { name: "LiveCodeBench v6 (Pass@3)", iron: 16.6, light: 14.3, qwen3: [11.4, 16.4], lfm: 3.4, qwen35: [6.9, 5.7], minicpm: [11.4, 37.7] },
    ],
  },
  reasoning: {
    desc: "Broad reasoning benchmarks.",
    rows: [
      { name: "BBH", iron: 37.6, light: 30.1, qwen3: [30.9, 56.0], lfm: 21.9, qwen35: [37.0, 60.3], minicpm: [67.4, 70.8] },
      { name: "ZebraLogic", iron: 3.5, light: 2.5, qwen3: [3.8, 29.0], lfm: 1.2, qwen35: [3.3, 23.4], minicpm: [1.0, 11.2] },
    ],
  },
  quality: {
    desc: "Subjective response quality.",
    rows: [
      { name: "AlpacaEval 2.0", iron: 10.2, light: 7.1, qwen3: [3.4, 2.6], lfm: 7.0, qwen35: [1.6, 2.9], minicpm: [4.0, 3.4] },
      { name: "ArenaHard", iron: 11.9, light: 6.1, qwen3: [3.5, 5.9], lfm: 9.0, qwen35: [2.6, 4.6], minicpm: [6.3, 6.4] },
    ],
  },
  tools: {
    desc: "Function calling.",
    rows: [
      { name: "BFCL v3", iron: 49.4, light: 46.5, qwen3: [47.9, 49.3], lfm: 37.7, qwen35: [38.8, 39.0], minicpm: [41.3, 49.6] },
    ],
  },
};

const llmCategoryLabels = {
  instruction: "Instruction following",
  knowledge: "Knowledge",
  math: "Mathematics",
  longctx: "Long context",
  code: "Code",
  reasoning: "Reasoning",
  quality: "Subjective Quality",
  tools: "Tools",
};

function formatLlmCell(value, expanded) {
  if (Array.isArray(value)) {
    return expanded ? `${value[0]} / ${value[1]}` : String(value[0]);
  }
  return String(value);
}

function llmResultColumns(expanded) {
  const primary = [
    { key: "iron", label: "IronLLM-0.6B", className: "col-iron" },
    { key: "qwen35", label: "Qwen3.5-0.8B", meta: expanded ? "NT / Thinking" : "Non-thinking" },
    { key: "minicpm", label: "MiniCPM5-1B", meta: expanded ? "NT / Thinking" : "Non-thinking" },
  ];
  if (!expanded) return primary;

  return [
    primary[0],
    { key: "light", label: "IronLLM-0.6B-Light", className: "col-iron-light" },
    { key: "qwen3", label: "Qwen3-0.6B", meta: "NT / Thinking" },
    { key: "lfm", label: "LFM2-700M" },
    ...primary.slice(1),
  ];
}

function getLlmBenchmarks() {
  return Object.entries(llmBenchmarkSheet);
}

function renderLlmResultsTable(expanded) {
  const head = document.querySelector("#llmResultsHead");
  const body = document.querySelector("#llmResultsBody");
  if (!head || !body) return;

  const columns = llmResultColumns(expanded);

  head.innerHTML = `
    <tr>
      <th scope="col">Benchmark</th>
      ${columns
        .map(
          (col) => `
        <th scope="col" class="${col.className || ""}">
          <span class="model-name">${col.label}</span>
          ${col.meta ? `<span class="model-meta">${col.meta}</span>` : ""}
        </th>`
        )
        .join("")}
    </tr>`;

  const rows = getLlmBenchmarks()
    .map(([key, block]) => {
      const groupRow = `<tr class="group-row"><th scope="row" colspan="${columns.length + 1}">${llmCategoryLabels[key] || key}</th></tr>`;
      const dataRows = block.rows
        .map((row) => {
          const visibleScores = columns.map((col) => {
            const value = row[col.key];
            return Array.isArray(value) ? value[0] : value;
          });
          const max = Math.max(...visibleScores);

          const cells = columns
            .map((col) => {
              const value = row[col.key];
              const score = Array.isArray(value) ? value[0] : value;
              const classes = [col.className || "", score === max ? "best" : ""].filter(Boolean).join(" ");
              return `<td class="${classes}">${formatLlmCell(value, expanded && Array.isArray(value))}</td>`;
            })
            .join("");

          return `<tr><th scope="row">${row.name}</th>${cells}</tr>`;
        })
        .join("");
      return groupRow + dataRows;
    })
    .join("");

  body.innerHTML = rows;

  const table = document.querySelector("#llmResultsTable");
  if (table) table.classList.toggle("is-expanded", expanded);
}

function initLlmResultsExplorer(root = document) {
  const explorer = root.querySelector("[data-llm-results]");
  if (!explorer || explorer.dataset.wired === "true") return;

  const expandToggle = explorer.querySelector("#llmResultsExpanded");
  let expanded = expandToggle ? expandToggle.checked : false;

  function render() {
    renderLlmResultsTable(expanded);
  }

  if (expandToggle) {
    expandToggle.addEventListener("change", () => {
      expanded = expandToggle.checked;
      render();
    });
  }

  render();
  explorer.dataset.wired = "true";
}

/* ---------------------------------------------------------------------- */
/* Benchmark chart rendering, scoped per model panel                       */
/* ---------------------------------------------------------------------- */

function renderChart(chartEl, rows, options = {}) {
  if (!chartEl) return;
  const { compact = false, valueDigits = 2 } = options;
  const max = Math.max(...rows.map((r) => r.score), 1);
  chartEl.innerHTML = rows
    .map((row) => {
      const modelClass = row.model ? ` model-${row.model}` : "";
      const ironClass = row.iron ? " iron" : "";
      const label = compact && row.short ? row.short : row.name;
      const value =
        valueDigits === 0
          ? String(Math.round(row.score))
          : row.score.toFixed(valueDigits);
      return `
      <div class="bar-row${ironClass}${modelClass}${compact ? " bar-row-compact" : ""}" data-score="${value}" tabindex="0" role="img" aria-label="${row.name}: ${value}">
        <span class="bar-label">${label}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width:0" data-width="${(row.score / max) * 100}%"></div>
        </div>
        <span class="bar-value">${value}</span>
      </div>`;
    })
    .join("");

  requestAnimationFrame(() => {
    chartEl.querySelectorAll(".bar-fill").forEach((el) => {
      el.style.width = el.dataset.width;
    });
  });
}

function renderVerticalBars(container, rows, options = {}) {
  if (!container) return;
  const { valueDigits = 1 } = options;
  const formatValue = (n) =>
    valueDigits === 0 ? String(Math.round(n)) : Number(n).toFixed(valueDigits);
  const totalOf = (row) => row.score + (row.extra || 0);
  const max = Math.max(...rows.map(totalOf), 0.01);
  const logoByModel = {
    iron: "assets/model-logos/iron.svg?v=logo2",
    "iron-light": "assets/model-logos/iron.svg?v=logo2",
    qwen3: "assets/model-logos/qwen3.png?v=logo2",
    lfm: "assets/model-logos/lfm.png?v=logo2",
    qwen35: "assets/model-logos/qwen35.png?v=logo2",
    minicpm: "assets/model-logos/minicpm.png?v=logo2",
  };

  container.innerHTML = rows
    .map((row) => {
      const extra = row.extra || 0;
      const total = totalOf(row);
      const value = formatValue(row.score);
      const totalLabel = formatValue(total);
      const model = row.model || "default";
      const height = Math.max(8, (total / max) * 100);
      const logo = logoByModel[model];
      const logoHtml = logo
        ? `<img class="vbar-logo" src="${logo}" alt="" width="32" height="32" draggable="false" />`
        : "";
      const basePct = (row.score / total) * 100;
      const extraPct = (extra / total) * 100;
      const mtpHtml = extra
        ? `<span class="vbar-mtp" style="height:${extraPct}%"><span>w/ MTP</span></span>`
        : "";
      const tip = extra ? `${row.name}: ${value} · w/ MTP ${totalLabel}` : `${row.name}: ${value}`;
      return `
        <button
          type="button"
          class="vbar model-${model}${row.iron ? " iron" : ""}${extra ? " has-mtp" : ""}"
          style="--h:${height}%"
          title="${tip}"
          aria-label="${tip}"
        >
          <span class="vbar-val">${extra ? totalLabel : value}</span>
          <span class="vbar-col">
            ${mtpHtml}
            <span class="vbar-fill" style="height:${basePct}%"></span>
            ${logoHtml}
          </span>
        </button>`;
    })
    .join("");
}

function initLlmPerformanceBoard(panel) {
  const board = panel.querySelector("[data-performance-board]");
  if (!board || board.dataset.wired === "true") return;

  const grid = board.querySelector("#perfGrid-llm");
  const tpsEl = board.querySelector("#tpsChart-llm");
  if (!grid) return;

  grid.innerHTML = llmPerformanceBoard.categories
    .map(
      (cat) => `
      <article class="perf-card" data-perf="${cat.id}">
        <h4>${cat.title}</h4>
        <div class="vbars" data-perf-chart="${cat.id}"></div>
      </article>`
    )
    .join("");

  llmPerformanceBoard.categories.forEach((cat) => {
    renderVerticalBars(grid.querySelector(`[data-perf-chart="${cat.id}"]`), cat.rows, {
      valueDigits: 1,
    });
  });

  if (tpsEl) {
    renderVerticalBars(tpsEl, llmPerformanceBoard.tps, { valueDigits: 2 });
  }

  board.dataset.wired = "true";
}

function initBenchmarkPanel(panel, model) {
  if (model === "llm") {
    initLlmPerformanceBoard(panel);
    return;
  }

  const benchmark = panel.querySelector(".benchmark");
  if (!benchmark || benchmark.dataset.wired === "true") return;
  const tabs = benchmark.querySelector(".benchmark-tabs");
  const chartEl = benchmark.querySelector(".chart");
  if (!tabs || !chartEl) return;

  const dataset = benchmarkDataByModel[model] || {};

  const activeBtn = tabs.querySelector("button.active") || tabs.querySelector("button");
  if (activeBtn) renderChart(chartEl, dataset[activeBtn.dataset.metric] || []);

  tabs.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const active = tabs.querySelector("button.active");
      if (active) {
        active.classList.remove("active");
        active.setAttribute("aria-selected", "false");
      }
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      renderChart(chartEl, dataset[btn.dataset.metric] || []);
    });
  });

  benchmark.dataset.wired = "true";
}

function initResultExplorers(root = document) {
  root.querySelectorAll("[data-result-explorer]").forEach((explorer) => {
    if (explorer.dataset.wired === "true") return;
    const tabs = explorer.querySelectorAll("[data-result-tab]");
    const panels = explorer.querySelectorAll("[data-result-panel]");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.resultTab;
        tabs.forEach((item) => {
          const isActive = item === tab;
          item.classList.toggle("active", isActive);
          item.setAttribute("aria-selected", String(isActive));
        });
        panels.forEach((panel) => {
          const isActive = panel.dataset.resultPanel === target;
          panel.classList.toggle("active", isActive);
          panel.hidden = !isActive;
        });
      });
    });

    explorer.dataset.wired = "true";
  });
}

/* ---------------------------------------------------------------------- */
/* Model switcher                                                          */
/* ---------------------------------------------------------------------- */

const modelTabs = document.querySelectorAll(".model-tab");
const modelPanels = document.querySelectorAll(".model-panel");
let activeModel = document.documentElement.dataset.activeModel || "llm";

function modelFromLocation() {
  const hash = window.location.hash.slice(1);
  if (hash.endsWith("-vit")) return "vit";
  if (hash.endsWith("-llm")) return "llm";
  const param = new URLSearchParams(window.location.search).get("model");
  if (param === "vit" || param === "llm") return param;
  return null;
}

const locationModel = modelFromLocation();
if (locationModel) activeModel = locationModel;

function applyModelState(model) {
  document.documentElement.dataset.activeModel = model;
  modelTabs.forEach((tab) => {
    const isMatch = tab.dataset.model === model;
    tab.classList.toggle("active", isMatch);
    tab.setAttribute("aria-selected", String(isMatch));
  });
}

applyModelState(activeModel);

function sectionIdFor(section, model) {
  if (section === "news") return "news";
  return `${section}-${model}`;
}

function showPanelForModel(model, options = {}) {
  const { forceReveal = false } = options;
  modelPanels.forEach((panel) => {
    const isMatch = panel.dataset.model === model;
    panel.hidden = !isMatch;
    if (isMatch) {
      if (forceReveal) {
        // Switching tabs shouldn't require re-scrolling past content to
        // trigger the entrance animation, so reveal immediately.
        panel.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
      }
      initBenchmarkPanel(panel, model);
      initResultExplorers(panel);
      if (model === "llm") initLlmResultsExplorer(panel);
    }
  });
}

function syncModelToUrl(model) {
  const params = new URLSearchParams(window.location.search);
  params.set("model", model);
  const hash = window.location.hash.slice(1);
  const nextHash = hash ? `#${hash.replace(/-(llm|vit)$/, `-${model}`)}` : "";
  history.pushState(null, "", `?${params}${nextHash}`);
}

function setActiveModel(model) {
  if (model === activeModel) return;
  activeModel = model;

  applyModelState(model);

  showPanelForModel(model, { forceReveal: true });
  initSectionNav();
  syncModelToUrl(model);
}

modelTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    if (tab.disabled) return;
    setActiveModel(tab.dataset.model);
  });
});

// Initialize benchmark chart for the initially active panel. The default
// model's .reveal elements keep the normal scroll-triggered animation.
showPanelForModel(activeModel);

function revealResultsOnLoad() {
  const hash = window.location.hash.slice(1);
  if (!hash.includes("results")) return;

  const section = document.getElementById(hash) || document.querySelector(`#${hash}`);
  if (!section) return;

  section.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  requestAnimationFrame(() => {
    section.scrollIntoView({ behavior: "auto", block: "start" });
  });
}

revealResultsOnLoad();

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

function scrollToSection(id, behavior) {
  const target = id && document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior, block: "start" });
}

function syncFromLocation(behavior) {
  const model = modelFromLocation();
  if (model) setActiveModel(model);
  revealResultsOnLoad();
  scrollToSection(location.hash.slice(1), behavior);
}

window.addEventListener("hashchange", () => {
  syncFromLocation("auto");
});

window.addEventListener("popstate", () => {
  const model = modelFromLocation();
  if (model) setActiveModel(model);
  revealResultsOnLoad();
  requestAnimationFrame(() => scrollToSection(location.hash.slice(1), "auto"));
});

/* ---------------------------------------------------------------------- */
/* Section anchor navigation (nav-links / page-toc / hero & nav CTAs)      */
/* ---------------------------------------------------------------------- */

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-section]");
  if (!link) return;
  const id = sectionIdFor(link.dataset.section, activeModel);
  if (!document.getElementById(id)) return;
  event.preventDefault();
  const next = `#${id}`;
  if (location.hash !== next) history.pushState(null, "", next);
  scrollToSection(id, "smooth");
});

let navSectionObservers = [];

function wireSectionNav(links, rootMargin) {
  const sections = [...links]
    .map((link) => document.getElementById(sectionIdFor(link.dataset.section, activeModel)))
    .filter(Boolean);

  if (!sections.length) return null;

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((link) => {
          const matches = sectionIdFor(link.dataset.section, activeModel) === id;
          link.classList.toggle("active", matches);
        });
      });
    },
    { rootMargin, threshold: 0 }
  );

  sections.forEach((section) => navObserver.observe(section));
  return navObserver;
}

function initSectionNav() {
  navSectionObservers.forEach((observer) => observer && observer.disconnect());
  navSectionObservers = [
    wireSectionNav(document.querySelectorAll('.nav-links a[data-section]'), "-40% 0px -50% 0px"),
    wireSectionNav(document.querySelectorAll('.page-toc a[data-section]'), "-45% 0px -45% 0px"),
  ];
}

initSectionNav();

/* Architecture variant switcher */
const architectureSwitcher = document.querySelector("[data-architecture-switcher]");
if (architectureSwitcher) {
  const image = architectureSwitcher.querySelector("[data-architecture-image]");
  const caption = architectureSwitcher.querySelector("[data-architecture-caption]");
  const variants = {
    standard: {
      src: "assets/architecture.png",
      alt: "IronLLM-0.6B hybrid architecture overview",
      caption: "Figure A · IronLLM-0.6B architecture",
      width: 1200,
      height: 1000,
    },
    light: {
      src: "assets/model_arch_light_display.png",
      alt: "IronLLM-0.6B-Light architecture overview",
      caption: "Figure A · IronLLM-0.6B-Light architecture",
      width: 1662,
      height: 1540,
    },
  };

  architectureSwitcher.querySelectorAll("[data-architecture-variant]").forEach((button) => {
    button.addEventListener("click", () => {
      const variant = variants[button.dataset.architectureVariant];
      if (!variant || !image) return;
      image.src = variant.src;
      image.alt = variant.alt;
      image.width = variant.width;
      image.height = variant.height;
      image.classList.toggle("is-light", button.dataset.architectureVariant === "light");
      if (caption) caption.textContent = variant.caption;
      architectureSwitcher.querySelectorAll("[data-architecture-variant]").forEach((tab) => {
        const active = tab === button;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-pressed", String(active));
      });
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Pre-training figure carousel                                            */
/* ---------------------------------------------------------------------- */

document.querySelectorAll("[data-figure-carousel]").forEach((root) => {
  const track = root.querySelector("[data-carousel-track]");
  const viewport = root.querySelector(".figure-carousel-viewport");
  const slides = [...root.querySelectorAll("[data-carousel-slide]")];
  const dots = [...root.querySelectorAll("[data-carousel-dot]")];
  const captions = [...root.querySelectorAll("[data-carousel-caption]")];
  const prevBtn = root.querySelector("[data-carousel-prev]");
  const nextBtn = root.querySelector("[data-carousel-next]");
  if (!track || !viewport || slides.length < 2) return;

  let index = 0;
  let dragX = 0;
  let startX = 0;
  let dragging = false;
  let width = viewport.clientWidth;

  const clamp = (i) => Math.max(0, Math.min(slides.length - 1, i));

  const syncHeight = () => {
    const slide = slides[index];
    if (!slide) return;
    viewport.style.height = `${slide.offsetHeight}px`;
  };

  const render = (animate = true) => {
    width = viewport.clientWidth || width;
    track.classList.toggle("is-dragging", !animate);
    const offset = -index * width + dragX;
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
    syncHeight();
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("active", active);
      dot.setAttribute("aria-selected", String(active));
    });
    captions.forEach((caption) => {
      const active = Number(caption.dataset.carouselCaption) === index;
      caption.classList.toggle("is-active", active);
    });
  };

  const goTo = (i) => {
    index = clamp(i);
    dragX = 0;
    render(true);
  };

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));
  dots.forEach((dot) => {
    dot.addEventListener("click", () => goTo(Number(dot.dataset.carouselDot) || 0));
  });

  const onPointerDown = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    dragging = true;
    startX = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
    dragX = 0;
    viewport.classList.add("is-dragging");
    render(false);
  };

  const onPointerMove = (event) => {
    if (!dragging) return;
    const x = event.clientX ?? event.touches?.[0]?.clientX ?? startX;
    dragX = x - startX;
    render(false);
  };

  const onPointerUp = () => {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove("is-dragging");
    const threshold = Math.min(80, width * 0.18);
    if (dragX > threshold) goTo(index - 1);
    else if (dragX < -threshold) goTo(index + 1);
    else goTo(index);
  };

  viewport.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
  window.addEventListener("resize", () => render(false));
  root.querySelectorAll("img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", () => render(false), { once: true });
  });

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goTo(index - 1);
    if (event.key === "ArrowRight") goTo(index + 1);
  });

  render(false);
});

/* ---------------------------------------------------------------------- */
/* News expand / collapse                                                  */
/* ---------------------------------------------------------------------- */

const newsToggle = document.querySelector("#newsToggle");
const newsList = document.querySelector("#newsList");

if (newsToggle && newsList) {
  newsToggle.addEventListener("click", () => {
    const extras = newsList.querySelectorAll(".news-extra");
    const expanding = newsToggle.getAttribute("aria-expanded") !== "true";
    extras.forEach((el) => {
      el.hidden = !expanding;
    });
    newsList.classList.toggle("expanded", expanding);
    newsToggle.setAttribute("aria-expanded", String(expanding));
    newsToggle.innerHTML = expanding
      ? 'Show less <span aria-hidden="true">&uarr;</span>'
      : 'View all updates <span aria-hidden="true">&rarr;</span>';
  });
}

/* ---------------------------------------------------------------------- */
/* Scroll-triggered reveal animation                                       */
/* ---------------------------------------------------------------------- */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------------------------------------------------------------------- */
/* Theme toggle                                                            */
/* ---------------------------------------------------------------------- */

const THEME_KEY = "iron-preview-theme";
const themeToggle = document.querySelector("#themeToggle");

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function syncThemeToggle(theme) {
  if (!themeToggle) return;
  const next = theme === "light" ? "dark" : "light";
  themeToggle.setAttribute("aria-label", `Switch to ${next} theme`);
  themeToggle.setAttribute("title", `Switch to ${next} theme`);
}


function applyTheme(theme) {
  const next = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (e) {}
  syncThemeToggle(next);
}

syncThemeToggle(currentTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    applyTheme(currentTheme() === "light" ? "dark" : "light");
  });
}
