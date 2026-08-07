// ============================================
// CivicVoice Location Service
// Handles GPS permission, live position watching,
// and reverse geocoding via Nominatim.
// ============================================

const LOCATION_STORAGE_KEY = 'civicvoice_location';
const UPDATE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

class LocationService {
  constructor() {
    this.lat = null;
    this.lng = null;
    this.city = null;
    this.area = null;
    this.accuracy = null;
    this.permissionState = null; // 'granted' | 'denied' | 'prompt' | null
    this._watchId = null;
    this._listeners = [];
    this._lastGeocodeTime = 0;
    this._geocodeCooldown = 60 * 1000; // 1 min between geocode calls
    this._loadFromStorage();
  }

  // ── Persist / Load ──────────────────────────────────
  _loadFromStorage() {
    try {
      const stored = JSON.parse(localStorage.getItem(LOCATION_STORAGE_KEY) || 'null');
      if (stored && stored.lat && stored.lng) {
        this.lat = stored.lat;
        this.lng = stored.lng;
        this.city = stored.city || null;
        this.area = stored.area || null;
        this.permissionState = stored.permissionState || null;
      }
    } catch (_) {}
  }

  _saveToStorage() {
    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({
        lat: this.lat,
        lng: this.lng,
        city: this.city,
        area: this.area,
        permissionState: this.permissionState,
        savedAt: Date.now(),
      }));
    } catch (_) {}
  }

  // ── Event Bus ──────────────────────────────────────
  on(listener) {
    this._listeners.push(listener);
    // Immediately fire with current data if available
    if (this.lat && this.lng) {
      listener(this._payload());
    }
  }

  off(listener) {
    this._listeners = this._listeners.filter(l => l !== listener);
  }

  _emit() {
    const payload = this._payload();
    this._listeners.forEach(l => l(payload));
    // Also dispatch a DOM event for components that prefer it
    window.dispatchEvent(new CustomEvent('locationUpdated', { detail: payload }));
  }

  _payload() {
    return {
      lat: this.lat,
      lng: this.lng,
      city: this.city,
      area: this.area,
      accuracy: this.accuracy,
      permissionState: this.permissionState,
      displayLabel: this._displayLabel(),
    };
  }

  _displayLabel() {
    if (!this.city && !this.area) return null;
    if (this.area && this.city && this.area !== this.city) {
      return `${this.area}, ${this.city}`;
    }
    return this.city || this.area;
  }

  // ── Permission Check ───────────────────────────────
  async checkPermission() {
    if (!navigator.permissions) return null;
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      this.permissionState = result.state;
      result.onchange = () => {
        this.permissionState = result.state;
        if (result.state === 'granted') this.startWatching();
      };
      return result.state;
    } catch (_) {
      return null;
    }
  }

  // ── Core: Request + Start Watching ─────────────────
  async init() {
    await this.checkPermission();

    // If previously denied, don't bother (avoid annoying the user)
    if (this.permissionState === 'denied') {
      return { success: false, reason: 'denied' };
    }

    return this.startWatching();
  }

  async startWatching() {
    this._stopWatching();

    const isNative = window.Capacitor && window.Capacitor.isNativePlatform();

    if (isNative) {
      return this._initNative();
    } else {
      return this._initBrowser();
    }
  }

  async _initBrowser() {
    if (!navigator.geolocation) {
      return { success: false, reason: 'unsupported' };
    }

    try {
      // One-shot first to get a fast fix
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        })
      );

      this.permissionState = 'granted';
      await this._handlePosition(pos);

      // Then watch for updates
      this._watchId = navigator.geolocation.watchPosition(
        async (p) => { await this._handlePosition(p); },
        (err) => { console.warn('[LocationService] watchPosition error:', err.message); },
        { enableHighAccuracy: true, maximumAge: 300000 }
      );

      return { success: true };
    } catch (err) {
      this.permissionState = err.code === 1 ? 'denied' : 'error';
      this._saveToStorage();
      return { success: false, reason: this.permissionState, error: err };
    }
  }

  async _initNative() {
    try {
      const { Geolocation } = window.Capacitor.Plugins;

      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      this.permissionState = 'granted';
      await this._handlePosition({
        coords: {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }
      });

      // Watch via Capacitor
      this._watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        async (p, err) => {
          if (err) { console.warn('[LocationService] Native watch error:', err); return; }
          await this._handlePosition({ coords: p.coords });
        }
      );

      return { success: true };
    } catch (err) {
      this.permissionState = 'denied';
      this._saveToStorage();
      return { success: false, reason: 'denied', error: err };
    }
  }

  async _handlePosition(pos) {
    const { latitude: lat, longitude: lng, accuracy } = pos.coords;

    // Skip if position barely changed (within ~100m) and we recently geocoded
    const moved = !this.lat || !this.lng ||
      Math.abs(lat - this.lat) > 0.001 ||
      Math.abs(lng - this.lng) > 0.001;

    this.lat = lat;
    this.lng = lng;
    this.accuracy = accuracy;

    // Emit immediately with coordinates (city/area may come later from geocode)
    this._emit();

    // Reverse-geocode only if moved significantly or enough time has passed
    const now = Date.now();
    if (moved || now - this._lastGeocodeTime > this._geocodeCooldown) {
      await this._reverseGeocode(lat, lng);
      this._lastGeocodeTime = now;
    }

    this._saveToStorage();
  }

  async _reverseGeocode(lat, lng) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        { headers: { 'Accept-Language': 'en', 'User-Agent': 'CivicVoiceApp/1.0' } }
      );
      const geo = await res.json();
      const addr = geo.address || {};

      this.city = addr.city || addr.town || addr.municipality ||
                  addr.county || addr.state_district || addr.state || '';
      this.area = addr.suburb || addr.neighbourhood || addr.quarter || addr.village || '';

      this._emit();
      this._saveToStorage();
    } catch (_) {
      // Geocoding failed — still emit with coordinates only
      this._emit();
    }
  }

  _stopWatching() {
    if (this._watchId !== null) {
      if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        try { window.Capacitor.Plugins.Geolocation.clearWatch({ id: this._watchId }); } catch (_) {}
      } else {
        navigator.geolocation.clearWatch(this._watchId);
      }
      this._watchId = null;
    }
  }

  // ── Quick Location (for use inside modals) ─────────
  async getCurrentOnce() {
    if (this.lat && this.lng) return this._payload();
    return new Promise((resolve) => {
      const cleanup = (payload) => {
        this.off(cleanup);
        resolve(payload);
      };
      this.on(cleanup);
      this.startWatching(); // triggers a fresh fix
      // Timeout fallback
      setTimeout(() => {
        this.off(cleanup);
        resolve(this.lat ? this._payload() : null);
      }, 8000);
    });
  }

  destroy() {
    this._stopWatching();
    this._listeners = [];
  }
}

export const locationService = new LocationService();
