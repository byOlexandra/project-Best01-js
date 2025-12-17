
import StarRating from 'star-rating.js';
import Swiper from 'swiper'; 
import { Navigation, Pagination } from 'swiper/modules';

import 'star-rating.js/dist/star-rating.css';

const API_URL = 'https://paw-hut.b.goit.study/api/feedbacks?limit=10&page=1';

function createFeedbackCard(feedback) {
    return `
        <div class="swiper-slide">
            <div class="feedback-card" id="${feedback.id}">
                <div>
                    <div class="rating-container">
                    <div class="star-rating-lib" data-rating="${Number(feedback.rate)}"></div>
                    </div>
                    <p class="feedback-text">${feedback.description}</p>
                </div>
                <p class="feedback-author">${feedback.author}</p>
            </div>
        </div>
    `;
}

const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (type === 'touchmove' && (options === undefined || options === false)) {
        originalAddEventListener.call(this, type, listener, { passive: true });
    } else {
        originalAddEventListener.call(this, type, listener, options);
    }
};

function initializeFeedbacksAndStars(data) {
    const wrapper = document.getElementById('feedbacks-wrapper');
    if (!wrapper || !data) return;

    wrapper.innerHTML = data.map(createFeedbackCard).join('');
    initializeSwiper();
    requestAnimationFrame(() => {
    new StarRating('.star-rating-lib', {
        readOnly: true,
        tooltip: false,
        clearable: false,
        stars(el, item) {
        let iconId = 'icon-star-outline';

        if (item.state === 'full') iconId = 'icon-star-filled';
        if (item.state === 'half') iconId = 'icon-star-half';

        el.innerHTML = `
            <svg width="24" height="24" class="star ${item.state}">
            <use href="/img/sprite.svg#${iconId}"></use>
            </svg>
        `;
        }
    });
});
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
        const apiResponse = await response.json();
        const feedbackData = apiResponse.feedbacks;
    
        initializeFeedbacksAndStars(feedbackData);
        
    } catch (error) {
        console.error("Error loading reviews:", error);
    }
}