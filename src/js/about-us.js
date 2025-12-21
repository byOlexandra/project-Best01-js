import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
Swiper.use([Navigation, Pagination]);
export function initSwiper() {
    const swiperEl = document.querySelector(".swiper");
    if (!swiperEl) return;
    const prevBtn = document.querySelector(".swiper-button-prev");
    const nextBtn = document.querySelector(".swiper-button-next");
    const swiper = new Swiper (swiperEl, {
        slidesPerView: 'auto',
        centeredSlides: true,
        autoHeight: false,
        loop: false,
        speed: 600,
        grabCursor: true,
        allowTouchMove: true,
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        updateOnImagesReady: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            disabledClass: 'swiper-button-disabled',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 1,
        },
        on: {
            // Примусове оновлення через частку секунди після старту
            init: function () {
                setTimeout(() => {
                    this.update();
                }, 300);
            }
        }
    })
    window.addEventListener('load', () => {
        swiper.update();
    });    
}