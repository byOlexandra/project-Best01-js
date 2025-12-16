import Swiper from 'swiper'; 
import { Navigation, Pagination } from 'swiper/modules';



const API_URL = 'https://paw-hut.b.goit.study/api/feedbacks?limit=10&page=1';

function createFeedbackCard(feedback) {
    const ratingId = `rating-${feedback._id}`;
    
    return `
        <div class="swiper-slide">
            <div class="feedback-card">
                <div>
                    <div id="${ratingId}" class="rating-container"></div>
                    <p class="feedback-text">${feedback.description}</p>
                </div>
                <p class="feedback-author">${feedback.author}</p>
            </div>
        </div>
    `;
}

function initializeFeedbacksAndRaty(data) {
    const wrapper = document.getElementById('feedbacks-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = data.map(createFeedbackCard).join('');

    data.forEach(feedback => {
        const ratingElement = $(`#rating-${feedback._id}`);

        if (ratingElement.length) {
            ratingElement.raty({
                score: feedback.rate, 
                readOnly: true,
                half: true,
                size: 20,

                starHalf: 'https://cdn.jsdelivr.net/npm/raty-js@2.9.0/lib/images/star-half.png',
                starOff: 'https://cdn.jsdelivr.net/npm/raty-js@2.9.0/lib/images/star-off.png',
                starOn: 'https://cdn.jsdelivr.net/npm/raty-js@2.9.0/lib/images/star-on.png',
            });
        }
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
            1025: { slidesPerView: 2, spaceBetween: 24 }
        },

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            bulletClass: 'swiper-pagination-bullet', 
            bulletActiveClass: 'swiper-pagination-bullet-active',
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
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiResponse = await response.json();
        const feedbackData = apiResponse.feedbacks;
    
        initializeFeedbacksAndRaty(feedbackData);
       initializeSwiper()
        
        }catch (error) {
            console.error("Error loading reviews:", error);
    }
}

initSuccessStories();