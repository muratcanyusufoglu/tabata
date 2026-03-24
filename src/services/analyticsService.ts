type AnalyticsEventName =
  | 'app_open' | 'app_background' | 'onboarding_complete' | 'onboarding_skip'
  | 'timer_start' | 'timer_pause' | 'timer_resume' | 'timer_stop' | 'timer_complete' | 'timer_skip_phase'
  | 'template_create' | 'template_edit' | 'template_duplicate' | 'template_delete' | 'template_favorite'
  | 'paywall_view' | 'paywall_dismiss' | 'purchase_start' | 'purchase_complete' | 'purchase_fail' | 'purchase_restore'
  | 'ad_impression' | 'theme_change' | 'color_theme_change' | 'sound_pack_change' | 'language_change'
  | 'font_size_change' | 'haptics_toggle' | 'calendar_view' | 'streak_milestone'
  | 'rate_prompt_shown' | 'rate_prompt_accepted' | 'rate_prompt_dismissed' | 'share_workout'
  | 'error_audio_play' | 'error_db_write' | 'error_background_timer' | 'error_purchase';

interface AnalyticsEvent {
  name: AnalyticsEventName;
  params?: Record<string, unknown>;
}

class AnalyticsService {
  track(event: AnalyticsEvent): void {
    if (__DEV__) {
      console.log('[Analytics]', event.name, event.params);
      return;
    }
    // Production: send to your analytics platform
    // e.g. PostHog, Mixpanel, or custom endpoint
  }
}

export const analytics = new AnalyticsService();
