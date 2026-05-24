let injected = false;
export function injectFontImport(): void {
  if (injected) return;
  injected = true;
  if (typeof document === 'undefined') return;
  if (document.getElementById('lindenweg-fonts')) return;
  const link = document.createElement('link');
  link.id = 'lindenweg-fonts';
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap';
  document.head.appendChild(link);
}
