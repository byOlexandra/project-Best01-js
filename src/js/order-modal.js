import Swal from "sweetalert2";

const refs = {
    modal: document.querySelector("[data-modal]"),
    backdrop: document.querySelector("[data-modal-backdrop]"),
    closeBtn: document.querySelector("[data-modal-close]"),
    form: document.querySelector(".order-modal-form"),
    loader: document.querySelector(".loader"),
};

const BASE_URL = "https://paw-hut.b.goit.study/api";
let currentAnimalId = null;

const hasModal = refs.modal && refs.backdrop && refs.closeBtn && refs.form;

if (hasModal) {
    refs.closeBtn.addEventListener("click", closeModal);
    refs.backdrop.addEventListener("click", onBackdropClick);
    refs.form.addEventListener("submit", onSubmit);
    refs.form.addEventListener("input", onFieldInput);
    refs.form.addEventListener("blur", onFieldBlur, true);
}

document.addEventListener("openAdoptionModal", e => {
    if (!hasModal) return;
    const { animalId } = e.detail || {};
    openModal(animalId);
});

function openModal(animalId) {
    if (!hasModal) return;
    currentAnimalId = animalId ?? null;
    refs.modal.classList.remove("is-hidden");
    document.body.classList.add("no-scroll");
    window.addEventListener("keydown", onEscClose);
}

function closeModal() {
    if (!hasModal) return;
    refs.modal.classList.add("is-hidden");
    document.body.classList.remove("no-scroll");
    window.removeEventListener("keydown", onEscClose);
    currentAnimalId = null;
    clearAllErrors();
    hideLoader();
}

function onEscClose(e) {
    if (e.key === "Escape") closeModal();
}

function onBackdropClick(e) {
    if (e.currentTarget === refs.backdrop) closeModal();
}

function ensureErrorEl(field) {
    const wrapper = field.closest(".order-modal-field");
    if (!wrapper) return null;

    let errorEl = wrapper.querySelector(".order-modal-error");
    if (!errorEl) {
        errorEl = document.createElement("p");
        errorEl.className = "order-modal-error";
        errorEl.style.marginTop = "4px";
        errorEl.style.fontSize = "12px";
        errorEl.style.lineHeight = "1.3";
        errorEl.style.color = "#e74c3c";
        wrapper.appendChild(errorEl);
    }

    return errorEl;
}

function setError(field, message) {
    field.classList.add("is-error");
    const errorEl = ensureErrorEl(field);
    if (errorEl) errorEl.textContent = message;
}

function clearError(field) {
    field.classList.remove("is-error");
    const wrapper = field.closest(".order-modal-field");
    if (!wrapper) return;

    const errorEl = wrapper.querySelector(".order-modal-error");
    if (errorEl) errorEl.textContent = "";
}

function clearAllErrors() {
    if (!refs.form) return;
    const fields = refs.form.querySelectorAll(
        ".order-modal-input, .order-modal-textarea"
    );
    fields.forEach(clearError);
}

function validateField(field) {
    if (!field) return true;
    clearError(field);

    if (field.id === "user-comment") {
    const value = field.value.trim();
    if (value.length > 0 && value.length < 10) {
        setError(
            field,
            `У тексті має бути не менше 10 символів (ви ввели ${value.length}).`
        );
        return false;
    }
    return true;
    }

    if (!field.checkValidity()) {
    if (field.id === "user-name") {
        setError(field, "Вкажіть імʼя.");
        return false;
    }

    if (field.id === "user-phone") {
        setError(field, "Введіть номер у форматі 380XXXXXXXXX (12 цифр).");
        return false;
    }

    setError(field, "Перевірте введені дані.");
    return false;
    }
    return true;
}

function validateForm() {
    const nameField = refs.form.querySelector("#user-name");
    const phoneField = refs.form.querySelector("#user-phone");
    const commentField = refs.form.querySelector("#user-comment");
    const a = validateField(nameField);
    const b = validateField(phoneField);
    const c = validateField(commentField);

    return a && b && c;
}

function onFieldInput(e) {
    const field = e.target;
    if (
        field.classList.contains("order-modal-input") ||
        field.classList.contains("order-modal-textarea")
    ) {
        validateField(field);
    }
}

function onFieldBlur(e) {
    const field = e.target;
    if (
        field.classList.contains("order-modal-input") ||
        field.classList.contains("order-modal-textarea")
    ) {
        validateField(field);
    }
}

function showLoader() {
    if (refs.loader) {
        refs.loader.classList.remove("hidden");
    }
}

function hideLoader() {
    if (refs.loader) {
        refs.loader.classList.add("hidden");
    }
}

async function onSubmit(e) {
    e.preventDefault();

    if (!currentAnimalId) {
        Swal.fire({
        icon: "warning",
        title: "Не обрано тварину",
        text: "Відкрий деталі тварини та натисни «Взяти додому».",
        });
        return;
    }

    const isValid = validateForm();
    if (!isValid) {
        const firstError = refs.form.querySelector(".is-error");
        if (firstError) firstError.focus();
        return;
    }

    const fd = new FormData(refs.form);
    const payload = {
        name: fd.get("user-name").trim(),
        phone: fd.get("user-phone").trim(),
        animalId: currentAnimalId,
        comment: (fd.get("user-comment") || "").trim(),
    };

    const submitBtn = refs.form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    showLoader();

    try {
        const res = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        });

    if (!res.ok) {
        let message = "Сталася помилка. Спробуйте ще раз.";
        try {
            const errData = await res.json();
            message = errData.message || message;
        } catch (_) {}
        throw new Error(message);
    }

    await Swal.fire({
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
    } finally {
        hideLoader();
        if (submitBtn) submitBtn.disabled = false;
    }
}

export { openModal, closeModal };



