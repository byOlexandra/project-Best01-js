import { initAccordion } from './js/FAQ-section.js';
import { openModal, closeModal } from './js/order-modal.js';
import { initMobileMenu } from './js/mobile-menu.js';
import { initSwiper } from './js/about-us.js';
import { addCategories, getPets, renderPets } from './js/pets-list.js';

document.addEventListener('DOMContentLoaded', () => {
    initAccordion();
    openModal();
    closeModal();
    initMobileMenu();
    initSwiper();

    addCategories();
    getPets('all', 1);

    const API_URL = 'https://paw-hut.b.goit.study/api/animals';
    fetch(API_URL)
        .then(res => res.json())
        .then(data => renderPets(data.pets))
        .catch(err => console.error(err));
});

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}