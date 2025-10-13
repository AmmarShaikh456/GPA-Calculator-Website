// Calculate GPA by subtracting 0.1 for each point below 100, or 0 if below 70. GPA cannot go below 0.
function calcGpa(level, grade) {
  if (isNaN(grade) || grade < 70 || grade > 100) return 0;
  const maxGpa = level === 'onlevel' ? 5.0 : level === 'honors' ? 5.5 : 6.0;
  const gpa = maxGpa - 0.1 * (100 - grade);
  return gpa > 0 ? gpa : 0;
}

const LEVELS = [
  { label: 'Onlevel', value: 'onlevel', maxGpa: 5.0 },
  { label: 'Honors', value: 'honors', maxGpa: 5.5 },
  { label: 'AP', value: 'ap', maxGpa: 6.0 }
];
const NUM_CLASSES = 8;
const tableBody = document.getElementById('gpa-table-body');

function createRow(idx) {
  const tr = document.createElement('tr');
  // Level select
  const levelTd = document.createElement('td');
  const select = document.createElement('select');
  LEVELS.forEach(lvl => {
    const opt = document.createElement('option');
    opt.value = lvl.value;
    opt.textContent = lvl.label;
    select.appendChild(opt);
  });
  levelTd.appendChild(select);
  tr.appendChild(levelTd);
  // Grade input
  const gradeTd = document.createElement('td');
  const input = document.createElement('input');
  input.type = 'number';
  input.min = 0;
  input.max = 100;
  input.value = '';
  gradeTd.appendChild(input);
  tr.appendChild(gradeTd);
  // GPA output
  const gpaTd = document.createElement('td');
  gpaTd.className = 'gpa-output';
  gpaTd.textContent = '0.00';
  tr.appendChild(gpaTd);
  // Event listeners
  select.addEventListener('change', () => updateGpa(idx));
  input.addEventListener('input', () => updateGpa(idx));
  return tr;
}

function updateGpa(idx) {
  const row = tableBody.children[idx];
  const select = row.children[0].querySelector('select');
  const input = row.children[1].querySelector('input');
  const gpaTd = row.children[2];
  const level = LEVELS.find(lvl => lvl.value === select.value);
  let grade = parseFloat(input.value);
  let gpa = calcGpa(level.value, grade);
  gpaTd.textContent = gpa.toFixed(1);
  updateFinalGpa();
}

function updateFinalGpa() {
  let weightedTotal = 0;
  let unweightedTotal = 0;
  let count = 0;
  for (let i = 0; i < NUM_CLASSES; i++) {
    const row = tableBody.children[i];
    const select = row.children[0].querySelector('select');
    const input = row.children[1].querySelector('input');
    const gpa = parseFloat(row.children[2].textContent);
    let grade = parseFloat(input.value);
    if (!isNaN(gpa) && !isNaN(grade)) {
      weightedTotal += gpa;
      // Unweighted GPA: always out of 5.0
      unweightedTotal += (grade >= 0 && grade <= 100) ? (grade / 100) * 5.0 : 0;
      count++;
    }
  }
  const weightedAvg = count > 0 ? weightedTotal / NUM_CLASSES : 0;
  const unweightedAvg = count > 0 ? unweightedTotal / NUM_CLASSES : 0;
  document.getElementById('final-gpa').innerHTML =
    '<span class="gpa-label">Weighted GPA</span>: <span class="gpa-value">' + weightedAvg.toFixed(2) + '</span>' +
    ' &nbsp; | &nbsp; ' +
    '<span class="gpa-label">Unweighted GPA</span>: <span class="gpa-value">' + unweightedAvg.toFixed(2) + '</span>';
}

// Initialize table
for (let i = 0; i < NUM_CLASSES; i++) {
  tableBody.appendChild(createRow(i));
}
