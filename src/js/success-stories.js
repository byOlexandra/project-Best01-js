import Swal from 'sweetalert2';
import Swiper from 'swiper'; 
import { Navigation, Pagination } from 'swiper/modules';

import 'star-rating.js/dist/star-rating.css';

const API_URL = 'https://paw-hut.b.goit.study/api/feedbacks?limit=10&page=1';

function createFeedbackCard(feedback) {
    const rating = feedback.rate;
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
        starsHtml += `
            <svg class="star-icon filled">
            <use href="./img/sprite.svg#icon-star-filled"></use>
            </svg>`;
        } else if (i - 0.5 <= rating) {
        starsHtml += `
            <div class="star-half-wrapper">
            <svg class="star-icon outline">
                <use href="/img/sprite.svg#icon-star-outline"></use>
            </svg>
            <svg class="star-icon filled half-overlay">
                <use href="/img/sprite.svg#icon-star-filled"></use>
            </svg>
            </div>`;
        } else {
        starsHtml += `
            <svg class="star-icon outline">
            <use href="/img/sprite.svg#icon-star-outline"></use>
            </svg>`;
        }
    }

    return `
        <div class="swiper-slide">
        <div class="feedback-card">
            <div class="rating-container">
            <div class="stars-wrapper">${starsHtml}</div>
            </div>
            <p class="feedback-text">${feedback.description}</p>
            <p class="feedback-author">${feedback.author}</p>
        </div>
        </div>
    `;
}

function initializeFeedbacksAndStars(data) {
    const wrapper = document.getElementById('feedbacks-wrapper');
    if (!wrapper || !data?.length) return;

    wrapper.innerHTML = data.map(createFeedbackCard).join('');

    initializeSwiper();
}


function initializeSwiper() {
    return new Swiper('.feedbacks-slider', {
        modules: [Navigation, Pagination], 
        slidesPerView: 1,
        spaceBetween: 24,
        grabCursor: true, 
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 16 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1280: { slidesPerView: 2, spaceBetween: 24 }
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        observer: true, 
        observeParents: true,
    });
}

export async function initSuccessStories() {
    const section = document.querySelector('.feedbacks-section');
    if (!section) return;

    try {
        const response = await fetch(API_URL);
        const { feedbacks } = await response.json();

        initializeFeedbacksAndStars(feedbacks);
    } catch (error) {
        Swal.fire({
        icon: 'error',
        title: 'Помилка завантаження',
        text: 'Не вдалося завантажити відгуки. Спробуйте пізніше.',
        });
    }
}