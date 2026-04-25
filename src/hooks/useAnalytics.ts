import { projectId } from '../utils/supabase/info';

type AnalyticsEvent =
  | 'page_view'
  | 'send_money_started'
  | 'send_money_completed'
  | 'send_money_failed'
  | 'bill_payment_started'
  | 'bill_payment_completed'
  | 'bill_payment_queued_offline'
  | 'qr_scan_started'
  | 'qr_payment_completed'
  | 'loan_apply_started'
  | 'loan_apply_completed'
  | 'loan_apply_failed'
  | 'kyc_banner_shown'
  | 'kyc_upgrade_started'
  | 'kyc_upgrade_completed'
  | 'recurring_payment_created'
  | 'recurring_payment_toggled'
  | 'settings_security_viewed'
  | 'merchant_dashboard_viewed'
  | 'ai_assistant_message_sent'
  | 'support_chat_opened'
  | 'language_toggled';

export function useAnalytics(accessToken?: string) {
  const track = (event: AnalyticsEvent, properties?: Record<string, unknown>) => {
    if (!accessToken) return;
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-69a10ee8/integrations/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ event, properties, timestamp: new Date().toISOString() }),
    }).catch(() => { /* analytics must never break the app */ });
  };

  return { track };
}
