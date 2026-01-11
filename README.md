# 🐹 Quizlet Term Scraper

**Quizlet Term Scraper** is a Chrome Extension that helps you **extract the entire list of terms and definitions** from any set on Quizlet. This tool supports exporting data to Excel or special text formats so you can quickly create new sets (Import).

## ✨ Main Features

* **🔍 Automatic Data Extraction:** Scans and extracts all terms and definitions currently displayed on the Quizlet page.

* **📋 Copy to Import:** Copies data to the clipboard in a custom format, ready to be pasted into Quizlet's "Import" feature.

* **📄 Export Import File (.txt):** Downloads a text file containing the formatted data.

* **📊 Export to Excel (.xlsx):** Export data to an Excel file for easy storage and editing.

* **Smart Text Processing:** Automatically retain line breaks in terms/definitions (convert the `<br>` tag to `\n`).

## 🛠 Installation (Load Unpacked)

Since this is a development extension, you need to manually install it in your browser:

1. Download or clone this repository.

2. Open your browser (Chrome, Edge, Cốc Cốc, etc.) and go to: `chrome://extensions/`

3. Enable **Developer mode** in the upper right corner.

4. Click the **Load unpacked** button.

5. Select the folder containing the project source code (where the `manifest.json` file is located).

## 📖 User Guide

### 1. Retrieving Data
1. Access the Quizlet course page you want to retrieve data from (Example: `https://quizlet.com/vn/123456/course-name/`).

2. Click the Extension icon on the browser toolbar.

3. Click the **"🔍 Get Course Data"** button.

4. The results (JSON) will appear in the frame below for you to check.

### 2. Copying to Create a New Course (Import)
1. After successfully retrieving the data, click the **"📋 Copy to Import"** button.

2. Go to Quizlet, select **Create New Course** (or Edit Course).

3. Click the **Import** button (Import from Word, Excel, Google Docs...).

4. Paste (Ctrl+V) the copied content into the text box.

5. In the **Import Settings** section, set the delimiters as follows (the Extension has automatically formatted according to this rule):

* **Between terms and definitions:** Custom input is `@@@`

* **Between tags:** Custom input is `###`

### 3. Export to Excel
1. After successfully retrieving the data, click the **"📊 Export Excel (.xlsx)"** button.

2. The `quizlet_terms.xlsx` file will be downloaded to your computer.

## 📂 Project Structure

* `manifest.json`: The main configuration file of the Extension (Manifest V3).

* `popup.html`: The user interface of the Extension.

* `popup.js`: Logic for handling buttons, exporting files, and communicating with the Content Script.

* `content.js`: A script that runs in the background on the Quizlet page to scan (scrape) HTML data.

* `xlsx.full.min.js`: A library that supports exporting to Excel.

## ⚙️ Technical Requirements
* Browsers that support Chromium (Chrome, Edge, Brave...).

* Manifest Version: 3.

* Permissions:

* `activeTab`: To access the currently open Quizlet tab.

* `scripting`: To execute the script to retrieve data.

* `clipboardWrite`: To copy data to the clipboard.

## 🤝 Contributions
This project was developed by **HuyND**. All contributions are welcome!
