import { initAccordion } from './js/FAQ-section.js';
initAccordion();
import { openModal, closeModal } from './js/order-modal.js';
import { initMobileMenu } from './js/mobile-menu.js';
import { initSwiper } from './js/about-us.js';
import { addCategories, getPets, renderPets } from './js/pets-list.js';
import { initSuccessStories } from './js/success-stories.js';
initSuccessStories();
import updateCopyrightYear from './js/footer.js';

document.addEventListener('DOMContentLoaded', () => {
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
    
    updateCopyrightYear()
});

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
