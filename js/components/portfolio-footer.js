(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initPortfolioFooter);

  function initPortfolioFooter() {
    const footer = document.getElementById('portfolioFooter');
    if (!footer) return;

    const privacyToggle = document.getElementById('privacyToggle');
    const eyeOpen = privacyToggle ? privacyToggle.querySelector('.eye-open') : null;
    const eyeClosed = privacyToggle ? privacyToggle.querySelector('.eye-closed') : null;
    let isHidden = false;

    // Privacy Mask Toggle
    if (privacyToggle) {
      privacyToggle.addEventListener('click', () => {
        isHidden = !isHidden;
        footer.classList.toggle('privacy-masked', isHidden);

        if (eyeOpen && eyeClosed) {
          eyeOpen.style.display = isHidden ? 'none' : 'block';
          eyeClosed.style.display = isHidden ? 'block' : 'none';
        }

        privacyToggle.setAttribute('aria-label', isHidden ? 'Mostrar valores' : 'Alternar visibilidade dos valores');
      });
    }

    // Tabs Switching and Sliding Indicator
    const tabButtons = footer.querySelectorAll('.tab-btn');
    const tabIndicator = document.getElementById('tabIndicator');
    const tabPanels = footer.querySelectorAll('.tab-panel');

    function updateIndicator(btn) {
      if (!tabIndicator || !btn) return;
      tabIndicator.style.width = `${btn.offsetWidth}px`;
      tabIndicator.style.transform = `translateX(${btn.offsetLeft - 3}px)`;
    }

    // Initialize indicator position
    const activeTab = footer.querySelector('.tab-btn.active');
    if (activeTab) {
      setTimeout(() => updateIndicator(activeTab), 50);
    }

    window.addEventListener('resize', () => {
      const currentActive = footer.querySelector('.tab-btn.active');
      if (currentActive) updateIndicator(currentActive);
    });

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        // Update tab buttons
        tabButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        updateIndicator(btn);

        // Switch panels
        tabPanels.forEach((panel) => {
          if (panel.id === `panel-${targetTab}`) {
            panel.style.display = 'block';
            panel.classList.add('active');
          } else {
            panel.style.display = 'none';
            panel.classList.remove('active');
          }
        });
      });
    });
  }
})();
