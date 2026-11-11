/**
 * SOC Analyst Portfolio - Main Script
 * Author: Gnana Prakash Gajula
 */

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      navLinks.classList.toggle('open');
    });

    // Close menu when a navigation link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  // Resume Download — smooth direct download with 404 fallback
  const resumeBtn = document.getElementById('resumeDownloadBtn');

  if (resumeBtn) {
    if (window.location.protocol.startsWith('http')) {
      resumeBtn.addEventListener('click', async (e) => {
        const resumeUrl = resumeBtn.getAttribute('href');
        try {
          const response = await fetch(resumeUrl, { method: 'HEAD' });
          if (response.status === 404) {
            e.preventDefault();
            showResumeNotice();
          }
        } catch (err) {
          // Allow native download if HEAD probe is blocked by server policies
        }
      });
    }

    function showResumeNotice() {
      // Insert a temporary dismissible notice after the button
      const existing = document.getElementById('heroResumeNotice');
      if (existing) return; // already shown
      const notice = document.createElement('div');
      notice.id = 'heroResumeNotice';
      notice.style.cssText = 'margin-top:0.75rem;padding:0.65rem 1rem;background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.3);border-radius:6px;font-size:0.82rem;color:#94A3B8;line-height:1.5;';
      notice.innerHTML = '<strong style="color:#38BDF8">Resume Notice:</strong> The resume file could not be located. ' +
        'Please reach out via <a href="#contact" style="color:#38BDF8">Contact</a> or LinkedIn to request a copy. ' +
        '<button onclick="this.parentElement.remove()" style="margin-left:0.75rem;background:none;border:none;cursor:pointer;color:#94A3B8;font-size:1rem;" aria-label="Close">×</button>';
      resumeBtn.parentElement.insertAdjacentElement('afterend', notice);
    }
  }

  // Dynamically Update Copyright Year in Footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Contact Form Handling with Active Message Delivery & Graceful Fallback
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('senderName');
  const emailInput = document.getElementById('senderEmail');
  const messageInput = document.getElementById('senderMessage');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const submitBtnIcon = document.getElementById('submitBtnIcon');
  const directEmailLink = document.getElementById('directEmailLink');

  const TARGET_EMAIL = 'gnanaprakash2956@gmail.com';

  if (contactForm && nameInput && emailInput && messageInput && formFeedback) {
    function escapeHtml(string) {
      const div = document.createElement('div');
      div.innerText = string;
      return div.innerHTML;
    }

    // Clear field-level error messages as user types
    [nameInput, emailInput, messageInput].forEach(input => {
      input.addEventListener('input', () => {
        const fieldName = input.id.replace('sender', '').toLowerCase();
        const errorElem = document.getElementById(`${fieldName}Error`);
        if (errorElem) errorElem.textContent = '';
        input.removeAttribute('aria-invalid');
      });
    });

    // Update mailto fallback link prefill in real time
    function updateDirectEmailLink() {
      if (!directEmailLink) return;
      const name = nameInput.value.trim();
      const message = messageInput.value.trim();
      const subject = encodeURIComponent(name ? `SOC Inquiry from ${name}` : 'SOC Analyst Portfolio Inquiry');
      const body = encodeURIComponent(message ? `${message}\n\n--\nFrom: ${name || 'Website Visitor'}` : 'Hi Gnana,\n\n');
      directEmailLink.href = `mailto:${TARGET_EMAIL}?subject=${subject}&body=${body}`;
    }

    nameInput.addEventListener('input', updateDirectEmailLink);
    messageInput.addEventListener('input', updateDirectEmailLink);
    updateDirectEmailLink();

    function showFeedback(type, title, messageHtml) {
      formFeedback.className = `form-feedback ${type}`;
      const icon = type === 'success' ? '✓' : (type === 'error' ? '⚠️' : 'ℹ️');
      formFeedback.innerHTML = `
        <div class="feedback-card">
          <span class="feedback-icon">${icon}</span>
          <div class="feedback-text">
            <strong>${escapeHtml(title)}</strong>
            <p>${messageHtml}</p>
          </div>
          <button type="button" class="feedback-close" aria-label="Close notification">&times;</button>
        </div>
      `;
      formFeedback.style.display = 'block';

      const closeBtn = formFeedback.querySelector('.feedback-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          formFeedback.style.display = 'none';
        });
      }
    }

    function setSubmittingState(isSubmitting) {
      if (!submitBtn) return;
      submitBtn.disabled = isSubmitting;
      if (isSubmitting) {
        if (submitBtnText) submitBtnText.textContent = 'Sending...';
        if (submitBtnIcon) submitBtnIcon.innerHTML = '<span class="spinner" aria-hidden="true"></span>';
      } else {
        if (submitBtnText) submitBtnText.textContent = 'Send Message';
        if (submitBtnIcon) submitBtnIcon.textContent = '➤';
      }
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous feedback and errors
      formFeedback.style.display = 'none';
      formFeedback.className = 'form-feedback';
      if (nameError) nameError.textContent = '';
      if (emailError) emailError.textContent = '';
      if (messageError) messageError.textContent = '';

      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const messageVal = messageInput.value.trim();

      let isValid = true;
      let firstInvalidInput = null;

      // Validate Name
      if (!nameVal) {
        if (nameError) nameError.textContent = 'Please enter your name.';
        nameInput.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else if (nameVal.length < 2) {
        if (nameError) nameError.textContent = 'Name must be at least 2 characters.';
        nameInput.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        if (emailError) emailError.textContent = 'Please enter your email address.';
        emailInput.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else if (!emailPattern.test(emailVal)) {
        if (emailError) emailError.textContent = 'Please enter a valid email format (e.g. name@example.com).';
        emailInput.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      }

      // Validate Message
      if (!messageVal) {
        if (messageError) messageError.textContent = 'Please enter a message.';
        messageInput.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = messageInput;
      } else if (messageVal.length < 10) {
        if (messageError) messageError.textContent = 'Message should contain at least 10 characters.';
        messageInput.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = messageInput;
      }

      if (!isValid) {
        if (firstInvalidInput) firstInvalidInput.focus();
        return;
      }

      // Honeypot spam check
      const botCheck = contactForm.querySelector('input[name="botcheck"]');
      if (botCheck && botCheck.checked) {
        contactForm.reset();
        return;
      }

      setSubmittingState(true);

      // Determine endpoint: Check for custom Web3Forms access key, otherwise use FormSubmit.co
      const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
      const accessKey = accessKeyInput ? accessKeyInput.value.trim() : '';
      const useWeb3Forms = accessKey && accessKey !== 'YOUR_ACCESS_KEY';

      const mailtoFallbackUrl = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(`SOC Inquiry from ${nameVal}`)}&body=${encodeURIComponent(`${messageVal}\n\n--\nFrom: ${nameVal}\nEmail: ${emailVal}`)}`;

      try {
        let response;
        if (useWeb3Forms) {
          response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              access_key: accessKey,
              name: nameVal,
              email: emailVal,
              message: messageVal,
              subject: `Portfolio Contact: Message from ${nameVal}`
            })
          });
        } else {
          // FormSubmit.co provides direct inbox delivery
          response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name: nameVal,
              email: emailVal,
              message: messageVal,
              _subject: `New Message from ${nameVal} (SOC Portfolio)`,
              _template: 'table',
              _captcha: 'false'
            })
          });
        }

        const data = await response.json();

        if (response.ok && (data.success === true || data.success === 'true')) {
          showFeedback(
            'success',
            'Message Sent Successfully!',
            `Thank you, <em>${escapeHtml(nameVal)}</em>. Your message has been delivered directly to my inbox. I will review it and get back to you at <strong>${escapeHtml(emailVal)}</strong> promptly.`
          );

          if (submitBtnText) submitBtnText.textContent = 'Message Sent!';
          if (submitBtnIcon) submitBtnIcon.textContent = '✓';

          contactForm.reset();
          updateDirectEmailLink();

          setTimeout(() => {
            setSubmittingState(false);
          }, 3500);
        } else {
          throw new Error(data.message || 'Delivery service returned an error.');
        }
      } catch (err) {
        console.warn('Contact form submission error:', err);
        setSubmittingState(false);

        showFeedback(
          'error',
          'Automated Delivery Interrupted',
          `Could not send your message via the web service (${escapeHtml(err.message || 'network/adblock restriction')}).<br>` +
          `You can deliver it instantly using your email client: ` +
          `<a href="${mailtoFallbackUrl}" class="feedback-mailto-link"><strong>Click here to open email client</strong> ↗</a>`
        );
      }
    });
  }

  // 4. Project Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.classList.remove('filter-hidden');
          } else {
            card.classList.add('filter-hidden');
          }
        });
      });
    });
  }

  // 5. Copy Log Samples to Clipboard
  const copyButtons = document.querySelectorAll('.btn-copy-log');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const logContainer = btn.closest('.terminal-log-box');
      if (!logContainer) return;

      const codeElement = logContainer.querySelector('pre code');
      const textToCopy = codeElement ? codeElement.innerText : '';

      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = '<span class="copy-icon">✓</span><span class="copy-text">Copied!</span>';

        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        // Fallback for older browsers or permission block
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          const originalText = btn.innerHTML;
          btn.classList.add('copied');
          btn.innerHTML = '<span class="copy-icon">✓</span><span class="copy-text">Copied!</span>';
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = originalText;
          }, 2000);
        } catch (e) {
          console.warn('Unable to copy log sample:', e);
        }
        document.body.removeChild(textarea);
      }
    });
  });



  // 7. Scrollspy Navigation
  const sections = document.querySelectorAll('section[id]');
  const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length > 0 && navAnchorLinks.length > 0 && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navAnchorLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  // 8. Case Studies "Expand All / Collapse All" Toggle
  const btnToggleAllCases = document.getElementById('btnToggleAllCases');
  const toggleAllCasesIcon = document.getElementById('toggleAllCasesIcon');
  const toggleAllCasesText = document.getElementById('toggleAllCasesText');
  const caseDetailsList = document.querySelectorAll('.case-details');

  if (btnToggleAllCases && caseDetailsList.length > 0) {
    let allExpanded = false;
    btnToggleAllCases.addEventListener('click', () => {
      allExpanded = !allExpanded;
      caseDetailsList.forEach(detail => {
        detail.open = allExpanded;
      });
      if (toggleAllCasesIcon) toggleAllCasesIcon.textContent = allExpanded ? '📁' : '📂';
      if (toggleAllCasesText) toggleAllCasesText.textContent = allExpanded ? 'Collapse All Reports' : 'Expand All Reports';
    });
  }

  // 9. Interactive MITRE ATT&CK Tag Filter
  const mitreTags = document.querySelectorAll('.mitre-tag');
  const mitreActiveFilterBar = document.getElementById('mitreActiveFilterBar');
  const activeMitreTagLabel = document.getElementById('activeMitreTagLabel');
  const clearMitreFilterBtn = document.getElementById('clearMitreFilterBtn');
  const allCardsToFilter = document.querySelectorAll('.case-card, .project-card');

  if (mitreTags.length > 0) {
    mitreTags.forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.stopPropagation();
        const codeElem = tag.querySelector('code');
        const tagText = codeElem ? codeElem.textContent.trim() : tag.textContent.trim();
        const techniqueId = tagText.split(' ')[0].replace(/[^a-zA-Z0-9.]/g, '');

        if (!techniqueId) return;

        // Set active state on tags
        mitreTags.forEach(t => t.classList.remove('active-filter'));
        tag.classList.add('active-filter');

        // Show active filter bar
        if (mitreActiveFilterBar && activeMitreTagLabel) {
          activeMitreTagLabel.textContent = tagText;
          mitreActiveFilterBar.style.display = 'inline-flex';
        }

        // Highlight matching cards and scroll
        let firstMatch = null;
        allCardsToFilter.forEach(card => {
          const cardText = card.textContent || '';
          if (cardText.includes(techniqueId)) {
            card.classList.add('highlight-match');
            if (!firstMatch) firstMatch = card;
          } else {
            card.classList.remove('highlight-match');
          }
        });

        if (firstMatch) {
          firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    if (clearMitreFilterBtn) {
      clearMitreFilterBtn.addEventListener('click', () => {
        if (mitreActiveFilterBar) mitreActiveFilterBar.style.display = 'none';
        mitreTags.forEach(t => t.classList.remove('active-filter'));
        allCardsToFilter.forEach(card => card.classList.remove('highlight-match'));
      });
    }
  }

  // 10. Floating Back-to-Top Button
  const btnBackToTop = document.getElementById('btnBackToTop');
  if (btnBackToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        btnBackToTop.classList.add('visible');
      } else {
        btnBackToTop.classList.remove('visible');
      }
    }, { passive: true });

    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 11. Interactive Detection Query Library Modal
  const btnOpenQueryModal = document.getElementById('btnOpenQueryModal');
  const queryModalBackdrop = document.getElementById('queryModalBackdrop');
  const btnCloseQueryModal = document.getElementById('btnCloseQueryModal');
  const btnCloseQueryModalBottom = document.getElementById('btnCloseQueryModalBottom');
  const queryTabs = document.querySelectorAll('.query-tab');
  const querySearchInput = document.getElementById('querySearchInput');
  const queryModalList = document.getElementById('queryModalList');

  const DETECTION_QUERIES = [
    {
      tab: 'splunk',
      title: 'Brute-Force & Password Spraying Threshold',
      techBadge: 'Event 4625 • T1110',
      desc: 'Detects high-frequency failed logon attempts across single or distributed user accounts from internal or perimeter IP addresses.',
      query: 'index=windows EventCode=4625 | bin _time span=5m | stats count, dc(TargetUserName) as targeted_users by src_ip | where count > 10 OR targeted_users > 3'
    },
    {
      tab: 'splunk',
      title: 'Obfuscated & Encoded PowerShell Execution',
      techBadge: 'Event 4104 • T1059.001',
      desc: 'Flags base64 encoded scripts, download cradles, and execution policy bypass parameters inside PowerShell script block logs.',
      query: 'index=windows EventCode=4104 (ScriptBlockText="*-enc*" OR ScriptBlockText="*-EncodedCommand*" OR ScriptBlockText="*FromBase64String*" OR ScriptBlockText="*DownloadString*") | table _time, Computer, ScriptBlockText'
    },
    {
      tab: 'splunk',
      title: 'Privilege Escalation via Local Group Addition',
      techBadge: 'Event 4728/4732 • T1078',
      desc: 'Audits whenever a user account is granted administrative access by being added into privileged local or domain groups.',
      query: 'index=windows (EventCode=4728 OR EventCode=4732) TargetUserName="*Admin*" | table _time, SubjectUserName, TargetUserName, MemberName'
    },
    {
      tab: 'sysmon',
      title: 'Suspicious Process Spawning from %TEMP% or %APPDATA%',
      techBadge: 'Sysmon Event 1 • T1059',
      desc: 'Identifies executable processes originating from atypical user-writable directories commonly leveraged by droppers and payloads.',
      query: '<QueryList><Query Id="0" Path="Microsoft-Windows-Sysmon/Operational"><Select Path="Microsoft-Windows-Sysmon/Operational">*[System[(EventID=1)]] and *[EventData[Data[@Name="CurrentDirectory"] and (contains(.,"AppData") or contains(.,"Temp"))]]</Select></Query></QueryList>'
    },
    {
      tab: 'sysmon',
      title: 'Abnormal Network Beaconing by Unknown Binaries',
      techBadge: 'Sysmon Event 3 • T1071',
      desc: 'Detects outbound connections over non-standard ports (e.g. 4444, 5555, 8080) initiated by processes outside standard browsers.',
      query: 'index=sysmon EventCode=3 NOT (Image="*chrome.exe" OR Image="*firefox.exe" OR Image="*msedge.exe") DestinationPort IN (4444, 5555, 8080, 8443, 9001) | stats count by Image, DestinationIp, DestinationPort'
    },
    {
      tab: 'sysmon',
      title: 'Masqueraded System File Creation in User Paths',
      techBadge: 'Sysmon Event 11 • T1036.005',
      desc: 'Alerts when common Windows system file names (svchost.exe, lsass.exe, csrss.exe) are created outside C:\\Windows\\System32.',
      query: 'index=sysmon EventCode=11 TargetFilename IN ("*\\svchost.exe", "*\\lsass.exe", "*\\taskhost.exe") NOT TargetFilename="C:\\Windows\\System32\\*" | table _time, Image, TargetFilename'
    },
    {
      tab: 'eventids',
      title: 'Authentication & Account Lockout Monitoring',
      techBadge: 'Event 4624 / 4625 / 4740',
      desc: 'Key Windows Security log IDs: 4624 (Logon success with Type 2-Interactive, 3-Network, 10-RDP), 4625 (Failed logon), and 4740 (Account lockout).',
      query: 'index=windows EventCode IN (4624, 4625, 4740) | eval Status=case(EventCode==4624,"SUCCESS", EventCode==4625,"FAILURE", EventCode==4740,"LOCKED") | stats count by TargetUserName, Status, src_ip'
    },
    {
      tab: 'eventids',
      title: 'New Windows Service Installation (Persistence)',
      techBadge: 'System Event 7045 • T1543.003',
      desc: 'Tracks new service creation entries in the Windows System event log, inspecting the ImagePath for suspicious script runners or temp paths.',
      query: 'index=windows source="WinEventLog:System" EventCode=7045 | table _time, ComputerName, ServiceName, ImagePath, ServiceType, StartType'
    },
    {
      tab: 'qradar',
      title: 'QRadar AQL: Rapid Multi-Account Authentication Failures',
      techBadge: 'QRadar AQL • T1110',
      desc: 'Correlates multiple failed authentications grouped by source IP address within a sliding 5-minute detection window in IBM QRadar.',
      query: 'SELECT "SourceIP", COUNT("EventID") AS "Failures", UNIQUE("UserName") AS "TargetUsers" FROM events WHERE "EventID" = 4625 GROUP BY "SourceIP" HAVING "Failures" > 15 LAST 5 MINUTES'
    },
    {
      tab: 'qradar',
      title: 'QRadar AQL: Off-Hours Administrative Privilege Use',
      techBadge: 'QRadar AQL • T1078',
      desc: 'Filters successful administrative sessions occurring outside standard business hours (between 22:00 and 06:00).',
      query: 'SELECT UTF8(payload), "UserName", "SourceIP", "LogonType" FROM events WHERE "EventID" = 4624 AND "LogonType" = 10 AND DATEFORMAT("DeviceTime", \'HH\') IN (\'22\',\'23\',\'00\',\'01\',\'02\',\'03\',\'04\',\'05\') LAST 24 HOURS'
    }
  ];

  if (queryModalList) {
    let currentTab = 'splunk';
    let searchQuery = '';

    function renderQueries() {
      queryModalList.innerHTML = '';
      const filtered = DETECTION_QUERIES.filter(item => {
        const matchesTab = item.tab === currentTab;
        const matchesSearch = !searchQuery ||
          item.title.toLowerCase().includes(searchQuery) ||
          item.desc.toLowerCase().includes(searchQuery) ||
          item.techBadge.toLowerCase().includes(searchQuery) ||
          item.query.toLowerCase().includes(searchQuery);
        return matchesTab && matchesSearch;
      });

      if (filtered.length === 0) {
        queryModalList.innerHTML = `
          <div style="text-align:center;padding:2rem;color:var(--color-text-muted);">
            <p>No detection queries found matching "<em>${escapeHtml(searchQuery)}</em>" in this category.</p>
          </div>
        `;
        return;
      }

      filtered.forEach(q => {
        const card = document.createElement('div');
        card.className = 'query-card';
        card.innerHTML = `
          <div class="query-card-header">
            <h4 class="query-title">${escapeHtml(q.title)}</h4>
            <span class="query-tech-badge">${escapeHtml(q.techBadge)}</span>
          </div>
          <p class="query-card-desc">${escapeHtml(q.desc)}</p>
          <div class="query-code-box">
            <code class="query-code-text">${escapeHtml(q.query)}</code>
            <button type="button" class="btn-copy-query" aria-label="Copy query syntax">Copy</button>
          </div>
        `;

        const copyBtn = card.querySelector('.btn-copy-query');
        if (copyBtn) {
          copyBtn.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(q.query);
              copyBtn.textContent = 'Copied! ✓';
              copyBtn.classList.add('copied');
              setTimeout(() => {
                copyBtn.textContent = 'Copy';
                copyBtn.classList.remove('copied');
              }, 2000);
            } catch (err) {
              console.warn('Clipboard copy failed:', err);
            }
          });
        }

        queryModalList.appendChild(card);
      });
    }

    renderQueries();

    // Tab buttons
    queryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        queryTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        currentTab = tab.getAttribute('data-tab');
        renderQueries();
      });
    });

    // Search input
    if (querySearchInput) {
      querySearchInput.addEventListener('input', () => {
        searchQuery = querySearchInput.value.trim().toLowerCase();
        renderQueries();
      });
    }

    // Modal open / close handlers
    function openModal() {
      if (queryModalBackdrop) {
        queryModalBackdrop.style.display = 'flex';
        setTimeout(() => queryModalBackdrop.classList.add('open'), 10);
        document.body.style.overflow = 'hidden';
        if (querySearchInput) querySearchInput.focus();
      }
    }

    function closeModal() {
      if (queryModalBackdrop) {
        queryModalBackdrop.classList.remove('open');
        setTimeout(() => {
          queryModalBackdrop.style.display = 'none';
          document.body.style.overflow = '';
        }, 200);
      }
    }

    if (btnOpenQueryModal) {
      btnOpenQueryModal.addEventListener('click', openModal);
    }

    if (btnCloseQueryModal) {
      btnCloseQueryModal.addEventListener('click', closeModal);
    }

    if (btnCloseQueryModalBottom) {
      btnCloseQueryModalBottom.addEventListener('click', closeModal);
    }

    if (queryModalBackdrop) {
      queryModalBackdrop.addEventListener('click', (e) => {
        if (e.target === queryModalBackdrop) {
          closeModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && queryModalBackdrop && queryModalBackdrop.classList.contains('open')) {
        closeModal();
      }
    });
  }
});

