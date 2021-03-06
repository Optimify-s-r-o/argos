import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import login_cs from './translations/cs/login';
import nav_cs from './translations/cs/nav';
import calendar_cs from './translations/cs/calendar';
import job_forms_cs from './translations/cs/job-forms';
import capacity_forms_cs from './translations/cs/capacity-forms';
import phase_forms_cs from './translations/cs/phase-forms';
import document_forms_cs from './translations/cs/document-forms';
import message_box_cs from './translations/cs/message-box';
import plates_cs from './translations/cs/plates';
import settings_cs from './translations/cs/settings';
import warnings_cs from './translations/cs/warnings';

import login_en from './translations/en/login';
import nav_en from './translations/en/nav';
//import calendar_en from './translations/en/calendar';
import job_forms_en from './translations/en/job-forms';
//import capacity_forms_en from './translations/en/capacity-forms';
//import phase_forms_en from './translations/en/phase-forms';
//import document_forms_en from './translations/en/document-forms';

i18n.use(initReactI18next).init({
  lng: 'cs',
  debug: true,
  fallbackLng: 'en',
  interpolation: { escapeValue: false }, // React already does escaping
  resources: {
    cs: {
      login: login_cs,
      nav: nav_cs,
      calendar: calendar_cs,
      jobForms: job_forms_cs,
      capacityForms: capacity_forms_cs,
      phaseForms: phase_forms_cs,
      documentForms: document_forms_cs,
      messageBox: message_box_cs,
      plates: plates_cs,
      settings: settings_cs,
      warnings: warnings_cs,
    },
    en: {
      login: login_en,
      nav: nav_en,
      jobForms: job_forms_en,
    },
  },
});

export default i18n;
