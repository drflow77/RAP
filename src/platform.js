// ¿Corre dentro del contenedor nativo (Capacitor/Android) y no en un navegador?
// Capacitor inyecta window.Capacitor antes de cargar la página, así que no hace
// falta importar el paquete en la versión web.
export const isNative = Boolean(window.Capacitor?.isNativePlatform?.());
