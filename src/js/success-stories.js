
import StarRating from 'star-rating.js';
import Swiper from 'swiper'; 
import { Navigation, Pagination } from 'swiper/modules';

import 'star-rating.js/dist/star-rating.css';

const API_URL = 'https://paw-hut.b.goit.study/api/feedbacks?limit=10&page=1';

function createFeedbackCard(feedback) {
    return `
        <div class="swiper-slide">
            <div class="feedback-card">
                <div>
                    <div class="rating-container">
                        <select class="star-rating-lib">
                            <option value="">Select a rating</option>
                            <option value="5" ${Math.round(feedback.rate) === 5 ? 'selected' : ''}>5</option>
                            <option value="4" ${Math.round(feedback.rate) === 4 ? 'selected' : ''}>4</option>
                            <option value="3" ${Math.round(feedback.rate) === 3 ? 'selected' : ''}>3</option>
                            <option value="2" ${Math.round(feedback.rate) === 2 ? 'selected' : ''}>2</option>
                            <option value="1" ${Math.round(feedback.rate) === 1 ? 'selected' : ''}>1</option>
                        </select>
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

    
    setTimeout(() => {
        new StarRating('.star-rating-lib', {
            readOnly: true,
            tooltip: false,
            clearable: false,
            stars: function (el, item, index) {
        el.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <path d="M16 2.5l4.3 8.7 9.7 1.4-7 6.8 1.7 9.6-8.7-4.6-8.7 4.6 1.7-9.6-7-6.8 9.7-1.4z"/>
            </svg>`;
    },
    
        });
        document.querySelectorAll('.star-rating-lib + .star-rating label').forEach(label => {
            label.style.pointerEvents = 'none';
        });
        initializeSwiper();
    }, 0);
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