export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-bg-base light-ambient-surface flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl border border-border-subtle bg-bg-surface/90 p-6 sm:p-7 shadow-xl text-center">
        <p className="text-meta uppercase tracking-[0.14em] text-text-muted mb-2">Offline Mode</p>
        <h1 className="text-section text-text mb-2">You are offline</h1>
        <p className="text-body text-text-muted">
          Personal LMS cannot reach the network right now. Reconnect and refresh to continue syncing your latest data.
        </p>
      </section>
    </main>
  );
}
