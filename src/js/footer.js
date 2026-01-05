export default function updateCopyrightYear() {
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
}