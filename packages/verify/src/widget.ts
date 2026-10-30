/**
 * @cyberplus/verify/widget - Embeddable verification widget
 * 
 * Renders a "Verify with CyberPlus" button and badge.
 */

export interface WidgetConfig {
  /** Container element ID */
  containerId: string;
  /** Your app's API key (public/sandbox) */
  apiKey: string;
  /** Required verification tier */
  requiredTier?: number;
  /** Callback on successful verification */
  onVerified?: (result: { nullifier: string; signedToken: string }) => void;
  /** Callback on verification failure */
  onError?: (error: Error) => void;
  /** API base URL */
  baseUrl?: string;
  /** Widget theme */
  theme?: 'light' | 'dark' | 'auto';
}

/**
 * Mount the CyberPlus verification widget into a container element.
 */
export function mountWidget(config: WidgetConfig): { destroy: () => void } {
  const container = document.getElementById(config.containerId);
  if (!container) throw new Error(`Container #${config.containerId} not found`);

  // Create widget UI
  const wrapper = document.createElement('div');
  wrapper.className = 'cyberplus-widget';
  wrapper.innerHTML = `
    <button class="cyberplus-verify-btn" type="button">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
      <span>Verify with CyberPlus</span>
    </button>
    <style>
      .cyberplus-widget { font-family: system-ui, -apple-system, sans-serif; }
      .cyberplus-verify-btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 10px 20px; border: none; border-radius: 8px;
        background: linear-gradient(135deg, #0d9488, #0891b2);
        color: white; font-size: 14px; font-weight: 600;
        cursor: pointer; transition: all 0.2s;
      }
      .cyberplus-verify-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(13,148,136,0.4); }
      .cyberplus-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px;
        background: #0d9488; color: white; border-radius: 20px; font-size: 12px; font-weight: 600; }
    </style>
  `;

  const btn = wrapper.querySelector('.cyberplus-verify-btn') as HTMLButtonElement;
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'Verifying…';
    try {
      // Will integrate with real proof generation
      config.onVerified?.({ nullifier: '', signedToken: '' });
    } catch (err) {
      config.onError?.(err as Error);
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg><span>Verify with CyberPlus</span>`;
    }
  });

  container.appendChild(wrapper);
  return {
    destroy: () => { wrapper.remove(); }
  };
}

/**
 * Render a "Verified Human" badge.
 */
export function renderBadge(containerId: string, options?: { theme?: 'light' | 'dark' }): void {
  const container = document.getElementById(containerId);
  if (!container) return;
  const dark = options?.theme === 'dark';
  container.innerHTML = `
    <span class="cyberplus-badge" style="background:${dark ? '#0d9488' : '#f0fdfa'};color:${dark ? '#fff' : '#0d9488'}">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
      Verified Human
    </span>
  `;
}
