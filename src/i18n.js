import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import job_forms_cs from './translations/cs/job-forms';
import nav_cs from './translations/cs/nav';
import job_forms_en from './translations/en/job-forms';

i18n
    .use(initReactI18next)
    .init({
        lng: 'cs',
        debug: true,
        fallbackLng: 'en',
        interpolation: { escapeValue: false },  // React already does escaping
        resources: {
            cs: {
                jobForms: job_forms_cs,
                nav: nav_cs,
            },
            en: {
                jobForms: job_forms_en,
            },
        },
    });

export default i18n;