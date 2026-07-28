import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import * as dns from 'dns';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  public lastErrorDetails: string = '';

  constructor(private readonly configService: ConfigService) {
    this.initTransporter();
  }

  private async createTransporterForPort(targetPort: number): Promise<nodemailer.Transporter> {
    const rawHost = this.configService.get<string>('SMTP_HOST') || 'smtp.hostinger.com';
    const user = this.configService.get<string>('SMTP_EMAIL') || 'contact@kliamo.com';
    const pass = this.configService.get<string>('SMTP_PASSWORD') || 'Prosenjit2026@';

    let resolvedHost = rawHost;
    try {
      const ips = await dns.promises.resolve4(rawHost);
      if (ips && ips.length > 0) {
        resolvedHost = ips[0];
      }
    } catch (err) {
      this.logger.warn(`Could not resolve IPv4 for ${rawHost}: ${err}`);
    }

    return nodemailer.createTransport({
      host: resolvedHost,
      port: targetPort,
      secure: targetPort === 465,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false,
        servername: rawHost,
      },
    } as any);
  }

  private async initTransporter() {
    const user = this.configService.get<string>('SMTP_EMAIL') || 'contact@kliamo.com';
    const pass = this.configService.get<string>('SMTP_PASSWORD') || 'Prosenjit2026@';

    if (!user || !pass) {
      this.logger.warn('SMTP credentials missing. Email sending disabled.');
      return;
    }

    const host = this.configService.get<string>('SMTP_HOST') || 'smtp.hostinger.com';
    const port = Number(this.configService.get<number>('SMTP_PORT')) || 465;

    this.transporter = await this.createTransporterForPort(port);
    this.logger.log(`SMTP transporter initialized: ${host}:${port} (Resolved IPv4 forced)`);
  }

  private async sendMailWithFallback(mailOptions: nodemailer.SendMailOptions): Promise<boolean> {
    this.lastErrorDetails = '';

    // 1. Try Resend HTTP API if RESEND_API_KEY is configured
    const resendApiKey = (this.configService.get<string>('RESEND_API_KEY') || process.env.RESEND_API_KEY || '').trim();
    if (resendApiKey && resendApiKey !== 're_your_api_key_here') {
      try {
        const fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL') || process.env.RESEND_FROM_EMAIL || 'KLIAMO Fashion <onboarding@resend.dev>';
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to],
            subject: mailOptions.subject,
            html: mailOptions.html,
          }),
        });

        if (response.ok) {
          this.logger.log(`Email successfully sent via Resend API to ${mailOptions.to}`);
          this.lastErrorDetails = '';
          return true;
        } else {
          const resJson = await response.json().catch(() => ({}));
          const msg = resJson.message || response.statusText;
          this.logger.warn(`Resend API failed: ${msg}`);
          this.lastErrorDetails = `Resend API: ${msg}`;
        }
      } catch (err: any) {
        this.logger.warn(`Resend API fetch error: ${err?.message || err}`);
        this.lastErrorDetails = `Resend API: ${err?.message || err}`;
      }
    }

    // 2. Fall back to SMTP
    const user = this.configService.get<string>('SMTP_EMAIL') || 'contact@kliamo.com';
    const pass = this.configService.get<string>('SMTP_PASSWORD') || 'Prosenjit2026@';
    if (!user || !pass) {
      if (!this.lastErrorDetails) this.lastErrorDetails = 'SMTP transporter missing credentials';
      return false;
    }

    const primaryPort = Number(this.configService.get<number>('SMTP_PORT')) || 465;
    const fallbackPort = primaryPort === 465 ? 587 : 465;

    try {
      const primaryTransporter = await this.createTransporterForPort(primaryPort);
      await primaryTransporter.sendMail(mailOptions);
      this.transporter = primaryTransporter;
      this.lastErrorDetails = '';
      return true;
    } catch (primaryError: any) {
      const pMsg = primaryError?.message || String(primaryError);
      this.logger.warn(
        `Primary SMTP send failed on port ${primaryPort} (${pMsg}). Retrying on fallback port ${fallbackPort}...`,
      );
      try {
        const fallbackTransporter = await this.createTransporterForPort(fallbackPort);
        await fallbackTransporter.sendMail(mailOptions);
        this.logger.log(`Fallback SMTP send succeeded on port ${fallbackPort}! Updating active transporter.`);
        this.transporter = fallbackTransporter;
        this.lastErrorDetails = '';
        return true;
      } catch (fallbackError: any) {
        const fMsg = fallbackError?.message || String(fallbackError);
        this.logger.error(
          `Fallback SMTP send also failed on port ${fallbackPort}: ${fMsg}`,
          fallbackError?.stack,
        );
        const resendWarning = !resendApiKey || resendApiKey === 're_your_api_key_here' ? 'RESEND_API_KEY missing in Render environment variables. ' : '';
        this.lastErrorDetails = `${resendWarning}Primary port ${primaryPort}: ${pMsg} | Fallback port ${fallbackPort}: ${fMsg}`;
        return false;
      }
    }
  }

  private getLogoAttachments() {
    const possiblePaths = [
      path.resolve(process.cwd(), '../web/public/kliamologoNew.png'),
      path.resolve(process.cwd(), 'apps/web/public/kliamologoNew.png'),
      path.resolve(process.cwd(), 'public/kliamologoNew.png'),
      '/Users/user228/Desktop/Prosenjit Hazra/my-turborepo/apps/web/public/kliamologoNew.png',
    ];
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        return [
          {
            filename: 'kliamologoNew.png',
            path: p,
            cid: 'kliamologo@kliamo',
          },
        ];
      }
    }
    return [];
  }

  async sendWelcomeEmail(toEmail: string, userName: string): Promise<boolean> {
    if (!this.transporter) this.initTransporter();
    if (!this.transporter) return false;

    const fromEmail = this.configService.get<string>('SMTP_EMAIL') || 'contact@kliamo.com';
    const attachments = this.getLogoAttachments();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to KLIAMO</title>
      </head>
      <body style="margin: 0; padding: 20px 0; background-color: #FDFAF6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Header with Logo -->
          <div style="background-color: #FDFAF6; padding: 32px 24px; text-align: center; border-b: 1px solid #E8E2D6;">
            <img src="${attachments.length > 0 ? 'cid:kliamologo@kliamo' : 'https://kliamo.com/kliamologoNew.png'}" alt="KLIAMO Fashion" style="height: 52px; width: auto; max-width: 200px; display: inline-block; border: 0;" />
            <h1 style="color: #4A453E; margin: 16px 0 4px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Welcome to KLIAMO!</h1>
            <p style="color: #F9A37E; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Style That Defines You</p>
          </div>

          <!-- Body Content -->
          <div style="padding: 32px 28px; color: #4A453E; line-height: 1.6; font-size: 15px;">
            <p style="margin-top: 0; font-size: 16px;">Hi <strong>${userName}</strong>,</p>
            <p>Thank you for creating an account with <strong>KLIAMO</strong>! We're thrilled to welcome you to our exclusive fashion and custom print community.</p>
            <p>With your new account, you can now:</p>
            <ul style="padding-left: 20px; margin-bottom: 24px; color: #5C554C;">
              <li style="margin-bottom: 8px;">Design realistic custom T-shirts & Polo shirts in 3D</li>
              <li style="margin-bottom: 8px;">Save your favorite products to your wishlist</li>
              <li style="margin-bottom: 8px;">Track your live order shipments step-by-step</li>
            </ul>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0 24px 0;">
              <a href="https://kliamo.com" style="background-color: #F9A37E; color: #FFFFFF; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 800; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(249, 163, 126, 0.35);">Explore Collections</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #FDFAF6; padding: 20px 24px; text-align: center; border-top: 1px solid #E8E2D6; font-size: 12px; color: #7A736A;">
            <p style="margin: 0 0 6px 0; font-weight: 600;">Need assistance? We're here to help.</p>
            <p style="margin: 0;">Contact us anytime at <a href="mailto:contact@kliamo.com" style="color: #F9A37E; text-decoration: none; font-weight: bold;">contact@kliamo.com</a></p>
            <p style="margin: 12px 0 0 0; font-size: 11px; color: #A89B8A;">© ${new Date().getFullYear()} KLIAMO Fashion. All rights reserved.</p>
          </div>

        </div>
      </body>
      </html>
    `;

    const sent = await this.sendMailWithFallback({
      from: `"KLIAMO Fashion" <${fromEmail}>`,
      to: toEmail,
      subject: 'Welcome to KLIAMO Fashion!',
      html: htmlContent,
      attachments,
    });
    if (sent) {
      this.logger.log(`Welcome email successfully sent to ${toEmail}`);
    }
    return sent;
  }

  async sendOrderConfirmationEmail(order: any): Promise<boolean> {
    if (!this.transporter) this.initTransporter();
    if (!this.transporter) return false;

    const fromEmail = this.configService.get<string>('SMTP_EMAIL') || 'contact@kliamo.com';
    const attachments = this.getLogoAttachments();

    let itemsListHtml = '';
    let shippingAddressHtml = '';

    if (order.itemsJson) {
      try {
        const items = typeof order.itemsJson === 'string' ? JSON.parse(order.itemsJson) : order.itemsJson;
        
        // Extract shipping address if present on first item
        if (Array.isArray(items) && items[0]?.address) {
          const addr = items[0].address;
          shippingAddressHtml = `
            <div style="margin-top: 24px; background-color: #FDFAF6; border: 1px solid #E8E2D6; border-radius: 12px; padding: 16px 20px;">
              <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 800; color: #F9A37E; text-transform: uppercase; letter-spacing: 1px;">Shipping Destination</p>
              <p style="margin: 0; font-size: 14px; font-weight: 700; color: #2D2A26;">${addr.fullName || order.customer}</p>
              <p style="margin: 3px 0 0 0; font-size: 13px; color: #5C554C;">${addr.street || ''}${addr.city ? `, ${addr.city}` : ''}${addr.state ? `, ${addr.state}` : ''} ${addr.zip || ''}</p>
              ${addr.phone ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #7A736A;"><strong>Phone:</strong> ${addr.phone}</p>` : ''}
            </div>
          `;
        }

        if (Array.isArray(items)) {
          itemsListHtml = items.map((item: any) => `
            <tr style="border-bottom: 1px solid #F0ECE3;">
              <td style="padding: 14px 10px; font-size: 14px; color: #4A453E;">
                <strong style="color: #2D2A26; font-size: 14px; display: block;">${item.name || 'Custom Apparel'}</strong>
                <div style="font-size: 12px; color: #7A736A; margin-top: 3px;">
                  Size: <strong>${item.size || 'M'}</strong> &nbsp;·&nbsp; Color: <strong>${item.color || 'Standard'}</strong>
                  ${item.category ? ` &nbsp;·&nbsp; Category: <strong>${item.category}</strong>` : ''}
                </div>
              </td>
              <td style="padding: 14px 10px; font-size: 14px; color: #4A453E; text-align: center; font-weight: 700;">${item.quantity || 1}</td>
              <td style="padding: 14px 10px; font-size: 14px; color: #2D2A26; text-align: right; font-weight: 800;">₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</td>
            </tr>
          `).join('');
        }
      } catch (e) {
        itemsListHtml = `<tr><td colspan="3" style="padding: 14px 10px; font-size: 14px;">Total Items: ${order.items || 1}</td></tr>`;
      }
    }

    if (!shippingAddressHtml) {
      shippingAddressHtml = `
        <div style="margin-top: 24px; background-color: #FDFAF6; border: 1px solid #E8E2D6; border-radius: 12px; padding: 16px 20px;">
          <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 800; color: #F9A37E; text-transform: uppercase; letter-spacing: 1px;">Customer Details</p>
          <p style="margin: 0; font-size: 14px; font-weight: 700; color: #2D2A26;">${order.customer}</p>
          <p style="margin: 2px 0 0 0; font-size: 13px; color: #5C554C;">${order.email}</p>
        </div>
      `;
    }

    const subtotal = Number(order.total) / 1.18;
    const taxGst = Number(order.total) - subtotal;
    const orderDateFormatted = order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN'));

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation #${order.id}</title>
      </head>
      <body style="margin: 0; padding: 24px 0; background-color: #FDFAF6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Header Banner with Logo -->
          <div style="background-color: #FDFAF6; padding: 32px 24px; text-align: center; border-bottom: 1px solid #E8E2D6;">
            <img src="${attachments.length > 0 ? 'cid:kliamologo@kliamo' : 'https://kliamo.com/kliamologoNew.png'}" alt="KLIAMO Fashion" style="height: 54px; width: auto; max-width: 210px; display: inline-block; border: 0;" />
            <h1 style="color: #4A453E; margin: 16px 0 4px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Order Confirmation</h1>
            <p style="color: #F9A37E; font-weight: 700; font-size: 14px; margin: 0;">Order #${order.id} &nbsp;·&nbsp; ${orderDateFormatted}</p>
          </div>

          <!-- Body Content -->
          <div style="padding: 32px 28px; color: #4A453E; line-height: 1.6; font-size: 15px;">
            <p style="margin-top: 0; font-size: 16px;">Dear <strong>${order.customer}</strong>,</p>
            <p style="margin-bottom: 24px;">Thank you for your order! We've successfully received your payment and design details. Our production team is currently preparing your custom apparel.</p>
            
            <!-- Itemized Order Table -->
            <table style="width: 100%; border-collapse: collapse; margin: 0 0 20px 0;">
              <thead>
                <tr style="background-color: #FDFAF6; border-bottom: 2px solid #E8E2D6;">
                  <th style="padding: 12px 10px; text-align: left; font-size: 11px; color: #7A736A; text-transform: uppercase; letter-spacing: 0.5px;">Item & Specifications</th>
                  <th style="padding: 12px 10px; text-align: center; font-size: 11px; color: #7A736A; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                  <th style="padding: 12px 10px; text-align: right; font-size: 11px; color: #7A736A; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsListHtml}
              </tbody>
            </table>

            <!-- Shipping Destination Box -->
            ${shippingAddressHtml}

            <!-- Complete Payment Summary Box -->
            <div style="margin-top: 20px; background-color: #FDFAF6; border: 1px solid #E8E2D6; border-radius: 12px; padding: 18px 20px;">
              <p style="margin: 0 0 12px 0; font-size: 11px; font-weight: 800; color: #F9A37E; text-transform: uppercase; letter-spacing: 1px;">Payment & Invoice Breakdown</p>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #5C554C;">
                <tr>
                  <td style="padding: 4px 0;">Subtotal (Excl. GST)</td>
                  <td style="padding: 4px 0; text-align: right; font-weight: 600;">₹${subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;">Tax / GST (18%)</td>
                  <td style="padding: 4px 0; text-align: right; font-weight: 600;">₹${taxGst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;">Shipping Fee</td>
                  <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #A8C69F;">FREE</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0;">Payment Method</td>
                  <td style="padding: 4px 0; text-align: right; font-weight: 700; text-transform: uppercase; color: #4A453E;">${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}</td>
                </tr>
                ${order.paymentId ? `
                <tr>
                  <td style="padding: 4px 0;">Transaction ID</td>
                  <td style="padding: 4px 0; text-align: right; font-family: monospace; font-size: 12px; color: #4A453E;">${order.paymentId}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 4px 0;">Payment Status</td>
                  <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #A8C69F; text-transform: uppercase;">${order.paymentStatus || 'Paid'}</td>
                </tr>
                <tr style="border-top: 1px solid #E8E2D6;">
                  <td style="padding: 12px 0 4px 0; font-size: 16px; font-weight: 800; color: #2D2A26;">Grand Total Paid</td>
                  <td style="padding: 12px 0 4px 0; text-align: right; font-size: 18px; font-weight: 800; color: #F9A37E;">₹${Number(order.total).toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </div>

            <!-- CTA Live Tracking Button -->
            <div style="text-align: center; margin: 36px 0 24px 0;">
              <a href="https://kliamo.com/orders/${order.id}/track" style="background-color: #F9A37E; color: #FFFFFF; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 800; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(249, 163, 126, 0.35);">Track Package Live</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #FDFAF6; padding: 24px; text-align: center; border-top: 1px solid #E8E2D6; font-size: 12px; color: #7A736A;">
            <p style="margin: 0 0 6px 0; font-weight: 700; color: #4A453E;">Questions about your shipment or custom order?</p>
            <p style="margin: 0;">Reply directly to this email or contact customer support at <a href="mailto:contact@kliamo.com" style="color: #F9A37E; text-decoration: none; font-weight: bold;">contact@kliamo.com</a></p>
            <p style="margin: 14px 0 0 0; font-size: 11px; color: #A89B8A;">© ${new Date().getFullYear()} KLIAMO Fashion. All rights reserved.</p>
          </div>

        </div>
      </body>
      </html>
    `;

    const sent = await this.sendMailWithFallback({
      from: `"KLIAMO Fashion Orders" <${fromEmail}>`,
      to: order.email,
      subject: `Order Confirmation #${order.id} - KLIAMO Fashion`,
      html: htmlContent,
      attachments,
    });
    if (sent) {
      this.logger.log(`Order confirmation email sent to ${order.email} for order #${order.id}`);
    }
    return sent;
  }

  async sendOtpEmail(toEmail: string, userName: string, otp: string, purpose: 'signup' | 'reset' = 'reset'): Promise<boolean> {
    if (!this.transporter) this.initTransporter();
    if (!this.transporter) return false;

    const fromEmail = this.configService.get<string>('SMTP_EMAIL') || 'contact@kliamo.com';
    const logoAttachments = this.getLogoAttachments();
    const logoSrc = logoAttachments.length > 0 ? 'cid:kliamologo@kliamo' : 'https://kliamo.com/kliamologoNew.png';
    const expiryMinutes = 10;

    const isSignup = purpose === 'signup';
    const titleText = isSignup ? 'Account Verification OTP' : 'Password Reset OTP';
    const subjectText = isSignup
      ? `${otp} is your KLIAMO registration verification code`
      : `${otp} is your KLIAMO password reset code`;

    const bodyText = isSignup
      ? `Hi <strong style="color: #4A453E;">${userName}</strong>, thank you for registering with KLIAMO. Use the one-time verification code below to complete your account registration. This code expires in <strong>${expiryMinutes} minutes</strong>.`
      : `Hi <strong style="color: #4A453E;">${userName}</strong>, we received a request to reset your KLIAMO account password. Use the one-time code below to proceed. This code expires in <strong>${expiryMinutes} minutes</strong>.`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; background-color: #FDFAF6; border: 1px solid #E8E2D6; border-radius: 16px; overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #FDFAF6; border-bottom: 1px solid #E8E2D6; padding: 32px 24px; text-align: center;">
          <img src="${logoSrc}" alt="KLIAMO" style="height: 48px; width: auto; max-width: 200px; display: inline-block; border: 0;" />
          <p style="color: #F9A37E; font-weight: 700; margin: 8px 0 0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">STYLE THAT DEFINES YOU</p>
        </div>

        <!-- Body -->
        <div style="padding: 36px 32px; background-color: #FFFFFF;">
          <h2 style="color: #4A453E; font-size: 20px; font-weight: 800; margin: 0 0 8px;">${titleText}</h2>
          <p style="color: #7A736A; font-size: 14px; line-height: 1.6; margin: 0 0 28px;">
            ${bodyText}
          </p>

          <!-- OTP Box -->
          <div style="background-color: #FDFAF6; border: 2px dashed #F9A37E; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 28px;">
            <p style="color: #A89B8A; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 10px;">Your Verification Code</p>
            <span style="display: inline-block; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #4A453E; font-family: 'Courier New', monospace;">${otp}</span>
            <p style="color: #A89B8A; font-size: 11px; margin: 12px 0 0;">Valid for ${expiryMinutes} minutes only</p>
          </div>

          <!-- Warning -->
          <div style="background-color: #FFF8F0; border-left: 4px solid #F9A37E; border-radius: 0 8px 8px 0; padding: 14px 16px; margin-bottom: 24px;">
            <p style="color: #7A736A; font-size: 12px; line-height: 1.6; margin: 0;">
              🔒 <strong>Never share this code</strong> with anyone. The KLIAMO team will never ask for your OTP.
              ${isSignup ? "If you didn't initiate this registration, please ignore this email." : "If you didn't request this, please ignore this email — your password will remain unchanged."}
            </p>
          </div>

          <p style="color: #A89B8A; font-size: 12px; text-align: center; margin: 0;">
            Need help? Contact us at <a href="mailto:contact@kliamo.com" style="color: #F9A37E; text-decoration: none; font-weight: 700;">contact@kliamo.com</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #FDFAF6; border-top: 1px solid #E8E2D6; padding: 16px 24px; text-align: center;">
          <p style="color: #A89B8A; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} KLIAMO. All rights reserved.</p>
        </div>
      </div>
    `;

    const sent = await this.sendMailWithFallback({
      from: `"KLIAMO Fashion" <${fromEmail}>`,
      to: toEmail,
      subject: subjectText,
      html,
      ...(logoAttachments.length > 0 ? { attachments: logoAttachments } : {}),
    });
    if (sent) {
      this.logger.log(`OTP email sent to ${toEmail} for ${purpose}`);
    }
    return sent;
  }
}
