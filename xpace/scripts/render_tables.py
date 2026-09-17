"""Write report tables into static HTML; no runtime fetching or build is required."""
from html import escape
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / "assets/data/experiment-tables.json").read_text())
TABLES = {
    "conditioning": "skeletonConditioning",
    "sgf": "selfGradientForcing",
    "simulator": "finalSimulator",
    "human-supervision": "humanSupervision",
}


def figure(name, key):
    data = DATA["tables"][key]
    title_id = f"table-{name}-title"
    note_id = f"table-{name}-note"
    human = key == "humanSupervision"
    lines = [
        f'<figure class="experiment-figure" id="table-{name}">',
        f'<figcaption class="table-title" id="{title_id}"><span>Table {data["number"]}</span>{escape(data["title"])}</figcaption>',
        f'<div class="table-scroll" tabindex="0" role="region" aria-labelledby="{title_id}" aria-describedby="{note_id}">',
        f'<table class="experiment-table{" experiment-table--recipes" if human else " experiment-table--compact" if key == "finalSimulator" else ""}" aria-labelledby="{title_id}">',
        f'<thead><tr><th scope="col">{escape(data["rowHeader"])}</th>',
    ]
    for col in data["columns"]:
        direction = " ↑" if col["direction"] == "higher" else " ↓" if col["direction"] == "lower" else ""
        definition = DATA["metricDefinitions"].get(col["key"], "")
        label = col["label"] + direction
        lines.append(f'<th scope="col" title="{escape(definition)}">{escape(label)}</th>')
    lines.append('</tr></thead>')
    for group in data["groups"]:
        label = group["label"]
        if key == "selfGradientForcing":
            label = f'{group["frames"]} frames · {"In-distribution" if group["split"] == "ID" else "Out-of-distribution"}'
        lines.append(f'<tbody data-split="{group.get("split", "benchmark")}">')
        if not human:
            lines.append(f'<tr class="table-group"><th scope="rowgroup" colspan="{len(data["columns"]) + 1}">{escape(label)}</th></tr>')
        for row in group["rows"]:
            note = f'<span class="table-reference">{escape(row["displayNote"])}</span>' if row.get("displayNote") else ""
            lines.append(f'<tr><th scope="row">{escape(row["label"])}{note}</th>')
            for col in data["columns"]:
                value = row["values"][col["key"]]
                display = escape(value).replace('-', '−') if value is not None else '—'
                if value is not None and col["unit"] == '%':
                    display += '%'
                if col["key"] in row.get("best", []):
                    display = f'<strong>{display}</strong>'
                lines.append(f'<td data-metric="{col["key"]}" data-value="{escape(value or "")}">{display}</td>')
            lines.append('</tr>')
        lines.append('</tbody>')
    notes = data["caption"]
    if any(col['key'] == 'psnr' for col in data['columns']):
        notes = 'PSNR is in dB. ' + notes
    if key == "skeletonConditioning":
        notes += ' OFS measures optical-flow agreement; DINO measures visual-feature similarity. ↑ Higher is better; ↓ lower is better.'
    lines.extend(['</table></div>', f'<p class="table-note" id="{note_id}">{escape(notes)}</p>', '</figure>'])
    return '\n'.join('                ' + line for line in lines)


def main():
    page = ROOT / 'index.html'
    html = page.read_text()
    for name, key in TABLES.items():
        start = f'<!-- table:{name}:start -->'
        end = f'<!-- table:{name}:end -->'
        html, count = re.subn(re.escape(start) + r'.*?' + re.escape(end),
                              lambda _: start + '\n' + figure(name, key) + '\n                ' + end,
                              html, flags=re.S)
        if count != 1:
            raise ValueError(f'Expected one table marker for {name}; found {count}')
    page.write_text(html)


if __name__ == '__main__':
    main()
