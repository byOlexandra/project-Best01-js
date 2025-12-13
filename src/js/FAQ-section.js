import Accordion from "accordion-js";
import "accordion-js/dist/accordion.min.css";

export function initAccordion() {
    document.addEventListener("DOMContentLoaded", () => {
        new Accordion(".accordion-container", {
        duration: 300,
        showMultiple: false
        });
    });
}