'use strict';

// Results are transcribed from sec/5_exp.tex. These interactions present
// manuscript evidence and dataset annotations; they do not perform inference.
const evidence = {
  generalization: {
    ood: [51.00, 45.89, 74.92],
    main: [77.91, 87.26, 91.07],
    labels: ['Monocular depth', 'Binocular depth', 'Binocular disparity → depth']
  },
  interventions: {
    labels: ['Duplicated left', 'Single left', 'Zero right', 'Shuffled right', 'Correct stereo'],
    depth: [7.40, 80.82, 79.70, 70.16, 94.51],
    object: [8.18, 40.26, 39.81, 32.49, 64.43]
  },
  transfer: [
    ['Omni3D', 8.21], ['DA-2K', 2.37], ['OmniSpatial', 2.48],
    ['MindCube', 3.71], ['VSI-Bench', 0.92]
  ]
};

function setPressed(buttons, selected) {
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
}

// DROID reference annotations from the benchmark manifest.
const realDemoExamples = {"correspondence": {"question": "In the left stereo image, identify the orange plastic cup. Then locate the same physical object in the right stereo image and return its bounding box. Answer with the right-image bounding box only.", "answer": "[301, 180, 365, 256]", "unit": "Right-image bounding box · pixels"}, "disparity": {"question": "For the orange plastic cup in the left stereo image, provide its representative left-to-right horizontal disparity in pixels. Answer with the numeric value only.", "answer": "96.11 px", "unit": "Horizontal disparity · pixels"}, "depth": {"question": "Stereo camera calibration for this displayed pair: fx=267 pixels, baseline=0.120103 meters.\nUsing the rectified stereo pair and the provided camera calibration, estimate the depth of the orange plastic cup in the left stereo image along the camera's optical axis. Answer with the numeric depth value in meters only.", "answer": "0.334 m", "unit": "Reference depth · left-camera optical axis"}};
const demoButtons = [...document.querySelectorAll('[data-demo]')];
demoButtons.forEach(button => button.addEventListener('click', () => {
  setPressed(demoButtons, button);
  const sample = realDemoExamples[button.dataset.demo];
  document.getElementById('demo-question').textContent = sample.question;
  document.getElementById('demo-answer').textContent = sample.answer;
  document.getElementById('demo-unit').textContent = sample.unit;
}));

const scaleButtons = [...document.querySelectorAll('[data-scale]')];
scaleButtons.forEach(button => button.addEventListener('click', () => {
  setPressed(scaleButtons, button);
  document.querySelectorAll('[data-model]').forEach(row => {
    row.classList.toggle('selected', row.dataset.model === button.dataset.scale);
  });
}));

function drawBars(element, labels, values, accentIndex, context) {
  element.replaceChildren();
  element.setAttribute('aria-label', context);
  labels.forEach((label, index) => {
    const row = document.createElement('div');
    row.className = `bar-row${index === accentIndex ? ' accent' : ''}`;
    const info = document.createElement('div');
    info.className = 'bar-info';
    const name = document.createElement('span');
    name.textContent = label;
    const value = document.createElement('span');
    value.className = 'bar-value';
    value.textContent = values[index].toFixed(2);
    info.append(name, value);
    const track = document.createElement('div');
    track.className = 'bar-track';
    track.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.style.width = `${values[index]}%`;
    track.append(fill);
    row.append(info, track);
    element.append(row);
  });
}
const splitButtons = [...document.querySelectorAll('[data-split]')];
function drawGeneralization(split) {
  drawBars(document.getElementById('generalization-chart'), evidence.generalization.labels,
    evidence.generalization[split], 2, `Depth delta-1 percentage on the ${split === 'ood' ? 'out-of-domain' : 'main'} split. Axis: 0 to 100.`);
}
splitButtons.forEach(button => button.addEventListener('click', () => {
  setPressed(splitButtons, button);
  drawGeneralization(button.dataset.split);
}));
drawGeneralization('ood');

function drawInterventions(metric) {
  drawBars(document.getElementById('intervention-chart'), evidence.interventions.labels,
    evidence.interventions[metric], 4,
    `Right-view interventions: ${metric === 'depth' ? 'depth delta-1 percentage' : 'object-level average score'}. Axis: 0 to 100.`);
}
document.getElementById('intervention-metric').addEventListener('change', event => drawInterventions(event.target.value));
drawInterventions('depth');

// Qualitative panels are extracted without altering the figure's colors.
const depthLabels = ['RGB input', 'Ground truth', 'StereoVLM-2B · stereo', 'StereoVLM-2B · monocular'];
const depthAlts = ['Observed scene', 'Reference depth reconstruction', 'Stereo-conditioned depth prediction', 'Single-view depth prediction'];
const sceneNames = { 0: 'DROID robot tabletop', 2: 'Xperience-10M workbench', 4: 'Out-of-domain conference room' };
function drawDepthGallery(scene) {
  const gallery = document.getElementById('depth-gallery');
  gallery.replaceChildren();
  depthLabels.forEach((label, index) => {
    const figure = document.createElement('figure');
    figure.className = `depth-tile${index === 2 ? ' ours' : ''}`;
    const caption = document.createElement('figcaption');
    caption.textContent = label;
    const image = document.createElement('img');
    image.src = window.STEREO_DEPTH_GALLERY?.[scene]?.[index]
      || `assets/depth-${scene}-${index}.webp`;
    image.alt = `${depthAlts[index]}: ${sceneNames[scene]}`;
    image.width = 374;
    image.height = 176;
    image.loading = 'eager';
    image.decoding = 'async';
    figure.append(caption, image);
    gallery.append(figure);
  });
}
const sceneButtons = [...document.querySelectorAll('[data-scene]')];
sceneButtons.forEach(button => button.addEventListener('click', () => {
  setPressed(sceneButtons, button);
  drawDepthGallery(button.dataset.scene);
}));
drawDepthGallery('0');

const transferChart = document.getElementById('transfer-chart');
evidence.transfer.forEach(([label, gain]) => {
  const row = document.createElement('div');
  row.className = 'transfer-row';
  const name = document.createElement('span');
  name.textContent = label;
  const track = document.createElement('div');
  track.className = 'bar-track';
  track.setAttribute('aria-hidden', 'true');
  const fill = document.createElement('div');
  fill.className = 'bar-fill';
  fill.style.width = `${gain / 10 * 100}%`;
  track.append(fill);
  const value = document.createElement('strong');
  value.textContent = `+${gain.toFixed(2)}`;
  row.append(name, track, value);
  transferChart.append(row);
});
transferChart.setAttribute('aria-label', 'Gains from stereo instruction tuning. Shared bar scale: 0 to 10 points.');


// All four original scenes load with the page for immediate, independent switching.
const methodSceneButtons = [...document.querySelectorAll('[data-method-scene]')];
methodSceneButtons.forEach(button => button.addEventListener('click', () => {
  setPressed(methodSceneButtons, button);
  document.querySelectorAll('[data-method-panel]').forEach(panel => {
    panel.hidden = panel.dataset.methodPanel !== button.dataset.methodScene;
  });
}));

// Point samples and 3D answers copied from local benchmark annotations.
const pointQA = {"correspondence": {"question": "For the highlighted point (329, 243) in the left image, where is the corresponding point in the right image?", "answer": "(277.04, 243.00)", "unit": "Right-image coordinates \u00b7 pixels", "left": [329, 243], "right": [277.04051208496094, 243.0], "reference": {"xy": [329, 243], "gt_disparity_px": 51.95948791503906, "gt_right_xy_px": [277.04051208496094, 243.0], "gt_depth_m": 0.6169329285621643}}, "disparity": {"question": "What is the horizontal disparity of the highlighted point (546, 234) in the left image?", "answer": "41.65 px", "unit": "Horizontal disparity \u00b7 pixels", "left": [546, 234], "right": [504.3473358154297, 234.0], "reference": {"xy": [546, 234], "gt_disparity_px": 41.65266418457031, "gt_right_xy_px": [504.3473358154297, 234.0], "gt_depth_m": 0.7695910930633545}}, "depth": {"question": "What is the metric depth of the highlighted point (387, 262) in the left image along the camera optical axis?", "answer": "0.582 m", "unit": "Optical-axis depth \u00b7 meters", "left": [387, 262], "right": [331.88425064086914, 262.0], "reference": {"xy": [387, 262], "gt_disparity_px": 55.11574935913086, "gt_right_xy_px": [331.88425064086914, 262.0], "gt_depth_m": 0.5816035866737366}}};
const reasoningQA = {"box": {"question": "Rectified-left camera calibration: fx=267, fy=267 pixels; baseline=0.120044 meters. The principal point is at the image center.\nProvide the 3D OBB for the silver toaster in the left stereo image. Answer with the 3D bounding box and object label only.", "answer": "Toaster", "center": "Center (m): 0.185, -0.048, 0.888", "size": "Size (m): 0.222, 0.104, 0.175", "full": [{"bbox_3d": [0.185009, -0.047659, 0.887993, 0.222496, 0.104405, 0.174517, 2.986158, -1.993758, 0.267478, 267.0, 0.0, 400.0, 0.0, 267.0, 160.0], "label": "toaster"}]}, "target": {"question": "Stereo camera calibration: fx = fy = 267 px; baseline = 0.120044 m; principal point at the image center.\nWhich object should the robot manipulate to perform the following task? Return its label and 3D oriented bounding box.\nTask: Open or close slidable objects (ex: toaster, drawers, sliding doors, dressers)", "answer": "Toaster", "center": "Center (m): 0.185, -0.048, 0.888", "size": "Size (m): 0.222, 0.104, 0.175", "full": [{"bbox_3d": [0.185009, -0.047659, 0.887993, 0.222496, 0.104405, 0.174517, 2.986158, -1.993758, 0.267478, 267.0, 0.0, 400.0, 0.0, 267.0, 160.0], "label": "toaster"}]}};

const pointButtons = [...document.querySelectorAll('[data-point-task]')];
pointButtons.forEach(button => button.addEventListener('click', () => {
  setPressed(pointButtons, button);
  const sample = pointQA[button.dataset.pointTask];
  ['question','answer','unit'].forEach(key => document.getElementById(`point-${key}`).textContent = sample[key]);
  document.querySelectorAll('#point-qa .qa-point').forEach((dot,i) => {
    const xy = i === 0 ? sample.left : sample.right;
    dot.setAttribute('cx',xy[0]); dot.setAttribute('cy',xy[1]);
  });
}));
const reasoningButtons = [...document.querySelectorAll('[data-reasoning-task]')];
reasoningButtons.forEach(button => button.addEventListener('click', () => {
  setPressed(reasoningButtons, button);
  const sample = reasoningQA[button.dataset.reasoningTask];
  ['question','answer','center','size'].forEach(key => document.getElementById(`reasoning-${key}`).textContent = sample[key]);
  document.getElementById('reasoning-full').textContent = JSON.stringify(sample.full,null,2);
}));
