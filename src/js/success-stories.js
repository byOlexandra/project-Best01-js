import Swal from 'sweetalert2';
import Swiper from 'swiper'; 
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const API_URL = 'https://paw-hut.b.goit.study/api/feedbacks?limit=10&page=1';

function createFeedbackCard(feedback) {
    const rating = feedback.rate;
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
        starsHtml += `
            <svg class="star-icon filled">
            <use href="/img/sprite.svg#icon-star-filled"></use>
            </svg>`;
        } else if (i - 0.5 <= rating) {
        starsHtml += `
            <div class="star-half-wrapper">
            <svg class="star-icon outline">
                <use href="../img/sprite.svg#icon-star-outline"></use>
            </svg>
            <svg class="star-icon filled half-overlay">
                <use href="../img/sprite.svg#icon-star-filled"></use>
            </svg>
            </div>`;
        } else {
        starsHtml += `
            <svg class="star-icon outline">
            <use href="../img/sprite.svg#icon-star-outline"></use>
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
    const sliderContainer = document.querySelector('.feedbacks-section .feedbacks-slider');
    if (!sliderContainer) return;

    const btnNext = sliderContainer.querySelector('.swiper-button-next');
    const btnPrev = sliderContainer.querySelector('.swiper-button-prev');

    const swiper = new Swiper(sliderContainer, {
        modules: [Navigation, Pagination], 
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 24,
        grabCursor: true,
        pagination: {
            el: sliderContainer.querySelector('.swiper-pagination'),
            clickable: true,
        },
        breakpoints: {
            320: { slidesPerView: 1, slidesPerGroup: 1 },
            768: { slidesPerView: 2, slidesPerGroup: 1 },
            1280: { slidesPerView: 2, slidesPerGroup: 1 }
        },
        
        on: {
            init: function() { toggleButtons(this); },
            slideChange: function() { toggleButtons(this); }
        }
    });

    function toggleButtons(s) {
        if (!btnNext || !btnPrev) return;
        
        btnPrev.disabled = s.isBeginning;
        btnPrev.classList.toggle('swiper-button-disabled', s.isBeginning);
        
        btnNext.disabled = s.isEnd;
        btnNext.classList.toggle('swiper-button-disabled', s.isEnd);
    }

    if (btnNext) {
        btnNext.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            swiper.slideNext();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            swiper.slidePrev();
        });
    }

    return swiper;
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