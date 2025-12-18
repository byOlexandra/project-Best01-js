import Swal from "sweetalert2";
import { openPetModal } from './animal-details-modal.js';

const API_URL = 'https://paw-hut.b.goit.study/api';

let currentCategory = '';
let currentPage = 1;
let perPage = window.innerWidth >= 1440 ? 9 : 8;

const animalsContainer = document.querySelector('.pets-list');
const categoriesList = document.querySelector('.filter-pet-list');
const loadMoreBtn = document.querySelector('.add-more-pets');
const loader = document.querySelector('.loader');

window.addEventListener('resize', () => {
  perPage = window.innerWidth >= 1440 ? 9 : 8;
});

function showLoader() {
  if (loader) loader.classList.remove('hidden');
  document
    .querySelectorAll('.filter-pet-list-button')
    .forEach(btn => (btn.disabled = true));
  if (loadMoreBtn) loadMoreBtn.disabled = true;
}

function hideLoader() {
  if (loader) loader.classList.add('hidden');
  document
    .querySelectorAll('.filter-pet-list-button')
    .forEach(btn => (btn.disabled = false));
  if (loadMoreBtn) loadMoreBtn.disabled = false;
}

export async function addCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`);
    const categories = await response.json();
    const allButtonMarkup = `
            <li class="filter-item">
                <button type="button" class="filter-pet-list-button active" data-id="all">
                    Всі
                </button>
            </li>
        `;
    const markup = categories
      .toSorted((a, b) => a._id.localeCompare(b._id))
      .map(
        ({ _id, name }) => `
            <li class="filter-item">
            <button type="button" class="filter-pet-list-button" data-id="${_id}">
                ${name}
            </button>
            </li>
        `
      )
      .join('');
    categoriesList.innerHTML = allButtonMarkup + markup;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Помилка завантаження',
      text: 'Не вдалося отримати список категорій. Спробуйте ще раз пізніше.',
    })
  }
}

categoriesList.addEventListener('click', async e => {

  if (e.target.nodeName !== 'BUTTON') return;

  currentCategory = e.target.dataset.id;
  currentPage = 1;
  animalsContainer.innerHTML = '';

  document
    .querySelectorAll('.filter-pet-list-button')
    .forEach(btn => btn.classList.remove('active'));
  
  e.target.classList.add('active');

  await getPets(currentCategory, currentPage);
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  await getPets(currentCategory, currentPage);
});

export async function getPets(categoryId = 'all', page = 1) {
  showLoader();
  try {
    let url = `${API_URL}/animals?page=${page}&limit=${perPage}`;
    if (categoryId && categoryId !== 'all') {
      url += `&categoryId=${categoryId}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Помилка завантаження');
    const data = await response.json();
    renderPets(data.animals);
    if (page * perPage >= data.totalItems) {
      loadMoreBtn.classList.add('hidden');
    } else {
      loadMoreBtn.classList.remove('hidden');
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Помилка завантаження',
      text: 'Не вдалося завантажити список тварин. Спробуйте пізніше.',
    })
  }
    finally {
    hideLoader();
  }
}

export let currentPets = [];

function renderPets(petsArray = []) {
  currentPets.push(...petsArray);
  const markup = petsArray
    .map(
      pet => `
        <li class="pet-card">
            <img src="${pet.image}" alt="${pet.name}" loading="lazy" />
            <div class="pet-info-box">
                <p class="pet-species">${pet.species}</p>
                <h3 class="pet-name">${pet.name}</h3>
                <ul class="pet-filters">
                    ${pet.categories
                      .map(cat => `<li>${cat.name}</li>`)
                      .join('')}
                </ul>
                <ul class="pet-info">
                    <li>${pet.age}</li>
                    <li>${pet.gender}</li>
                </ul>
            </div>
            <p class="pet-desc">${pet.shortDescription}</p>
    <button
                type="button"
                class="pet-more-btn"
                data-id="${pet._id}">
                Дізнатись більше
            </button>
        </li>
    `
    )
    .join('');
  animalsContainer.insertAdjacentHTML('beforeend', markup);
}
animalsContainer.addEventListener('click', e => {
  const btn = e.target.closest('.pet-more-btn');
  if (!btn) return;

  const petId = btn.dataset.id;
  openPetModal(petId);
});

export { renderPets }
