'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2, ExternalLink, Loader2, Smartphone } from 'lucide-react';

type PushNotificationPreferences = {
  enabled: boolean;
  anchorsEnabled: boolean;
  eventsEnabled: boolean;
  anchorLeadMinutes: number;
  eventLeadMinutes: number;
  timezone: string;
};

type PushSettingsResponse = {
  preferences: PushNotificationPreferences;
  subscriptionCount: number;
  isConfigured: boolean;
  publicKey: string | null;
};

const DEFAULT_PREFERENCES: PushNotificationPreferences = {
  enabled: false,
  anchorsEnabled: true,
  eventsEnabled: true,
  anchorLeadMinutes: 10,
  eventLeadMinutes: 15,
  timezone: 'America/New_York',
};

const LEAD_OPTIONS = [5, 10, 15, 30, 60];

function urlBase64ToApplicationServerKey(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const bytes = Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function getIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const standaloneNavigator = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || standaloneNavigator.standalone === true;
}

export function PushNotificationSettings() {
  const [settings, setSettings] = useState<PushSettingsResponse | null>(null);
  const [preferences, setPreferences] = useState<PushNotificationPreferences>(DEFAULT_PREFERENCES);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isStandalone, setIsStandalone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscribeBusy, setSubscribeBusy] = useState(false);
  const [testBusy, setTestBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSupported = typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;

  useEffect(() => {
    setIsStandalone(getIsStandalone());
    if (!isSupported) {
      setPermission('unsupported');
      setLoading(false);
      return;
    }

    setPermission(Notification.permission);
    const run = async () => {
      try {
        const response = await fetch('/api/push/settings', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Unable to load notification settings.');
        }
        const payload = (await response.json()) as PushSettingsResponse;
        setSettings(payload);
        setPreferences(payload.preferences);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load notification settings.');
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [isSupported]);

  const canEnable = useMemo(
    () =>
      Boolean(
        settings?.isConfigured &&
          settings.publicKey &&
          permission !== 'denied' &&
          isSupported,
      ),
    [isSupported, permission, settings?.isConfigured, settings?.publicKey],
  );

  const updatePreferences = async (next: PushNotificationPreferences) => {
    setPreferences(next);
    setSaving(true);
    setNotice(null);
    setError(null);
    try {
      const response = await fetch('/api/push/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: next }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Unable to save notification preferences.');
      }
      setSettings((current) =>
        current
          ? {
              ...current,
              preferences: next,
            }
          : current,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save notification preferences.');
    } finally {
      setSaving(false);
    }
  };

  const handleEnable = async () => {
    if (!settings?.publicKey || !isSupported) return;
    setSubscribeBusy(true);
    setNotice(null);
    setError(null);
    try {
      const sw = await navigator.serviceWorker.ready;
      let nextPermission = Notification.permission;
      if (nextPermission !== 'granted') {
        nextPermission = await Notification.requestPermission();
      }
      setPermission(nextPermission);
      if (nextPermission !== 'granted') {
        throw new Error('Notification permission was not granted.');
      }

      let subscription = await sw.pushManager.getSubscription();
      if (!subscription) {
        subscription = await sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToApplicationServerKey(settings.publicKey),
        });
      }

      const nextPreferences = {
        ...preferences,
        enabled: true,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || preferences.timezone,
      };

      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          preferences: nextPreferences,
        }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Unable to enable push notifications.');
      }

      setPreferences(nextPreferences);
      setSettings((current) =>
        current
          ? {
              ...current,
              preferences: nextPreferences,
              subscriptionCount: Math.max(current.subscriptionCount, 1),
            }
          : current,
      );
      setNotice('Push notifications are enabled on this device.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to enable push notifications.');
    } finally {
      setSubscribeBusy(false);
    }
  };

  const handleDisable = async () => {
    if (!isSupported) return;
    setSubscribeBusy(true);
    setNotice(null);
    setError(null);
    try {
      const sw = await navigator.serviceWorker.ready;
      const subscription = await sw.pushManager.getSubscription();
      if (subscription) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }

      const nextPreferences = { ...preferences, enabled: false };
      await updatePreferences(nextPreferences);
      setSettings((current) =>
        current
          ? {
              ...current,
              subscriptionCount: 0,
              preferences: nextPreferences,
            }
          : current,
      );
      setNotice('Push notifications were disabled on this device.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to disable push notifications.');
    } finally {
      setSubscribeBusy(false);
    }
  };

  const sendTest = async () => {
    setTestBusy(true);
    setNotice(null);
    setError(null);
    try {
      const response = await fetch('/api/push/test', { method: 'POST' });
      const payload = (await response.json().catch(() => null)) as { error?: string; sent?: number } | null;
      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to send test notification.');
      }
      setNotice(payload?.sent ? `Sent ${payload.sent} test notification${payload.sent === 1 ? '' : 's'}.` : 'Test notification sent.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send test notification.');
    } finally {
      setTestBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-border-subtle/60 bg-bg-surface/70 px-5 py-8 text-text-muted">
        <div className="flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading notification settings…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-border-subtle/60 bg-bg-surface/75 px-5 py-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle/60 bg-bg-elevated/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
              <Bell className="h-3.5 w-3.5" />
              iPhone PWA Push
            </div>
            <h1 className="text-xl font-semibold text-text">Notification settings</h1>
            <p className="max-w-xl text-sm text-text-muted">
              Enable reminders for anchors and calendar events on your installed home-screen app.
            </p>
          </div>
          <div className="rounded-2xl border border-border-subtle/60 bg-bg-elevated/65 px-3 py-2 text-right text-xs text-text-muted">
            <div>{isStandalone ? 'Installed on Home Screen' : 'Open from Home Screen on iPhone'}</div>
            <div>{permission === 'unsupported' ? 'Push unsupported' : `Permission: ${permission}`}</div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border-subtle/50 bg-bg-elevated/55 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-muted">Device subscriptions</div>
            <div className="mt-1 text-lg font-semibold text-text">{settings?.subscriptionCount ?? 0}</div>
          </div>
          <div className="rounded-2xl border border-border-subtle/50 bg-bg-elevated/55 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-muted">Server config</div>
            <div className="mt-1 text-lg font-semibold text-text">{settings?.isConfigured ? 'Ready' : 'Missing keys'}</div>
          </div>
          <div className="rounded-2xl border border-border-subtle/50 bg-bg-elevated/55 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-muted">Timezone</div>
            <div className="mt-1 text-lg font-semibold text-text">{preferences.timezone}</div>
          </div>
        </div>

        {!isStandalone && (
          <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/8 px-4 py-3 text-sm text-text-muted">
            iOS only delivers web push to the Home Screen-installed app. Open this page from your installed PWA before enabling notifications.
          </div>
        )}

        {!settings?.isConfigured && (
          <div className="mt-4 rounded-2xl border border-amber-300/30 bg-amber-500/10 px-4 py-3 text-sm text-text-muted">
            Server VAPID keys are not configured yet. The UI is ready, but push delivery will not work until those env vars are set.
          </div>
        )}

        {notice && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-secondary/25 bg-secondary/10 px-4 py-3 text-sm text-text">
            <CheckCircle2 className="h-4 w-4 text-secondary" />
            {notice}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-text">
            {error}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={preferences.enabled ? handleDisable : handleEnable}
            disabled={subscribeBusy || !canEnable}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/12 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/18 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {subscribeBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
            {preferences.enabled ? 'Disable on this device' : 'Enable on this device'}
          </button>
          <button
            type="button"
            onClick={sendTest}
            disabled={testBusy || !preferences.enabled || !settings?.subscriptionCount}
            className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-bg-elevated px-4 py-2 text-sm font-semibold text-text transition hover:bg-bg-surface disabled:cursor-not-allowed disabled:opacity-50"
          >
            {testBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
            Send test notification
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border-subtle/60 bg-bg-surface/75 px-5 py-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-text">Reminder types</h2>
            <p className="mt-1 text-sm text-text-muted">
              These preferences are saved now and will drive the first reminder automation pass.
            </p>
          </div>
          {saving && (
            <div className="inline-flex items-center gap-2 text-xs text-text-muted">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="rounded-2xl border border-border-subtle/50 bg-bg-elevated/50 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-text">Anchor reminders</div>
                <div className="mt-1 text-xs text-text-muted">Upcoming daily anchors like wake, gym, work blocks, and bedtime.</div>
              </div>
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-primary"
                checked={preferences.anchorsEnabled}
                onChange={(event) =>
                  void updatePreferences({ ...preferences, anchorsEnabled: event.target.checked })
                }
              />
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
              Remind me
              <select
                value={preferences.anchorLeadMinutes}
                onChange={(event) =>
                  void updatePreferences({
                    ...preferences,
                    anchorLeadMinutes: Number(event.target.value),
                  })
                }
                className="rounded-full border border-border-subtle bg-bg-surface px-3 py-1 text-sm text-text"
              >
                {LEAD_OPTIONS.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes} min
                  </option>
                ))}
              </select>
              before
            </div>
          </label>

          <label className="rounded-2xl border border-border-subtle/50 bg-bg-elevated/50 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-text">Calendar event reminders</div>
                <div className="mt-1 text-xs text-text-muted">Scheduled items from the calendar and planning surfaces.</div>
              </div>
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-primary"
                checked={preferences.eventsEnabled}
                onChange={(event) =>
                  void updatePreferences({ ...preferences, eventsEnabled: event.target.checked })
                }
              />
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
              Remind me
              <select
                value={preferences.eventLeadMinutes}
                onChange={(event) =>
                  void updatePreferences({
                    ...preferences,
                    eventLeadMinutes: Number(event.target.value),
                  })
                }
                className="rounded-full border border-border-subtle bg-bg-surface px-3 py-1 text-sm text-text"
              >
                {LEAD_OPTIONS.map((minutes) => (
                  <option key={minutes} value={minutes}>
                    {minutes} min
                  </option>
                ))}
              </select>
              before
            </div>
          </label>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border-subtle/60 bg-bg-surface/75 px-5 py-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-text">What’s next</h2>
            <p className="mt-1 text-sm text-text-muted">
              Timer-complete pushes and automatic reminder dispatch can build on this same device enrollment.
            </p>
          </div>
          <Link
            href="/dashboard/day-planner"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
          >
            Open planner
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
