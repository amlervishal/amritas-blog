export const SITE_URL = 'https://www.pindropsilence.in'
export const SITE_NAME = 'Pin Drop Silence'
export const AUTHOR_NAME = 'Dr. Amrita Vohra'
export const SITE_DESCRIPTION =
  'Insightful blogs and thoughts by Dr. Amrita Vohra on education, life, relationships and personal growth.'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/default-image.png`
export const REVALIDATE_SECONDS = 300

// Emails allowed to see Create / Edit links (client UI only; Firestore rules are the real gate)
export const ALLOWED_EDITOR_EMAILS = ['amlervishal@gmail.com', 'dramritavohra@gmail.com']
export const isAllowedToEdit = (email) => ALLOWED_EDITOR_EMAILS.includes(email)
