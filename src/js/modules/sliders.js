const pageHeroImages = {
  'page-hero-bg': new URL('../../images/page-hero-bg.jpg', import.meta.url).href,
  'home-tech-visual-bg': new URL('../../images/home-tech-visual-bg.jpg', import.meta.url).href,
  'home-company-visual-bg': new URL('../../images/home-company-visual-bg.jpg', import.meta.url).href,
};

export function initSliders() {
  document.querySelectorAll('[data-solution-detail-audience-slider]').forEach((slider) => {
    const media = slider.closest('.solution-detail-audience__media');
    const track = slider.querySelector('[data-solution-detail-audience-track]');
    const slides = Array.from(slider.querySelectorAll('.solution-detail-audience__slide'));
    const controls = Array.from(media?.querySelectorAll('[data-solution-detail-audience-control]') || []);
    const controlsWrap = media?.querySelector('.solution-detail-audience__controls');
    const captionTarget = media?.querySelector('[data-solution-detail-audience-caption-target]');

    if (!track || slides.length < 2) return;

    let resizeRaf = 0;
    let isDragging = false;
    let hasDragged = false;
    let dragStartX = 0;
    let dragOffset = 0;
    let activePointerId = null;
    let suppressClick = false;
    let currentIndex = 0;

    const getMaxIndex = () => Math.max(0, slides.length - 1);

    const clampIndex = (index) => Math.max(0, Math.min(getMaxIndex(), index));

    const applyTransform = (index, { animate = true, offset = 0 } = {}) => {
      const slide = slides[clampIndex(index)];
      if (!slide) return;

      track.style.transition = animate ? '' : 'none';
      track.style.transform = `translate3d(${-(slide.offsetLeft) + offset}px, 0, 0)`;
    };

    const updateState = () => {
      const canScroll = getMaxIndex() > 0;

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
        slide.toggleAttribute('inert', !isActive);
      });

      if (captionTarget) {
        captionTarget.textContent = slides[currentIndex]?.dataset.caption || '';
      }

      controls.forEach((control, controlIndex) => {
        const isActive = controlIndex === currentIndex;
        const isDisabled = controlIndex === 0
          ? currentIndex <= 0
          : currentIndex >= getMaxIndex();

        control.classList.toggle('is-active', !isDisabled);
        control.classList.toggle('is-disabled', isDisabled);
        control.setAttribute('aria-pressed', String(isActive));
        control.disabled = isDisabled || !canScroll;
      });
    };

    const snapToIndex = (index, animate = true) => {
      currentIndex = clampIndex(index);
      dragOffset = 0;
      applyTransform(currentIndex, { animate });
      updateState();
    };

    const stopDragging = () => {
      if (!isDragging) return;

      isDragging = false;
      activePointerId = null;
      track.classList.remove('is-dragging');

      if (hasDragged) {
        suppressClick = true;
        window.setTimeout(() => {
          suppressClick = false;
        }, 0);
      }

      const slide = slides[clampIndex(currentIndex)];
      const slideWidth = slide?.clientWidth || track.clientWidth || 0;
      const threshold = Math.min(80, Math.max(28, slideWidth * 0.2));
      const nextIndex = dragOffset < -threshold ? currentIndex + 1 : dragOffset > threshold ? currentIndex - 1 : currentIndex;

      snapToIndex(nextIndex, true);
      hasDragged = false;
      dragOffset = 0;
    };

    track.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;

      isDragging = true;
      hasDragged = false;
      dragStartX = event.clientX;
      dragOffset = 0;
      activePointerId = event.pointerId;
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    track.addEventListener('pointermove', (event) => {
      if (!isDragging || event.pointerId !== activePointerId) return;

      const deltaX = event.clientX - dragStartX;
      if (Math.abs(deltaX) > 4) {
        hasDragged = true;
      }

      dragOffset = deltaX;
      applyTransform(currentIndex, { animate: false, offset: deltaX });

      if (hasDragged) {
        event.preventDefault();
      }
    });

    track.addEventListener('pointerup', stopDragging);
    track.addEventListener('pointercancel', stopDragging);
    track.addEventListener('lostpointercapture', stopDragging);
    track.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });
    track.addEventListener('click', (event) => {
      if (!suppressClick) return;

      event.preventDefault();
      event.stopPropagation();
    }, true);

    controls.forEach((control, controlIndex) => {
      control.addEventListener('click', () => {
        snapToIndex(controlIndex, true);
      });
    });

    controlsWrap?.addEventListener('click', (event) => {
      const control = event.target.closest('[data-solution-detail-audience-control]');
      if (!control) return;

      const controlIndex = controls.indexOf(control);
      if (controlIndex === -1) return;

      event.preventDefault();
      snapToIndex(controlIndex, true);
    });

    window.addEventListener('resize', () => {
      if (resizeRaf) return;

      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0;
        snapToIndex(currentIndex, false);
      });
    });

    snapToIndex(0, false);
    return;
  });

  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const track = slider.querySelector('[data-slider-track]');
    if (!track) return;

    if (track.classList.contains('technology-page__strip')) {
      const motion = track.querySelector('[data-slider-track-inner]') || track;
      const slides = Array.from(motion.children);
      if (slides.length < 2) return;

      let isDragging = false;
      let hasDragged = false;
      let dragStartX = 0;
      let dragOffset = 0;
      let activePointerId = null;
      let suppressClick = false;
      let currentIndex = 0;

      const getGap = () => {
        const styles = window.getComputedStyle(motion);
        const gap = styles.columnGap || styles.gap || '0';
        const value = Number.parseFloat(gap);
        return Number.isFinite(value) ? value : 0;
      };

      const getStep = () => {
        const firstSlide = slides[0];
        if (!firstSlide) return track.clientWidth || 0;
        return firstSlide.clientWidth + getGap();
      };

      const getBaseOffset = () => {
        const firstSlide = slides[0];
        return firstSlide?.offsetLeft || 0;
      };

      const clampIndex = (index) => Math.max(0, Math.min(slides.length - 1, index));

      const applyTransform = (index, { animate = true, offset = 0 } = {}) => {
        const slide = slides[clampIndex(index)];
        if (!slide) return;

        motion.style.transition = animate ? '' : 'none';
        motion.style.transform = `translate3d(${getBaseOffset() - slide.offsetLeft + offset}px, 0, 0)`;
      };

      const snapToIndex = (index, animate = true) => {
        currentIndex = clampIndex(index);
        dragOffset = 0;
        applyTransform(currentIndex, { animate });
      };

      const stopDragging = () => {
        if (!isDragging) return;

        isDragging = false;
        activePointerId = null;
        motion.classList.remove('is-dragging');

        if (hasDragged) {
          suppressClick = true;
          window.setTimeout(() => {
            suppressClick = false;
          }, 0);
        }

        const step = getStep();
        const threshold = Math.min(40, Math.max(20, step * 0.05));
        const nextIndex = dragOffset < -threshold ? currentIndex + 1 : dragOffset > threshold ? currentIndex - 1 : currentIndex;

        snapToIndex(nextIndex, true);
        hasDragged = false;
        dragOffset = 0;
      };

      motion.addEventListener('pointerdown', (event) => {
        if (event.button !== 0 && event.pointerType === 'mouse') return;

        isDragging = true;
        hasDragged = false;
        dragStartX = event.clientX;
        dragOffset = 0;
        activePointerId = event.pointerId;
        motion.classList.add('is-dragging');
        motion.setPointerCapture(event.pointerId);
        applyTransform(currentIndex, { animate: false, offset: 0 });
        event.preventDefault();
      });

      motion.addEventListener('pointermove', (event) => {
        if (!isDragging || event.pointerId !== activePointerId) return;

        const deltaX = event.clientX - dragStartX;
        if (Math.abs(deltaX) > 4) {
          hasDragged = true;
        }

        dragOffset = deltaX;
        applyTransform(currentIndex, { animate: false, offset: deltaX });

        if (hasDragged) {
          event.preventDefault();
        }
      });

      motion.addEventListener('pointerup', stopDragging);
      motion.addEventListener('pointercancel', stopDragging);
      motion.addEventListener('lostpointercapture', stopDragging);
      motion.addEventListener('dragstart', (event) => {
        event.preventDefault();
      });
      motion.addEventListener('click', (event) => {
        if (!suppressClick) return;

        event.preventDefault();
        event.stopPropagation();
      }, true);

      snapToIndex(0, false);
      return;
    }

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const stopDragging = () => {
      isDragging = false;
      track.classList.remove('is-dragging');
    };

    track.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;

      isDragging = true;
      startX = event.clientX;
      startScrollLeft = track.scrollLeft;
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    track.addEventListener('pointermove', (event) => {
      if (!isDragging) return;

      const deltaX = event.clientX - startX;
      track.scrollLeft = startScrollLeft - deltaX;
    });

    track.addEventListener('pointerup', stopDragging);
    track.addEventListener('pointercancel', stopDragging);
    track.addEventListener('lostpointercapture', stopDragging);
    track.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });
  });

  document.querySelectorAll('[data-home-projects-slider]').forEach((slider) => {
    const track = slider.querySelector('[data-home-projects-track]');
    const slides = Array.from(slider.querySelectorAll('[data-home-projects-slide]'));
    const prevButtons = Array.from(slider.querySelectorAll('[data-home-projects-prev]'));
    const nextButtons = Array.from(slider.querySelectorAll('[data-home-projects-next]'));

    if (!track || slides.length < 2) return;

    let resizeRaf = 0;
    let isDragging = false;
    let hasDragged = false;
    let dragStartX = 0;
    let dragOffset = 0;
    let activePointerId = null;
    let suppressClick = false;
    let currentIndex = 0;

    const getMaxIndex = () => Math.max(0, slides.length - 1);

    const clampIndex = (index) => Math.max(0, Math.min(getMaxIndex(), index));

    const applyTransform = (index, { animate = true, offset = 0 } = {}) => {
      const slide = slides[clampIndex(index)];
      if (!slide) return;

      track.style.transition = animate ? '' : 'none';
      track.style.transform = `translate3d(${-(slide.offsetLeft) + offset}px, 0, 0)`;
    };

    const updateState = () => {
      const canScroll = getMaxIndex() > 0;

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
        slide.toggleAttribute('inert', !isActive);
      });

      prevButtons.forEach((button) => {
        button.classList.toggle('is-disabled', !canScroll || currentIndex <= 0);
      });

      nextButtons.forEach((button) => {
        button.classList.toggle('is-disabled', !canScroll || currentIndex >= getMaxIndex());
      });
    };

    const scrollByStep = (direction) => {
      snapToIndex(currentIndex + direction, true);
    };

    const snapToIndex = (index, animate = true) => {
      currentIndex = clampIndex(index);
      dragOffset = 0;
      applyTransform(currentIndex, { animate });
      updateState();
    };

    const stopDragging = () => {
      if (!isDragging) return;

      isDragging = false;
      activePointerId = null;
      track.classList.remove('is-dragging');

      if (hasDragged) {
        suppressClick = true;
        window.setTimeout(() => {
          suppressClick = false;
        }, 0);
      }

      const slide = slides[clampIndex(currentIndex)];
      const slideWidth = slide?.clientWidth || track.clientWidth || 0;
      const threshold = Math.min(80, Math.max(28, slideWidth * 0.2));
      const nextIndex = dragOffset < -threshold ? currentIndex + 1 : dragOffset > threshold ? currentIndex - 1 : currentIndex;

      snapToIndex(nextIndex, true);
      hasDragged = false;
      dragOffset = 0;
    };

    track.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;

      isDragging = true;
      hasDragged = false;
      dragStartX = event.clientX;
      dragOffset = 0;
      activePointerId = event.pointerId;
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
    });

    track.addEventListener('pointermove', (event) => {
      if (!isDragging || event.pointerId !== activePointerId) return;

      const deltaX = event.clientX - dragStartX;
      if (Math.abs(deltaX) > 4) {
        hasDragged = true;
      }

      dragOffset = deltaX;
      applyTransform(currentIndex, { animate: false, offset: deltaX });

      if (hasDragged) {
        event.preventDefault();
      }
    });

    track.addEventListener('pointerup', stopDragging);
    track.addEventListener('pointercancel', stopDragging);
    track.addEventListener('lostpointercapture', stopDragging);

    track.addEventListener('click', (event) => {
      if (!suppressClick) return;

      event.preventDefault();
      event.stopPropagation();
    }, true);

    prevButtons.forEach((button) => {
      button.addEventListener('click', () => {
        scrollByStep(-1);
      });
    });

    nextButtons.forEach((button) => {
      button.addEventListener('click', () => {
        scrollByStep(1);
      });
    });

    window.addEventListener('resize', () => {
      if (resizeRaf) return;

      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0;
        snapToIndex(currentIndex, false);
      });
    });

    snapToIndex(0, false);
  });

  document.querySelectorAll('[data-technology-certificates-slider]').forEach((slider) => {
    const section = slider.closest('.technology-certificates');
    const track = slider.querySelector('[data-technology-certificates-track]');
    const slides = Array.from(slider.querySelectorAll('.technology-certificate'));
    const prevButtons = Array.from(section?.querySelectorAll('[data-technology-certificates-prev]') || []);
    const nextButtons = Array.from(section?.querySelectorAll('[data-technology-certificates-next]') || []);

    if (!track || slides.length < 2) return;

    let resizeRaf = 0;
    let isDragging = false;
    let hasDragged = false;
    let dragStartX = 0;
    let dragOffset = 0;
    let activePointerId = null;
    let suppressClick = false;
    let currentIndex = 0;

    const getGap = () => {
      const styles = window.getComputedStyle(track);
      const gap = styles.columnGap || styles.gap || '0';
      const value = Number.parseFloat(gap);
      return Number.isFinite(value) ? value : 0;
    };

    const getMaxIndex = () => Math.max(0, slides.length - 1);

    const clampIndex = (index) => Math.max(0, Math.min(getMaxIndex(), index));

    const applyTransform = (index, { animate = true, offset = 0 } = {}) => {
      const slide = slides[clampIndex(index)];
      if (!slide) return;

      track.style.transition = animate ? '' : 'none';
      track.style.transform = `translate3d(${-(slide.offsetLeft) + offset}px, 0, 0)`;
    };

    const updateState = () => {
      const canScroll = getMaxIndex() > 0;

      prevButtons.forEach((button) => {
        button.classList.toggle('is-disabled', !canScroll || currentIndex <= 0);
      });

      nextButtons.forEach((button) => {
        button.classList.toggle('is-disabled', !canScroll || currentIndex >= getMaxIndex());
      });
    };

    const scrollByStep = (direction) => {
      snapToIndex(currentIndex + direction, true);
    };

    const snapToIndex = (index, animate = true) => {
      currentIndex = clampIndex(index);
      dragOffset = 0;
      applyTransform(currentIndex, { animate });
      updateState();
    };

    const stopDragging = () => {
      if (!isDragging) return;

      isDragging = false;
      activePointerId = null;
      track.classList.remove('is-dragging');

      if (hasDragged) {
        suppressClick = true;
        window.setTimeout(() => {
          suppressClick = false;
        }, 0);
      }

      const slide = slides[clampIndex(currentIndex)];
      const slideWidth = slide?.clientWidth || track.clientWidth || 0;
      const threshold = Math.min(80, Math.max(28, slideWidth * 0.2));
      const nextIndex = dragOffset < -threshold ? currentIndex + 1 : dragOffset > threshold ? currentIndex - 1 : currentIndex;

      snapToIndex(nextIndex, true);
      hasDragged = false;
      dragOffset = 0;
    };

    track.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;

      isDragging = true;
      hasDragged = false;
      dragStartX = event.clientX;
      dragOffset = 0;
      activePointerId = event.pointerId;
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    track.addEventListener('pointermove', (event) => {
      if (!isDragging || event.pointerId !== activePointerId) return;

      const deltaX = event.clientX - dragStartX;
      if (Math.abs(deltaX) > 4) {
        hasDragged = true;
      }

      dragOffset = deltaX;
      applyTransform(currentIndex, { animate: false, offset: deltaX });

      if (hasDragged) {
        event.preventDefault();
      }
    });

    track.addEventListener('pointerup', stopDragging);
    track.addEventListener('pointercancel', stopDragging);
    track.addEventListener('lostpointercapture', stopDragging);
    track.addEventListener('dragstart', (event) => {
      event.preventDefault();
    });
    track.addEventListener('click', (event) => {
      if (!suppressClick) return;

      event.preventDefault();
      event.stopPropagation();
    }, true);

    prevButtons.forEach((button) => {
      button.addEventListener('click', () => {
        scrollByStep(-1);
      });
    });

    nextButtons.forEach((button) => {
      button.addEventListener('click', () => {
        scrollByStep(1);
      });
    });

    window.addEventListener('resize', () => {
      if (resizeRaf) return;

      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0;
        snapToIndex(currentIndex, false);
      });
    });

    snapToIndex(0, false);
  });

  document.querySelectorAll('[data-home-reviews-slider]').forEach((slider) => {
    const section = slider.closest('.home-reviews');
    const track = slider.querySelector('[data-home-reviews-track]');
    const slides = Array.from(slider.querySelectorAll('[data-home-reviews-slide]'));
    const prevButton = section?.querySelector('[data-home-reviews-prev]');
    const nextButton = section?.querySelector('[data-home-reviews-next]');

    if (!track || !prevButton || !nextButton) return;

    let resizeRaf = 0;
    let isDragging = false;
    let hasDragged = false;
    let dragStartX = 0;
    let dragOffset = 0;
    let activePointerId = null;
    let suppressClick = false;
    let currentIndex = 0;

    const getGap = () => {
      const styles = window.getComputedStyle(track);
      const gap = styles.columnGap || styles.gap || '0';
      const value = Number.parseFloat(gap);
      return Number.isFinite(value) ? value : 0;
    };

    const getStep = () => {
      const firstSlide = slides[0];
      if (!firstSlide) return track.clientWidth || 0;
      return firstSlide.clientWidth + getGap();
    };

    const getColumns = () => {
      const styles = window.getComputedStyle(track);
      const value = Number.parseInt(styles.getPropertyValue('--home-reviews-columns'), 10);
      return Number.isFinite(value) && value > 0 ? value : 1;
    };

    const getMaxIndex = () => Math.max(0, slides.length - getColumns());

    const clampIndex = (index) => Math.max(0, Math.min(getMaxIndex(), index));

    const applyTransform = (index, { animate = true, offset = 0 } = {}) => {
      const step = getStep();
      if (!step) return;

      track.style.transition = animate ? '' : 'none';
      track.style.transform = `translate3d(${-(index * step) + offset}px, 0, 0)`;
    };

    const updateControls = () => {
      const maxIndex = getMaxIndex();
      const canScroll = maxIndex > 0;

      prevButton.classList.toggle('is-disabled', !canScroll || currentIndex <= 0);
      nextButton.classList.toggle('is-disabled', !canScroll || currentIndex >= maxIndex);
    };

    const scrollByStep = (direction) => {
      snapToIndex(currentIndex + direction, true);
    };

    const snapToIndex = (index, animate = true) => {
      currentIndex = clampIndex(index);
      dragOffset = 0;
      applyTransform(currentIndex, { animate });
      updateControls();
    };

    const stopDragging = () => {
      if (!isDragging) return;

      isDragging = false;
      activePointerId = null;
      track.classList.remove('is-dragging');

      if (hasDragged) {
        suppressClick = true;
        window.setTimeout(() => {
          suppressClick = false;
        }, 0);
      }

      const step = getStep();
      const threshold = Math.min(80, Math.max(28, step * 0.2));
      const nextIndex = dragOffset < -threshold ? currentIndex + 1 : dragOffset > threshold ? currentIndex - 1 : currentIndex;

      snapToIndex(nextIndex, true);
      hasDragged = false;
      dragOffset = 0;
    };

    track.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;

      isDragging = true;
      hasDragged = false;
      dragStartX = event.clientX;
      dragOffset = 0;
      activePointerId = event.pointerId;
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
      applyTransform(currentIndex, { animate: false, offset: 0 });
      event.preventDefault();
    });

    track.addEventListener('pointermove', (event) => {
      if (!isDragging || event.pointerId !== activePointerId) return;

      const deltaX = event.clientX - dragStartX;
      if (Math.abs(deltaX) > 4) {
        hasDragged = true;
      }

      dragOffset = deltaX;
      applyTransform(currentIndex, { animate: false, offset: deltaX });

      if (hasDragged) {
        event.preventDefault();
      }
    });

    track.addEventListener('pointerup', stopDragging);
    track.addEventListener('pointercancel', stopDragging);
    track.addEventListener('lostpointercapture', stopDragging);

    track.addEventListener('click', (event) => {
      if (!suppressClick) return;

      event.preventDefault();
      event.stopPropagation();
    }, true);

    prevButton.addEventListener('click', () => {
      scrollByStep(-1);
    });

    nextButton.addEventListener('click', () => {
      scrollByStep(1);
    });

    track.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', () => {
      if (resizeRaf) return;

      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0;
        snapToIndex(currentIndex, false);
      });
    });

    snapToIndex(0, false);
  });

  document.querySelectorAll('[data-page-hero]').forEach((hero) => {
    const slides = Array.from(hero.querySelectorAll('[data-page-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-page-hero-dot]'));

    if (!slides.length || slides.length !== dots.length) return;

    hero.querySelectorAll('[data-page-hero-slide-image]').forEach((image) => {
      const imageKey = image.getAttribute('data-page-hero-slide-src');
      if (!imageKey || !pageHeroImages[imageKey]) return;
      image.src = pageHeroImages[imageKey];
    });

    const slidesTrack = hero.querySelector('[data-page-hero-slides]');
    let isDragging = false;
    let hasDragged = false;
    let startX = 0;
    let startY = 0;
    let dragOffset = 0;
    let baseIndex = 0;
    let activeIndex = 0;
    let resizeRaf = 0;

    const getTrackWidth = () => slidesTrack?.clientWidth || 0;

    const applyTrackTransform = (index, offset = 0, animate = true) => {
      if (!slidesTrack) return;

      const width = getTrackWidth();
      if (!width) return;

      slidesTrack.style.transition = animate ? '' : 'none';
      slidesTrack.style.transform = `translate3d(${-(index * width) + offset}px, 0, 0)`;
    };

    const applyActiveSlide = (index, { scroll = false } = {}) => {
      const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
      activeIndex = nextIndex;
      baseIndex = nextIndex;
      dragOffset = 0;

      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === nextIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
        slide.toggleAttribute('inert', !isActive);
      });

      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === nextIndex;
        dot.classList.toggle('page-hero__dot--active', isActive);
        if (isActive) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });

      if (slidesTrack) {
        applyTrackTransform(nextIndex, 0, scroll);
      }
    };

    if (slidesTrack) {
      const stopDragging = () => {
        if (!isDragging) return;

        isDragging = false;
        slidesTrack.classList.remove('is-dragging');
        slidesTrack.style.transition = '';

        const width = getTrackWidth();
        if (!width) return;

        const nextIndex = Math.max(
          0,
          Math.min(slides.length - 1, baseIndex - Math.round(dragOffset / width)),
        );
        applyActiveSlide(nextIndex, { scroll: true });
      };

      slidesTrack.addEventListener('pointerdown', (event) => {
        if (event.button !== 0 && event.pointerType === 'mouse') return;

        isDragging = true;
        hasDragged = false;
        baseIndex = activeIndex;
        startX = event.clientX;
        startY = event.clientY;
        dragOffset = 0;
        slidesTrack.classList.add('is-dragging');
        slidesTrack.style.transition = 'none';
        slidesTrack.setPointerCapture(event.pointerId);
      });

      slidesTrack.addEventListener('pointermove', (event) => {
        if (!isDragging) return;

        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        if (!hasDragged && Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) return;

        hasDragged = true;
        event.preventDefault();
        dragOffset = deltaX;
        applyTrackTransform(baseIndex, dragOffset, false);
      });

      slidesTrack.addEventListener('pointerup', stopDragging);
      slidesTrack.addEventListener('pointercancel', stopDragging);
      slidesTrack.addEventListener('lostpointercapture', stopDragging);

      slidesTrack.addEventListener('click', (event) => {
        if (!hasDragged) return;
        event.preventDefault();
      }, true);
    }

    applyActiveSlide(0);

    window.addEventListener('resize', () => {
      if (!slidesTrack) return;

      if (resizeRaf) return;
      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0;
        applyTrackTransform(activeIndex, 0, false);
      });
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        applyActiveSlide(index, { scroll: true });
      });
    });

    dots.forEach((dot) => {
      dot.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

        event.preventDefault();

        const activeIndex = dots.findIndex((item) => item.classList.contains('page-hero__dot--active'));
        if (activeIndex === -1) return;

        const direction = event.key === 'ArrowLeft' ? -1 : 1;
        const nextIndex = (activeIndex + direction + dots.length) % dots.length;
        applyActiveSlide(nextIndex, { scroll: true });
        dots[nextIndex].focus();
      });
    });
  });
}
