import { z } from 'zod';

// Comprehensive blocklist of disposable / temporary email providers
const BLOCKED_EMAIL_DOMAINS = new Set([
  // YOPmail family
  'yopmail.com', 'yopmail.fr', 'cool.fr.nf', 'jetable.fr.nf', 'nospam.ze.tc',
  'nomail.xl.cx', 'mega.zik.dj', 'speed.1s.fr', 'courriel.fr.nf', 'moncourrier.fr.nf',
  'monemail.fr.nf', 'monmail.fr.nf',
  // Mailinator / Guerrilla
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.info', 'grr.la', 'guerrillamailblock.com',
  'spam4.me', 'trashmail.com', 'trashmail.me', 'trashmail.net', 'trashmail.org',
  'trashmail.io', 'trashmail.at', 'dispostable.com', 'discard.email',
  // 10 Minute Mail family
  '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minutemail.co.uk',
  '10minutemail.de', '10minutemail.ru', '10minemail.com', 'temp-mail.org',
  'temp-mail.ru', 'tempmail.com', 'tempmail.net', 'tempmail.org', 'tempmail.de',
  'tmpmail.net', 'tmpmail.org',
  // Sharklasers / Guerrilla aliases
  'sharklasers.com', 'guerrillamail.info', 'grr.la', 'guerrillamail.biz',
  'guerrillamail.de', 'guerrillamail.net', 'guerrillamail.org', 'spam4.me',
  // Throwaway / fake mail
  'throwam.com', 'throwam.net', 'fakeinbox.com', 'fakeinbox.net',
  'mailnull.com', 'mailnull.net', 'spamgourmet.com', 'spamgourmet.net',
  'spamgourmet.org', 'maildrop.cc', 'spambox.us', 'spamfree24.org',
  'spamhereplease.com', 'spamoff.de', 'wegwerfmail.de', 'wegwerfmail.net',
  'wegwerfmail.org', 'mailexpire.com', 'spamevader.com',
  // Misc popular disposable
  'mailnesia.com', 'mailnesia.net', 'mailnull.com', 'spamevader.com',
  'spambox.info', 'spambox.irishspringrealty.com', 'spambox.org',
  'spambox.us', 'spamcero.com', 'spamcon.org', 'spamcorptastic.com',
  'spamcowboy.com', 'spamcowboy.net', 'spamcowboy.org', 'spamday.com',
  'maildrop.cc', 'mailnull.com', 'filzmail.com', 'mytemp.email',
  'getnada.com', 'tempr.email', 'discard.email', 'throwam.com',
  'mailnull.com', 'spamex.com', 'deadaddress.com', 'crapmail.org',
  'getairmail.com', 'tempinbox.com', 'jetable.com', 'spamgap.com',
  'nwldx.com', 'binkmail.com', 'bobmail.info', 'chammy.info',
  'devnullmail.com', 'haltospam.com', 'jetable.net', 'jetable.org',
  'mail-filter.com', 'mailblocks.com', 'mailscrap.com', 'mailsiphon.com',
  'mailzilla.com', 'mbx.cc', 'meltmail.com', 'mintemail.com',
  'mt2009.com', 'mx0.wwwnew.eu', 'mycleaninbox.net', 'nospamfor.us',
  'nospamthanks.info', 'notmailinator.com', 'obobbo.com', 'odaymail.com',
  'oneoffmail.com', 'ordinaryamerican.net', 'pcusers.otherinbox.com',
  'pookmail.com', 'proxymail.eu', 'rcpt.at', 'rejectmail.com', 'rklips.com',
  'rmqkr.net', 's0ny.net', 'safe-mail.net', 'safetymail.info', 'safetypost.de',
  'sendspamhere.com', 'shieldedmail.com', 'shhmail.com', 'shortmail.net',
  'sneakemail.com', 'sofimail.com', 'sogetthis.com', 'spam.la',
  'spamavert.com', 'spambob.com', 'spambob.net', 'spambob.org',
  'tempinbox.co.uk', 'trashdevil.com', 'trashdevil.de', 'trbvm.com',
  'turual.com', 'twinmail.de', 'tyttuy.com', 'uggsrock.com', 'uroid.com',
  'veryrealemail.com', 'viditag.com', 'vomoto.com', 'votiputox.org',
  'vpn.st', 'vsimcard.com', 'vubby.com', 'wasteland.rfc822.org', 'webm4il.info',
  'weg-werf-email.de', 'wetrainbayarea.org', 'whyspam.me', 'willhackforfood.biz',
  'wilemail.com', 'wollan.info', 'wronghead.com', 'wuzupmail.net', 'xagloo.com',
  'xemaps.com', 'xents.com', 'xmaily.com', 'xoxy.net', 'xyzfree.net',
  'yapped.net', 'yeah.net', 'yep.it', 'yodx.ro', 'yopmail.gq',
  'yourdomain.com', 'yuurok.com', 'zehnminuten.de', 'zehnminutenmail.de',
  'zetmail.com', 'zippymail.info', 'zoemail.net', 'zoemail.org',
  'zomg.info', 'zwwnhcac.com',
  // Inboxkitten / Nada
  'nada.email', 'inboxkitten.com', 'throwam.com', 'incognitomail.com',
  'bspamfree.org', 'owlpic.com',
]);

const isDisposableEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return BLOCKED_EMAIL_DOMAINS.has(domain);
};

const emailValidation = z
  .string()
  .min(1, { message: 'Email address is required' })
  .email({ message: 'Please enter a valid email address' })
  .refine((email) => !isDisposableEmail(email), {
    message: 'Temporary or disposable email addresses are not allowed. Please use a real email address.',
  });

// ── Login Schema ──────────────────────────────────────────────
export const loginSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ── Sign Up Schema ────────────────────────────────────────────
export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: 'Full name must be at least 2 characters' }),
    email: emailValidation,
    phone: z
      .string()
      .min(10, { message: 'Phone number must be at least 10 digits' })
      .regex(/^[+0-9\s-]{10,15}$/, { message: 'Please enter a valid phone number' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the Terms of Service and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
