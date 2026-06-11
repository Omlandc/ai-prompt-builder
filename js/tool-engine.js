(function() {
  const config = window.toolConfig || {};
  const fields = config.fields || [];
  const template = config.template || function(v) { return JSON.stringify(v, null, 2); };

  const formEl = document.getElementById('tool-form');
  const previewEl = document.getElementById('preview-body');
  if (!formEl || !previewEl) return;

  const state = {};
  const isZh = document.documentElement.lang === 'zh-CN' || document.documentElement.lang === 'zh';
  const copyLabel = isZh ? '📋 复制提示词' : '📋 Copy Prompt';
  const downloadLabel = isZh ? '⬇️ 下载 Markdown' : '⬇️ Download Markdown';

  function buildForm() {
    formEl.innerHTML = '';
    fields.forEach((field, idx) => {
      const wrap = document.createElement('div');
      wrap.className = 'form-group';
      wrap.dataset.fieldName = field.name;
      if (field.showIf) {
        wrap.dataset.showIfField = field.showIf.field;
        wrap.dataset.showIfValue = field.showIf.value;
      }

      const label = document.createElement('label');
      label.textContent = field.label;
      wrap.appendChild(label);

      if (field.hint) {
        const hint = document.createElement('div');
        hint.className = 'hint';
        hint.textContent = field.hint;
        wrap.appendChild(hint);
      }

      let input;
      switch (field.type) {
        case 'textarea':
          input = document.createElement('textarea');
          input.rows = field.rows || 4;
          break;
        case 'select':
          input = document.createElement('select');
          (field.options || []).forEach(opt => {
            const o = document.createElement('option');
            o.value = opt.value !== undefined ? opt.value : opt;
            o.textContent = opt.label !== undefined ? opt.label : opt;
            input.appendChild(o);
          });
          break;
        case 'radio': {
          input = document.createElement('div');
          input.className = 'radio-group';
          (field.options || []).forEach((opt, optIdx) => {
            const lbl = document.createElement('label');
            const r = document.createElement('input');
            r.type = 'radio';
            r.name = field.name;
            r.value = opt.value !== undefined ? opt.value : opt;
            if (field.default !== undefined && String(opt.value !== undefined ? opt.value : opt) === String(field.default)) {
              r.checked = true;
            } else if (field.default === undefined && optIdx === 0) {
              r.checked = true;
            }
            lbl.appendChild(r);
            lbl.appendChild(document.createTextNode(opt.label !== undefined ? opt.label : opt));
            input.appendChild(lbl);
          });
          break;
        }
        case 'checkbox': {
          input = document.createElement('div');
          input.className = 'checkbox-group';
          (field.options || []).forEach(opt => {
            const lbl = document.createElement('label');
            const c = document.createElement('input');
            c.type = 'checkbox';
            c.name = field.name;
            c.value = opt.value !== undefined ? opt.value : opt;
            lbl.appendChild(c);
            lbl.appendChild(document.createTextNode(opt.label !== undefined ? opt.label : opt));
            input.appendChild(lbl);
          });
          break;
        }
        case 'table': {
          input = buildTable(field);
          break;
        }
        case 'number':
          input = document.createElement('input');
          input.type = 'number';
          if (field.min !== undefined) input.min = field.min;
          if (field.max !== undefined) input.max = field.max;
          break;
        default:
          input = document.createElement('input');
          input.type = 'text';
      }

      if (field.type !== 'radio' && field.type !== 'checkbox' && field.type !== 'table') {
        input.name = field.name;
        if (field.placeholder) input.placeholder = field.placeholder;
        if (field.default !== undefined) input.value = field.default;
      }

      wrap.appendChild(input);
      formEl.appendChild(wrap);

      // bind events
      if (field.type === 'table') {
        input.addEventListener('input', () => updateState());
      } else if (field.type === 'radio') {
        input.querySelectorAll('input').forEach(el => el.addEventListener('change', () => updateState()));
      } else if (field.type === 'checkbox') {
        input.querySelectorAll('input').forEach(el => el.addEventListener('change', () => updateState()));
      } else {
        input.addEventListener('input', () => updateState());
      }
    });

    // Place actions in preview header if available; otherwise fallback to form bottom
    const previewHeader = document.querySelector('.preview-header');
    let existingActions = document.getElementById('preview-actions');
    if (existingActions) existingActions.remove();

    const actions = document.createElement('div');
    actions.id = 'preview-actions';
    actions.className = 'preview-actions';
    actions.innerHTML = `
      <button class="btn btn-primary" id="btn-copy" type="button">${copyLabel}</button>
      <button class="btn btn-secondary" id="btn-download" type="button">${downloadLabel}</button>
    `;

    if (previewHeader) {
      previewHeader.appendChild(actions);
    } else {
      const fallback = document.createElement('div');
      fallback.className = 'tool-actions';
      fallback.innerHTML = actions.innerHTML;
      formEl.appendChild(fallback);
    }

    document.getElementById('btn-copy').addEventListener('click', copyPrompt);
    document.getElementById('btn-download').addEventListener('click', downloadPrompt);

    updateState();
  }

  function buildTable(field) {
    const table = document.createElement('table');
    table.className = 'table-builder';
    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    (field.columns || []).forEach(col => {
      const th = document.createElement('th');
      th.textContent = col.label || col;
      trh.appendChild(th);
    });
    const thAdd = document.createElement('th');
    thAdd.style.width = '40px';
    trh.appendChild(thAdd);
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const addRow = () => {
      const tr = document.createElement('tr');
      (field.columns || []).forEach((col, i) => {
        const td = document.createElement('td');
        const inp = document.createElement(i === 0 ? 'input' : 'textarea');
        inp.rows = 2;
        inp.placeholder = col.placeholder || '';
        td.appendChild(inp);
        tr.appendChild(td);
      });
      const tdDel = document.createElement('td');
      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.textContent = '✕';
      btnDel.style.background = 'none';
      btnDel.style.border = 'none';
      btnDel.style.color = '#ef4444';
      btnDel.style.cursor = 'pointer';
      btnDel.onclick = () => { tr.remove(); updateState(); };
      tdDel.appendChild(btnDel);
      tr.appendChild(tdDel);
      tbody.appendChild(tr);
    };
    for (let i = 0; i < (field.defaultRows || 2); i++) addRow();
    table.appendChild(tbody);

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn-secondary';
    addBtn.style.marginTop = '8px';
    addBtn.textContent = isZh ? '+ 增加一行' : '+ Add Row';
    addBtn.onclick = addRow;

    const wrap = document.createElement('div');
    wrap.appendChild(table);
    wrap.appendChild(addBtn);
    return wrap;
  }

  function getValues() {
    const vals = {};
    fields.forEach(field => {
      if (field.type === 'radio') {
        const checked = formEl.querySelector(`input[name="${field.name}"]:checked`);
        vals[field.name] = checked ? checked.value : '';
      } else if (field.type === 'checkbox') {
        const checked = Array.from(formEl.querySelectorAll(`input[name="${field.name}"]:checked`)).map(el => el.value);
        vals[field.name] = checked;
      } else if (field.type === 'table') {
        const tbody = formEl.querySelectorAll('.table-builder tbody tr');
        const rows = [];
        tbody.forEach(tr => {
          const cells = Array.from(tr.querySelectorAll('td')).slice(0, -1).map(td => {
            const inp = td.querySelector('input, textarea');
            return inp ? inp.value.trim() : '';
          });
          if (cells.some(c => c)) rows.push(cells);
        });
        vals[field.name] = rows;
      } else {
        const el = formEl.querySelector(`[name="${field.name}"]`);
        vals[field.name] = el ? el.value : '';
      }
    });
    return vals;
  }

  function updateVisibility() {
    fields.forEach(field => {
      if (!field.showIf) return;
      const wrap = formEl.querySelector(`.form-group[data-field-name="${field.name}"]`);
      if (!wrap) return;
      const currentVal = state[field.showIf.field];
      const visible = String(currentVal) === String(field.showIf.value);
      wrap.style.display = visible ? 'block' : 'none';
    });
  }

  function updateState() {
    const vals = getValues();
    Object.assign(state, vals);
    updateVisibility();
    const md = template(state);
    previewEl.innerHTML = md;
  }

  function copyPrompt() {
    const text = previewEl.innerText;
    navigator.clipboard.writeText(text).then(() => {
      window.showToast && window.showToast(isZh ? '已复制到剪贴板' : 'Copied to clipboard');
    });
  }

  function downloadPrompt() {
    const text = previewEl.innerText;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (config.filename || 'prompt') + '.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  buildForm();
})();
