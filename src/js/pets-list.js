const API_BASE = 'https://paw-hut.b.goit.study';

async function fetchCategories() {
  const res = await fetch(`${API_BASE}/api/categories`);
  if (!res.ok) throw new Error('Categories error');
  return res.json();
}

async function fetchAnimals({ page, limit, categoryId }) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (categoryId) params.set('categoryId', categoryId);

  const res = await fetch(`${API_BASE}/api/animals?${params.toString()}`);
  if (!res.ok) throw new Error('Animals error');
  return res.json();
}

const state = {
  page: 1,
  limitDesktop: 9,
  limitMobile: 6,
  totalPages: 1,
  categoryId: null,
  categoriesMap: new Map(),
  isLoading: false,
};

const mqWithPagination = window.matchMedia('(min-width: 768px)');

const refs = {
  section: document.querySelector('.pets-list-section'),
  list: document.querySelector('.pets-list'),
  filters: document.querySelector('.filter-pet-list'),
  filterBtns: document.querySelectorAll('.filter-pet-list-button'),
  pagination: document.querySelector('.pets-pagination'),
  loadMore: document.querySelector('.add-more-pets'),
};

if (refs.section) {
  init();
}

async function init() {
  await loadCategories();

  refs.filters.addEventListener('click', onFilterClick);

  if (refs.pagination) {
    refs.pagination.addEventListener('click', onPaginationClick);
  }
  if (refs.loadMore) {
    refs.loadMore.addEventListener('click', onLoadMore);
  }

  mqWithPagination.addEventListener?.('change', async () => {
    state.page = 1;
    await loadAndRender({ reset: true });
  });

  await loadAndRender({ reset: true });
}

function getLimit() {
  return mqWithPagination.matches ? state.limitDesktop : state.limitMobile;
}

async function loadCategories() {
  const categories = await fetchCategories();
  categories.forEach(cat => {
    state.categoriesMap.set(cat.name.trim(), cat._id);
  });
}

async function onFilterClick(e) {
  const btn = e.target.closest('.filter-pet-list-button');
  if (!btn || state.isLoading) return;

  const name = btn.textContent.trim();
  state.page = 1;

  state.categoryId =
    name === 'Всі' ? null : state.categoriesMap.get(name) || null;

  setActiveFilter(btn);
  await loadAndRender({ reset: true });
}

async function onPaginationClick(e) {
  if (!mqWithPagination.matches) return;

  const btn = e.target.closest('button');
  if (!btn || state.isLoading) return;

  if (btn.dataset.page) {
    state.page = Number(btn.dataset.page);
  }

  if (btn.dataset.action === 'prev' && state.page > 1) {
    state.page -= 1;
  }

  if (btn.dataset.action === 'next' && state.page < state.totalPages) {
    state.page += 1;
  }

  await loadAndRender({ reset: true });
}

async function onLoadMore() {
  if (mqWithPagination.matches) return;

  if (state.page >= state.totalPages) return;

  state.page += 1;
  await loadAndRender({ reset: false });
}

async function loadAndRender({ reset }) {
  try {
    state.isLoading = true;

    const limit = getLimit();
    const data = await fetchAnimals({
      page: state.page,
      limit,
      categoryId: state.categoryId,
    });

    state.totalPages = Math.max(1, Math.ceil(data.totalItems / limit));

    renderCards(data.animals, { append: !reset });

    if (mqWithPagination.matches) {
      if (refs.pagination) renderPagination();
      if (refs.loadMore) refs.loadMore.style.display = 'none';
    } else {
      if (refs.pagination) refs.pagination.innerHTML = '';
      if (refs.loadMore) {
        refs.loadMore.style.display =
          state.page >= state.totalPages ? 'none' : '';
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    state.isLoading = false;
  }
}

function renderCards(animals, { append }) {
  const markup = animals.map(createCard).join('');

  if (append) {
    refs.list.insertAdjacentHTML('beforeend', markup);
  } else {
    refs.list.innerHTML = markup;
  }
}

function createCard(animal) {
  return `
    <li class="pet-card">
      <img src="${animal.image}" alt="${animal.name}" loading="lazy" />
      <h3>${animal.name}</h3>
      <p>${animal.species}</p>
      <p>${animal.age} • ${animal.gender}</p>
      <p>${animal.shortDescription || ''}</p>
      <button type="button">Дізнатись більше</button>
    </li>
  `;
}

function renderPagination() {
  if (!refs.pagination) return;

  if (state.totalPages <= 1) {
    refs.pagination.innerHTML = '';
    return;
  }

  let html = `
    <button data-action="prev" ${state.page === 1 ? 'disabled' : ''}>←</button>
  `;

  for (let i = 1; i <= state.totalPages; i += 1) {
    html += `
      <button data-page="${i}" ${
      i === state.page ? 'class="active"' : ''
    }>${i}</button>
    `;
  }

  html += `
    <button data-action="next" ${
      state.page === state.totalPages ? 'disabled' : ''
    }>→</button>
  `;

  refs.pagination.innerHTML = html;
}

function setActiveFilter(activeBtn) {
  refs.filterBtns.forEach(btn => btn.classList.remove('is-active'));
  activeBtn.classList.add('is-active');
}
