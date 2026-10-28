// Route chunks that are worth fetching before the user navigates.
// App.jsx uses the same loaders for lazy(), so a preload here is reused
// instead of downloaded again.
export const loadDashboard = () => import('@/app/dashboard/page')

// Start downloading the dashboard while the user is still typing on the
// sign-in / sign-up form, so entering the app after auth is instant.
export function preloadDashboard() {
  const run = () => loadDashboard().catch(() => { /* retried on navigation */ })
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 2000 })
  else setTimeout(run, 300)
}
