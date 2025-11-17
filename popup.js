let lastData = [];

document.getElementById("btn").addEventListener("click", async () => {
    const outputEl = document.getElementById("output");
    outputEl.textContent = "Đang lấy dữ liệu...";
    outputEl.classList.remove("success", "error"); // Reset trạng thái

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, "SCRAPE_QUIZLET", (res) => {
        if (chrome.runtime.lastError) {
            outputEl.textContent = "Lỗi: " + chrome.runtime.lastError.message + "\nVui lòng tải lại trang Quizlet và thử lại.";
            outputEl.classList.add("error");
            return;
        }
        if (!res || res.length === 0) {
            outputEl.textContent = "Không lấy được dữ liệu. Hãy chắc chắn bạn đang ở trang học phần Quizlet.";
            outputEl.classList.add("error");
            return;
        }

        lastData = res;
        outputEl.textContent = JSON.stringify(res, null, 2);
    });
});

document.getElementById("copyImport").addEventListener("click", () => {
    const outputEl = document.getElementById("output");
    outputEl.classList.remove("success", "error");

    if (!lastData || lastData.length === 0) {
        outputEl.textContent = "Chưa có dữ liệu. Hãy bấm 'Lấy dữ liệu' trước.";
        outputEl.classList.add("error");
        return;
    }

    const TERM_DEF_SEPARATOR = "@@@";
    const CARD_SEPARATOR = "###";
    let importString = "";

    lastData.forEach(row => {
        const term = row.term;
        const def = row.definition;
        importString += `${term}\n${TERM_DEF_SEPARATOR}${def}${CARD_SEPARATOR}\n`;
    });

    navigator.clipboard.writeText(importString).then(() => {
        outputEl.textContent =
            `Đã sao chép vào clipboard!\n
1. Vào Quizlet, chọn "Tạo học phần" 
2. Chọn "Nhập" 
3. Paste nội dung vừa copy.
4. Ở mục "Giữa thuật ngữ và định nghĩa" 
=> Nhập tùy chỉnh: @@@
5. Ở mục "Giữa các thẻ" 
=> Nhập tùy chỉnh: ### `;
        outputEl.classList.add("success");
    }).catch(err => {
        outputEl.textContent = "Lỗi khi sao chép: " + err;
        outputEl.classList.add("error");
        console.error("Không thể copy: ", err);
    });
});


document.getElementById("exportImportable").addEventListener("click", () => {
    const outputEl = document.getElementById("output");
    outputEl.classList.remove("success", "error");

    if (!lastData || lastData.length === 0) {
        outputEl.textContent = "Chưa có dữ liệu. Hãy bấm 'Lấy dữ liệu' trước.";
        outputEl.classList.add("error");
        return;
    }

    const TERM_DEF_SEPARATOR = "@@@";
    const CARD_SEPARATOR = "###";
    let importString = "";

    lastData.forEach(row => {
        const term = row.term;
        const def = row.definition;
        importString += `${term}\n${TERM_DEF_SEPARATOR}${def}${CARD_SEPARATOR}\n`;
    });

    const blob = new Blob([importString], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quizlet_import.txt";
    a.click();

    URL.revokeObjectURL(url);

    outputEl.textContent = "Đã tải file 'quizlet_import.txt'.";
    outputEl.classList.add("success");
});

document.getElementById("exportXlsx").addEventListener("click", () => {
    const outputEl = document.getElementById("output");
    outputEl.classList.remove("success", "error");

    if (!lastData || lastData.length === 0) {
        outputEl.textContent = "Chưa có dữ liệu. Hãy bấm 'Lấy dữ liệu' trước.";
        outputEl.classList.add("error");
        return;
    }

    try {
        const worksheet = XLSX.utils.json_to_sheet(lastData, { skipHeader: true });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Quizlet");
        XLSX.writeFile(workbook, "quizlet_terms.xlsx");

        outputEl.textContent = "Đã tải file 'quizlet_terms.xlsx'.";
        outputEl.classList.add("success");
    } catch (err) {
        outputEl.textContent = "Lỗi khi xuất Excel: " + err;
        outputEl.classList.add("error");
    }
});
