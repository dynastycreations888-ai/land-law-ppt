class MaharashtraLandRevenuePresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 9;
        this.isTransitioning = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
        this.addAccessibilityFeatures();
        this.addLegalEducationFeatures();
    }
    
    initializeElements() {
        this.slidesContainer = document.getElementById('slidesContainer');
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideEl = document.getElementById('currentSlide');
        this.totalSlidesEl = document.getElementById('totalSlides');
        this.progressFill = document.querySelector('.progress-fill');
        
        // Set total slides display
        this.totalSlidesEl.textContent = this.totalSlides;
        
        // Initialize slide data for Maharashtra Land Revenue Code presentation
        this.slideData = {
            1: { title: "Title Slide - Lekshmi Prakash", type: "title" },
            2: { title: "Introduction to Maharashtra Land Revenue Code 1966", type: "introduction" },
            3: { title: "Survey Officers: Appointment & Hierarchy", type: "appointment_hierarchy" },
            4: { title: "Powers of Survey Officers", type: "powers" },
            5: { title: "Duties of Survey Officers", type: "duties" },
            6: { title: "Survey Procedures & Settlement Operations", type: "procedures" },
            7: { title: "Supreme Court Cases & Legal Precedents", type: "case_law" },
            8: { title: "Modern Challenges & Compliance Issues", type: "challenges" },
            9: { title: "Thank You - Lekshmi Prakash", type: "thank_you" }
        };

        // Key sections for quick reference
        this.keySections = {
            'Section 8': 'Survey Officers appointment',
            'Section 14': 'Powers and duties of survey officers',
            'Section 80': 'General notice and summons powers',
            'Section 81': 'Assistance in measurement and classification',
            'Section 126': 'Survey of village, town and city sites',
            'Section 241': 'Power to enter upon and survey land',
            'Sections 246-258': 'Appeal and revision mechanisms'
        };
    }
    
    bindEvents() {
        // Button navigation
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Click navigation on slides
        this.slides.forEach((slide, index) => {
            slide.addEventListener('click', (e) => {
                if (e.target === slide || e.target.closest('.slide-content') === slide.querySelector('.slide-content')) {
                    if (e.clientX > window.innerWidth / 2) {
                        this.nextSlide();
                    } else {
                        this.previousSlide();
                    }
                }
            });
        });
        
        // Prevent context menu during presentation
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Touch/swipe support for mobile devices
        this.initializeTouchEvents();
        
        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        // Visibility change handler
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }
    
    initializeTouchEvents() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        
        this.slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        this.slidesContainer.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            this.handleSwipe(startX, startY, endX, endY, endTime - startTime);
        }, { passive: true });
    }
    
    handleSwipe(startX, startY, endX, endY, duration) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        const maxSwipeTime = 1000;
        
        // Only handle horizontal swipes within time limit
        if (Math.abs(deltaX) > Math.abs(deltaY) && 
            Math.abs(deltaX) > minSwipeDistance && 
            duration < maxSwipeTime) {
            
            if (deltaX > 0) {
                this.previousSlide();
            } else {
                this.nextSlide();
            }
        }
    }
    
    handleKeyPress(e) {
        if (this.isTransitioning) return;
        
        switch(e.key) {
            case 'ArrowRight':
            case ' ': // Spacebar
            case 'PageDown':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'Backspace':
            case 'PageUp':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                this.exitFullscreen();
                break;
            case 'F5':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'p':
            case 'P':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.printPresentation();
                }
                break;
            case 'h':
            case 'H':
                e.preventDefault();
                this.showKeyboardHelp();
                break;
            case 'n':
            case 'N':
                e.preventDefault();
                this.toggleNotes();
                break;
        }
        
        // Number keys for direct slide navigation (1-9)
        if (e.key >= '1' && e.key <= '9') {
            const slideNumber = parseInt(e.key);
            if (slideNumber <= this.totalSlides) {
                this.goToSlide(slideNumber);
            }
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides && !this.isTransitioning) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1 && !this.isTransitioning) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides || 
            slideNumber === this.currentSlide || this.isTransitioning) {
            return;
        }
        
        this.isTransitioning = true;
        
        // Remove active class from current slide
        const currentSlideEl = document.querySelector('.slide.active');
        if (currentSlideEl) {
            currentSlideEl.classList.remove('active');
        }
        
        // Add active class to new slide
        const newSlideEl = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
        if (newSlideEl) {
            setTimeout(() => {
                newSlideEl.classList.add('active');
                this.currentSlide = slideNumber;
                this.updateDisplay();
                
                // Trigger slide-specific animations
                setTimeout(() => {
                    this.handleSlideSpecificEffects();
                    this.isTransitioning = false;
                }, 300);
            }, 50);
        }
        
        // Log slide navigation for study tracking
        this.logSlideNavigation(slideNumber);
    }
    
    updateDisplay() {
        // Update slide counter
        this.currentSlideEl.textContent = this.currentSlide;
        
        // Update progress bar (11.11% per slide for 9 slides)
        const progressPercentage = (this.currentSlide / this.totalSlides) * 100;
        this.progressFill.style.width = `${progressPercentage}%`;
        
        // Update button states
        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        
        // Update page title with current slide info
        const slideInfo = this.slideData[this.currentSlide];
        document.title = `${slideInfo.title} - Maharashtra Land Revenue Code 1966`;
        
        // Update ARIA labels for accessibility
        this.updateAriaLabels();
        
        // Update quick navigation if available
        this.updateQuickNavigation();
    }
    
    handleSlideSpecificEffects() {
        const currentSlideEl = document.querySelector('.slide.active');
        if (!currentSlideEl) return;
        
        // Animate list items with staggered entrance
        const listItems = currentSlideEl.querySelectorAll('.feature-list li, .power-list li, .duty-details li');
        listItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 200 + (index * 80));
        });
        
        // Animate cards with subtle bounce effect
        const cards = currentSlideEl.querySelectorAll('.hierarchy-card, .duty-card, .power-section, .case-card, .challenge-card, .step-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.98)';
            setTimeout(() => {
                card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 250 + (index * 100));
        });
        
        // Special animations for specific slides
        switch(this.currentSlide) {
            case 3: // Hierarchy slide
                this.animateHierarchy();
                break;
            case 4: // Powers slide
                this.animatePowers();
                break;
            case 5: // Duties slide
                this.animateDuties();
                break;
            case 6: // Procedures slide
                this.animateProcedures();
                break;
            case 7: // Cases slide
                this.animateCases();
                break;
        }
    }
    
    animateHierarchy() {
        const hierarchyCards = document.querySelectorAll('.hierarchy-card');
        hierarchyCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-50px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, 400 + (index * 150));
        });
    }
    
    animatePowers() {
        const powerSections = document.querySelectorAll('.power-section');
        powerSections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'scale(0.95) rotateY(-5deg)';
            setTimeout(() => {
                section.style.transition = 'all 0.6s ease-out';
                section.style.opacity = '1';
                section.style.transform = 'scale(1) rotateY(0deg)';
            }, 300 + (index * 200));
        });
    }
    
    animateDuties() {
        const dutyCards = document.querySelectorAll('.duty-card');
        dutyCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) rotateX(10deg)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) rotateX(0deg)';
            }, 350 + (index * 120));
        });
    }
    
    animateProcedures() {
        const stepCards = document.querySelectorAll('.step-card');
        stepCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(' + (index % 2 === 0 ? '-40px' : '40px') + ')';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, 400 + (index * 180));
        });
    }
    
    animateCases() {
        const caseCards = document.querySelectorAll('.case-card');
        caseCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'rotateY(-15deg) scale(0.9)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'rotateY(0deg) scale(1)';
            }, 300 + (index * 250));
        });
    }
    
    addAccessibilityFeatures() {
        // Add ARIA labels
        const presentation = document.querySelector('.presentation-container');
        presentation.setAttribute('role', 'application');
        presentation.setAttribute('aria-label', 'Maharashtra Land Revenue Code 1966 - Powers and Duties of Survey Officer - LLB Presentation - 9 Slides');
        
        // Add keyboard navigation instructions
        const instructions = document.createElement('div');
        instructions.className = 'sr-only';
        instructions.textContent = 'Use arrow keys, spacebar, or navigation buttons to control slides. Press F5 for fullscreen, H for help, N for notes, Ctrl+P to print. Numbers 1-9 for direct slide access.';
        document.body.appendChild(instructions);
        
        // Add skip navigation
        const skipNav = document.createElement('a');
        skipNav.href = '#slidesContainer';
        skipNav.textContent = 'Skip to presentation content';
        skipNav.className = 'sr-only';
        skipNav.addEventListener('focus', () => skipNav.classList.remove('sr-only'));
        skipNav.addEventListener('blur', () => skipNav.classList.add('sr-only'));
        document.body.insertBefore(skipNav, document.body.firstChild);
    }
    
    updateAriaLabels() {
        const currentSlideEl = document.querySelector('.slide.active');
        if (currentSlideEl) {
            currentSlideEl.setAttribute('aria-current', 'step');
            currentSlideEl.setAttribute('aria-label', 
                `Slide ${this.currentSlide} of ${this.totalSlides}: ${this.slideData[this.currentSlide].title}`);
        }
        
        // Remove aria-current from other slides
        this.slides.forEach((slide, index) => {
            if (index + 1 !== this.currentSlide) {
                slide.removeAttribute('aria-current');
            }
        });
    }
    
    addLegalEducationFeatures() {
        this.createQuickNavigation();
        this.createNoteTakingPanel();
        this.createKeyboardHelpModal();
        this.createSectionReferencePanel();
        this.addPresentationTimer();
        this.highlightLegalTerms();
    }
    
    createQuickNavigation() {
        const quickNav = document.createElement('div');
        quickNav.className = 'quick-navigation';
        quickNav.innerHTML = `
            <div class="quick-nav-header">Quick Access</div>
            <div class="quick-nav-buttons">
                <button class="quick-nav-btn" data-slide="1">Title</button>
                <button class="quick-nav-btn" data-slide="2">Intro</button>
                <button class="quick-nav-btn" data-slide="3">Hierarchy</button>
                <button class="quick-nav-btn" data-slide="4">Powers</button>
                <button class="quick-nav-btn" data-slide="5">Duties</button>
                <button class="quick-nav-btn" data-slide="6">Procedures</button>
                <button class="quick-nav-btn" data-slide="7">Cases</button>
                <button class="quick-nav-btn" data-slide="8">Challenges</button>
                <button class="quick-nav-btn" data-slide="9">Thank You</button>
            </div>
        `;
        
        const quickNavStyles = document.createElement('style');
        quickNavStyles.textContent = `
            .quick-navigation {
                position: fixed;
                right: 20px;
                top: 60px;
                background: var(--color-surface);
                border: 2px solid #000080;
                border-radius: var(--radius-md);
                padding: var(--space-12);
                z-index: 999;
                max-width: 120px;
                box-shadow: var(--shadow-lg);
            }
            .quick-nav-header {
                font-size: var(--font-size-xs);
                font-weight: var(--font-weight-bold);
                color: #000080;
                margin-bottom: var(--space-8);
                text-align: center;
            }
            .quick-nav-buttons {
                display: grid;
                gap: var(--space-2);
            }
            .quick-nav-btn {
                background: var(--color-secondary);
                border: 1px solid #000080;
                color: #000000;
                padding: var(--space-2) var(--space-6);
                border-radius: var(--radius-sm);
                font-size: var(--font-size-xs);
                cursor: pointer;
                transition: all var(--duration-fast) var(--ease-standard);
            }
            .quick-nav-btn:hover {
                background: #000080;
                color: white;
            }
            .quick-nav-btn.active {
                background: #FF9933;
                color: white;
                border-color: #FF9933;
            }
            @media (max-width: 768px) {
                .quick-navigation {
                    display: none;
                }
            }
        `;
        
        document.head.appendChild(quickNavStyles);
        document.body.appendChild(quickNav);
        
        quickNav.querySelectorAll('.quick-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slideNumber = parseInt(e.target.dataset.slide);
                this.goToSlide(slideNumber);
            });
        });
    }
    
    updateQuickNavigation() {
        const quickNav = document.querySelector('.quick-navigation');
        if (quickNav) {
            quickNav.querySelectorAll('.quick-nav-btn').forEach((btn, index) => {
                btn.classList.toggle('active', index + 1 === this.currentSlide);
            });
        }
    }
    
    createNoteTakingPanel() {
        const notePanel = document.createElement('div');
        notePanel.className = 'note-panel hidden';
        notePanel.innerHTML = `
            <div class="note-header">
                <h3>Study Notes</h3>
                <button class="close-notes">×</button>
            </div>
            <textarea id="studyNotes" placeholder="Add your LLB study notes here...

Key sections to remember:
• Section 8: Survey Officers
• Section 14: Powers and duties
• Section 80: General notice powers
• Section 81: Assistance requirements
• Section 126: Village/town/city surveys
• Section 241: Power to enter land
• Sections 246-258: Appeals & revision

Important cases:
• State of Gujarat v. Patil Raghav Natha (1989)
• L.L. Constructions v. State of Maharashtra
• Malhar Balkrushna Kulkarni v. Divisional Commissioner (2025)"></textarea>
            <div class="note-actions">
                <button class="save-notes">Save Notes</button>
                <button class="export-notes">Export</button>
            </div>
        `;
        
        const noteStyles = document.createElement('style');
        noteStyles.textContent = `
            .note-panel {
                position: fixed;
                left: 20px;
                top: 60px;
                width: 300px;
                height: 450px;
                background: var(--color-surface);
                border: 2px solid #000080;
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: 999;
                display: flex;
                flex-direction: column;
            }
            .note-panel.hidden {
                display: none;
            }
            .note-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-12);
                border-bottom: 1px solid var(--color-border);
                background: rgba(255, 153, 51, 0.1);
            }
            .note-header h3 {
                margin: 0;
                color: #000000;
                font-size: var(--font-size-sm);
            }
            .close-notes {
                background: none;
                border: none;
                font-size: var(--font-size-lg);
                cursor: pointer;
                color: #000080;
                font-weight: bold;
            }
            .note-panel textarea {
                flex: 1;
                padding: var(--space-12);
                border: none;
                resize: none;
                font-family: var(--font-family-base);
                font-size: var(--font-size-xs);
                color: #000000;
                line-height: 1.4;
            }
            .note-actions {
                display: flex;
                gap: var(--space-6);
                padding: var(--space-8);
                border-top: 1px solid var(--color-border);
            }
            .note-actions button {
                flex: 1;
                padding: var(--space-4) var(--space-8);
                border: 1px solid #000080;
                border-radius: var(--radius-sm);
                background: var(--color-secondary);
                color: #000000;
                font-size: var(--font-size-xs);
                cursor: pointer;
                transition: all var(--duration-fast) var(--ease-standard);
            }
            .note-actions button:hover {
                background: #000080;
                color: white;
            }
            .note-toggle {
                position: fixed;
                left: 20px;
                bottom: 100px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #000080;
                color: white;
                border: none;
                font-size: var(--font-size-lg);
                cursor: pointer;
                box-shadow: var(--shadow-lg);
                z-index: 998;
                transition: all var(--duration-normal) var(--ease-standard);
            }
            .note-toggle:hover {
                background: #FF9933;
                transform: scale(1.1);
            }
            @media (max-width: 768px) {
                .note-panel {
                    width: calc(100vw - 40px);
                    height: 300px;
                    left: 20px;
                    top: 80px;
                }
                .note-toggle {
                    bottom: 80px;
                }
            }
        `;
        
        document.head.appendChild(noteStyles);
        document.body.appendChild(notePanel);
        
        const noteToggle = document.createElement('button');
        noteToggle.className = 'note-toggle';
        noteToggle.innerHTML = '📝';
        noteToggle.title = 'Study Notes (Press N)';
        document.body.appendChild(noteToggle);
        
        noteToggle.addEventListener('click', () => this.toggleNotes());
        notePanel.querySelector('.close-notes').addEventListener('click', () => this.toggleNotes());
        
        // Save notes functionality
        const saveBtn = notePanel.querySelector('.save-notes');
        const exportBtn = notePanel.querySelector('.export-notes');
        const textarea = notePanel.querySelector('textarea');
        
        saveBtn.addEventListener('click', () => {
            const notes = textarea.value;
            // In a real application, this would save to a database
            console.log('Notes saved locally');
            this.showNotification('Notes saved locally!', 'success');
        });
        
        exportBtn.addEventListener('click', () => {
            const notes = textarea.value;
            const blob = new Blob([notes], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Maharashtra_Land_Revenue_Code_Notes.txt';
            a.click();
            URL.revokeObjectURL(url);
            this.showNotification('Notes exported!', 'success');
        });
    }
    
    toggleNotes() {
        const notePanel = document.querySelector('.note-panel');
        if (notePanel) {
            notePanel.classList.toggle('hidden');
            if (!notePanel.classList.contains('hidden')) {
                notePanel.querySelector('textarea').focus();
            }
        }
    }
    
    createKeyboardHelpModal() {
        const helpModal = document.createElement('div');
        helpModal.className = 'help-modal hidden';
        helpModal.innerHTML = `
            <div class="help-modal-content">
                <div class="help-header">
                    <h3>Keyboard Shortcuts</h3>
                    <button class="close-help">×</button>
                </div>
                <div class="help-shortcuts">
                    <div class="shortcut-group">
                        <h4>Navigation</h4>
                        <div class="shortcut"><kbd>→</kbd> <kbd>Space</kbd> Next slide</div>
                        <div class="shortcut"><kbd>←</kbd> <kbd>Backspace</kbd> Previous slide</div>
                        <div class="shortcut"><kbd>1-9</kbd> Go to specific slide</div>
                        <div class="shortcut"><kbd>Home</kbd> First slide</div>
                        <div class="shortcut"><kbd>End</kbd> Last slide</div>
                    </div>
                    <div class="shortcut-group">
                        <h4>Presentation</h4>
                        <div class="shortcut"><kbd>F5</kbd> Toggle fullscreen</div>
                        <div class="shortcut"><kbd>Esc</kbd> Exit fullscreen</div>
                        <div class="shortcut"><kbd>Ctrl+P</kbd> Print presentation</div>
                    </div>
                    <div class="shortcut-group">
                        <h4>Study Features</h4>
                        <div class="shortcut"><kbd>N</kbd> Toggle notes panel</div>
                        <div class="shortcut"><kbd>H</kbd> Show this help</div>
                    </div>
                </div>
            </div>
        `;
        
        const helpStyles = document.createElement('style');
        helpStyles.textContent = `
            .help-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            .help-modal.hidden {
                display: none;
            }
            .help-modal-content {
                background: var(--color-surface);
                border: 3px solid #000080;
                border-radius: var(--radius-lg);
                padding: var(--space-24);
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
            }
            .help-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--space-20);
                border-bottom: 2px solid #FF9933;
                padding-bottom: var(--space-12);
            }
            .help-header h3 {
                margin: 0;
                color: #000000;
                font-size: var(--font-size-xl);
            }
            .close-help {
                background: none;
                border: none;
                font-size: var(--font-size-xl);
                cursor: pointer;
                color: #000080;
                font-weight: bold;
            }
            .help-shortcuts {
                display: grid;
                gap: var(--space-16);
            }
            .shortcut-group h4 {
                color: #000080;
                margin-bottom: var(--space-8);
                font-size: var(--font-size-md);
            }
            .shortcut {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--space-4) 0;
                border-bottom: 1px solid rgba(0, 0, 128, 0.1);
                color: #000000;
                font-size: var(--font-size-sm);
            }
            .shortcut:last-child {
                border-bottom: none;
            }
            kbd {
                background: rgba(255, 153, 51, 0.2);
                border: 1px solid #FF9933;
                border-radius: var(--radius-sm);
                padding: var(--space-2) var(--space-6);
                font-family: var(--font-family-mono);
                font-size: var(--font-size-xs);
                color: #000080;
                font-weight: bold;
            }
        `;
        
        document.head.appendChild(helpStyles);
        document.body.appendChild(helpModal);
        
        helpModal.querySelector('.close-help').addEventListener('click', () => {
            helpModal.classList.add('hidden');
        });
        
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.classList.add('hidden');
            }
        });
    }
    
    showKeyboardHelp() {
        const helpModal = document.querySelector('.help-modal');
        if (helpModal) {
            helpModal.classList.remove('hidden');
        }
    }
    
    createSectionReferencePanel() {
        const refPanel = document.createElement('div');
        refPanel.className = 'section-reference-panel';
        refPanel.innerHTML = `
            <div class="ref-header">Key Sections</div>
            <div class="ref-sections">
                ${Object.entries(this.keySections).map(([section, description]) => 
                    `<div class="ref-item">
                        <div class="ref-section">${section}</div>
                        <div class="ref-desc">${description}</div>
                    </div>`
                ).join('')}
            </div>
        `;
        
        const refStyles = document.createElement('style');
        refStyles.textContent = `
            .section-reference-panel {
                position: fixed;
                right: 160px;
                top: 60px;
                width: 280px;
                background: var(--color-surface);
                border: 2px solid #138808;
                border-radius: var(--radius-md);
                padding: var(--space-12);
                z-index: 998;
                box-shadow: var(--shadow-md);
            }
            .ref-header {
                font-size: var(--font-size-sm);
                font-weight: var(--font-weight-bold);
                color: #138808;
                margin-bottom: var(--space-10);
                text-align: center;
                border-bottom: 1px solid #138808;
                padding-bottom: var(--space-6);
            }
            .ref-sections {
                max-height: 300px;
                overflow-y: auto;
            }
            .ref-item {
                margin-bottom: var(--space-8);
                padding: var(--space-6);
                background: rgba(19, 136, 8, 0.05);
                border-radius: var(--radius-sm);
            }
            .ref-section {
                font-weight: var(--font-weight-bold);
                color: #000080;
                font-size: var(--font-size-xs);
                margin-bottom: var(--space-2);
            }
            .ref-desc {
                color: #000000;
                font-size: var(--font-size-xs);
                font-style: italic;
            }
            @media (max-width: 1024px) {
                .section-reference-panel {
                    display: none;
                }
            }
        `;
        
        document.head.appendChild(refStyles);
        document.body.appendChild(refPanel);
    }
    
    addPresentationTimer() {
        const timerContainer = document.createElement('div');
        timerContainer.className = 'presentation-timer-container';
        timerContainer.innerHTML = `
            <div class="timer-label">Duration:</div>
            <div class="timer-display">00:00</div>
        `;
        
        const timerStyles = document.createElement('style');
        timerStyles.textContent = `
            .presentation-timer-container {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--color-surface);
                border: 2px solid #FF9933;
                border-radius: var(--radius-md);
                padding: var(--space-8);
                font-family: var(--font-family-mono);
                z-index: 999;
                text-align: center;
            }
            .timer-label {
                font-size: var(--font-size-xs);
                color: #FF9933;
                font-weight: var(--font-weight-bold);
            }
            .timer-display {
                font-size: var(--font-size-md);
                color: #000000;
                font-weight: var(--font-weight-bold);
            }
            @media (max-width: 768px) {
                .presentation-timer-container {
                    top: 10px;
                    right: 10px;
                    padding: var(--space-4);
                }
            }
        `;
        
        document.head.appendChild(timerStyles);
        document.body.appendChild(timerContainer);
        
        let startTime = Date.now();
        const timerDisplay = timerContainer.querySelector('.timer-display');
        
        setInterval(() => {
            const elapsed = Date.now() - startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    highlightLegalTerms() {
        const legalTerms = [
            'Survey Officer', 'Settlement Officer', 'Survey Tahsildar',
            'Maharashtra Land Revenue Code', 'Section 8', 'Section 14', 
            'Section 80', 'Section 81', 'Section 126', 'Section 241',
            'revenue survey', 'settlement', 'boundary demarcation',
            'sanad', 'survey number', 'land classification',
            'Supreme Court', 'appeal', 'revision', 'writ jurisdiction'
        ];
        
        document.querySelectorAll('.slide-content').forEach(slide => {
            let content = slide.innerHTML;
            legalTerms.forEach(term => {
                const regex = new RegExp(`\\b(${term})\\b`, 'gi');
                content = content.replace(regex, '<mark class="legal-term">$1</mark>');
            });
            slide.innerHTML = content;
        });
        
        const termStyles = document.createElement('style');
        termStyles.textContent = `
            .legal-term {
                background: rgba(255, 153, 51, 0.3);
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-sm);
                font-weight: var(--font-weight-semibold);
                color: #000080;
            }
        `;
        document.head.appendChild(termStyles);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const notificationStyles = document.createElement('style');
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 80px;
                right: 20px;
                padding: var(--space-12) var(--space-16);
                border-radius: var(--radius-md);
                color: white;
                font-weight: var(--font-weight-semibold);
                font-size: var(--font-size-sm);
                z-index: 9998;
                box-shadow: var(--shadow-lg);
                transform: translateX(100%);
                transition: transform var(--duration-normal) var(--ease-standard);
            }
            .notification-success {
                background: #138808;
            }
            .notification-error {
                background: #dc2626;
            }
            .notification-info {
                background: #000080;
            }
            .notification.show {
                transform: translateX(0);
            }
        `;
        
        if (!document.querySelector('style[data-notification-styles]')) {
            notificationStyles.setAttribute('data-notification-styles', 'true');
            document.head.appendChild(notificationStyles);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
    
    printPresentation() {
        const printStyles = document.createElement('style');
        printStyles.textContent = `
            @media print {
                .slide { 
                    position: relative !important; 
                    page-break-after: always; 
                    opacity: 1 !important;
                    transform: none !important;
                }
                .navigation-controls, .progress-bar, .quick-navigation, 
                .note-panel, .section-reference-panel, .presentation-timer-container { 
                    display: none !important; 
                }
                .slide-content { 
                    max-height: none !important; 
                    overflow: visible !important; 
                    border: 2px solid #000000 !important;
                }
                body { background: white !important; }
                * { color: black !important; }
            }
        `;
        document.head.appendChild(printStyles);
        
        setTimeout(() => {
            window.print();
            printStyles.remove();
        }, 100);
    }
    
    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.updateDisplay();
        }, 250);
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            document.body.classList.add('presentation-paused');
        } else {
            document.body.classList.remove('presentation-paused');
            setTimeout(() => {
                this.handleSlideSpecificEffects();
            }, 100);
        }
    }
    
    logSlideNavigation(slideNumber) {
        console.log(`Navigated to slide ${slideNumber}: ${this.slideData[slideNumber].title}`);
        
        // Track study progress
        const studyProgress = {
            currentSlide: slideNumber,
            title: this.slideData[slideNumber].title,
            timestamp: new Date().toISOString(),
            totalSlides: this.totalSlides
        };
        
        // In a real application, this could be sent to analytics
        if (window.gtag) {
            gtag('event', 'slide_view', {
                'event_category': 'legal_presentation',
                'event_label': this.slideData[slideNumber].title,
                'value': slideNumber
            });
        }
    }
    
    // Public API methods
    getCurrentSlideInfo() {
        return {
            current: this.currentSlide,
            total: this.totalSlides,
            percentage: (this.currentSlide / this.totalSlides) * 100,
            title: this.slideData[this.currentSlide].title,
            type: this.slideData[this.currentSlide].type
        };
    }
    
    jumpToSlideByType(type) {
        const slideNumber = Object.keys(this.slideData).find(key => 
            this.slideData[key].type === type
        );
        if (slideNumber) {
            this.goToSlide(parseInt(slideNumber));
        }
    }
    
    getKeySection(sectionNumber) {
        return this.keySections[`Section ${sectionNumber}`] || null;
    }
}

// Initialize presentation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main presentation
    window.maharashtraLandRevenueApp = new MaharashtraLandRevenuePresentationApp();
    
    // Add loading completion indicator
    document.body.classList.add('presentation-loaded');
    
    // Add smooth scrolling for all slide content
    document.querySelectorAll('.slide-content').forEach(content => {
        content.style.scrollBehavior = 'smooth';
    });
    
    // Log initialization success
    console.log('🏛️ Maharashtra Land Revenue Code Presentation Initialized (9 Slides)');
    console.log('📚 Student: Lekshmi Prakash - 3 LLB (Sem 5) - PDEA Law College, Hadapsar');
    console.log('⚖️ Features: Navigation, Quick Nav, Study Notes, Section Reference, Timer');
    console.log('⌨️ Shortcuts: Arrow keys, Space, Home/End, F5 (fullscreen), H (help), N (notes), 1-9 (direct slides)');
    console.log('📱 Mobile: Swipe gestures supported');
    console.log('📖 Content: Powers and Duties of Survey Officer under Maharashtra Land Revenue Code 1966');
    
    // Add presentation metadata
    window.presentationMetadata = {
        title: 'Powers and Duties of Survey Officer under the Maharashtra Land Revenue Code 1966',
        student: {
            name: 'Lekshmi Prakash',
            class: '3 LLB (Sem 5)',
            college: 'PDEA Law College, Hadapsar'
        },
        subject: 'Land Laws',
        totalSlides: 9,
        primaryLegislation: 'Maharashtra Land Revenue Code, 1966',
        keySections: ['8', '14', '80', '81', '126', '241', '246-258'],
        keyTopics: [
            'Survey Officers Appointment and Hierarchy',
            'Powers of Survey Officers',
            'Duties of Survey Officers', 
            'Survey Procedures and Settlement',
            'Supreme Court Cases and Precedents',
            'Modern Challenges and Compliance'
        ],
        version: '9-slide comprehensive version for LLB examination preparation'
    };
});

// Handle fullscreen changes
document.addEventListener('fullscreenchange', () => {
    document.body.classList.toggle('fullscreen-mode', !!document.fullscreenElement);
});

// Handle print preparation
window.addEventListener('beforeprint', () => {
    document.body.classList.add('print-mode');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-mode');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        MaharashtraLandRevenuePresentationApp
    };
}