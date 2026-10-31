/**
 * CyberPlus Embeddable Verification Widget
 * Standalone browser bundle
 */

export function mountWidget(config) {
  const container = document.getElementById(config.containerId);
  if (!container) {
    console.error(`[CyberPlus Widget] Container #${config.containerId} not found`);
    return { destroy: () => {} };
  }

  const wrapper = document.createElement("div");
  wrapper.className = "cyberplus-widget-wrapper";
  wrapper.innerHTML = `
    <button class="cyberplus-verify-btn" type="button" aria-label="Verify with CyberPlus">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
      <span>Verify with CyberPlus</span>
    </button>
    <style>
      .cyberplus-widget-wrapper { display: inline-block; font-family: system-ui, -apple-system, sans-serif; }
      .cyberplus-verify-btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 9px 18px; border: none; border-radius: 8px;
        background: linear-gradient(135deg, #0d9488, #0891b2);
        color: #ffffff; font-size: 13px; font-weight: 600;
        cursor: pointer; transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(13, 148, 136, 0.25);
      }
      .cyberplus-verify-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(13, 148, 136, 0.4);
      }
      .cyberplus-verify-btn:disabled {
        opacity: 0.6; cursor: not-allowed; transform: none;
      }
    </style>
  `;

  const btn = wrapper.querySelector(".cyberplus-verify-btn");
  btn.addEventListener("click", async () => {
    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span>Verifying human...</span>`;

    try {
      const baseUrl = config.baseUrl || "/api/v1";
      // 1. Request challenge
      const chalRes = await fetch(`${baseUrl}/challenges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          appScope: config.appScope || window.location.hostname,
          requiredTier: config.requiredTier || 1,
        }),
      });

      const challenge = await chalRes.json();
      if (!chalRes.ok) throw new Error(challenge.error || "Challenge creation failed");

      // 2. Client-side verification
      const verifyRes = await fetch(`${baseUrl}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          challengeId: challenge.id,
          proof: {
            merkleTreeRoot: challenge.scope,
            nullifier: "0x" + Math.random().toString(36).substring(2, 18),
          },
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.verified) {
        throw new Error(verifyData.reason || "Proof verification rejected");
      }

      btn.style.background = "#059669";
      btn.innerHTML = `<span>✓ Verified Human</span>`;

      if (config.onVerified) {
        config.onVerified({
          nullifier: verifyData.nullifier,
          signedToken: verifyData.signedToken,
          tier: verifyData.tier,
        });
      }
    } catch (err) {
      btn.style.background = "#171a20";
      btn.innerHTML = `<span>✕ Verification Failed</span>`;
      setTimeout(() => {
        btn.disabled = false;
        btn.style.background = "linear-gradient(135deg, #0d9488, #0891b2)";
        btn.innerHTML = originalText;
      }, 3000);
      if (config.onError) config.onError(err);
    }
  });

  container.appendChild(wrapper);
  return {
    destroy: () => wrapper.remove(),
  };
}

export function renderBadge(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isDark = options.theme === "dark";
  const badge = document.createElement("span");
  badge.className = "cyberplus-badge";
  badge.style.cssText = `
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 9999px; font-size: 11px;
    font-weight: 600; font-family: system-ui, sans-serif;
    background: ${isDark ? "#064e3b" : "#ecfdf5"};
    color: ${isDark ? "#34d399" : "#059669"};
    border: 1px solid ${isDark ? "#059669" : "#a7f3d0"};
  `;
  badge.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
    <span>Verified Human</span>
  `;
  container.appendChild(badge);
}

