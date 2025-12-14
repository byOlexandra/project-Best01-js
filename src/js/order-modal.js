import Swal from "sweetalert2";

const refs = {
    modal: document.querySelector("[data-modal]"),
    backdrop: document.querySelector("[data-modal-backdrop]"),
    closeBtn: document.querySelector("[data-modal-close]"),
    openBtns: document.querySelectorAll("[data-take-home]"),
    form: document.querySelector(".order-modal-form"),
};

let currentAnimalId = null;

function openModal(animalId) {
    currentAnimalId = animalId ?? null;

    refs.modal.classList.remove("is-hidden");
    document.body.classList.add("no-scroll");

    window.addEventListener("keydown", onEscClose);
}

function closeModal() {
    refs.modal.classList.add("is-hidden");
    document.body.classList.remove("no-scroll");

    window.removeEventListener("keydown", onEscClose);

    currentAnimalId = null;
}

function onEscClose(e) {
    if (e.key === "Escape") closeModal();
}

function onBackdropClick(e) {
    if (e.target === refs.backdrop) closeModal();
}

async function onSubmit(e) {
    e.preventDefault();

    if (!refs.form.checkValidity()) {
    refs.form.reportValidity();
    return;
    }

    const fd = new FormData(refs.form);

    const payload = {
    name: fd.get("user-name").trim(),
    phone: fd.get("user-phone").trim(),
    comment: (fd.get("user-comment") || "").trim(),
    animalId: currentAnimalId,
    };

    if (!payload.animalId) {
    Swal.fire({
        icon: "warning",
        title: "Не обрано тварину",
        text: "Спробуй відкрити форму через картку конкретної тварини.",
    });
    return;
    }

    try {
    const BASE_URL = "https://paw-hut.b.goit.study/api";
    const res = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // часто API повертає json з помилкою — спробуємо дістати текст
        let message = "Сталася помилка. Спробуйте ще раз.";
        try {
        const errData = await res.json();
        message = errData.message || message;
        } catch (_) {}
        throw new Error(message);
    }

    Swal.fire({
        icon: "success",
        title: "Заявку надіслано!",
        text: "Ми зв’яжемося з вами найближчим часом 🙂",
        timer: 2200,
        showConfirmButton: false,
    });

    refs.form.reset();
    closeModal();
    } catch (err) {
    Swal.fire({
        icon: "error",
        title: "Не вдалося надіслати заявку",
        text: err.message || "Перевір з’єднання та спробуй ще раз.",
        });
    }
}

// -------------------- LISTENERS --------------------
refs.closeBtn.addEventListener("click", closeModal);
refs.backdrop.addEventListener("click", onBackdropClick);
refs.form.addEventListener("submit", onSubmit);

// Відкриття по кнопці "Взяти додому"
// Тут треба знати animalId: найкраще — записати його в data-атрибут кнопки.
refs.openBtns.forEach(btn => {
    btn.addEventListener("click", () => {
    // варіант 1 (рекомендований): data-animal-id на кнопці
    const idFromBtn = btn.dataset.animalId; // <button data-take-home data-animal-id="123">
    openModal(idFromBtn);
    });
});

// Експортуємо, щоб ти могла відкривати модалку з іншого місця (наприклад, з модалки опису)
export { openModal, closeModal };
