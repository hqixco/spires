export function initFaq() {
  document.querySelectorAll('.faq').forEach((faq) => {
    const items = [...faq.querySelectorAll('details')];
    let resizeRaf = 0;

    const syncHeights = () => {
      items.forEach((item) => {
        const content = item.querySelector('p');
        if (!content) return;

        item.style.setProperty('--faq-content-height', `${content.scrollHeight}px`);
      });
    };

    items.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
        syncHeights();
      });
    });

    window.addEventListener('resize', () => {
      if (resizeRaf) return;

      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0;
        syncHeights();
      });
    });

    syncHeights();
  });
}
