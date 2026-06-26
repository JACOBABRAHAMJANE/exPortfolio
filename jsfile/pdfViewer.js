/* pdfViewer.js
   Standalone full-page PDF viewer.
   Reads query parameters: ?path=...&title=...&category=...&type=...
*/

document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);
    const filePath = params.get("path") || "";
    const title = params.get("title") || "Document";
    const category = params.get("category") || "File";

    const categoryBadge = document.getElementById("categoryBadge");
    const fileNameLabel = document.getElementById("fileNameLabel");
    const viewerTitleText = document.getElementById("viewerTitleText");
    const viewerSubtitleText = document.getElementById("viewerSubtitleText");
    const downloadBtn = document.getElementById("downloadBtn");

    if (categoryBadge) {
        categoryBadge.textContent = category;
        categoryBadge.className = "category_badge category_" + category.toLowerCase();
    }

    // ---- Display the title (not the filename) in the path bar ----
    if (fileNameLabel) {
        fileNameLabel.textContent = title;          // Show the descriptive title
        fileNameLabel.title = title;                // Tooltip
    }

    if (viewerTitleText) {
        viewerTitleText.textContent = title;
    }
    if (viewerSubtitleText) {
        viewerSubtitleText.textContent = "Previewing PDF · " + category;
    }
    if (downloadBtn) {
        downloadBtn.href = filePath;
        // Optionally set download filename from the actual file
        const filename = filePath.split("/").pop() || "document.pdf";
        downloadBtn.download = filename;
    }
    document.title = title + " | Viewer";

    // --- Back Button: go back or close tab / fallback ---
    const backBtn = document.getElementById("backBtn");
    backBtn.addEventListener("click", function () {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.close();
            setTimeout(function () {
                window.location.href = "Portfolio.html";
            }, 100);
        }
    });

    if (!filePath) {
        if (viewerTitleText) viewerTitleText.textContent = "No document specified";
        if (viewerSubtitleText) viewerSubtitleText.textContent = "Missing ?path= in the URL";
        return;
    }

    const pdfContainer = document.getElementById("pdfCanvasContainer");
    const loadingEl = document.getElementById("viewerLoading");
    const fallbackEl = document.getElementById("viewerFallback");
    const openNewTabPdf = document.getElementById("openNewTabPdf");
    const zoomInBtn = document.getElementById("zoomIn");
    const zoomOutBtn = document.getElementById("zoomOut");
    const zoomLevelEl = document.getElementById("zoomLevel");
    const pageCountEl = document.getElementById("pageCount");

    if (openNewTabPdf) openNewTabPdf.href = filePath;

    function showFallback() {
        if (loadingEl) loadingEl.hidden = true;
        fallbackEl.hidden = false;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = function () {
        if (typeof pdfjsLib === "undefined") {
            showFallback();
            return;
        }

        pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        let currentScale = 1.0;
        let pdfDoc = null;
        const canvases = [];

        function setZoomLabel() {
            zoomLevelEl.textContent = Math.round(currentScale * 100) + "%";
        }

        async function renderPage(pageNum) {
            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: currentScale });

            let entry = canvases[pageNum - 1];
            if (!entry) {
                const canvas = document.createElement("canvas");
                pdfContainer.appendChild(canvas);
                entry = { canvas: canvas, ctx: canvas.getContext("2d") };
                canvases[pageNum - 1] = entry;
            }

            entry.canvas.width = viewport.width;
            entry.canvas.height = viewport.height;

            await page.render({ canvasContext: entry.ctx, viewport: viewport }).promise;
        }

        async function renderAllPages() {
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                await renderPage(i);
            }
        }

        async function loadPdf() {
            try {
                const loadingTask = pdfjsLib.getDocument(filePath);
                pdfDoc = await loadingTask.promise;

                if (loadingEl) loadingEl.hidden = true;
                pageCountEl.textContent =
                    pdfDoc.numPages + (pdfDoc.numPages === 1 ? " page" : " pages");
                setZoomLabel();

                await renderAllPages();
            } catch (err) {
                console.error("PDF.js failed to render the document:", err);
                showFallback();
            }
        }

        async function rerenderAtCurrentScale() {
            for (let i = 1; i <= pdfDoc.numPages; i++) {
                await renderPage(i);
            }
            setZoomLabel();
        }

        zoomInBtn.addEventListener("click", function () {
            if (!pdfDoc) return;
            currentScale = Math.min(currentScale + 0.2, 3.0);
            rerenderAtCurrentScale();
        });

        zoomOutBtn.addEventListener("click", function () {
            if (!pdfDoc) return;
            currentScale = Math.max(currentScale - 0.2, 0.4);
            rerenderAtCurrentScale();
        });

        loadPdf();
    };
    script.onerror = showFallback;
    document.head.appendChild(script);
});