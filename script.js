
(function() {
    'use strict';
    
    const headers = document.querySelectorAll("header");
    const sections = document.querySelectorAll("section");
    const sectionsArray = Array.prototype.slice.call(sections);


    const MOBILE_QUERY = '(max-width: 850px) and (orientation: portrait)';
    const SCROLL_LOCK_MS = 350; 
    let scrollLocked = false;


    function init() {
        setupClickHandlers();
        setupScrollNavigation();
        handleInitialLoad();
        setupPopstateHandler();
    }


    function setupClickHandlers() {
        headers.forEach(function(header) {
            header.addEventListener('click', function() {
                const section = this.closest('section');
                if (section) {
                    openSection(section);
                    updateURL(section.id);
                }
            });
        });
    }


    function openSection(targetSection) {

        sections.forEach(function(section) {
            section.classList.remove('visible');
        });
        

        targetSection.classList.add('visible');
    }


    function updateURL(sectionId) {
        history.pushState(sectionId, null, '#' + sectionId);
    }

  
    function getCurrentIndex() {
        const current = sectionsArray.findIndex(function(section) {
            return section.classList.contains('visible');
        });
        return current === -1 ? 0 : current;
    }


    function goToRelativeSection(direction) {
        const currentIndex = getCurrentIndex();
        const nextIndex = currentIndex + direction;

        if (nextIndex < 0 || nextIndex >= sectionsArray.length) {
            return; 
        }

        const targetSection = sectionsArray[nextIndex];
        openSection(targetSection);
        updateURL(targetSection.id);
    }


    function lockScroll() {
        scrollLocked = true;
        setTimeout(function() {
            scrollLocked = false;
        }, SCROLL_LOCK_MS);
    }


    function isCvSectionVisible() {
        const cvSection = document.getElementById('cv');
        return !!(cvSection && cvSection.classList.contains('visible'));
    }


    function setupScrollNavigation() {
        let touchStartY = null;

        window.addEventListener('wheel', function(event) {
            if (!window.matchMedia(MOBILE_QUERY).matches) return;
            if (isCvSectionVisible()) return; 
            if (scrollLocked) {
                event.preventDefault();
                return;
            }

            event.preventDefault();
            const direction = event.deltaY > 0 ? 1 : -1;
            goToRelativeSection(direction);
            lockScroll();
        }, { passive: false });

        window.addEventListener('touchstart', function(event) {
            if (!window.matchMedia(MOBILE_QUERY).matches) return;
            touchStartY = event.touches[0].clientY;
        }, { passive: true });

        window.addEventListener('touchmove', function(event) {
            if (!window.matchMedia(MOBILE_QUERY).matches) return;
            if (isCvSectionVisible()) return; 
            event.preventDefault();
        }, { passive: false });

        window.addEventListener('touchend', function(event) {
            if (!window.matchMedia(MOBILE_QUERY).matches) return;
            if (isCvSectionVisible()) return; 
            if (touchStartY === null || scrollLocked) return;

            const touchEndY = event.changedTouches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            const SWIPE_THRESHOLD = 40; // pixels

            if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
                const direction = deltaY > 0 ? 1 : -1; 
                goToRelativeSection(direction);
                lockScroll();
            }

            touchStartY = null;
        }, { passive: true });
    }


    function handleInitialLoad() {
        const hash = window.location.hash;
        let targetSection;

        if (hash) {
            targetSection = document.querySelector(hash);
        }
        

        if (!targetSection) {
            targetSection = document.querySelector('#projet5');
        }
        
        if (targetSection) {
            openSection(targetSection);
        }
    }


    function setupPopstateHandler() {
        window.addEventListener('popstate', function(event) {
            const sectionId = event.state;
            let targetSection;
            
            if (sectionId) {
                targetSection = document.querySelector('#' + sectionId);
            }
            
  
            if (!targetSection) {
                targetSection = document.querySelector('#projet5');
            }
            
            if (targetSection) {
                openSection(targetSection);
            }
        });
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();