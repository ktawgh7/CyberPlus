import { db } from "./db";
import { hmacSha256 } from "./crypto";

export async function dispatchWebhook(orgId: string, eventType: string, payload: Record<string, unknown>) {
  try {
    const webhooks = await db.webhook.findMany({
      where: {
        orgId,
        active: true,
      },
    });

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const payloadString = JSON.stringify(payload);

    for (const hook of webhooks) {
      const allowedEvents = hook.events.split(",").map((e) => e.trim());
      if (!allowedEvents.includes(eventType) && !allowedEvents.includes("*")) {
        continue;
      }

      // HMAC signature: SHA256(timestamp + "." + payload, secret)
      const signedData = `${timestamp}.${payloadString}`;
      const signature = hmacSha256(signedData, hook.secret);
      const signatureHeader = `t=${timestamp},v1=${signature}`;

      // Dispatch async (fire and log)
      try {
        const response = await fetch(hook.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "CyberPlus-Signature": signatureHeader,
            "CyberPlus-Event": eventType,
          },
          body: payloadString,
          signal: AbortSignal.timeout(5000), // 5s timeout
        });

        await db.webhookDelivery.create({
          data: {
            webhookId: hook.id,
            event: eventType,
            payload: payloadString,
            statusCode: response.status,
            success: response.ok,
            attempts: 1,
          },
        });
      } catch (err: any) {
        await db.webhookDelivery.create({
          data: {
            webhookId: hook.id,
            event: eventType,
            payload: payloadString,
            statusCode: 0,
            response: err.message || "Connection timeout",
            success: false,
            attempts: 1,
          },
        });
      }
    }
  } catch (err) {
    console.error("Webhook dispatch error:", err);
  }
}

