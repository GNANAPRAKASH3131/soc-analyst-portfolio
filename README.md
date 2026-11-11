# Gnana Prakash Gajula | SOC Analyst Portfolio

A professional, recruiter-ready Security Operations Center (SOC) Analyst portfolio website built with pure semantic HTML5, CSS3, and vanilla JavaScript. Features zero dependencies, a midnight-navy SOC dashboard aesthetic, and authentic defensive cybersecurity workflows.

---

## Project Structure

```text
soc-analyst-portfolio/
├── index.html              # Main HTML document featuring all portfolio sections
├── css/
│   ├── style.css           # Core design system, variables, components & typography
│   └── responsive.css      # Responsive breakpoints (desktop, tablet, mobile)
├── js/
│   └── script.js           # Client-side mobile menu, filters, copy button, resume check & form validation
├── assets/
│   ├── images/             # General portfolio image assets
│   ├── icons/              # Security and UI icon assets
│   ├── projects/           # Screenshots and diagrams for hands-on lab case studies
│   └── resume/             # Resume PDF directory (place resume.pdf here)
└── README.md               # Project documentation & configuration guide
```

---

## Portfolio Features & Sections

1. **Accessibility & Navigation**: Skip-to-content link, responsive navbar with GP monogram logo, active Scrollspy section tracking, mobile drawer toggle, and smooth scrolling.
2. **Hero Section (`#home`)**: Professional identity summary, headline, call-to-actions, social profile badges, and a professional portrait presentation card with an active operational status badge (`Active & Ready to Deploy`) and specialization indicators.
3. **About Me (`#about`)**: B.Tech in CSE with AI Specialization, foundational systems knowledge, and operational SOC objectives.
4. **Technical Skills (`#skills`)**: 6 structured domain competency groups (SIEM Platforms, EDR & Monitoring, Networking & Protocols, Security Tools, Security Concepts & Frameworks, Systems & Scripting).
5. **Featured Projects (`#projects`)**: Interactive domain filter bar (`All`, `SIEM & Detection`, `Network Forensics`, `Vulnerability & Systems`) with 5 detailed lab cards and expandable technical details.
6. **SOC Investigation Workflow (`#investigations`)**: 7-stage connected operational pipeline (Alert Generation, Initial Triage, Log Investigation, Threat Analysis, Incident Classification, Escalation/Response, Documentation).
7. **Security Investigation Case Studies (`#case-studies`)**: 4 expandable incident reports with an "Expand/Collapse All" control bar, interactive MITRE ATT&CK tag filtering, and one-click terminal log copy buttons.
8. **Interactive Detection Query Library**: Built-in modal and search engine featuring production-grade detection queries across Splunk SPL, Sysmon, Windows Event IDs, and QRadar AQL with 1-click clipboard copying.
9. **Certifications & Training (`#certifications`)**: Highlights verified credentials from resume (Cybersecurity Essentials, Networking Basics, IT Support Essentials), specialized SOC training, and practical lab platforms.
10. **Professional Resume (`#resume`)**: Candidate overview with a direct PDF download action button (`Gnana_Prakash_Gajula_Resume.pdf`).
11. **Contact & Inquiries (`#contact`)**: Direct channels (Bengaluru location, direct email, phone/WhatsApp, CV download, LinkedIn, GitHub, TryHackMe) and an interactive contact form with active message delivery via FormSubmit, optional Web3Forms integration, live input validation, and a prefilled email client fallback.
12. **Navigation & Floating Controls**: Floating Back-to-Top button with live scrolling state and dynamic copyright year.

---

## Local Testing Instructions

You can test the portfolio locally using any of the following methods:

### Method 1: Python Built-in Server (Recommended)
Open a terminal in the project directory (`soc-analyst-portfolio/`) and run:
```bash
python -m http.server 8000
```
Open your browser and navigate to:
```text
http://localhost:8000
```

### Method 2: Node.js `npx serve`
If Node.js is installed on your workstation, run:
```bash
npx serve .
```
and open the displayed local URL (typically `http://localhost:3000`).

### Method 3: Direct File Opening
Double-click `index.html` in File Explorer or open it directly in Chrome, Firefox, Edge, or Safari:
```text
file:///path/to/soc-analyst-portfolio/index.html
```

---

## GitHub Pages Deployment Guide

Deploying this portfolio to GitHub Pages is fast because it has zero build steps:

### Step 1: Initialize Git and Commit
In your terminal, navigate to the `soc-analyst-portfolio/` folder:
```bash
cd "soc-analyst-portfolio"
git init
git add .
git commit -m "feat: complete SOC Analyst portfolio website"
```

### Step 2: Create a Repository on GitHub
1. Log into your account at [GitHub.com](https://github.com).
2. Click **New Repository**.
3. Name it (e.g. `soc-analyst-portfolio` or `<your-username>.github.io`).
4. Keep it **Public** and do not initialize with README or license.
5. Click **Create repository**.

### Step 3: Push to GitHub
Link your local repository to GitHub and push to the `main` branch:
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/soc-analyst-portfolio.git
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. On your GitHub repository page, navigate to **Settings** (gear icon).
2. On the left sidebar under *Code and automation*, click **Pages**.
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` and `/ (root)`.
4. Click **Save**.
5. Wait 1–2 minutes. GitHub will display your live portfolio URL:
   ```text
   https://<your-username>.github.io/soc-analyst-portfolio/
   ```

---

## Customization Checklist

- [x] **Resume PDF**: Configured and available for download at `assets/resume/resume.pdf`.
- [x] **Email Address**: Configured to `gnanaprakash2956@gmail.com`.
- [x] **Contact Form Delivery**: Configured with active FormSubmit delivery and mail client fallback.
- [x] **LinkedIn URL**: Linked to `https://www.linkedin.com/in/gnanaprakash-gajula/`.
- [x] **GitHub URL**: Linked to `https://github.com/GNANAPRAKASH3131`.
- [x] **Certifications**: Updated to match resume (Cybersecurity Essentials, Networking Basics, IT Support Essentials).
