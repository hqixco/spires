import '../scss/main.scss';
import { loadIncludes } from './modules/includes.js';
import { initMenu } from './modules/menu.js';
import { initFaq } from './modules/faq.js';
import { initSliders } from './modules/sliders.js';

const siteLogo = new URL('../images/spires-logo.svg', import.meta.url).href;
const homeTechBackground = new URL('../images/home-tech-visual-bg.jpg', import.meta.url).href;
const homeCompanyBackground = new URL('../images/home-company-visual-bg.jpg', import.meta.url).href;
const homeProjectsImage = new URL('../images/home-projects-image.jpg', import.meta.url).href;
const pageHeroBackground = new URL('../images/page-hero-bg.jpg', import.meta.url).href;
const technologyStepVisualImage = new URL('../images/technology-step-visual-image.jpg', import.meta.url).href;
const solutionDetailBenefitsImage = new URL('../images/solution-detail-benefits-image.jpg', import.meta.url).href;
const solutionDetailAudiencePhoto = new URL('../images/solution-detail-audience-photo.jpg', import.meta.url).href;
const googleIcon = new URL('../images/google-icon.svg', import.meta.url).href;
const phoneIcon = new URL('../images/phone-icon.svg', import.meta.url).href;
const mailIcon = new URL('../images/mail-icon.svg', import.meta.url).href;
const telegramIcon = new URL('../images/telegram-icon.svg', import.meta.url).href;
const whatsappIcon = new URL('../images/whatsapp-icon.svg', import.meta.url).href;
const developerIcon = new URL('../images/developer-icon.svg', import.meta.url).href;
const technologyStripImage = new URL('../images/technology-strip-image.jpg', import.meta.url).href;
const technologyProductImage = new URL('../images/technology-product-card-image.jpg', import.meta.url).href;
const technologyCertificateImage = new URL('../images/technology-certificate.jpg', import.meta.url).href;

async function bootstrap() {
  await loadIncludes();
  const siteHeader = document.querySelector('.site-header');
  let headerRaf = 0;

  const updateHeaderState = () => {
    if (!siteHeader) return;
    siteHeader.classList.toggle('is-condensed', window.scrollY > 0);
  };

  updateHeaderState();

  window.addEventListener('scroll', () => {
    if (headerRaf) return;

    headerRaf = window.requestAnimationFrame(() => {
      headerRaf = 0;
      updateHeaderState();
    });
  }, { passive: true });

  document.querySelectorAll('[data-site-logo]').forEach((logo) => {
    logo.src = siteLogo;
  });
  document.querySelectorAll('[data-home-tech-bg]').forEach((image) => {
    image.src = homeTechBackground;
  });
  document.querySelectorAll('[data-home-company-bg]').forEach((image) => {
    if (image instanceof HTMLImageElement) {
      image.src = homeCompanyBackground;
      return;
    }

    image.style.setProperty('--home-company-bg-image', `url("${homeCompanyBackground}")`);
  });
  document.querySelectorAll('[data-home-projects-image]').forEach((image) => {
    image.src = homeProjectsImage;
  });
  document.querySelectorAll('[data-page-hero-bg]').forEach((image) => {
    image.src = pageHeroBackground;
  });
  document.querySelectorAll('[data-technology-step-visual-image]').forEach((image) => {
    image.src = technologyStepVisualImage;
  });
  document.querySelectorAll('[data-solution-detail-benefits-image]').forEach((image) => {
    if (image instanceof HTMLImageElement) {
      image.src = solutionDetailBenefitsImage;
      return;
    }

    image.style.setProperty('--solution-detail-benefits-image', `url("${solutionDetailBenefitsImage}")`);
  });
  document.querySelectorAll('[data-solution-detail-audience-photo]').forEach((image) => {
    if (image instanceof HTMLImageElement) {
      image.src = solutionDetailAudiencePhoto;
      return;
    }

    image.style.setProperty('--solution-detail-audience-photo', `url("${solutionDetailAudiencePhoto}")`);
  });
  document.querySelectorAll('[data-solution-detail-audience-photo-alt]').forEach((image) => {
    if (image instanceof HTMLImageElement) {
      image.src = homeCompanyBackground;
      return;
    }

    image.style.setProperty('--solution-detail-audience-photo', `url("${homeCompanyBackground}")`);
  });
  document.querySelectorAll('[data-google-icon]').forEach((icon) => {
    icon.src = googleIcon;
  });
  document.querySelectorAll('[data-phone-icon]').forEach((icon) => {
    icon.src = phoneIcon;
  });
  document.querySelectorAll('[data-mail-icon]').forEach((icon) => {
    icon.src = mailIcon;
  });
  document.querySelectorAll('[data-telegram-icon]').forEach((icon) => {
    icon.src = telegramIcon;
  });
  document.querySelectorAll('[data-whatsapp-icon]').forEach((icon) => {
    icon.src = whatsappIcon;
  });
  document.querySelectorAll('[data-footer-dev-icon]').forEach((icon) => {
    icon.src = developerIcon;
  });
  document.querySelectorAll('[data-technology-strip-image]').forEach((image) => {
    image.src = technologyStripImage;
  });
  document.querySelectorAll('[data-technology-product-image]').forEach((image) => {
    image.src = technologyProductImage;
  });
  document.querySelectorAll('[data-technology-certificate-image]').forEach((image) => {
    image.src = technologyCertificateImage;
  });
  document.querySelectorAll('[data-lang-toggle]').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const isDeu = toggle.classList.toggle('is-deu');
      toggle.setAttribute('aria-pressed', String(isDeu));
    });
  });
  initMenu();
  initFaq();
  initSliders();
}

bootstrap();
