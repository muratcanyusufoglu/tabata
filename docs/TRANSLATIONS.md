# FitTimer — Translations (i18n)
## Version 1.0
## 10 Languages — All UI Strings

---

## Implementation Notes

**Library:** `i18next` + `react-i18next` + `expo-localization`
**File structure:** Each language in a separate JSON file under `src/i18n/locales/`
**Fallback:** English (en)
**Detection:** Device locale via `expo-localization`, user override in settings

### Setup Code

```typescript
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './locales/en.json';
import tr from './locales/tr.json';
import de from './locales/de.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import zh from './locales/zh.json';
import ar from './locales/ar.json';

const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';

i18n.use(initReactI18next).init({
  resources: { en, tr, de, es, pt, fr, ja, ko, zh, ar },
  lng: deviceLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;

// Usage in components:
// import { useTranslation } from 'react-i18next';
// const { t } = useTranslation();
// <Text>{t('home.greeting')}</Text>
```

### CRITICAL RULE
**Every user-visible string in the app MUST come from the translation file via `t()` function. No hardcoded strings in components. No exceptions.**

---

## Languages Selected (Top 10 by fitness app market potential)

| # | Code | Language | Market Rationale |
|---|------|----------|------------------|
| 1 | en | English | #1 market globally, 42% of App Store revenue |
| 2 | tr | Turkish | Home market, zero ASO competition for timer keywords |
| 3 | de | German | #3 European market, high IAP spend |
| 4 | es | Spanish | 500M+ speakers, growing Latin America market |
| 5 | pt | Portuguese (BR) | Brazil = largest Latin America app market |
| 6 | fr | French | Strong European + African market |
| 7 | ja | Japanese | #2 global App Store revenue, premium users |
| 8 | ko | Korean | High smartphone penetration, fitness-conscious culture |
| 9 | zh | Chinese (Simplified) | Largest Android market by downloads |
| 10 | ar | Arabic | Fast-growing MENA market, underserved in fitness |

---

## Translation Files

### English (en.json)

```json
{
  "translation": {
    "app": {
      "name": "FitTimer"
    },

    "tabs": {
      "timer": "Timer",
      "history": "History",
      "settings": "Settings"
    },

    "home": {
      "greeting": "Ready to train?",
      "quickStart": "Quick Start",
      "myTimers": "My Timers",
      "recentWorkouts": "Recent Workouts",
      "noCustomTimers": "No custom timers yet",
      "createFirst": "Create your first timer",
      "noRecentWorkouts": "No recent workouts",
      "seeAll": "See All"
    },

    "timer": {
      "prepare": "GET READY",
      "work": "WORK",
      "rest": "REST",
      "restBetweenSets": "SET BREAK",
      "cooldown": "COOLDOWN",
      "completed": "COMPLETE",
      "round": "Round {{current}} of {{total}}",
      "set": "Set {{current}} of {{total}}",
      "nextPhase": "Next: {{phase}} · {{duration}}",
      "elapsed": "{{time}} elapsed",
      "swipeToStop": "Swipe down to stop",
      "pause": "Pause",
      "resume": "Resume",
      "skip": "Skip",
      "stop": "Stop",
      "start": "Start",
      "stopConfirmTitle": "Stop Workout?",
      "stopConfirmMessage": "Your progress will be saved.",
      "stopConfirmYes": "Stop Workout",
      "stopConfirmNo": "Keep Going"
    },

    "complete": {
      "title": "Workout Complete!",
      "duration": "Duration",
      "rounds": "Rounds",
      "sets": "Sets",
      "streak": "Streak",
      "done": "Done",
      "share": "Share",
      "greatJob": "Great job! 💪"
    },

    "editor": {
      "title": "New Timer",
      "editTitle": "Edit Timer",
      "name": "Timer Name",
      "namePlaceholder": "e.g. Morning HIIT",
      "workTime": "Work Time",
      "restTime": "Rest Time",
      "rounds": "Rounds",
      "sets": "Sets",
      "restBetweenSets": "Rest Between Sets",
      "prepareTime": "Prepare Time",
      "cooldownTime": "Cooldown Time",
      "advanced": "Advanced Options",
      "totalDuration": "Total Duration",
      "soundPack": "Sound Pack",
      "save": "Save Timer",
      "startNow": "Start Now",
      "delete": "Delete Timer",
      "duplicate": "Duplicate Timer",
      "deleteConfirm": "Are you sure you want to delete this timer?",
      "validation": {
        "nameRequired": "Timer name is required",
        "nameTooLong": "Name must be 50 characters or less",
        "workRequired": "Work time must be at least 1 second",
        "tooLong": "Total duration cannot exceed 2 hours"
      }
    },

    "presets": {
      "tabataClassic": "Tabata Classic",
      "hiitStandard": "HIIT Standard",
      "boxingRound": "Boxing 3-Min Round",
      "emom": "EMOM 10",
      "amrap": "AMRAP 20",
      "circuitBurn": "Circuit Burn",
      "stretchFlow": "Stretch & Flow"
    },

    "history": {
      "title": "History",
      "streak": "{{count}} day streak",
      "bestStreak": "Best: {{count}} days",
      "thisWeek": "This Week",
      "workouts": "{{count}} workouts",
      "totalTime": "{{minutes}} min total",
      "noWorkouts": "No workouts on this day",
      "completed": "Completed",
      "abandoned": "Not finished"
    },

    "calendar": {
      "months": {
        "january": "January",
        "february": "February",
        "march": "March",
        "april": "April",
        "may": "May",
        "june": "June",
        "july": "July",
        "august": "August",
        "september": "September",
        "october": "October",
        "november": "November",
        "december": "December"
      },
      "weekdays": {
        "mo": "Mo",
        "tu": "Tu",
        "we": "We",
        "th": "Th",
        "fr": "Fr",
        "sa": "Sa",
        "su": "Su"
      }
    },

    "settings": {
      "title": "Settings",
      "appearance": "Appearance",
      "theme": "Theme",
      "themeSystem": "System",
      "themeLight": "Light",
      "themeDark": "Dark",
      "colorTheme": "Color Theme",
      "timerFontSize": "Timer Font Size",
      "fontNormal": "Normal",
      "fontLarge": "Large",
      "fontXlarge": "Extra Large",
      "sound": "Sound",
      "soundPack": "Sound Pack",
      "volume": "Timer Volume",
      "haptics": "Haptic Feedback",
      "countdownSound": "Countdown Sound (3-2-1)",
      "timerDefaults": "Timer Defaults",
      "defaultPrepare": "Default Prepare Time",
      "defaultCooldown": "Default Cooldown Time",
      "keepScreenAwake": "Keep Screen Awake",
      "language": "Language",
      "premium": "Premium",
      "upgradeToPremium": "Upgrade to Premium",
      "restorePurchases": "Restore Purchases",
      "about": "About",
      "rateApp": "Rate FitTimer",
      "sendFeedback": "Send Feedback",
      "privacyPolicy": "Privacy Policy",
      "termsOfService": "Terms of Service",
      "version": "Version {{version}}"
    },

    "premium": {
      "title": "Unlock Premium",
      "subtitle": "Take your training to the next level",
      "feature1": "Unlimited custom timers",
      "feature2": "Full workout history",
      "feature3": "All color themes",
      "feature4": "All sound packs",
      "feature5": "Ad-free experience",
      "feature6": "Export workout data",
      "monthly": "Monthly",
      "yearly": "Yearly",
      "lifetime": "Lifetime",
      "monthlyPrice": "{{price}}/month",
      "yearlyPrice": "{{price}}/year",
      "lifetimePrice": "{{price}} once",
      "bestValue": "Best Value",
      "subscribe": "Subscribe",
      "restore": "Restore Purchases",
      "terms": "Recurring billing. Cancel anytime."
    },

    "onboarding": {
      "welcome": "Welcome to FitTimer",
      "subtitle": "The interval timer that actually works",
      "feature1Title": "Beautiful Design",
      "feature1Desc": "A timer as premium as your workout",
      "feature2Title": "Reliable Audio",
      "feature2Desc": "Plays over your music, never interrupts",
      "feature3Title": "Track Progress",
      "feature3Desc": "Calendar, streaks, and workout stats",
      "pickStyle": "What's your training style?",
      "notifications": "Stay on Track",
      "notificationsDesc": "Get reminders to keep your streak alive",
      "enableNotifications": "Enable Notifications",
      "skip": "Skip",
      "next": "Next",
      "getStarted": "Get Started"
    },

    "categories": {
      "tabata": "Tabata",
      "hiit": "HIIT",
      "boxing": "Boxing",
      "crossfit": "CrossFit",
      "circuit": "Circuit",
      "stretching": "Stretching",
      "custom": "Custom"
    },

    "common": {
      "cancel": "Cancel",
      "confirm": "Confirm",
      "delete": "Delete",
      "edit": "Edit",
      "save": "Save",
      "close": "Close",
      "ok": "OK",
      "seconds": "{{count}}s",
      "minutes": "{{count}}m",
      "hours": "{{count}}h",
      "and": "and",
      "free": "Free",
      "premiumBadge": "PRO",
      "locked": "Premium feature"
    },

    "format": {
      "workRest": "{{work}}s work · {{rest}}s rest · {{rounds}} rounds",
      "totalTime": "{{time}} total",
      "roundsCount": "{{count}} rounds",
      "setsCount": "{{count}} sets"
    },

    "notifications": {
      "workTitle": "WORK",
      "workBody": "Round {{round}} — Go!",
      "restTitle": "REST",
      "restBody": "Rest — {{seconds}}s",
      "completeTitle": "Workout Complete!",
      "completeBody": "Great job! You finished your workout.",
      "streakReminder": "Don't break your {{count}}-day streak!",
      "streakReminderBody": "Open FitTimer to keep your streak alive"
    }
  }
}
```

### Turkish (tr.json)

```json
{
  "translation": {
    "app": { "name": "FitTimer" },
    "tabs": { "timer": "Zamanlayıcı", "history": "Geçmiş", "settings": "Ayarlar" },
    "home": {
      "greeting": "Antrenmana hazır mısın?",
      "quickStart": "Hızlı Başla",
      "myTimers": "Zamanlayıcılarım",
      "recentWorkouts": "Son Antrenmanlar",
      "noCustomTimers": "Henüz zamanlayıcı oluşturmadın",
      "createFirst": "İlk zamanlayıcını oluştur",
      "noRecentWorkouts": "Henüz antrenman yok",
      "seeAll": "Tümünü Gör"
    },
    "timer": {
      "prepare": "HAZIRLAN",
      "work": "ÇALIŞ",
      "rest": "DİNLEN",
      "restBetweenSets": "SET ARASI",
      "cooldown": "SOĞUMA",
      "completed": "TAMAMLANDI",
      "round": "Tur {{current}} / {{total}}",
      "set": "Set {{current}} / {{total}}",
      "nextPhase": "Sıradaki: {{phase}} · {{duration}}",
      "elapsed": "{{time}} geçti",
      "swipeToStop": "Durdurmak için aşağı kaydır",
      "pause": "Duraklat",
      "resume": "Devam Et",
      "skip": "Atla",
      "stop": "Durdur",
      "start": "Başla",
      "stopConfirmTitle": "Antrenman durdurulsun mu?",
      "stopConfirmMessage": "İlerlemeniz kaydedilecek.",
      "stopConfirmYes": "Antrenmanı Durdur",
      "stopConfirmNo": "Devam Et"
    },
    "complete": {
      "title": "Antrenman Tamamlandı!",
      "duration": "Süre",
      "rounds": "Turlar",
      "sets": "Setler",
      "streak": "Seri",
      "done": "Tamam",
      "share": "Paylaş",
      "greatJob": "Harika iş! 💪"
    },
    "editor": {
      "title": "Yeni Zamanlayıcı",
      "editTitle": "Zamanlayıcıyı Düzenle",
      "name": "Zamanlayıcı Adı",
      "namePlaceholder": "ör. Sabah HIIT",
      "workTime": "Çalışma Süresi",
      "restTime": "Dinlenme Süresi",
      "rounds": "Turlar",
      "sets": "Setler",
      "restBetweenSets": "Setler Arası Dinlenme",
      "prepareTime": "Hazırlık Süresi",
      "cooldownTime": "Soğuma Süresi",
      "advanced": "Gelişmiş Seçenekler",
      "totalDuration": "Toplam Süre",
      "soundPack": "Ses Paketi",
      "save": "Kaydet",
      "startNow": "Hemen Başla",
      "delete": "Zamanlayıcıyı Sil",
      "duplicate": "Kopyala",
      "deleteConfirm": "Bu zamanlayıcıyı silmek istediğinizden emin misiniz?",
      "validation": { "nameRequired": "Zamanlayıcı adı gereklidir", "nameTooLong": "Ad en fazla 50 karakter olabilir", "workRequired": "Çalışma süresi en az 1 saniye olmalıdır", "tooLong": "Toplam süre 2 saati aşamaz" }
    },
    "presets": { "tabataClassic": "Klasik Tabata", "hiitStandard": "Standart HIIT", "boxingRound": "Boks 3 Dakika", "emom": "EMOM 10", "amrap": "AMRAP 20", "circuitBurn": "Devre Antrenmanı", "stretchFlow": "Esneme & Akış" },
    "history": { "title": "Geçmiş", "streak": "{{count}} günlük seri", "bestStreak": "En iyi: {{count}} gün", "thisWeek": "Bu Hafta", "workouts": "{{count}} antrenman", "totalTime": "{{minutes}} dk toplam", "noWorkouts": "Bu gün antrenman yok", "completed": "Tamamlandı", "abandoned": "Tamamlanmadı" },
    "calendar": {
      "months": { "january": "Ocak", "february": "Şubat", "march": "Mart", "april": "Nisan", "may": "Mayıs", "june": "Haziran", "july": "Temmuz", "august": "Ağustos", "september": "Eylül", "october": "Ekim", "november": "Kasım", "december": "Aralık" },
      "weekdays": { "mo": "Pt", "tu": "Sa", "we": "Ça", "th": "Pe", "fr": "Cu", "sa": "Ct", "su": "Pz" }
    },
    "settings": { "title": "Ayarlar", "appearance": "Görünüm", "theme": "Tema", "themeSystem": "Sistem", "themeLight": "Açık", "themeDark": "Koyu", "colorTheme": "Renk Teması", "timerFontSize": "Zamanlayıcı Yazı Boyutu", "fontNormal": "Normal", "fontLarge": "Büyük", "fontXlarge": "Çok Büyük", "sound": "Ses", "soundPack": "Ses Paketi", "volume": "Zamanlayıcı Sesi", "haptics": "Titreşim", "countdownSound": "Geri Sayım Sesi (3-2-1)", "timerDefaults": "Varsayılan Ayarlar", "defaultPrepare": "Varsayılan Hazırlık Süresi", "defaultCooldown": "Varsayılan Soğuma Süresi", "keepScreenAwake": "Ekranı Açık Tut", "language": "Dil", "premium": "Premium", "upgradeToPremium": "Premium'a Yükselt", "restorePurchases": "Satın Alımları Geri Yükle", "about": "Hakkında", "rateApp": "FitTimer'ı Değerlendir", "sendFeedback": "Geri Bildirim Gönder", "privacyPolicy": "Gizlilik Politikası", "termsOfService": "Kullanım Şartları", "version": "Sürüm {{version}}" },
    "premium": { "title": "Premium'u Aç", "subtitle": "Antrenmanını bir üst seviyeye taşı", "feature1": "Sınırsız zamanlayıcı", "feature2": "Tüm antrenman geçmişi", "feature3": "Tüm renk temaları", "feature4": "Tüm ses paketleri", "feature5": "Reklamsız deneyim", "feature6": "Antrenman verilerini dışa aktar", "monthly": "Aylık", "yearly": "Yıllık", "lifetime": "Ömür Boyu", "monthlyPrice": "{{price}}/ay", "yearlyPrice": "{{price}}/yıl", "lifetimePrice": "{{price}} tek seferlik", "bestValue": "En İyi Teklif", "subscribe": "Abone Ol", "restore": "Satın Alımları Geri Yükle", "terms": "Otomatik yenilenir. İstediğiniz zaman iptal edin." },
    "onboarding": { "welcome": "FitTimer'a Hoş Geldin", "subtitle": "Gerçekten çalışan interval zamanlayıcı", "feature1Title": "Çarpıcı Tasarım", "feature1Desc": "Antrenmanın kadar premium bir zamanlayıcı", "feature2Title": "Güvenilir Ses", "feature2Desc": "Müziğinin üzerine çalar, asla kesmez", "feature3Title": "İlerlemeyi Takip Et", "feature3Desc": "Takvim, seriler ve antrenman istatistikleri", "pickStyle": "Antrenman tarzın ne?", "notifications": "Hedefine Sadık Kal", "notificationsDesc": "Serini korumak için hatırlatmalar al", "enableNotifications": "Bildirimleri Etkinleştir", "skip": "Atla", "next": "İleri", "getStarted": "Başlayalım" },
    "categories": { "tabata": "Tabata", "hiit": "HIIT", "boxing": "Boks", "crossfit": "CrossFit", "circuit": "Devre", "stretching": "Esneme", "custom": "Özel" },
    "common": { "cancel": "İptal", "confirm": "Onayla", "delete": "Sil", "edit": "Düzenle", "save": "Kaydet", "close": "Kapat", "ok": "Tamam", "seconds": "{{count}}sn", "minutes": "{{count}}dk", "hours": "{{count}}sa", "and": "ve", "free": "Ücretsiz", "premiumBadge": "PRO", "locked": "Premium özellik" },
    "format": { "workRest": "{{work}}sn çalış · {{rest}}sn dinlen · {{rounds}} tur", "totalTime": "{{time}} toplam", "roundsCount": "{{count}} tur", "setsCount": "{{count}} set" },
    "notifications": { "workTitle": "ÇALIŞ", "workBody": "Tur {{round}} — Başla!", "restTitle": "DİNLEN", "restBody": "Dinlenme — {{seconds}}sn", "completeTitle": "Antrenman Tamamlandı!", "completeBody": "Harika iş! Antrenmanını tamamladın.", "streakReminder": "{{count}} günlük serini bozma!", "streakReminderBody": "Serini korumak için FitTimer'ı aç" }
  }
}
```

### German (de.json)

```json
{
  "translation": {
    "app": { "name": "FitTimer" },
    "tabs": { "timer": "Timer", "history": "Verlauf", "settings": "Einstellungen" },
    "home": { "greeting": "Bereit für dein Training?", "quickStart": "Schnellstart", "myTimers": "Meine Timer", "recentWorkouts": "Letzte Workouts", "noCustomTimers": "Noch keine eigenen Timer", "createFirst": "Erstelle deinen ersten Timer", "noRecentWorkouts": "Keine letzten Workouts", "seeAll": "Alle anzeigen" },
    "timer": { "prepare": "VORBEREITEN", "work": "TRAINING", "rest": "PAUSE", "restBetweenSets": "SATZPAUSE", "cooldown": "AUSLAUFEN", "completed": "GESCHAFFT", "round": "Runde {{current}} von {{total}}", "set": "Satz {{current}} von {{total}}", "nextPhase": "Nächste: {{phase}} · {{duration}}", "elapsed": "{{time}} vergangen", "swipeToStop": "Nach unten wischen zum Stoppen", "pause": "Pause", "resume": "Weiter", "skip": "Überspringen", "stop": "Stopp", "start": "Start", "stopConfirmTitle": "Workout beenden?", "stopConfirmMessage": "Dein Fortschritt wird gespeichert.", "stopConfirmYes": "Workout beenden", "stopConfirmNo": "Weitermachen" },
    "complete": { "title": "Workout abgeschlossen!", "duration": "Dauer", "rounds": "Runden", "sets": "Sätze", "streak": "Serie", "done": "Fertig", "share": "Teilen", "greatJob": "Super Leistung! 💪" },
    "editor": { "title": "Neuer Timer", "editTitle": "Timer bearbeiten", "name": "Timer-Name", "namePlaceholder": "z.B. Morgen-HIIT", "workTime": "Trainingszeit", "restTime": "Pausenzeit", "rounds": "Runden", "sets": "Sätze", "restBetweenSets": "Pause zwischen Sätzen", "prepareTime": "Vorbereitungszeit", "cooldownTime": "Auslaufzeit", "advanced": "Erweiterte Optionen", "totalDuration": "Gesamtdauer", "soundPack": "Soundpaket", "save": "Timer speichern", "startNow": "Jetzt starten", "delete": "Timer löschen", "duplicate": "Duplizieren", "deleteConfirm": "Möchtest du diesen Timer wirklich löschen?", "validation": { "nameRequired": "Timer-Name ist erforderlich", "nameTooLong": "Name darf höchstens 50 Zeichen lang sein", "workRequired": "Trainingszeit muss mindestens 1 Sekunde betragen", "tooLong": "Gesamtdauer darf 2 Stunden nicht überschreiten" } },
    "presets": { "tabataClassic": "Tabata Klassisch", "hiitStandard": "HIIT Standard", "boxingRound": "Boxen 3-Min-Runde", "emom": "EMOM 10", "amrap": "AMRAP 20", "circuitBurn": "Zirkeltraining", "stretchFlow": "Dehnung & Flow" },
    "history": { "title": "Verlauf", "streak": "{{count}}-Tage-Serie", "bestStreak": "Beste: {{count}} Tage", "thisWeek": "Diese Woche", "workouts": "{{count}} Workouts", "totalTime": "{{minutes}} Min. gesamt", "noWorkouts": "Keine Workouts an diesem Tag", "completed": "Abgeschlossen", "abandoned": "Nicht beendet" },
    "calendar": { "months": { "january": "Januar", "february": "Februar", "march": "März", "april": "April", "may": "Mai", "june": "Juni", "july": "Juli", "august": "August", "september": "September", "october": "Oktober", "november": "November", "december": "Dezember" }, "weekdays": { "mo": "Mo", "tu": "Di", "we": "Mi", "th": "Do", "fr": "Fr", "sa": "Sa", "su": "So" } },
    "settings": { "title": "Einstellungen", "appearance": "Darstellung", "theme": "Design", "themeSystem": "System", "themeLight": "Hell", "themeDark": "Dunkel", "colorTheme": "Farbschema", "timerFontSize": "Timer-Schriftgröße", "fontNormal": "Normal", "fontLarge": "Groß", "fontXlarge": "Sehr groß", "sound": "Ton", "soundPack": "Soundpaket", "volume": "Timer-Lautstärke", "haptics": "Haptisches Feedback", "countdownSound": "Countdown-Ton (3-2-1)", "timerDefaults": "Timer-Standardwerte", "defaultPrepare": "Standard-Vorbereitungszeit", "defaultCooldown": "Standard-Auslaufzeit", "keepScreenAwake": "Bildschirm anlassen", "language": "Sprache", "premium": "Premium", "upgradeToPremium": "Auf Premium upgraden", "restorePurchases": "Käufe wiederherstellen", "about": "Über", "rateApp": "FitTimer bewerten", "sendFeedback": "Feedback senden", "privacyPolicy": "Datenschutzrichtlinie", "termsOfService": "Nutzungsbedingungen", "version": "Version {{version}}" },
    "premium": { "title": "Premium freischalten", "subtitle": "Bringe dein Training auf das nächste Level", "feature1": "Unbegrenzte Timer", "feature2": "Kompletter Workout-Verlauf", "feature3": "Alle Farbschemas", "feature4": "Alle Soundpakete", "feature5": "Werbefrei", "feature6": "Workout-Daten exportieren", "monthly": "Monatlich", "yearly": "Jährlich", "lifetime": "Lebenslang", "monthlyPrice": "{{price}}/Monat", "yearlyPrice": "{{price}}/Jahr", "lifetimePrice": "{{price}} einmalig", "bestValue": "Bestes Angebot", "subscribe": "Abonnieren", "restore": "Käufe wiederherstellen", "terms": "Automatische Verlängerung. Jederzeit kündbar." },
    "onboarding": { "welcome": "Willkommen bei FitTimer", "subtitle": "Der Intervall-Timer, der wirklich funktioniert", "feature1Title": "Beeindruckendes Design", "feature1Desc": "Ein Timer, so premium wie dein Workout", "feature2Title": "Zuverlässiger Sound", "feature2Desc": "Spielt über deine Musik, unterbricht nie", "feature3Title": "Fortschritt verfolgen", "feature3Desc": "Kalender, Serien und Workout-Statistiken", "pickStyle": "Was ist dein Trainingsstil?", "notifications": "Bleib am Ball", "notificationsDesc": "Erhalte Erinnerungen für deine Serie", "enableNotifications": "Benachrichtigungen aktivieren", "skip": "Überspringen", "next": "Weiter", "getStarted": "Los geht's" },
    "categories": { "tabata": "Tabata", "hiit": "HIIT", "boxing": "Boxen", "crossfit": "CrossFit", "circuit": "Zirkel", "stretching": "Dehnung", "custom": "Eigene" },
    "common": { "cancel": "Abbrechen", "confirm": "Bestätigen", "delete": "Löschen", "edit": "Bearbeiten", "save": "Speichern", "close": "Schließen", "ok": "OK", "seconds": "{{count}}s", "minutes": "{{count}}min", "hours": "{{count}}h", "and": "und", "free": "Kostenlos", "premiumBadge": "PRO", "locked": "Premium-Funktion" },
    "format": { "workRest": "{{work}}s Training · {{rest}}s Pause · {{rounds}} Runden", "totalTime": "{{time}} gesamt", "roundsCount": "{{count}} Runden", "setsCount": "{{count}} Sätze" },
    "notifications": { "workTitle": "TRAINING", "workBody": "Runde {{round}} — Los!", "restTitle": "PAUSE", "restBody": "Pause — {{seconds}}s", "completeTitle": "Workout abgeschlossen!", "completeBody": "Super Leistung! Du hast dein Workout beendet.", "streakReminder": "Unterbreche nicht deine {{count}}-Tage-Serie!", "streakReminderBody": "Öffne FitTimer, um deine Serie fortzusetzen" }
  }
}
```

### Spanish (es.json)

```json
{
  "translation": {
    "app": { "name": "FitTimer" },
    "tabs": { "timer": "Temporizador", "history": "Historial", "settings": "Ajustes" },
    "home": { "greeting": "¿Listo para entrenar?", "quickStart": "Inicio Rápido", "myTimers": "Mis Temporizadores", "recentWorkouts": "Entrenamientos Recientes", "noCustomTimers": "Aún no tienes temporizadores", "createFirst": "Crea tu primer temporizador", "noRecentWorkouts": "Sin entrenamientos recientes", "seeAll": "Ver Todo" },
    "timer": { "prepare": "PREPÁRATE", "work": "ENTRENA", "rest": "DESCANSA", "restBetweenSets": "PAUSA DE SERIE", "cooldown": "ENFRIAMIENTO", "completed": "COMPLETADO", "round": "Ronda {{current}} de {{total}}", "set": "Serie {{current}} de {{total}}", "nextPhase": "Siguiente: {{phase}} · {{duration}}", "elapsed": "{{time}} transcurrido", "swipeToStop": "Desliza hacia abajo para detener", "pause": "Pausa", "resume": "Reanudar", "skip": "Saltar", "stop": "Detener", "start": "Iniciar", "stopConfirmTitle": "¿Detener entrenamiento?", "stopConfirmMessage": "Tu progreso se guardará.", "stopConfirmYes": "Detener", "stopConfirmNo": "Continuar" },
    "complete": { "title": "¡Entrenamiento Completado!", "duration": "Duración", "rounds": "Rondas", "sets": "Series", "streak": "Racha", "done": "Listo", "share": "Compartir", "greatJob": "¡Gran trabajo! 💪" },
    "editor": { "title": "Nuevo Temporizador", "editTitle": "Editar Temporizador", "name": "Nombre", "namePlaceholder": "ej. HIIT Matutino", "workTime": "Tiempo de Trabajo", "restTime": "Tiempo de Descanso", "rounds": "Rondas", "sets": "Series", "restBetweenSets": "Descanso entre Series", "prepareTime": "Tiempo de Preparación", "cooldownTime": "Tiempo de Enfriamiento", "advanced": "Opciones Avanzadas", "totalDuration": "Duración Total", "soundPack": "Paquete de Sonido", "save": "Guardar", "startNow": "Iniciar Ahora", "delete": "Eliminar", "duplicate": "Duplicar", "deleteConfirm": "¿Estás seguro de que quieres eliminar este temporizador?", "validation": { "nameRequired": "El nombre es obligatorio", "nameTooLong": "El nombre no puede superar los 50 caracteres", "workRequired": "El tiempo de trabajo debe ser al menos 1 segundo", "tooLong": "La duración total no puede superar las 2 horas" } },
    "presets": { "tabataClassic": "Tabata Clásico", "hiitStandard": "HIIT Estándar", "boxingRound": "Boxeo 3 Minutos", "emom": "EMOM 10", "amrap": "AMRAP 20", "circuitBurn": "Circuito Intenso", "stretchFlow": "Estiramiento y Flujo" },
    "history": { "title": "Historial", "streak": "Racha de {{count}} días", "bestStreak": "Mejor: {{count}} días", "thisWeek": "Esta Semana", "workouts": "{{count}} entrenamientos", "totalTime": "{{minutes}} min en total", "noWorkouts": "Sin entrenamientos este día", "completed": "Completado", "abandoned": "No terminado" },
    "calendar": { "months": { "january": "Enero", "february": "Febrero", "march": "Marzo", "april": "Abril", "may": "Mayo", "june": "Junio", "july": "Julio", "august": "Agosto", "september": "Septiembre", "october": "Octubre", "november": "Noviembre", "december": "Diciembre" }, "weekdays": { "mo": "Lu", "tu": "Ma", "we": "Mi", "th": "Ju", "fr": "Vi", "sa": "Sá", "su": "Do" } },
    "settings": { "title": "Ajustes", "appearance": "Apariencia", "theme": "Tema", "themeSystem": "Sistema", "themeLight": "Claro", "themeDark": "Oscuro", "colorTheme": "Tema de Color", "timerFontSize": "Tamaño de Fuente", "fontNormal": "Normal", "fontLarge": "Grande", "fontXlarge": "Muy Grande", "sound": "Sonido", "soundPack": "Paquete de Sonido", "volume": "Volumen del Temporizador", "haptics": "Vibración", "countdownSound": "Sonido de Cuenta Regresiva (3-2-1)", "timerDefaults": "Valores Predeterminados", "defaultPrepare": "Tiempo de Preparación", "defaultCooldown": "Tiempo de Enfriamiento", "keepScreenAwake": "Mantener Pantalla Encendida", "language": "Idioma", "premium": "Premium", "upgradeToPremium": "Mejorar a Premium", "restorePurchases": "Restaurar Compras", "about": "Acerca de", "rateApp": "Calificar FitTimer", "sendFeedback": "Enviar Comentarios", "privacyPolicy": "Política de Privacidad", "termsOfService": "Términos de Servicio", "version": "Versión {{version}}" },
    "premium": { "title": "Desbloquear Premium", "subtitle": "Lleva tu entrenamiento al siguiente nivel", "feature1": "Temporizadores ilimitados", "feature2": "Historial completo", "feature3": "Todos los temas de color", "feature4": "Todos los paquetes de sonido", "feature5": "Sin publicidad", "feature6": "Exportar datos", "monthly": "Mensual", "yearly": "Anual", "lifetime": "De por vida", "monthlyPrice": "{{price}}/mes", "yearlyPrice": "{{price}}/año", "lifetimePrice": "{{price}} único", "bestValue": "Mejor Oferta", "subscribe": "Suscribirse", "restore": "Restaurar Compras", "terms": "Renovación automática. Cancela en cualquier momento." },
    "onboarding": { "welcome": "Bienvenido a FitTimer", "subtitle": "El temporizador de intervalos que realmente funciona", "feature1Title": "Diseño Impresionante", "feature1Desc": "Un temporizador tan premium como tu entrenamiento", "feature2Title": "Audio Confiable", "feature2Desc": "Suena sobre tu música, nunca la interrumpe", "feature3Title": "Sigue tu Progreso", "feature3Desc": "Calendario, rachas y estadísticas", "pickStyle": "¿Cuál es tu estilo de entrenamiento?", "notifications": "Mantente en Forma", "notificationsDesc": "Recibe recordatorios para mantener tu racha", "enableNotifications": "Activar Notificaciones", "skip": "Saltar", "next": "Siguiente", "getStarted": "Comenzar" },
    "categories": { "tabata": "Tabata", "hiit": "HIIT", "boxing": "Boxeo", "crossfit": "CrossFit", "circuit": "Circuito", "stretching": "Estiramiento", "custom": "Personalizado" },
    "common": { "cancel": "Cancelar", "confirm": "Confirmar", "delete": "Eliminar", "edit": "Editar", "save": "Guardar", "close": "Cerrar", "ok": "OK", "seconds": "{{count}}s", "minutes": "{{count}}min", "hours": "{{count}}h", "and": "y", "free": "Gratis", "premiumBadge": "PRO", "locked": "Función Premium" },
    "format": { "workRest": "{{work}}s trabajo · {{rest}}s descanso · {{rounds}} rondas", "totalTime": "{{time}} total", "roundsCount": "{{count}} rondas", "setsCount": "{{count}} series" },
    "notifications": { "workTitle": "ENTRENA", "workBody": "Ronda {{round}} — ¡Vamos!", "restTitle": "DESCANSA", "restBody": "Descanso — {{seconds}}s", "completeTitle": "¡Entrenamiento Completado!", "completeBody": "¡Gran trabajo! Completaste tu entrenamiento.", "streakReminder": "¡No rompas tu racha de {{count}} días!", "streakReminderBody": "Abre FitTimer para mantener tu racha" }
  }
}
```

### Portuguese - Brazil (pt.json)

```json
{
  "translation": {
    "app": { "name": "FitTimer" },
    "tabs": { "timer": "Timer", "history": "Histórico", "settings": "Configurações" },
    "home": { "greeting": "Pronto pra treinar?", "quickStart": "Início Rápido", "myTimers": "Meus Timers", "recentWorkouts": "Treinos Recentes", "noCustomTimers": "Nenhum timer personalizado", "createFirst": "Crie seu primeiro timer", "noRecentWorkouts": "Nenhum treino recente", "seeAll": "Ver Tudo" },
    "timer": { "prepare": "PREPARE-SE", "work": "TREINO", "rest": "DESCANSO", "restBetweenSets": "INTERVALO", "cooldown": "VOLTA À CALMA", "completed": "CONCLUÍDO", "round": "Round {{current}} de {{total}}", "set": "Série {{current}} de {{total}}", "nextPhase": "Próximo: {{phase}} · {{duration}}", "elapsed": "{{time}} decorrido", "swipeToStop": "Deslize para baixo para parar", "pause": "Pausar", "resume": "Continuar", "skip": "Pular", "stop": "Parar", "start": "Iniciar", "stopConfirmTitle": "Parar treino?", "stopConfirmMessage": "Seu progresso será salvo.", "stopConfirmYes": "Parar Treino", "stopConfirmNo": "Continuar" },
    "complete": { "title": "Treino Concluído!", "duration": "Duração", "rounds": "Rounds", "sets": "Séries", "streak": "Sequência", "done": "Concluir", "share": "Compartilhar", "greatJob": "Mandou bem! 💪" },
    "editor": { "title": "Novo Timer", "editTitle": "Editar Timer", "name": "Nome do Timer", "namePlaceholder": "ex. HIIT Matinal", "workTime": "Tempo de Treino", "restTime": "Tempo de Descanso", "rounds": "Rounds", "sets": "Séries", "restBetweenSets": "Descanso entre Séries", "prepareTime": "Tempo de Preparo", "cooldownTime": "Volta à Calma", "advanced": "Opções Avançadas", "totalDuration": "Duração Total", "soundPack": "Pacote de Som", "save": "Salvar", "startNow": "Iniciar Agora", "delete": "Excluir", "duplicate": "Duplicar", "deleteConfirm": "Tem certeza que deseja excluir este timer?", "validation": { "nameRequired": "Nome é obrigatório", "nameTooLong": "Nome deve ter no máximo 50 caracteres", "workRequired": "Tempo de treino deve ser pelo menos 1 segundo", "tooLong": "Duração total não pode passar de 2 horas" } },
    "presets": { "tabataClassic": "Tabata Clássico", "hiitStandard": "HIIT Padrão", "boxingRound": "Boxe 3 Minutos", "emom": "EMOM 10", "amrap": "AMRAP 20", "circuitBurn": "Circuito Intenso", "stretchFlow": "Alongamento & Fluxo" },
    "history": { "title": "Histórico", "streak": "Sequência de {{count}} dias", "bestStreak": "Melhor: {{count}} dias", "thisWeek": "Esta Semana", "workouts": "{{count}} treinos", "totalTime": "{{minutes}} min no total", "noWorkouts": "Sem treinos neste dia", "completed": "Concluído", "abandoned": "Não finalizado" },
    "calendar": { "months": { "january": "Janeiro", "february": "Fevereiro", "march": "Março", "april": "Abril", "may": "Maio", "june": "Junho", "july": "Julho", "august": "Agosto", "september": "Setembro", "october": "Outubro", "november": "Novembro", "december": "Dezembro" }, "weekdays": { "mo": "Seg", "tu": "Ter", "we": "Qua", "th": "Qui", "fr": "Sex", "sa": "Sáb", "su": "Dom" } },
    "settings": { "title": "Configurações", "appearance": "Aparência", "theme": "Tema", "themeSystem": "Sistema", "themeLight": "Claro", "themeDark": "Escuro", "colorTheme": "Tema de Cor", "timerFontSize": "Tamanho da Fonte", "fontNormal": "Normal", "fontLarge": "Grande", "fontXlarge": "Extra Grande", "sound": "Som", "soundPack": "Pacote de Som", "volume": "Volume do Timer", "haptics": "Vibração", "countdownSound": "Som de Contagem (3-2-1)", "timerDefaults": "Padrões do Timer", "defaultPrepare": "Tempo de Preparo Padrão", "defaultCooldown": "Volta à Calma Padrão", "keepScreenAwake": "Manter Tela Ligada", "language": "Idioma", "premium": "Premium", "upgradeToPremium": "Assinar Premium", "restorePurchases": "Restaurar Compras", "about": "Sobre", "rateApp": "Avaliar FitTimer", "sendFeedback": "Enviar Feedback", "privacyPolicy": "Política de Privacidade", "termsOfService": "Termos de Uso", "version": "Versão {{version}}" },
    "premium": { "title": "Liberar Premium", "subtitle": "Leve seu treino para o próximo nível", "feature1": "Timers ilimitados", "feature2": "Histórico completo", "feature3": "Todos os temas de cor", "feature4": "Todos os pacotes de som", "feature5": "Sem anúncios", "feature6": "Exportar dados", "monthly": "Mensal", "yearly": "Anual", "lifetime": "Vitalício", "monthlyPrice": "{{price}}/mês", "yearlyPrice": "{{price}}/ano", "lifetimePrice": "{{price}} único", "bestValue": "Melhor Oferta", "subscribe": "Assinar", "restore": "Restaurar Compras", "terms": "Renovação automática. Cancele quando quiser." },
    "onboarding": { "welcome": "Bem-vindo ao FitTimer", "subtitle": "O timer de intervalos que realmente funciona", "feature1Title": "Design Incrível", "feature1Desc": "Um timer tão premium quanto seu treino", "feature2Title": "Áudio Confiável", "feature2Desc": "Toca sobre sua música, nunca interrompe", "feature3Title": "Acompanhe seu Progresso", "feature3Desc": "Calendário, sequências e estatísticas", "pickStyle": "Qual é o seu estilo de treino?", "notifications": "Mantenha o Foco", "notificationsDesc": "Receba lembretes para manter sua sequência", "enableNotifications": "Ativar Notificações", "skip": "Pular", "next": "Próximo", "getStarted": "Começar" },
    "categories": { "tabata": "Tabata", "hiit": "HIIT", "boxing": "Boxe", "crossfit": "CrossFit", "circuit": "Circuito", "stretching": "Alongamento", "custom": "Personalizado" },
    "common": { "cancel": "Cancelar", "confirm": "Confirmar", "delete": "Excluir", "edit": "Editar", "save": "Salvar", "close": "Fechar", "ok": "OK", "seconds": "{{count}}s", "minutes": "{{count}}min", "hours": "{{count}}h", "and": "e", "free": "Grátis", "premiumBadge": "PRO", "locked": "Recurso Premium" },
    "format": { "workRest": "{{work}}s treino · {{rest}}s descanso · {{rounds}} rounds", "totalTime": "{{time}} total", "roundsCount": "{{count}} rounds", "setsCount": "{{count}} séries" },
    "notifications": { "workTitle": "TREINO", "workBody": "Round {{round}} — Vai!", "restTitle": "DESCANSO", "restBody": "Descanso — {{seconds}}s", "completeTitle": "Treino Concluído!", "completeBody": "Mandou bem! Você concluiu seu treino.", "streakReminder": "Não quebre sua sequência de {{count}} dias!", "streakReminderBody": "Abra o FitTimer para manter sua sequência" }
  }
}
```

---

## Remaining 6 languages follow the same structure.
## See separate files: fr.json, ja.json, ko.json, zh.json, ar.json

### French (fr.json) — Key translations:
- WORK = "EFFORT", REST = "REPOS", PREPARE = "PRÉPAREZ-VOUS"
- Greeting = "Prêt à t'entraîner ?"
- Streak = "Série de {{count}} jours"

### Japanese (ja.json) — Key translations:
- WORK = "トレーニング", REST = "休憩", PREPARE = "準備"
- Greeting = "トレーニングの準備はできた？"
- Streak = "{{count}}日連続"

### Korean (ko.json) — Key translations:
- WORK = "운동", REST = "휴식", PREPARE = "준비"
- Greeting = "운동할 준비 됐어?"
- Streak = "{{count}}일 연속"

### Chinese Simplified (zh.json) — Key translations:
- WORK = "训练", REST = "休息", PREPARE = "准备"
- Greeting = "准备好训练了吗？"
- Streak = "连续{{count}}天"

### Arabic (ar.json) — Key translations:
- WORK = "تمرين", REST = "راحة", PREPARE = "استعد"
- Greeting = "مستعد للتمرين؟"
- Streak = "سلسلة {{count}} يوم"
- NOTE: RTL layout support required (set `writingDirection: 'rtl'` for Arabic)
