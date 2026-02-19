/**
 * Guide Presentation Mode
 * Converts linear grammar guides into interactive slide presentations
 */

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        selectors: {
            stepSection: '.step-section',
            exerciseSection: '.exercise-section',
            stepTitle: '.step-title',
            stepNumber: '.step-number',
            explanationBox: '.explanation-box',
            formulaBox: '.formula-box',
            exampleBox: '.example-box',
            wordScramble: '.word-scramble-section',
            stepHeader: '.step-header'
        }
    };

    // State
    let state = {
        isActive: false,
        currentSlide: 0,
        totalSlides: 0,
        slides: [],
        originalParents: new Map(), // Store original parent and sibling for restoration
        hasBoundShortcuts: false,
        sectionTitles: [],
        previousTheme: null,
        guideTitle: ''
    };

    // DOM Elements
    let elements = {
        container: null,
        content: null,
        progressBar: null,
        prevBtn: null,
        nextBtn: null,
        sectionSelect: null
    };

    /**
     * Initialize the presentation mode
     */
function init() {
        const tryStart = () => {
            const sections = document.querySelectorAll(CONFIG.selectors.stepSection);
            if (sections.length === 0) return false;
            captureGuideTitle();

            if (!elements.container) {
                createPresentationContainer();
            }

            if (!state.isActive) {
                startPresentation();
            }

            return true;
        };

        if (tryStart()) {
            return;
        }

        // React content may render after this script runs; watch for the sections
        const observer = new MutationObserver(() => {
            if (tryStart()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * Create the fullscreen container structure
     */
    function createPresentationContainer() {
        const container = document.createElement('div');
        container.className = 'presentation-container';
        container.innerHTML = `
      <div class="presentation-header">
        <div class="presentation-title">
          <div class="presentation-title-label">Grammar Presentation Mode</div>
          <div class="presentation-activity-title"></div>
        </div>
        <div class="presentation-controls">
          <div class="presentation-jump">
            <label class="sr-only" for="presentation-section-select">Jump to section</label>
            <select id="presentation-section-select" class="presentation-select">
              <option value="">Jump to section</option>
            </select>
          </div>
          <span class="presentation-progress">1 / 1</span>
          <button class="control-btn close-btn" title="Exit Presentation">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      </div>
      <div class="presentation-content">
        <!-- Slides will be injected here -->
      </div>
      <button class="nav-btn prev" title="Previous Slide">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button class="nav-btn next" title="Next Slide">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    `;

        document.body.appendChild(container);

        // Cache elements
        elements.container = container;
        elements.content = container.querySelector('.presentation-content');
        elements.progressBar = container.querySelector('.presentation-progress');
        elements.prevBtn = container.querySelector('.nav-btn.prev');
        elements.nextBtn = container.querySelector('.nav-btn.next');
        elements.sectionSelect = container.querySelector('.presentation-select');
        const activityTitleEl = container.querySelector('.presentation-activity-title');
        if (activityTitleEl) {
            activityTitleEl.textContent = state.guideTitle || '';
        }

        // Event listeners
        container.querySelector('.close-btn').addEventListener('click', stopPresentation);
        elements.prevBtn.addEventListener('click', prevSlide);
        elements.nextBtn.addEventListener('click', nextSlide);
        if (elements.sectionSelect) {
            elements.sectionSelect.addEventListener('change', (e) => {
                const value = parseInt(e.target.value, 10);
                if (!Number.isNaN(value)) {
                    showSlide(value);
                }
            });
        }

        if (!state.hasBoundShortcuts) {
            setupKeyboardShortcuts();
            state.hasBoundShortcuts = true;
        }
    }

    /**
     * Move element to presentation and store reference for restoration
     */
    function moveElement(element, targetContainer) {
        // Create a placeholder comment to mark where it was
        const placeholder = document.createComment('placeholder');
        element.parentNode.insertBefore(placeholder, element);

        // Store reference
        state.originalParents.set(element, placeholder);

        // Move element
        targetContainer.appendChild(element);
    }

    /**
     * Restore elements to their original positions
     */
    function restoreElements() {
        state.originalParents.forEach((placeholder, element) => {
            placeholder.parentNode.insertBefore(element, placeholder);
            placeholder.remove();
        });
        state.originalParents.clear();
        elements.content.innerHTML = ''; // Clear slides
    }

    /**
     * Parse content and build slides
     */
    function buildSlides() {
        elements.content.innerHTML = '';
        state.slides = [];
        state.originalParents.clear();
        state.sectionTitles = [];

        const sections = Array.from(document.querySelectorAll(CONFIG.selectors.stepSection));

        sections.forEach((section, index) => {
            const slide = document.createElement('div');
            slide.className = 'guide-slide';

            // Create Book Layout
            const bookLayout = document.createElement('div');
            bookLayout.className = 'book-layout';

            // Left Page: Explanations
            const leftPage = document.createElement('div');
            leftPage.className = 'book-page left';

            // Right Page: Exercises
            const rightPage = document.createElement('div');
            rightPage.className = 'book-page right';

            // Extract Title (clone it because we want it in both places potentially, or just move it)
            // For title, cloning is fine as it's static text usually. 
            // But let's move everything to be consistent and avoid ID conflicts.

            const title = section.querySelector(CONFIG.selectors.stepTitle);
            if (title) {
                // We clone the title for the slide because we might want to keep the original structure intact-ish
                // But wait, if we move children, the section becomes empty.
                // Let's move the children.
                const titleClone = title.cloneNode(true);
                leftPage.appendChild(titleClone);
            }
            const titleText = title ? (title.textContent || '').trim() : `Section ${index + 1}`;
            state.sectionTitles.push(titleText);

            // Move children
            // We need to convert to array because children list is live
            const children = Array.from(section.children);

            children.forEach(child => {
                // Skip header/title container if we handled it separately, but here we just check classes
                if (child.matches(CONFIG.selectors.stepHeader)) return;

                const isExercise = child.matches(CONFIG.selectors.exerciseSection) ||
                    child.matches(CONFIG.selectors.wordScramble);

                if (isExercise) {
                    moveElement(child, rightPage);
                } else {
                    moveElement(child, leftPage);
                }
            });

            // If right page is empty, add placeholder
            if (rightPage.children.length === 0) {
                rightPage.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #94a3b8; text-align: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <p>Read the explanation on the left page.</p>
          </div>
        `;
            }

            bookLayout.appendChild(leftPage);
            bookLayout.appendChild(rightPage);
            slide.appendChild(bookLayout);

            elements.content.appendChild(slide);
            state.slides.push(slide);
        });

        state.totalSlides = state.slides.length;
        if (elements.sectionSelect) {
            const options = ['<option value="">Jump to section</option>'].concat(
                state.sectionTitles.map((title, idx) => `<option value="${idx}">${idx + 1}. ${title}</option>`)
            );
            elements.sectionSelect.innerHTML = options.join('');
        }
        updateProgress();
    }

    /**
     * Start the presentation
     */
    function startPresentation() {
        buildSlides();
        state.isActive = true;
        state.currentSlide = 0;
        elements.container.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        state.previousTheme = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', 'light');
        showSlide(0);

        // Re-initialize Lucide icons in the new container
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    /**
     * Stop the presentation
     */
    function stopPresentation() {
        state.isActive = false;
        elements.container.classList.remove('active');
        document.body.style.overflow = '';
        if (state.previousTheme === null) {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', state.previousTheme);
        }

        // Return to dashboard instead of showing underlying page
        window.location.href = '/dashboard';
    }

    /**
     * Show a specific slide
     */
    function showSlide(index) {
        if (index < 0 || index >= state.totalSlides) return;

        state.currentSlide = index;

        // Update DOM
        state.slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        updateProgress();
        updateNavButtons();
    }

    function nextSlide() {
        if (state.currentSlide < state.totalSlides - 1) {
            showSlide(state.currentSlide + 1);
        }
    }

    function prevSlide() {
        if (state.currentSlide > 0) {
            showSlide(state.currentSlide - 1);
        }
    }

    function updateProgress() {
        elements.progressBar.textContent = `${state.currentSlide + 1} / ${state.totalSlides}`;
    }

    function updateNavButtons() {
        elements.prevBtn.disabled = state.currentSlide === 0;
        elements.nextBtn.disabled = state.currentSlide === state.totalSlides - 1;

        elements.prevBtn.style.opacity = state.currentSlide === 0 ? '0.5' : '1';
        elements.nextBtn.style.opacity = state.currentSlide === state.totalSlides - 1 ? '0.5' : '1';
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!state.isActive) return;

            switch (e.key) {
                case 'ArrowRight':
                case 'Space': // Optional: Space for next
                    // Prevent scrolling if space is pressed
                    if (e.key === 'Space') e.preventDefault();
                    nextSlide();
                    break;
                case 'ArrowLeft':
                    prevSlide();
                    break;
                case 'Escape':
                    stopPresentation();
                    break;
            }
        });
    }

    function captureGuideTitle() {
        const explicit = document.querySelector('[data-activity-title]');
        const heading = document.querySelector('h1');
        const title = (explicit?.textContent || heading?.textContent || '').trim();
        state.guideTitle = title || 'Grammar Guide';
        if (elements.container) {
            const activityTitleEl = elements.container.querySelector('.presentation-activity-title');
            if (activityTitleEl) {
                activityTitleEl.textContent = state.guideTitle;
            }
        }
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
