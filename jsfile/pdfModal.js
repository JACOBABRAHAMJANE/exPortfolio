/* pdfModal.js
   In-page PDF/Image/CSV preview — opens as an overlay on top of the
   current page. No navigation to pdfViewer.html, no new tab, no reload.

   Usage: give any link/button class="pdf-trigger" plus these data
   attributes, and clicking it opens the modal automatically (handled
   by the single delegated listener at the bottom of this file):

     <a href="javascript:void(0)" class="pdf-trigger"
        data-path="assests/pdfs/projects_file/1_Target_Case_Study.pdf"
        data-title="Target Brazil E-Commerce Analysis"
        data-category="Project"
        data-type="pdf">View</a>

   data-type accepts "pdf" (default), "image" (jpg/png certs), or "csv".

   pdfViewer.html/.js are untouched and still work standalone (useful
   as a direct shareable link), but are no longer what "View" buttons
   open by default.
*/
(function () {
    let modalEl = null;
    let pdfDoc = null;
    let currentScale = 1.0;
    let pdfjsLoaded = false;
    let papaLoaded = false;

    function ensureModal() {
        if (modalEl) return modalEl;

        modalEl = document.createElement('div');
        modalEl.id = 'pdfModalOverlay';
        modalEl.className = 'pdf_modal_overlay';
        modalEl.innerHTML =
            '<div class="pdf_modal_box" role="dialog" aria-modal="true">' +
                '<div class="pdf_modal_header">' +
                    '<span class="pdf_modal_badge" id="pdfModalBadge">File</span>' +
                    '<span class="pdf_modal_title" id="pdfModalTitle">Document</span>' +
                    '<div class="pdf_modal_actions">' +
                        '<button type="button" id="pdfModalZoomOut" class="pdf_modal_btn">\u2212</button>' +
                        '<span id="pdfModalZoomLevel" class="pdf_modal_zoom">100%</span>' +
                        '<button type="button" id="pdfModalZoomIn" class="pdf_modal_btn">+</button>' +
                        '<a id="pdfModalDownload" class="pdf_modal_btn pdf_modal_download" download> \u2B07 Download</a>' +
                        '<button type="button" id="pdfModalClose" class="pdf_modal_btn pdf_modal_close" aria-label="Close">\u2715</button>' +
                    '</div>' +
                '</div>' +
                '<div class="pdf_modal_body" id="pdfModalBody">' +
                    '<p class="pdf_modal_loading">Loading preview\u2026</p>' +
                '</div>' +
            '</div>';
        document.body.appendChild(modalEl);

        modalEl.addEventListener('click', function (e) {
            if (e.target === modalEl) closeModal();
        });
        document.getElementById('pdfModalClose').addEventListener('click', closeModal);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modalEl.classList.contains('open')) closeModal();
        });
        document.getElementById('pdfModalZoomIn').addEventListener('click', function () {
            currentScale = Math.min(currentScale + 0.2, 3.0);
            rerenderPdf();
        });
        document.getElementById('pdfModalZoomOut').addEventListener('click', function () {
            currentScale = Math.max(currentScale - 0.2, 0.4);
            rerenderPdf();
        });

        return modalEl;
    }

    function closeModal() {
        if (!modalEl) return;
        modalEl.classList.remove('open');
        document.body.style.overflow = '';
        pdfDoc = null;
    }

    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    function setZoomControlsVisible(visible) {
        document.getElementById('pdfModalZoomOut').style.display = visible ? '' : 'none';
        document.getElementById('pdfModalZoomIn').style.display = visible ? '' : 'none';
        document.getElementById('pdfModalZoomLevel').style.display = visible ? '' : 'none';
    }

    function fallbackMessage(path, text) {
        const body = document.getElementById('pdfModalBody');
        body.innerHTML = '<p class="pdf_modal_loading">' + text +
            ' <a href="' + path + '" target="_blank" rel="noopener">Open in a new tab</a> instead.</p>';
    }

    // =================================================
    // PDF
    // =================================================
    async function renderPdf(path) {
        const body = document.getElementById('pdfModalBody');
        body.innerHTML = '<p class="pdf_modal_loading">Loading preview\u2026</p>';
        setZoomControlsVisible(true);

        if (!pdfjsLoaded) {
            try {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
                pdfjsLib.GlobalWorkerOptions.workerSrc =
                    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                pdfjsLoaded = true;
            } catch (e) {
                fallbackMessage(path, "Couldn't load the PDF preview.");
                return;
            }
        }

        try {
            const task = pdfjsLib.getDocument(path);
            pdfDoc = await task.promise;
            currentScale = 1.0;
            document.getElementById('pdfModalZoomLevel').textContent = '100%';
            body.innerHTML = '';

            for (let i = 1; i <= pdfDoc.numPages; i++) {
                const page = await pdfDoc.getPage(i);
                const viewport = page.getViewport({ scale: currentScale });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                body.appendChild(canvas);
                await page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport }).promise;
            }
        } catch (e) {
            console.error('PDF.js failed to render:', e);
            pdfDoc = null;
            fallbackMessage(path, "This PDF couldn't be previewed inline.");
        }
    }

    async function rerenderPdf() {
        if (!pdfDoc) return;
        document.getElementById('pdfModalZoomLevel').textContent = Math.round(currentScale * 100) + '%';
        const body = document.getElementById('pdfModalBody');
        body.innerHTML = '';
        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: currentScale });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            body.appendChild(canvas);
            await page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport }).promise;
        }
    }

    // =================================================
    // IMAGE (e.g. the Udemy .jpg certificate)
    // =================================================
    function renderImage(path) {
        setZoomControlsVisible(false);
        const body = document.getElementById('pdfModalBody');
        body.innerHTML = '';
        const img = document.createElement('img');
        img.src = path;
        img.alt = 'Certificate image';
        img.className = 'pdf_modal_image';
        img.onerror = function () {
            fallbackMessage(path, "This image couldn't be previewed inline.");
        };
        body.appendChild(img);
    }

    // =================================================
    // CSV
    // =================================================
    async function renderCsv(path) {
        setZoomControlsVisible(false);
        const body = document.getElementById('pdfModalBody');
        body.innerHTML = '<p class="pdf_modal_loading">Loading dataset\u2026</p>';

        if (!papaLoaded) {
            try {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js');
                papaLoaded = true;
            } catch (e) {
                fallbackMessage(path, "Couldn't load the dataset preview.");
                return;
            }
        }

        Papa.parse(path, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                if (!results.data || results.data.length === 0 || !results.meta.fields) {
                    body.innerHTML = '<p class="pdf_modal_loading">This dataset couldn\'t be previewed inline.</p>';
                    return;
                }
                const table = document.createElement('table');
                table.className = 'pdf_modal_csv_table';

                const thead = document.createElement('thead');
                const headRow = document.createElement('tr');
                results.meta.fields.forEach(function (f) {
                    const th = document.createElement('th');
                    th.textContent = f;
                    headRow.appendChild(th);
                });
                thead.appendChild(headRow);
                table.appendChild(thead);

                const tbody = document.createElement('tbody');
                results.data.forEach(function (row) {
                    const tr = document.createElement('tr');
                    results.meta.fields.forEach(function (f) {
                        const td = document.createElement('td');
                        td.textContent = row[f] != null ? row[f] : '';
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
                table.appendChild(tbody);

                body.innerHTML = '';
                body.appendChild(table);
            },
            error: function () {
                body.innerHTML = '<p class="pdf_modal_loading">This dataset couldn\'t be previewed inline.</p>';
            }
        });
    }

    // =================================================
    // PUBLIC API
    // =================================================
    window.openPdfViewer = function (path, title, category, type) {
        type = (type || 'pdf').toLowerCase();
        ensureModal();

        const badge = document.getElementById('pdfModalBadge');
        badge.textContent = category || 'File';
        badge.className = 'pdf_modal_badge pdf_modal_badge_' + (category || 'file').toLowerCase();
        document.getElementById('pdfModalTitle').textContent = title || 'Document';
        document.getElementById('pdfModalDownload').href = path;

        modalEl.classList.add('open');
        document.body.style.overflow = 'hidden';

        if (type === 'csv') {
            renderCsv(path);
        } else if (type === 'image') {
            renderImage(path);
        } else {
            renderPdf(path);
        }
    };

    // Delegated click listener — works for any current or future
    // .pdf-trigger element on the page, no per-button wiring needed.
    document.addEventListener('click', function (e) {
        const trigger = e.target.closest('.pdf-trigger');
        if (!trigger) return;
        e.preventDefault();
        window.openPdfViewer(
            trigger.dataset.path,
            trigger.dataset.title,
            trigger.dataset.category,
            trigger.dataset.type || 'pdf'
        );
    });
})();
