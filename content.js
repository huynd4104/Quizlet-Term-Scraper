function getTextWithNewLines(element) {
    if (!element) return "";
    return element.innerHTML
        .replace(/<br\s*\/?>(\n)?/gi, "\n") // chuyển <br> thành xuống dòng
        .replace(/\n{2,}/g, "\n") // gộp nhiều dòng trống
        .trim();
}

function scrapeQuizlet() {
    const results = [];

    const items = document.querySelectorAll(".SetPageTermsList-term");

    items.forEach(item => {
        const sides = item.querySelectorAll('[data-testid="set-page-term-card-side"]');
        if (sides.length < 2) return;

        const termEl = sides[0].querySelector('.TermText');
        const defEl = sides[1].querySelector('.TermText');

        const term = getTextWithNewLines(termEl);
        const definition = getTextWithNewLines(defEl);

        if (term && definition) {
            results.push({ term, definition });
        }
    });

    return results;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg === "SCRAPE_QUIZLET") {
        sendResponse(scrapeQuizlet());
    }
    return true;
});