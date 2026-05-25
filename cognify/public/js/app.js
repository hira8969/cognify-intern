import { initAnimations, refreshRevealAnimations } from './animations.js';
import { createToastService } from './components/toast.js';
import { createDashboardPage } from './pages/dashboard.js';
import { createRegistrationValidator } from './validation.js';
import { createRouter } from './router.js';

const app = {
  init() {
    this.cacheElements();
    this.bindGlobalEvents();
    initAnimations();

    if (!this.elements.registrationForm || !this.elements.toastRegion) {
      refreshRevealAnimations();
      return;
    }

    this.notifier = createToastService(this.elements.toastRegion);
    this.router = createRouter();
    this.validator = createRegistrationValidator(this.elements.registrationForm);
    this.dashboard = createDashboardPage({ notifier: this.notifier });

    this.bindEvents();
    this.router.init();
    this.dashboard.loadStudents();
    refreshRevealAnimations();
  },

  cacheElements() {
    this.elements = {
      registrationForm: document.getElementById('registrationForm'),
      submitButton: document.querySelector('[data-submit-button]'),
      submitLabel: document.querySelector('[data-submit-label]'),
      toastRegion: document.getElementById('toastRegion')
    };
  },

  bindEvents() {
    this.elements.registrationForm.addEventListener('submit', (event) => this.handleSubmit(event));
  },

  bindGlobalEvents() {
    window.addEventListener('scroll', () => {
      document.querySelector('[data-app-navbar]')?.classList.toggle('is-scrolled', window.scrollY > 12);
    }, { passive: true });
  },

  async handleSubmit(event) {
    event.preventDefault();

    if (!this.validator.validateAll()) {
      this.showInvalidFormFeedback();
      return;
    }

    this.setLoading(true);

    try {
      const studentData = this.validator.getStudentData();
      await this.dashboard.addStudent(studentData);
      this.validator.resetForm();
      this.router.navigate('dashboard');
    } catch (error) {
      this.validator.applyServerErrors(error.errors);
      this.notifier.notify({
        type: 'error',
        title: error.status === 422 ? 'Validation failed' : 'API error',
        message: error.message || 'Unable to save student.'
      });
    } finally {
      this.setLoading(false);
    }
  },

  showInvalidFormFeedback() {
    this.elements.registrationForm.classList.remove('shake');
    void this.elements.registrationForm.offsetWidth;
    this.elements.registrationForm.classList.add('shake');
    this.notifier.notify({
      type: 'error',
      title: 'Validation failed',
      message: 'Please fix the highlighted fields before submitting.'
    });
  },

  setLoading(isLoading) {
    const icon = this.elements.submitButton.querySelector('i');

    this.elements.submitButton.classList.toggle('is-loading', isLoading);
    this.elements.submitButton.disabled = isLoading;
    icon.className = isLoading ? 'fa-solid fa-spinner' : 'fa-solid fa-paper-plane';
    this.elements.submitLabel.textContent = isLoading ? 'Saving...' : 'Submit Registration';
  }
};

document.addEventListener('DOMContentLoaded', () => app.init());
