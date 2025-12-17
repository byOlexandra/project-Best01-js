import { currentPets } from './pets-list.js';
const backdrop = document.querySelector('[data-animal-modal-backdrop]');
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector('[data-animal-modal-close]');
const openFormBtn = backdrop.querySelector('[data-take-home]');
const modalImage = document.querySelector('[data-animal-img]');
const modalSpecies = document.querySelector('[data-animal-species]');
const modalName = document.querySelector('[data-animal-name]');
const modalAge = document.querySelector('[data-animal-age]');
const modalSex = document.querySelector('[data-animal-sex]');
const modalDesc = document.querySelector('[data-animal-description]');
const modalHealth = document.querySelector('[data-animal-health]');
const modalBehaviour = document.querySelector('[data-animal-behavior]');
export function openPetModal(petId) {
    if (!backdrop || !modalImage || !modalName) return;
    const pet = currentPets.find(p => p._id === petId);
    if (!pet) return;
    modalImage.src = pet.image;
    modalImage.alt = pet.name;
    modalName.textContent = pet.name;
    modalAge.textContent = pet.age;
    modalSex.textContent = pet.gender;
    modalSpecies.textContent = pet.species;
    modalDesc.textContent = pet.shortDescription;
    modalHealth.textContent = pet.healthStatus;
    modalBehaviour.textContent = pet.behavior;
    backdrop.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';
    setCurrentPetId(pet._id);
}
export function closePetModal() {
    backdrop.classList.add('is-hidden');
    document.body.style.overflow = '';
}
backdrop.addEventListener('click', (e) => {
    if (e.target.closest('[data-animal-modal-close]')) {
        closePetModal();
    }
    if (!modal.contains(e.target)) closePetModal();
});
document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePetModal();
})
let currentPetId = null;
export function setCurrentPetId(petId) {
    currentPetId = petId;
}
if (openFormBtn) {
    openFormBtn.addEventListener('click', () => {
        if (!currentPetId) return;
        closePetModal();
        const event = new CustomEvent('openAdoptionModal', {
            detail: { animalId: currentPetId },
            bubbles: true,
        });
        document.dispatchEvent(event);
    });
}