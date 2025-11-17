let lastData = [];

document.getElementById("btn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, "SCRAPE_QUIZLET", (res) => {
        if (chrome.runtime.lastError) {
            document.getElementById("output").textContent = "Lỗi: " + chrome.runtime.lastError.message + "\nVui lòng tải lại trang Quizlet và thử lại.";
            return;
        }
        if (!res || res.length === 0) {
            document.getElementById("output").textContent = "Không lấy được dữ liệu. Hãy chắc chắn bạn đang ở trang học phần Quizlet.";
            return;
        }

        lastData = res;
        document.getElementById("output").textContent = JSON.stringify(res, null, 2);
    });
});

document.getElementById("copyImport").addEventListener("click", () => {
    if (!lastData || lastData.length === 0) {
        alert("Chưa có dữ liệu. Hãy bấm 'Lấy dữ liệu' trước.");
        return;
    }

    const TERM_DEF_SEPARATOR = "@@@"; // Phân cách Term và Definition
    const CARD_SEPARATOR = "###";     // Phân cách các Card

    let importString = "";

    lastData.forEach(row => {
        const term = row.term;
        const def = row.definition;
        importString += `${term}${TERM_DEF_SEPARATOR}${def}${CARD_SEPARATOR}\n`;
    });

    // Sử dụng Clipboard API để copy
    navigator.clipboard.writeText(importString).then(() => {
        alert(
            `Đã sao chép vào clipboard!

Bây giờ hãy vào Quizlet và làm theo các bước sau:
1. Vào trang "Tạo học phần" (Create set).
2. Bấm nút "Nhập" (Import).
3. Dán (Paste) nội dung vừa copy vào ô văn bản.
4. Ở mục "Giữa thuật ngữ và định nghĩa", chọn "Tùy chỉnh" (Custom) và nhập: @@@
5. Ở mục "Giữa các thẻ", chọn "Tùy chỉnh" (Custom) và nhập: ###
6. Bấm "Nhập".`
        );
    }).catch(err => {
        alert("Lỗi khi sao chép: " + err);
        console.error("Không thể copy: ", err);
    });
});


document.getElementById("exportImportable").addEventListener("click", () => {
    if (!lastData || lastData.length === 0) {
        alert("Chưa có dữ liệu. Hãy bấm 'Lấy dữ liệu' trước.");
        return;
    }

    const TERM_DEF_SEPARATOR = "@@@";
    const CARD_SEPARATOR = "###";

    let importString = "";

    lastData.forEach(row => {
        const term = row.term;
        const def = row.definition;
        importString += `${term}${TERM_DEF_SEPARATOR}${def}${CARD_SEPARATOR}\n`;
    });

    const blob = new Blob([importString], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quizlet_import.txt";
    a.click();

    URL.revokeObjectURL(url);
});


document.getElementById("exportXlsx").addEventListener("click", () => {
    if (!lastData || lastData.length === 0) {
        alert("Chưa có dữ liệu. Hãy bấm 'Lấy dữ liệu' trước.");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(lastData, { skipHeader: true });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quizlet");

    // Xuất file
    XLSX.writeFile(workbook, "quizlet_terms.xlsx");
});