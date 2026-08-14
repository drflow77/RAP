// InstallBanner Component — guía de instalación de la PWA
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  window.dispatchEvent(new CustomEvent('pwa-installable'));
});

export function renderInstallBanner(container) {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isStandalone || sessionStorage.getItem('rap_install_dismissed')) {
    container.innerHTML = '';
    return;
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  container.innerHTML = `
    <div class="install-banner">
      <div class="install-banner-text">
        <h4>Instalar RAP en tu teléfono</h4>
        <p>${isIOS ? 'Toca Compartir y elige “Añadir a pantalla de inicio”.' : 'Instálala como app nativa para usarla sin conexión.'}</p>
      </div>

      <div class="install-banner-actions">
        <button id="btn-pwa-install-action" class="install-banner-btn">${isIOS ? '¿Cómo?' : 'Instalar'}</button>
        <button id="btn-pwa-dismiss" class="install-banner-close" aria-label="Descartar">✕</button>
      </div>
    </div>
  `;

  const actionBtn = container.querySelector('#btn-pwa-install-action');
  const dismissBtn = container.querySelector('#btn-pwa-dismiss');

  actionBtn?.addEventListener('click', async () => {
    if (isIOS) {
      alert('Para instalar en iPhone o iPad:\n1. Toca el icono de Compartir en la barra de Safari.\n2. Baja y selecciona "Añadir a pantalla de inicio".');
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') container.innerHTML = '';
      deferredPrompt = null;
    } else {
      alert('Para instalar en Android:\nAbre el menú de Chrome (⋮) y selecciona "Instalar aplicación".');
    }
  });

  dismissBtn?.addEventListener('click', () => {
    sessionStorage.setItem('rap_install_dismissed', 'true');
    container.innerHTML = '';
  });

  window.addEventListener('pwa-installable', () => {
    if (!isStandalone && !sessionStorage.getItem('rap_install_dismissed')) {
      renderInstallBanner(container);
    }
  });
}
