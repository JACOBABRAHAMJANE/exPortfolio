// =============================================
// Portfolio.js
// Renders Projects and Certifications, with "View"
// links opening pdfViewer.html in a new tab.
// =============================================

document.addEventListener("DOMContentLoaded", function () {

    // Helper: build a link that opens pdfViewer.html in a new tab
    function createViewLink(path, title, category, type) {
        const a = document.createElement("a");
        a.href = `pdfViewer.html?path=${encodeURIComponent(path)}&title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}&type=${type || 'pdf'}`;
        a.target = "_blank";
        a.textContent = "View";
        a.className = "view-btn";
        return a;
    }

    // ---------------------------------------------
    // PROJECTS
    // ---------------------------------------------
    const projectItems = [
        {
            title: "Employee Attrition Prediction",
            description: "ML project predicting employee turnover using Random Forest, XGBoost, and LightGBM with SHAP explainable AI.",
            pdf: "assests/pdfs/projects_file/9_Jacob_project_report2.pdf"
        },
        {
            title: "Target Brazil E-Commerce Analysis",
            description: "SQL-driven analysis of Target's Brazilian e-commerce data covering customer behavior, order patterns, and delivery insights.",
            pdf: "assests/pdfs/projects_file/1_Target_Case_Study.pdf"
        },
        {
            title: "Netflix Analysis",
            description: "Netflix content catalog analysis exploring genre trends, country-wise distribution, and content strategy recommendations.",
            pdf: "assests/pdfs/projects_file/2_Netflix_Case_Study.pdf"
        },
        {
            title: "AeroFit Analysis",
            description: "Descriptive statistics and probability analysis profiling AeroFit treadmill customers by product, demographics, and usage.",
            pdf: "assests/pdfs/projects_file/3_Aerofit_-_Descriptive_Statistics_Probability.pdf"
        },
        {
            title: "Walmart Analysis",
            description: "Statistical analysis of Walmart purchase data identifying gender and age-group spending patterns with confidence intervals.",
            pdf: "assests/pdfs/projects_file/4_Walmart_Report.pdf"
        },
        {
            title: "Yulu Case Study",
            description: "Hypothesis testing and demand analysis for Yulu electric cycles, with business recommendations to boost rentals.",
            pdf: "assests/pdfs/projects_file/5_Yulu_Case_Study_Report.pdf"
        },
        {
            title: "Delhivery Case Study",
            description: "Feature engineering and data processing on Delhivery logistics data to support delivery-time optimization.",
            pdf: "assests/pdfs/projects_file/6_Delhivery_Case_Study.pdf"
        },
        {
            title: "Jamboree Education Analysis",
            description: "Linear regression modeling on graduate admissions data to predict chances of admission to Ivy League programs.",
            pdf: "assests/pdfs/projects_file/7_Jamboree_Education_analyst.pdf"
        },
        {
            title: "LoanTap Logistic Regression",
            description: "Logistic regression model for loan default prediction, including EDA, feature engineering, and ROC-AUC evaluation.",
            pdf: "assests/pdfs/projects_file/8_LOANTAP_LOGISTIC_REGRESSION_CASE_STUDY.pdf"
        }
    ];

    // ============================================================
    // CERTIFICATIONS – Grouped by Category with Dropdown
    // ============================================================

    const certificateItems = [
        // --- NPTEL ---
        { label: "Programming in Java", path: "assests/pdfs/certificates_file/nptel/Programming in Java.pdf", type: "pdf", category: "NPTEL" },
        { label: "Programming in Java — 2nd Term", path: "assests/pdfs/certificates_file/nptel/Programming In_Java.pdf", type: "pdf", category: "NPTEL" },
        { label: "Joy of Computing Using Python", path: "assests/pdfs/certificates_file/nptel/The Joy of Computing using Python.pdf", type: "pdf", category: "NPTEL" },
        { label: "Introduction to Internet of Things — Elite", path: "assests/pdfs/certificates_file/nptel/Introduction to Internet of Things.pdf", type: "pdf", category: "NPTEL" },
        { label: "Problem Solving Through Programming in C", path: "assests/pdfs/certificates_file/nptel/Problem Solving Through Programming In C.pdf", type: "pdf", category: "NPTEL" },

        // --- Edu Skills – Short Term ---
        { label: "Google Android Developer", path: "assests/pdfs/certificates_file/Edu Skills/short-term/1_Google Android Developer.pdf", type: "pdf", category: "Edu Skills – Short Term" },
        { label: "Google Cloud Generative AI", path: "assests/pdfs/certificates_file/Edu Skills/short-term/2_Google Cloud Generative - AI.pdf", type: "pdf", category: "Edu Skills – Short Term" },
        { label: "Google AI & ML", path: "assests/pdfs/certificates_file/Edu Skills/short-term/3_Google AI-ML.pdf", type: "pdf", category: "Edu Skills – Short Term" },
        { label: "Palo Alto Cybersecurity", path: "assests/pdfs/certificates_file/Edu Skills/short-term/4_Palo Alto Cybersecurity.pdf", type: "pdf", category: "Edu Skills – Short Term" },
        { label: "UiPath RPA Developer", path: "assests/pdfs/certificates_file/Edu Skills/short-term/5_Uipath Rpa Developer.pdf", type: "pdf", category: "Edu Skills – Short Term" },
        { label: "Python Fullstack Developer", path: "assests/pdfs/certificates_file/Edu Skills/short-term/6_Python Fullstack Developer.pdf", type: "pdf", category: "Edu Skills – Short Term" },

        // --- Edu Skills – Long Term ---
        { label: "Google Cloud GenAI & AI-ML — 240hr", path: "assests/pdfs/certificates_file/Edu Skills/long-term/1_Google Cloud Generative - AI & Google AI-ML.pdf", type: "pdf", category: "Edu Skills – Long Term" },
        { label: "Palo Alto Cybersecurity & UiPath RPA — 240hr", path: "assests/pdfs/certificates_file/Edu Skills/long-term/2_Palo Alto Cybersecurity & Uipath Rpa Developer.pdf", type: "pdf", category: "Edu Skills – Long Term" },
        { label: "Python Fullstack & Ethical Hacking — 240hr", path: "assests/pdfs/certificates_file/Edu Skills/long-term/3_Python Fullstack Developer & Ethical Hacking.pdf", type: "pdf", category: "Edu Skills – Long Term" },

        // --- Edu Skills – Virtual Internship Certificates (folder "certificate") ---
        { label: "Google Android Developer Virtual Internship", path: "assests/pdfs/certificates_file/Edu Skills/certificate/1_Google Android Developer Virtual Internship.pdf", type: "pdf", category: "Edu Skills – Virtual Internship" },
        { label: "AI-ML Virtual Internship", path: "assests/pdfs/certificates_file/Edu Skills/certificate/2_AI-ML Virtual Internship.pdf", type: "pdf", category: "Edu Skills – Virtual Internship" },
        { label: "Google Cloud Generative AI Virtual Internship", path: "assests/pdfs/certificates_file/Edu Skills/certificate/3_Google Cloud Generative - AI Virtual Internship.pdf", type: "pdf", category: "Edu Skills – Virtual Internship" },
        { label: "AI-ML Virtual Internship (Oct-Dec)", path: "assests/pdfs/certificates_file/Edu Skills/certificate/4_AI-ML Virtual_Internship.pdf", type: "pdf", category: "Edu Skills – Virtual Internship" },
        { label: "Cybersecurity Virtual Internship", path: "assests/pdfs/certificates_file/Edu Skills/certificate/5_Cybersecurity Virtual Internship.pdf", type: "pdf", category: "Edu Skills – Virtual Internship" },
        { label: "RPA Developer Virtual Internship", path: "assests/pdfs/certificates_file/Edu Skills/certificate/6_RPA Developer Virtual Internship.pdf", type: "pdf", category: "Edu Skills – Virtual Internship" },
        { label: "Python Fullstack Developer Virtual Internship", path: "assests/pdfs/certificates_file/Edu Skills/certificate/7_Python Fullstack Developer Virtual Internship.pdf", type: "pdf", category: "Edu Skills – Virtual Internship" },

        // --- Udemy ---
        { label: "100 Days of Code: Python Pro Bootcamp (PDF)", path: "assests/pdfs/certificates_file/udemy/Udemey cerificate.pdf", type: "pdf", category: "Udemy" },
        { label: "100 Days of Code: Python Pro Bootcamp (Image)", path: "assests/pdfs/certificates_file/udemy/UC-80f32016-c5ee-4d9f-b99e-6635d7362d69.jpg", type: "image", category: "Udemy" },

        // --- YBI Foundation ---
        { label: "Cybersecurity Fundamentals", path: "assests/pdfs/certificates_file/ybi intership/Cybersecurity Fundamentals _ Beacon.pdf", type: "pdf", category: "YBI Foundation" },
        { label: "Fundamentals of Cloud Security", path: "assests/pdfs/certificates_file/ybi intership/Fundamentals of Cloud Security _ Beacon.pdf", type: "pdf", category: "YBI Foundation" },
        { label: "Fundamentals of SOC", path: "assests/pdfs/certificates_file/ybi intership/Fundamentals of SOC (Security Operations Center) _ Beacon.pdf", type: "pdf", category: "YBI Foundation" },
        { label: "Network Security Fundamentals", path: "assests/pdfs/certificates_file/ybi intership/Network Security Fundamentals _ Beacon.pdf", type: "pdf", category: "YBI Foundation" },
        { label: "Movie Recommendation Notebook", path: "assests/pdfs/certificates_file/ybi intership/project1.ipynb - Colab.pdf", type: "pdf", category: "YBI Foundation" },

        // --- Agnirva ---
        { label: "Agnirva Web Development Internship", path: "assests/pdfs/certificates_file/agnirva/agnirva_intership_certificate.pdf", type: "pdf", category: "Agnirva" },

        // --- CodTech ---
        { label: "CodTech Data Science Internship", path: "assests/pdfs/certificates_file/codtech/codtech_internship_certificate.pdf", type: "pdf", category: "CodTech" }
    ];

    // ---------------------------------------------
    // RENDER: Projects
    // ---------------------------------------------
    const projectsContainer = document.getElementById("projectsList");
    if (projectsContainer) {
        projectItems.forEach(function (project) {
            const section = document.createElement("section");
            section.className = "project";

            const h3 = document.createElement("h3");
            h3.textContent = project.title;
            section.appendChild(h3);

            const p = document.createElement("p");
            p.textContent = project.description;
            section.appendChild(p);

            if (project.pdf) {
                const card = document.createElement("div");
                card.className = "certificate_card";

                const span = document.createElement("span");
                span.textContent = "📄 " + project.title + " — Report";
                card.appendChild(span);

                card.appendChild(createViewLink(project.pdf, project.title, "Project", "pdf"));
                section.appendChild(card);
            }

            projectsContainer.appendChild(section);
        });
    }

    // ---------------------------------------------
    // RENDER: Certificates with Dropdown Filter
    // ---------------------------------------------
    const certificatesContainer = document.getElementById("certificatesList");
    const filterDropdown = document.getElementById("certCategory");

    if (certificatesContainer && filterDropdown) {
        // Clear any existing options first (prevents duplication on reload)
        filterDropdown.innerHTML = '';

        // Get unique categories (excluding any empty or undefined values)
        const uniqueCategories = [...new Set(certificateItems.map(cert => cert.category).filter(Boolean))];

        // Add "All Certifications" as the first option
        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.textContent = "All Certifications";
        filterDropdown.appendChild(allOption);

        // Add each unique category
        uniqueCategories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            filterDropdown.appendChild(option);
        });

        // Render function
        function renderCertificates(category) {
            certificatesContainer.innerHTML = "";
            const filtered = category === "all"
                ? certificateItems
                : certificateItems.filter(cert => cert.category === category);

            filtered.forEach(cert => {
                const li = document.createElement("li");
                const card = document.createElement("div");
                card.className = "certificate_card";

                const span = document.createElement("span");
                span.textContent = cert.label;
                card.appendChild(span);

                card.appendChild(createViewLink(cert.path, cert.label, "Certificate", cert.type));
                li.appendChild(card);
                certificatesContainer.appendChild(li);
            });
        }

        // Initial render (all)
        renderCertificates("all");

        // Event listener for dropdown change
        filterDropdown.addEventListener("change", function () {
            renderCertificates(this.value);
        });
    }
});
