"""Regenerate inline report charts from audited data; the site needs no build step."""
from html import escape
import argparse
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / "assets/data/charts.json").read_text())


def number(value):
    return f"{value:.2f}".rstrip("0").rstrip(".")


def panel(name, data, metric, title, maximum):
    chart_id = f"{name}-{metric}"
    x0, y0, plot_width, plot_height = 42, 28, 404, 232
    baseline = y0 + plot_height
    group_width = plot_width / len(data["categories"])
    series_count = len(data["series"])
    bar_width = 22 if series_count == 3 else 27
    bar_gap = 7 if series_count == 3 else 12
    cluster_width = series_count * bar_width + (series_count - 1) * bar_gap
    lines = [
        f'<section class="chart-panel" aria-labelledby="{chart_id}-heading">',
        f'<h5 id="{chart_id}-heading">{title}</h5>',
        f'<svg class="report-chart" viewBox="0 0 460 320" role="group" aria-labelledby="{chart_id}-title" aria-describedby="{chart_id}-desc">',
        f'<title id="{chart_id}-title">{escape(data["title"])}: {title}</title>',
        f'<desc id="{chart_id}-desc">Grouped bars compare {escape(", ".join(s["label"] for s in data["series"]))}. Higher is better. Values are printed above every bar.</desc>',
    ]
    for i, category in enumerate(data["categories"]):
        if category == "Avg":
            lines.append(f'<rect class="chart-average-band" x="{number(x0 + i * group_width)}" y="12" width="{number(group_width)}" height="286" rx="8"/>')
    for step in range(5):
        value = maximum * step / 4
        y = baseline - plot_height * step / 4
        lines.append(f'<line class="chart-gridline" x1="{x0}" y1="{y}" x2="{x0 + plot_width}" y2="{y}"/>')
        lines.append(f'<text class="chart-axis-label" x="32" y="{y + 5}" text-anchor="end">{number(value)}</text>')
    lines.append(f'<path class="chart-axis" d="M{x0} {y0}V{baseline}H{x0 + plot_width}"/>')
    for i, category in enumerate(data["categories"]):
        center = x0 + (i + .5) * group_width
        start = center - cluster_width / 2
        for j, series in enumerate(data["series"]):
            value = series[metric][i]
            height = plot_height * value / maximum
            x, y = start + j * (bar_width + bar_gap), baseline - height
            display = f"{value:.2f}" if metric == "taskProgress" else number(value)
            detail = f"Task progress: {display}" if metric == "taskProgress" else f"Success rate: {display}%"
            category_label = "Average" if category == "Avg" else category
            label = f'{series["label"]} · {category_label}'
            lines.extend([
                f'<g class="chart-series" data-series="{series["key"]}" data-metric="{metric}" data-category="{escape(category)}" data-number="{value}" data-label="{escape(label)}" data-value="{detail}" role="img" aria-label="{escape(label)}; {detail}">',
                f'<rect class="chart-bar" x="{number(x)}" y="{number(y)}" width="{bar_width}" height="{number(height)}" rx="2" fill="{series["color"]}"/>',
                f'<text class="chart-value-label" x="{number(x + bar_width / 2)}" y="{number(y - 8)}" text-anchor="middle">{display}</text>',
                # Include an honest zero-height bar, with a separate hit area for interaction.
                f'<rect class="chart-hit-area" x="{number(x - 2)}" y="{number(min(y - 22, baseline - 26))}" width="{bar_width + 4}" height="{number(max(height + 22, 26))}" fill="transparent"/>',
                '</g>',
            ])
        labels = ["Average"] if category == "Avg" else category.split(" ", 1)
        label_y = 285 if len(labels) == 1 else 281
        spans = ''.join(f'<tspan x="{number(center)}" dy="{0 if n == 0 else 18}">{escape(label)}</tspan>' for n, label in enumerate(labels))
        lines.append(f'<text class="chart-category-label" x="{number(center)}" y="{label_y}" text-anchor="middle">{spans}</text>')
    lines.extend(['</svg>', '</section>'])
    return '\n'.join(lines)


def pretraining_panel(name, data):
    """Keep the report's ordered exposure categories and signed loss changes."""
    chart_id = f'{name}-actionLossChange'
    series = data['series'][0]
    x0, y0, width, height = 54, 32, 430, 204
    xs = [x0 + i * width / (len(data['categories']) - 1) for i in range(len(data['categories']))]
    ys = [y0 - value / 15 * height for value in series['actionLossChange']]
    lines = [
        f'<section class="chart-panel chart-line-panel" aria-labelledby="{chart_id}-heading">',
        f'<h5 id="{chart_id}-heading">Benchmark action-loss change (↓)</h5>',
        f'<svg class="report-chart chart-line-plot" viewBox="0 0 530 300" role="group" aria-labelledby="{chart_id}-title" aria-describedby="{chart_id}-desc">',
        f'<title id="{chart_id}-title">{escape(data["title"])}</title>',
        f'<desc id="{chart_id}-desc">Action-loss change relative to zero Stage I exposure. Lower is better. The exposure fractions are shown as equally spaced categories, as in the report.</desc>',
    ]
    for value in (0, -5, -10, -15):
        y = y0 - value / 15 * height
        lines.extend([
            f'<line class="chart-gridline" x1="{x0}" y1="{number(y)}" x2="{x0 + width}" y2="{number(y)}"/>',
            f'<text class="chart-axis-label" x="42" y="{number(y + 5)}" text-anchor="end">{value}%</text>',
        ])
    lines.append(f'<path class="chart-axis" d="M{x0} {y0}V{y0 + height}H{x0 + width}"/>')
    points = ' '.join(f'{number(x)},{number(y)}' for x, y in zip(xs, ys))
    lines.append(f'<polyline class="chart-trend-line" points="{points}" fill="none" stroke="{series["color"]}"/>')
    for category, value, x, y in zip(data['categories'], series['actionLossChange'], xs, ys):
        display = '0%' if value == 0 else f'{value:.1f}%'
        label = f'Stage I exposure: {category}'
        detail = f'Action-loss change: {display} vs. no Stage I adaptation'
        lines.extend([
            f'<g class="chart-series" data-series="{series["key"]}" data-metric="actionLossChange" data-category="{category}" data-number="{value}" data-label="{label}" data-value="{detail}" role="img" aria-label="{label}; {detail}">',
            f'<circle class="chart-point" cx="{number(x)}" cy="{number(y)}" r="5" fill="{series["color"]}"/>',
            f'<text class="chart-value-label" x="{number(x)}" y="{number(y - 13)}" text-anchor="middle">{display}</text>',
            f'<circle class="chart-hit-area" cx="{number(x)}" cy="{number(y)}" r="19" fill="transparent"/>',
            '</g>',
            f'<text class="chart-category-label" x="{number(x)}" y="263" text-anchor="middle">{category}</text>',
        ])
    lines.extend([
        '</svg>',
        '<p class="chart-axis-caption">Stage I exposure fraction <i>r</i></p>',
        '</section>',
    ])
    return '\n'.join(lines)


def coverage_panel(name, data):
    """Responsive coverage labels stay readable beside or above the SVG rows."""
    x0, plot_width = 10, 430
    minimum, maximum = -13, 27

    def x_at(value):
        return x0 + (value - minimum) / (maximum - minimum) * plot_width

    zero = x_at(0)
    ticks = range(-10, 26, 5)
    lines = ['<div class="chart-coverage">']
    for i, (category, stratum) in enumerate(zip(data['categories'], data['strata'])):
        row_id = f'{name}-stratum-{i + 1}'
        row_label = f'Robot coverage: {stratum["robot"].lower()}; human coverage: {stratum["human"].lower()}'
        lines.extend([
            f'<section class="chart-coverage-row" aria-labelledby="{row_id}-label">',
            f'<h5 class="chart-coverage-label" id="{row_id}-label"><span><small>Robot</small>{stratum["robot"]}</span><span><small>Human</small>{stratum["human"]}</span></h5>',
            f'<svg class="report-chart chart-coverage-plot" viewBox="0 0 450 84" role="group" aria-labelledby="{row_id}-title" aria-describedby="{row_id}-desc">',
            f'<title id="{row_id}-title">{row_label}</title>',
            f'<desc id="{row_id}-desc">Relative action-loss reduction against robot-only. Higher is better. Yellow is human mid-training followed by robot-only fine-tuning; blue is human–robot co-training.</desc>',
        ])
        for tick in ticks:
            lines.append(f'<line class="chart-gridline" x1="{number(x_at(tick))}" y1="0" x2="{number(x_at(tick))}" y2="84"/>')
        lines.append(f'<path class="chart-axis" d="M{number(zero)} 0V84"/>')
        for j, series in enumerate(data['series']):
            value = series['actionLossReduction'][i]
            end = x_at(value)
            left, width = min(zero, end), abs(end - zero)
            y = 14 + j * 33
            text_x = end + (8 if value >= 0 else -8)
            anchor = 'start' if value >= 0 else 'end'
            display = f'{value:.1f}'
            label = f'{series["label"]} · robot {stratum["robot"].lower()}, human {stratum["human"].lower()}'
            detail = f'Action-loss reduction: {display}% vs. robot-only'
            lines.extend([
                f'<g class="chart-series" data-series="{series["key"]}" data-metric="actionLossReduction" data-category="{escape(category)}" data-number="{value}" data-label="{escape(label)}" data-value="{detail}" role="img" aria-label="{escape(label)}; {detail}">',
                f'<rect class="chart-bar" x="{number(left)}" y="{y}" width="{number(width)}" height="20" rx="2" fill="{series["color"]}"/>',
                f'<text class="chart-value-label" x="{number(text_x)}" y="{y + 15}" text-anchor="{anchor}">{display}</text>',
                f'<rect class="chart-hit-area" x="{number(left - (46 if value < 0 else 3))}" y="{y - 4}" width="{number(max(width + 50, 52))}" height="28" fill="transparent"/>',
                '</g>',
            ])
        lines.extend(['</svg>', '</section>'])
    lines.extend([
        '<div class="chart-coverage-axis" aria-hidden="true">',
        '<svg class="report-chart" viewBox="0 0 450 26">',
    ])
    for tick in ticks:
        lines.append(f'<text class="chart-axis-label" x="{number(x_at(tick))}" y="18" text-anchor="middle">{tick}</text>')
    lines.extend([
        '</svg></div>',
        '<p class="chart-axis-caption">Action-loss reduction vs. robot-only (%; higher is better)</p>',
        '</div>',
    ])
    return '\n'.join(lines)


def figure(name):
    data = DATA[name]
    title = escape(data["title"])
    lines = [
        f'<figure class="research-figure chart-figure" id="chart-{name}">',
        '<div class="chart-card">',
        f'<header class="chart-heading"><h4>{title}</h4>',
        f'<button class="chart-expand" type="button" data-chart-preview="chart-{name}" aria-label="Enlarge {title}" aria-haspopup="dialog" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg></button></header>',
    ]
    if len(data['series']) > 1:
        lines.append('<div class="chart-legend" aria-label="Chart legend">')
        for series in data["series"]:
            lines.append(f'<span class="chart-legend-item" data-series="{series["key"]}"><span style="--series-color:{series["color"]}" aria-hidden="true"></span>{escape(series["label"])}</span>')
        lines.append('</div>')
    if data.get('kind') == 'line':
        lines.append(pretraining_panel(name, data))
    elif data.get('kind') == 'coverage':
        lines.append(coverage_panel(name, data))
    else:
        lines.append('<div class="chart-grid">')
        lines.append(panel(name, data, 'taskProgress', 'Task-progress score', 1))
        lines.append(panel(name, data, 'successRate', 'Success rate (%)', 100))
        lines.append('</div>')
    lines.extend(['</div>', f'<figcaption>{escape(data["caption"])}</figcaption>', '</figure>'])
    return '\n'.join('              ' + line for line in lines)


def render_page(html):
    for name in ('improvement', 'results', 'robustness', 'pretraining', 'coverage'):
        start = f'<!-- chart:{name}:start -->'
        end = f'<!-- chart:{name}:end -->'
        if start not in html and end not in html:
            continue
        if html.count(start) != 1 or html.count(end) != 1:
            raise ValueError(f'Expected one matching chart-marker pair for {name}')
        pattern = re.escape(start) + r'.*?' + re.escape(end)
        html, count = re.subn(pattern, lambda _: start + '\n' + figure(name) + '\n              ' + end, html, flags=re.S)
        if count != 1:
            raise ValueError(f'Invalid chart-marker order for {name}')
    return html


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--page', type=Path, default=ROOT / 'index.html')
    args = parser.parse_args()
    original = args.page.read_text()
    rendered = render_page(original)
    if rendered != original:
        args.page.write_text(rendered)
