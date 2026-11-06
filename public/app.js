const $ = (id) => document.getElementById(id);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const state = {
  products: [],
  editingId: null,
  currentImageUrl: '',
  removeImage: false,
  selectedFile: null,
  objectUrl: '',
};

const els = {
  form: $('product-form'),
  id: $('product-id'),
  name: $('product-name'),
  price: $('product-price'),
  stock: $('product-stock'),
  description: $('product-description'),
  image: $('product-image'),
  preview: $('preview'),
  previewImage: $('preview-image'),
  previewLabel: $('preview-label'),
  removeImage: $('remove-image'),
  formTitle: $('form-title'),
  formSubtitle: $('form-subtitle'),
  submit: $('submit-btn'),
  cancel: $('cancel-edit'),
  message: $('form-message'),
  products: $('products'),
  count: $('product-count'),
  search: $('search'),
  toast: $('toast'),
};

/* Helpers ------------------------------------------------------- */
function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character]
  );
}

function initials(name) {
  const letters = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return letters || 'P';
}

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(path, options);
  } catch {
    throw new Error('Could not reach the server. Please try again.');
  }

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    /* Some errors may not return JSON. */
  }

  if (!response.ok) {
    const error = new Error(payload.message || 'Request failed.');
    error.errors = payload.errors;
    throw error;
  }

  return payload;
}

let toastTimer;
function showToast(message, type = 'success') {
  els.toast.textContent = message;
  els.toast.className = `toast is-visible ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.toast.className = 'toast';
  }, 2600);
}

function showMessage(message) {
  els.message.textContent = message;
  els.message.hidden = false;
}

function hideMessage() {
  els.message.textContent = '';
  els.message.hidden = true;
}

/* Products list ------------------------------------------------- */
let loadToken = 0;

async function loadProducts() {
  const token = ++loadToken;
  const search = els.search.value.trim();

  els.count.textContent = 'Loading…';

  try {
    const payload = await request(`/api/products?search=${encodeURIComponent(search)}`);
    if (token !== loadToken) return;

    state.products = payload.data;
    renderProducts(payload.data);
    els.count.textContent = `${payload.count} product${payload.count === 1 ? '' : 's'}`;
  } catch (error) {
    if (token !== loadToken) return;
    state.products = [];
    els.count.textContent = 'Could not load products';
    els.products.innerHTML = `<div class="empty"><strong>Something went wrong</strong><span>${escapeHtml(
      error.message
    )}</span></div>`;
    showToast(error.message, 'error');
  }
}

function renderProducts(products) {
  if (!products.length) {
    const searching = Boolean(els.search.value.trim());
    els.products.innerHTML = `<div class="empty">
      <strong>${searching ? 'No products match your search' : 'No products yet'}</strong>
      <span>${searching ? 'Try a different search term.' : 'Add your first product using the form.'}</span>
    </div>`;
    return;
  }

  els.products.innerHTML = products
    .map((product) => {
      const stockClass = product.stock === 0 ? 'out' : product.stock <= 5 ? 'low' : 'ok';
      const stockLabel =
        product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`;

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="card-image">
            <span aria-hidden="true">${escapeHtml(initials(product.name))}</span>
            ${
              product.imageUrl
                ? `<img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(
                    product.name
                  )}" loading="lazy" />`
                : ''
            }
          </div>
          <div class="card-body">
            <div class="card-top">
              <h3 title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</h3>
              <span class="price">${money.format(product.price)}</span>
            </div>
            <p class="card-description">${escapeHtml(
              product.description || 'No description added.'
            )}</p>
            <div class="card-footer">
              <span class="stock ${stockClass}">${stockLabel}</span>
              <div class="card-actions">
                <button type="button" data-action="edit" data-id="${product.id}">Edit</button>
                <button type="button" class="danger" data-action="delete" data-id="${product.id}">Delete</button>
              </div>
            </div>
          </div>
        </article>`;
    })
    .join('');
}

/* Image preview ------------------------------------------------ */
function clearSelectedFile() {
  state.selectedFile = null;
  els.image.value = '';

  if (state.objectUrl) {
    URL.revokeObjectURL(state.objectUrl);
    state.objectUrl = '';
  }
}

function updatePreview() {
  const src = state.selectedFile ? state.objectUrl : state.currentImageUrl;

  if (src) {
    els.previewImage.src = src;
    els.preview.hidden = false;
    els.previewLabel.textContent = state.selectedFile
      ? state.selectedFile.name
      : 'Current image';
  } else {
    els.preview.hidden = true;
    els.previewImage.removeAttribute('src');
  }
}

/* Form --------------------------------------------------------- */
function setLoading(loading) {
  els.submit.disabled = loading;
  els.submit.textContent = loading
    ? 'Saving…'
    : state.editingId === null
      ? 'Add product'
      : 'Save changes';
}

function resetForm() {
  state.editingId = null;
  state.currentImageUrl = '';
  state.removeImage = false;
  clearSelectedFile();

  els.form.reset();
  els.id.value = '';
  els.formTitle.textContent = 'Add product';
  els.formSubtitle.textContent = 'Create a product and upload its image.';
  els.submit.textContent = 'Add product';
  els.cancel.hidden = true;

  hideMessage();
  updatePreview();
}

function startEdit(product) {
  state.editingId = product.id;
  state.currentImageUrl = product.imageUrl || '';
  state.removeImage = false;
  clearSelectedFile();

  els.id.value = product.id;
  els.name.value = product.name;
  els.price.value = product.price;
  els.stock.value = product.stock;
  els.description.value = product.description || '';
  els.formTitle.textContent = 'Edit product';
  els.formSubtitle.textContent = 'Update the details or replace the image.';
  els.submit.textContent = 'Save changes';
  els.cancel.hidden = false;

  hideMessage();
  updatePreview();
  els.name.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteProduct(product) {
  if (!window.confirm(`Delete "${product.name}"?`)) return;

  try {
    await request(`/api/products/${product.id}`, { method: 'DELETE' });
    if (state.editingId === product.id) resetForm();
    await loadProducts();
    showToast('Product deleted.', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

/* Events ------------------------------------------------------- */
els.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  hideMessage();

  const name = els.name.value.trim();
  const priceValue = els.price.value.trim();
  const stockValue = els.stock.value.trim();
  const price = Number(priceValue);
  const stock = Number(stockValue);

  if (name.length < 2) {
    showMessage('Enter a product name of at least 2 characters.');
    els.name.focus();
    return;
  }

  if (!priceValue || !Number.isFinite(price) || price < 0) {
    showMessage('Enter a price of 0 or more.');
    els.price.focus();
    return;
  }

  if (!stockValue || !Number.isInteger(stock) || stock < 0) {
    showMessage('Enter stock as a whole number of 0 or more.');
    els.stock.focus();
    return;
  }

  setLoading(true);

  try {
    let imageUrl = state.removeImage ? '' : state.currentImageUrl;

    if (state.selectedFile) {
      const formData = new FormData();
      formData.append('image', state.selectedFile);

      const uploaded = await request('/api/uploads', {
        method: 'POST',
        body: formData,
      });
      imageUrl = uploaded.data.url;
    }

    const editing = state.editingId !== null;
    const payload = {
      name,
      description: els.description.value.trim(),
      price,
      stock,
      imageUrl,
    };

    await request(editing ? `/api/products/${state.editingId}` : '/api/products', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    resetForm();
    await loadProducts();
    showToast(editing ? 'Product updated.' : 'Product added.', 'success');
  } catch (error) {
    const fieldMessage = error.errors ? Object.values(error.errors)[0] : '';
    showMessage(fieldMessage || error.message);
    showToast('Could not save the product.', 'error');
  } finally {
    setLoading(false);
  }
});

els.image.addEventListener('change', () => {
  const file = els.image.files?.[0];
  if (!file) return;

  if (!ALLOWED_TYPES.includes(file.type)) {
    showToast('Choose a JPG, PNG, WebP, GIF or AVIF image.', 'error');
    els.image.value = '';
    return;
  }

  if (file.size > MAX_IMAGE_BYTES) {
    showToast('Image must be 5 MB or smaller.', 'error');
    els.image.value = '';
    return;
  }

  clearSelectedFile();
  state.selectedFile = file;
  state.removeImage = false;
  state.objectUrl = URL.createObjectURL(file);
  updatePreview();
});

els.removeImage.addEventListener('click', () => {
  clearSelectedFile();
  state.currentImageUrl = '';
  state.removeImage = true;
  updatePreview();
});

els.cancel.addEventListener('click', resetForm);

els.products.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const product = state.products.find(
    (item) => item.id === Number(button.dataset.id)
  );
  if (!product) return;

  if (button.dataset.action === 'edit') startEdit(product);
  if (button.dataset.action === 'delete') deleteProduct(product);
});

// If an uploaded file has gone missing, fall back to the initials tile.
els.products.addEventListener(
  'error',
  (event) => {
    if (event.target instanceof HTMLImageElement) event.target.remove();
  },
  true
);

let searchTimer;
els.search.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(loadProducts, 250);
});

/* Start -------------------------------------------------------- */
updatePreview();
loadProducts();
