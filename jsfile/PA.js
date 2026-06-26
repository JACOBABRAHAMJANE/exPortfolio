// ============================================================
// PA.js – Portfolio Dashboard (Visual Card Layout)
// Displays portfolio sections as clean, interactive cards
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    // ---- Find the content container ----
    const contentArea = document.getElementById('dashboardContent') || document.getElementById('chat_output');
    if (!contentArea) {
        console.error('❌ Dashboard content container not found!');
        return;
    }

    // ---- Helper: build a pdf-trigger link ----
    function escapeAttr(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function pdfTrigger(path, label, category, type) {
        type = type || 'pdf';
        return '<a href="javascript:void(0)" class="pdf-trigger view-btn" ' +
            'data-path="' + escapeAttr(path) + '" ' +
            'data-title="' + escapeAttr(label) + '" ' +
            'data-category="' + escapeAttr(category) + '" ' +
            'data-type="' + type + '">' + label + '</a>';
    }

    // ---- Helper: render a single card for a section item ----
    function renderItemCard(label, detail, viewLink, icon) {
        const card = document.createElement('div');
        card.className = 'dashboard-item-card';

        let inner = `
            <div class="item-content">
                ${icon ? `<span class="item-icon">${icon}</span>` : ''}
                <span class="item-label">${label}</span>
                ${detail ? `<span class="item-detail">${detail}</span>` : ''}
            </div>
            <div class="item-actions">
                ${viewLink || ''}
            </div>
        `;
        card.innerHTML = inner;
        return card;
    }

    // ---- Helper: render a project card ----
    function renderProjectCard(title, description, viewLink) {
        const card = document.createElement('div');
        card.className = 'dashboard-project-card';

        // Extract clean title (remove emoji if present)
        let cleanTitle = title.replace(/^[^\w\s]+/, '').trim();
        // If title starts with emoji + space, remove them
        const emojiMatch = title.match(/^([\u{1F600}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F300}-\u{1F6FF}]+)\s*/u);
        if (emojiMatch) {
            cleanTitle = title.replace(emojiMatch[0], '').trim();
        }

        card.innerHTML = `
            <div class="project-header">
                <h4 class="project-title">${cleanTitle}</h4>
            </div>
            <p class="project-description">${description || ''}</p>
            <div class="project-actions">
                ${viewLink || ''}
            </div>
        `;
        return card;
    }

    // ---- Helper: render a certificate card ----
    function renderCertCard(label, viewLink) {
        const card = document.createElement('div');
        card.className = 'dashboard-cert-card';

        // Clean label (remove emoji prefix if present)
        let cleanLabel = label;
        const emojiMatch = label.match(/^([\u{1F600}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F300}-\u{1F6FF}]+)\s*/u);
        if (emojiMatch) {
            cleanLabel = label.replace(emojiMatch[0], '').trim();
        }

        card.innerHTML = `
            <div class="cert-info">
                <span class="cert-icon"><i class="fas fa-certificate"></i></span>
                <span class="cert-name">${cleanLabel}</span>
            </div>
            <div class="cert-actions">
                ${viewLink || ''}
            </div>
        `;
        return card;
    }

    // ---- Helper: render a simple content section (introduction, education, etc.) ----
    function renderSimpleSection(title, items, icon) {
        const card = document.createElement('div');
        card.className = 'dashboard-section-card';

        let contentHTML = '';
        if (Array.isArray(items)) {
            contentHTML = items.map(item => {
                // If item is a string with HTML tags, render it as-is
                if (typeof item === 'string' && (item.includes('<a') || item.includes('<br'))) {
                    return `<div class="section-item">${item}</div>`;
                }
                // Otherwise, wrap in a paragraph
                return `<p class="section-item">${item}</p>`;
            }).join('');
        } else {
            contentHTML = `<p>${items}</p>`;
        }

        card.innerHTML = `
            <div class="section-card-header">
                ${icon ? `<span class="section-icon">${icon}</span>` : ''}
                <h3 class="section-card-title">${title}</h3>
            </div>
            <div class="section-card-body">
                ${contentHTML}
            </div>
        `;
        return card;
    }

    // ============================================================
    // SECTION DATA (preserved)
    // ============================================================
    const sectionData = {
        introduction: {
            icon: '👤',
            title: 'About Jacob',
            items: [
                "I'm Jacob Abraham Jane, a final-year B.Tech CSE (Data Science) student.",
                "🚀 I'm passionate about Machine Learning, Data Analytics, and building intelligent systems.",
                "💡 My goal is to become a Machine Learning Engineer.",
                "🎯 I'm currently at RVR & JC College of Engineering, Guntur.",
                "📊 CGPA: 7.36 | Expected Graduation: May 2026"
            ]
        },

        skills: {
            icon: '⚙️',
            title: 'Technical Skills',
            items: [
                "🐍 Python, SQL, Java, C",
                "📊 Data Analytics: Excel, Tableau, Power BI, Pandas, NumPy, Statistics, EDA",
                "🌐 Web: Flask, HTML, CSS, JavaScript",
                "🤖 Machine Learning: Random Forest, XGBoost, LightGBM, CatBoost, SMOTE, ADASYN",
                "⚙️ Tools: Git, GitHub, GCP, Figma"
            ]
        },

        projects: {
            icon: '🚀',
            title: 'Projects',
            items: [
                { title: "Employee Attrition Prediction", desc: "Random Forest, XGBoost, LightGBM, SHAP", pdf: "assests/pdfs/projects_file/9_Jacob_project_report2.pdf" },
                { title: "Target Brazil E-Commerce Analysis", desc: "SQL customer & delivery insights", pdf: "assests/pdfs/projects_file/1_Target_Case_Study.pdf" },
                { title: "Netflix Analysis", desc: "content strategy & genre trends", pdf: "assests/pdfs/projects_file/2_Netflix_Case_Study.pdf" },
                { title: "AeroFit Analysis", desc: "descriptive statistics & probability", pdf: "assests/pdfs/projects_file/3_Aerofit_-_Descriptive_Statistics_Probability.pdf" },
                { title: "Walmart Analysis", desc: "spending patterns by age & gender", pdf: "assests/pdfs/projects_file/4_Walmart_Report.pdf" },
                { title: "Yulu Case Study", desc: "demand analysis & hypothesis testing", pdf: "assests/pdfs/projects_file/5_Yulu_Case_Study_Report.pdf" },
                { title: "Delhivery Case Study", desc: "logistics feature engineering", pdf: "assests/pdfs/projects_file/6_Delhivery_Case_Study.pdf" },
                { title: "Jamboree Education Analysis", desc: "admissions regression modeling", pdf: "assests/pdfs/projects_file/7_Jamboree_Education_analyst.pdf" },
                { title: "LoanTap Logistic Regression", desc: "loan default risk modeling", pdf: "assests/pdfs/projects_file/8_LOANTAP_LOGISTIC_REGRESSION_CASE_STUDY.pdf" }
            ]
        },

        education: {
            icon: '🎓',
            title: 'Education',
            items: [
                "🎓 B.Tech in Computer Science & Engineering (Data Science)",
                "🏛️ R.V.R. & J.C. College of Engineering, Guntur",
                "📊 CGPA: 7.36 | Graduating May 2026",
                "📚 Scaler Academy – Advanced Software & Data Science Acceleration Program"
            ]
        },

        certifications: {
            icon: '📜',
            title: 'Certifications',
            items: [
                { name: "Programming in Java (NPTEL)", path: "assests/pdfs/certificates_file/nptel/Programming in Java.pdf" },
                { name: "Programming in Java — 2nd Term (NPTEL)", path: "assests/pdfs/certificates_file/nptel/Programming In_Java.pdf" },
                { name: "Joy of Computing Using Python (NPTEL)", path: "assests/pdfs/certificates_file/nptel/The Joy of Computing using Python.pdf" },
                { name: "Introduction to IoT — Elite (NPTEL)", path: "assests/pdfs/certificates_file/nptel/Introduction to Internet of Things.pdf" },
                { name: "Problem Solving Through Programming in C (NPTEL)", path: "assests/pdfs/certificates_file/nptel/Problem Solving Through Programming In C.pdf" },
                { name: "Google Android Developer", path: "assests/pdfs/certificates_file/Edu Skills/short-term/1_Google Android Developer.pdf" },
                { name: "Google Cloud Generative AI", path: "assests/pdfs/certificates_file/Edu Skills/short-term/2_Google Cloud Generative - AI.pdf" },
                { name: "Google AI & ML", path: "assests/pdfs/certificates_file/Edu Skills/short-term/3_Google AI-ML.pdf" },
                { name: "Palo Alto Cybersecurity", path: "assests/pdfs/certificates_file/Edu Skills/short-term/4_Palo Alto Cybersecurity.pdf" },
                { name: "UiPath RPA Developer", path: "assests/pdfs/certificates_file/Edu Skills/short-term/5_Uipath Rpa Developer.pdf" },
                { name: "Python Fullstack Developer", path: "assests/pdfs/certificates_file/Edu Skills/short-term/6_Python Fullstack Developer.pdf" },
                { name: "Google Cloud GenAI & AI-ML — 240hr", path: "assests/pdfs/certificates_file/Edu Skills/long-term/1_Google Cloud Generative - AI & Google AI-ML.pdf" },
                { name: "Palo Alto Cybersecurity & UiPath RPA — 240hr", path: "assests/pdfs/certificates_file/Edu Skills/long-term/2_Palo Alto Cybersecurity & Uipath Rpa Developer.pdf" },
                { name: "Python Fullstack & Ethical Hacking — 240hr", path: "assests/pdfs/certificates_file/Edu Skills/long-term/3_Python Fullstack Developer & Ethical Hacking.pdf" },
                { name: "100 Days of Code: Python Pro Bootcamp (Udemy, PDF)", path: "assests/pdfs/certificates_file/udemy/Udemey cerificate.pdf" },
                { name: "100 Days of Code: Python Pro Bootcamp (Udemy, image)", path: "assests/pdfs/certificates_file/udemy/UC-80f32016-c5ee-4d9f-b99e-6635d7362d69.jpg" },
                { name: "Cybersecurity Fundamentals (YBI Foundation)", path: "assests/pdfs/certificates_file/ybi intership/Cybersecurity Fundamentals _ Beacon.pdf" },
                { name: "Fundamentals of Cloud Security (YBI Foundation)", path: "assests/pdfs/certificates_file/ybi intership/Fundamentals of Cloud Security _ Beacon.pdf" },
                { name: "Fundamentals of SOC (YBI Foundation)", path: "assests/pdfs/certificates_file/ybi intership/Fundamentals of SOC (Security Operations Center) _ Beacon.pdf" },
                { name: "Network Security Fundamentals (YBI Foundation)", path: "assests/pdfs/certificates_file/ybi intership/Network Security Fundamentals _ Beacon.pdf" },
                { name: "Movie Recommendation Notebook (YBI Foundation)", path: "assests/pdfs/certificates_file/ybi intership/project1.ipynb - Colab.pdf" }
            ]
        },

        experience: {
            icon: '💼',
            title: 'Experience',
            items: [
                { role: "CodTech — Data Science Intern", cert: "assests/pdfs/certificates_file/codtech/codtech_internship_certificate.pdf" },
                { role: "Agnirva — Web Development Intern", cert: "assests/pdfs/certificates_file/agnirva/agnirva_intership_certificate.pdf" },
                "☁️ Google Cloud Generative AI Virtual Internship",
                "📱 Google Android Development Virtual Internship",
                "🤖 Google AI-ML Virtual Internship",
                "🔐 Palo Alto Cybersecurity Virtual Internship",
                "🤖 UiPath RPA Developer Virtual Internship",
                "🐍 Python Fullstack Developer Virtual Internship",
                "🛡️ YBI Foundation — Cybersecurity & Cloud Security Internship",
                "📊 Scaler Academy – Advanced Data Science Program"
            ]
        },

        resume: {
            icon: '📄',
            title: 'Resume',
            items: [
                `📄 <a href="assests/pdfs/resumefile/P JACOB ABRAHAM JANE_RESUME.pdf" target="_blank">View my resume</a>`,
                `📥 <a href="assests/pdfs/resumefile/P JACOB ABRAHAM JANE_RESUME.pdf" download>Download my resume</a>`,
                `🔗 LinkedIn: <a href="https://www.linkedin.com/in/pjacobjane" target="_blank">linkedin.com/in/pjacobjane</a>`,
                `🐙 GitHub: <a href="https://github.com/JACOBABRAHAMJANE" target="_blank">github.com/JACOBABRAHAMJANE</a>`
            ]
        },

        contact: {
            icon: '📬',
            title: 'Contact',
            items: [
                "📧 Email: <a href=\"mailto:pjajane02@gmail.com\">pjajane02@gmail.com</a>",
                "📱 Phone: <a href=\"tel:+918074014003\">+91 8074014003</a>",
                "🔗 LinkedIn: <a href=\"https://www.linkedin.com/in/pjacobjane\" target=\"_blank\">linkedin.com/in/pjacobjane</a>",
                "🐙 GitHub: <a href=\"https://github.com/JACOBABRAHAMJANE/PROJECTS.git\" target=\"_blank\">github.com/JACOBABRAHAMJANE</a>",
                "I'm always open to new opportunities and collaborations!"
            ]
        }
    };

    // ============================================================
    // RENDER FUNCTIONS – Visual Cards
    // ============================================================

    // ---- Render each section type ----
    function renderIntroduction(data) {
        const card = renderSimpleSection(data.title, data.items, data.icon);
        return card;
    }

    function renderSkills(data) {
        const card = renderSimpleSection(data.title, data.items, data.icon);
        return card;
    }

    function renderProjects(data) {
        const container = document.createElement('div');
        container.className = 'dashboard-projects-grid';

        data.items.forEach(project => {
            const viewLink = pdfTrigger(project.pdf, 'View Report', 'Project', 'pdf');
            const card = renderProjectCard(project.title, project.desc, viewLink);
            container.appendChild(card);
        });

        return container;
    }

    function renderEducation(data) {
        const card = renderSimpleSection(data.title, data.items, data.icon);
        return card;
    }

    function renderCertifications(data) {
        const container = document.createElement('div');
        container.className = 'dashboard-certs-grid';

        data.items.forEach(cert => {
            const viewLink = pdfTrigger(cert.path, 'View', 'Certificate', cert.path.endsWith('.jpg') ? 'image' : 'pdf');
            const card = renderCertCard(cert.name, viewLink);
            container.appendChild(card);
        });

        return container;
    }

    function renderExperience(data) {
        const container = document.createElement('div');
        container.className = 'dashboard-experience-list';

        data.items.forEach(item => {
            if (typeof item === 'string') {
                const div = document.createElement('div');
                div.className = 'experience-item';
                div.innerHTML = item;
                container.appendChild(div);
            } else if (typeof item === 'object' && item.role) {
                const div = document.createElement('div');
                div.className = 'experience-item with-cert';
                const viewLink = pdfTrigger(item.cert, 'View Certificate', 'Certificate', 'pdf');
                div.innerHTML = `
                    <span class="exp-role">${item.role}</span>
                    <span class="exp-cert-link">${viewLink}</span>
                `;
                container.appendChild(div);
            }
        });

        return container;
    }

    function renderResume(data) {
        const card = renderSimpleSection(data.title, data.items, data.icon);
        return card;
    }

    function renderContact(data) {
        const card = renderSimpleSection(data.title, data.items, data.icon);
        return card;
    }

    // ---- Main render dispatcher ----
    function renderSection(topic) {
        const data = sectionData[topic];
        if (!data) {
            contentArea.innerHTML = `<p class="empty-state">No data found for "${topic}"</p>`;
            return;
        }

        contentArea.innerHTML = '';

        let renderedContent;
        switch (topic) {
            case 'introduction':
                renderedContent = renderIntroduction(data);
                break;
            case 'skills':
                renderedContent = renderSkills(data);
                break;
            case 'projects':
                renderedContent = renderProjects(data);
                break;
            case 'education':
                renderedContent = renderEducation(data);
                break;
            case 'certifications':
                renderedContent = renderCertifications(data);
                break;
            case 'experience':
                renderedContent = renderExperience(data);
                break;
            case 'resume':
                renderedContent = renderResume(data);
                break;
            case 'contact':
                renderedContent = renderContact(data);
                break;
            default:
                renderedContent = renderSimpleSection(data.title, data.items, data.icon);
        }

        contentArea.appendChild(renderedContent);
        contentArea.scrollTop = 0;
    }

    // ============================================================
    // TOPIC BUTTON HANDLERS
    // ============================================================
    const buttons = document.querySelectorAll('.topic-btn');
    if (buttons.length === 0) {
        console.warn('⚠️ No topic buttons found — check your HTML.');
    }

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const topic = this.dataset.topic;
            renderSection(topic);
        });
    });

    // ============================================================
    // INITIAL RENDER – default to introduction
    // ============================================================
    const defaultBtn = document.querySelector('.topic-btn[data-topic="introduction"]');
    if (defaultBtn) {
        defaultBtn.classList.add('active');
        renderSection('introduction');
    } else if (buttons.length > 0) {
        buttons[0].classList.add('active');
        renderSection(buttons[0].dataset.topic);
    } else {
        renderSection('introduction');
    }

    console.log('✅ Portfolio Dashboard (visual cards) loaded!');
});