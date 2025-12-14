
const refs = {
    
    backdrop: document.querySelector("[data-animal-modal-backdrop]"),
    closeBtn: document.querySelector("[data-animal-modal-close]"),
    takeHomeBtn: document.querySelector("[data-take-home]"),
  
    img: document.querySelector("[data-animal-img]"),
    species: document.querySelector("[data-animal-species]"),
    name: document.querySelector("[data-animal-name]"),
    age: document.querySelector("[data-animal-age]"),
    sex: document.querySelector("[data-animal-sex]"),
    description: document.querySelector("[data-animal-description]"),
    health: document.querySelector("[data-animal-health]"),
    behavior: document.querySelector("[data-animal-behavior]"),
  
    
    loader: document.querySelector("[data-loader]"),
    toasts: document.querySelector("[data-toasts]"),
  };
  
  let lastActiveEl = null;
  

  function lockScroll() {
    document.body.classList.add("scroll-locked");
  }
  function unlockScroll() {
    document.body.classList.remove("scroll-locked");
  }
  
  function showLoader() {
    if (!refs.loader) return;
    refs.loader.classList.remove("is-hidden");
    refs.loader.setAttribute("aria-hidden", "false");
  }
  function hideLoader() {
    if (!refs.loader) return;
    refs.loader.classList.add("is-hidden");
    refs.loader.setAttribute("aria-hidden", "true");
  }
  
  function showToast(message, type = "error") {
    if (!refs.toasts) return;
  
    const el = document.createElement("div");
    el.className = `toast toast--${type}`;
    el.textContent = message;
  
    refs.toasts.appendChild(el);
  
    setTimeout(() => el.classList.add("is-show"), 10);
  
    setTimeout(() => {
      el.classList.remove("is-show");
      setTimeout(() => el.remove(), 250);
    }, 3000);
  }
  

  async function requestJson(url, options) {
    showLoader();
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      showToast("Сталася помилка запиту. Спробуйте ще раз.", "error");
      throw e;
    } finally {
      hideLoader();
    }
  }
  
  function normalizeImg(data) {
 
    if (data?.imageUrl && typeof data.imageUrl === "string") {
      return { src: data.imageUrl };
    }
  
  
    if (data?.image1x && data?.image2x) {
      return {
        src: data.image1x,
        srcset: `${data.image1x} 1x, ${data.image2x} 2x`,
      };
    }
  

    if (data?.image && typeof data.image === "object") {
      const src1x = data.image["1x"];
      const src2x = data.image["2x"];
      if (typeof src1x === "string" && src1x) {
        return src2x
          ? { src: src1x, srcset: `${src1x} 1x, ${src2x} 2x` }
          : { src: src1x };
      }
    }
  
 
    const fallback = data?.photo || data?.url || data?.image;
    if (typeof fallback === "string" && fallback) {
      return { src: fallback };
    }
  
    return null;
  }
  
  function applyAnimalImg(data) {
    if (!refs.img) return;
  
    const normalized = normalizeImg(data);
  
    if (!normalized) {
     
      refs.img.src = "";
      refs.img.removeAttribute("srcset");
      refs.img.removeAttribute("sizes");
      return;
    }
  
    refs.img.src = normalized.src;
  
    if (normalized.srcset) {
      refs.img.srcset = normalized.srcset;
  

      refs.img.sizes = "(min-width: 1440px) 576px, (min-width: 768px) 304px, 295px";
    } else {
      refs.img.removeAttribute("srcset");
      refs.img.removeAttribute("sizes");
    }
  }
  

  function onEsc(e) {
    if (e.key === "Escape") closeAnimalModal();
  }
  
  function onBackdropClick(e) {
    if (e.target === refs.backdrop) closeAnimalModal();
  }
  
  function fillAnimalModal(data) {
    applyAnimalImg(data);
    refs.img.alt = data?.name ? `Фото: ${data.name}` : "Фото тваринки";
  
    refs.species.textContent = data?.species ?? "—";
    refs.name.textContent = data?.name ?? "—";
    refs.age.textContent = data?.age ?? "—";
    refs.sex.textContent = data?.sex ?? "—";
    refs.description.textContent = data?.description ?? "";
    refs.health.textContent = data?.healthInfo ?? "";
    refs.behavior.textContent = data?.behaviorInfo ?? "";
  
    refs.takeHomeBtn.dataset.animalId = data?.id ?? "";
  }
  
  function showModalUI() {
    lastActiveEl = document.activeElement;
    refs.backdrop.classList.remove("is-hidden");
    lockScroll();
  
    document.addEventListener("keydown", onEsc);
    refs.backdrop.addEventListener("click", onBackdropClick);
  
    refs.closeBtn.focus();
  }
  
  export function openAnimalModal(animalCardData, { fetchDetails = false } = {}) {
    fillAnimalModal(animalCardData);
    showModalUI();
  
    // опційно 
    if (fetchDetails && animalCardData?.id) {
      (async () => {
        try {
          const fullData = await requestJson(`/api/animals/${animalCardData.id}`);
          fillAnimalModal({ ...animalCardData, ...fullData });
        } catch {
          closeAnimalModal();
        }
      })();
    }
  }
  
  export function closeAnimalModal() {
    refs.backdrop.classList.add("is-hidden");
    unlockScroll();
  
    document.removeEventListener("keydown", onEsc);
    refs.backdrop.removeEventListener("click", onBackdropClick);
  
    if (lastActiveEl) lastActiveEl.focus();
  }
  





  refs.closeBtn.addEventListener("click", closeAnimalModal);
  
  refs.takeHomeBtn.addEventListener("click", () => {
    const animalId = refs.takeHomeBtn.dataset.animalId;
  
    closeAnimalModal();
  
    document.dispatchEvent(
      new CustomEvent("openAdoptionModal", {
        detail: { animalId },
      })
    );
  });
  