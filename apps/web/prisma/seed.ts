import { PrismaClient, Role, AccountType, KeyStatus, TokenType, DocumentStatus, AppointmentStatus, ApiKeyMode, OrgRole } from "@prisma/client";
import { hash } from "@node-rs/argon2";
import crypto from "crypto";
import { ARTICLES } from "../src/lib/articles";

const prisma = new PrismaClient();

const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

function sha256(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

async function main() {
  console.log("🌱 Starting CyberPlus database seed...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.attackAttempt.deleteMany();
  await prisma.verificationEvent.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.nullifier.deleteMany();
  await prisma.connectedApp.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.location.deleteMany();
  await prisma.documentSubmission.deleteMany();
  await prisma.keyEvent.deleteMany();
  await prisma.identityKey.deleteMany();
  await prisma.groupLeaf.deleteMany();
  await prisma.groupRoot.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.emailToken.deleteMany();
  await prisma.resetToken.deleteMany();
  await prisma.passkey.deleteMany();
  await prisma.session.deleteMany();
  await prisma.ticketReply.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.webhookDelivery.deleteMany();
  await prisma.webhook.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.usageRecord.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.duressFlag.deleteMany();
  await prisma.recoveryApproval.deleteMany();
  await prisma.recoveryRequest.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared prior records.");

  // Pre-compute common password hashes
  const userPassHash = await hash("DemoPassword123!", ARGON2_OPTIONS);
  const officerPassHash = await hash("OfficerPassword123!", ARGON2_OPTIONS);
  const adminPassHash = await hash("AdminPassword123!", ARGON2_OPTIONS);
  const bizPassHash = await hash("BusinessPassword123!", ARGON2_OPTIONS);

  // 1. Seed Locations
  console.log("Creating Partner & Certified Center locations...");
  const locNY = await prisma.location.create({
    data: {
      name: "CyberPlus Partner Center — Manhattan",
      address: "350 5th Avenue, Suite 4200",
      city: "New York",
      country: "United States",
      postalCode: "10118",
      phone: "+1 (212) 555-0199",
      active: true,
    },
  });

  const locLondon = await prisma.location.create({
    data: {
      name: "CyberPlus Certified Node — Financial District",
      address: "100 Bishopsgate, Level 18",
      city: "London",
      country: "United Kingdom",
      postalCode: "EC2N 4AG",
      phone: "+44 20 7946 0912",
      active: true,
    },
  });

  const locSingapore = await prisma.location.create({
    data: {
      name: "CyberPlus Identity Anchor — Marina Bay",
      address: "10 Collyer Quay, Ocean Financial Centre",
      city: "Singapore",
      country: "Singapore",
      postalCode: "049315",
      phone: "+65 6789 0123",
      active: true,
    },
  });

  // 2. Seed Articles
  console.log("Seeding research articles...");
  for (const art of ARTICLES) {
    await prisma.article.create({
      data: {
        slug: art.slug,
        title: art.title,
        excerpt: art.excerpt,
        body: art.body,
        category: art.category,
        readTime: art.readTime,
        publishedAt: new Date(art.publishedAt),
      },
    });
  }

  // 3. Seed Demo Individual User
  console.log("Creating Demo Individual User (Alex Vance)...");
  const demoUser = await prisma.user.create({
    data: {
      name: "Alex Vance",
      email: "demo@cyberplus.id",
      passwordHash: userPassHash,
      emailVerified: true,
      accountType: AccountType.INDIVIDUAL,
      role: Role.USER,
      duressCodeHash: await hash("9999", ARGON2_OPTIONS), // Duress PIN
    },
  });

  const demoProfile = await prisma.profile.create({
    data: {
      userId: demoUser.id,
      tier: 2,
      status: KeyStatus.ACTIVE,
      lastVerifiedAt: new Date(Date.now() - 3600 * 1000 * 4), // 4 hours ago
    },
  });

  // Demo user's active identity key
  const demoCommitment = "2158974526314896541235896478512369854712563984125748963214589632";
  const demoKey = await prisma.identityKey.create({
    data: {
      profileId: demoProfile.id,
      commitment: demoCommitment,
      tier: 2,
      status: KeyStatus.ACTIVE,
      isSoftware: false,
      activatesAt: new Date(Date.now() - 86400 * 1000 * 7),
    },
  });

  await prisma.keyEvent.create({
    data: {
      keyId: demoKey.id,
      eventType: "CREATED",
      detail: "Hardware passkey enrolled via TouchID WebAuthn PRF",
      timestamp: new Date(Date.now() - 86400 * 1000 * 7),
    },
  });

  // Seed Merkle group leaf and root for Tier 2
  await prisma.groupLeaf.create({
    data: {
      groupName: "verified-humans-tier2",
      commitment: demoCommitment,
      leafIndex: 0,
    },
  });

  const mockRoot = "0x7a89b3f4c1e2894567123abcdef8901234567890abcdef1234567890abcdef12";
  await prisma.groupRoot.create({
    data: {
      groupName: "verified-humans-tier2",
      root: mockRoot,
      depth: 20,
      size: 1,
    },
  });

  // Connected Apps for Alex Vance
  await prisma.connectedApp.createMany({
    data: [
      {
        userId: demoUser.id,
        appId: "demo.social.feed",
        appName: "CyberPulse Social Feed",
        pseudonymousId: "0x39a1f8b4c2e91278",
      },
      {
        userId: demoUser.id,
        appId: "demo.reviews.store",
        appName: "Verified Product Reviews",
        pseudonymousId: "0x89b14c3e7a02df14",
      },
      {
        userId: demoUser.id,
        appId: "demo.bank.wire",
        appName: "Acrobatics Financial Treasury",
        pseudonymousId: "0x77c2e01b4491ac38",
      },
    ],
  });

  // Document review record for Alex
  await prisma.documentSubmission.create({
    data: {
      userId: demoUser.id,
      docType: "PASSPORT",
      docNumber: "USA-998241512",
      fullName: "Alex Vance",
      country: "United States",
      status: DocumentStatus.APPROVED,
      reviewedBy: "Officer Sarah Jenkins",
      reviewedAt: new Date(Date.now() - 86400 * 1000 * 6),
      reviewNotes: "Physical passport hologram and MRZ verified at Partner Center.",
    },
  });

  // Completed Appointment for Alex
  await prisma.appointment.create({
    data: {
      userId: demoUser.id,
      locationId: locNY.id,
      dateTime: new Date(Date.now() - 86400 * 1000 * 6),
      tier: 2,
      status: AppointmentStatus.COMPLETED,
      completedBy: "Officer Sarah Jenkins",
      notes: "In-person biometric confirmation matched with US Passport.",
    },
  });

  // 4. Seed Officers
  console.log("Creating Officer Accounts...");
  const officer1 = await prisma.user.create({
    data: {
      name: "Officer Sarah Jenkins",
      email: "officer1@cyberplus.id",
      passwordHash: officerPassHash,
      emailVerified: true,
      role: Role.OFFICER,
      accountType: AccountType.INDIVIDUAL,
    },
  });

  const officer2 = await prisma.user.create({
    data: {
      name: "Officer Marcus Thorne",
      email: "officer2@cyberplus.id",
      passwordHash: officerPassHash,
      emailVerified: true,
      role: Role.OFFICER,
      accountType: AccountType.INDIVIDUAL,
    },
  });

  // 5. Seed Admin
  console.log("Creating Administrator Account...");
  const adminUser = await prisma.user.create({
    data: {
      name: "System Administrator",
      email: "admin@cyberplus.id",
      passwordHash: adminPassHash,
      emailVerified: true,
      role: Role.ADMIN,
      accountType: AccountType.INDIVIDUAL,
    },
  });

  // 6. Seed Demo Business & Members
  console.log("Creating Business Organization (Acrobatics Financial Tech)...");
  const bizOwner = await prisma.user.create({
    data: {
      name: "Elena Rostova",
      email: "elena@acrobatics.finance",
      passwordHash: bizPassHash,
      emailVerified: true,
      role: Role.USER,
      accountType: AccountType.BUSINESS,
    },
  });

  const org = await prisma.organization.create({
    data: {
      name: "Acrobatics Financial Tech",
      slug: "acrobatics-fintech",
      plan: "PILOT_BUSINESS",
      stripeCustomerId: "cus_test_acrobatics_9941",
    },
  });

  await prisma.membership.create({
    data: {
      orgId: org.id,
      userId: bizOwner.id,
      role: OrgRole.OWNER,
    },
  });

  // 4 additional team members
  const memberData = [
    { name: "David Kim", email: "david@acrobatics.finance", role: OrgRole.ADMIN, tier: 3 },
    { name: "Liam O'Connor", email: "liam@acrobatics.finance", role: OrgRole.MEMBER, tier: 2 },
    { name: "Zoe Chen", email: "zoe@acrobatics.finance", role: OrgRole.MEMBER, tier: 2 },
    { name: "Jordan Bell", email: "jordan@acrobatics.finance", role: OrgRole.MEMBER, tier: 1 },
  ];

  for (const m of memberData) {
    const memUser = await prisma.user.create({
      data: {
        name: m.name,
        email: m.email,
        passwordHash: bizPassHash,
        emailVerified: true,
        role: Role.USER,
        accountType: AccountType.BUSINESS,
      },
    });

    await prisma.profile.create({
      data: {
        userId: memUser.id,
        tier: m.tier,
        status: KeyStatus.ACTIVE,
      },
    });

    await prisma.membership.create({
      data: {
        orgId: org.id,
        userId: memUser.id,
        role: m.role,
      },
    });
  }

  // Organization API Keys (Sandbox and Live)
  const apiKeyRaw = "cp_test_acrobatics_demo_key_9941";
  await prisma.apiKey.create({
    data: {
      orgId: org.id,
      name: "Primary Treasury Service Key",
      prefix: "cp_test_",
      keyHash: sha256(apiKeyRaw),
      mode: ApiKeyMode.SANDBOX,
    },
  });

  // Organization Webhook
  await prisma.webhook.create({
    data: {
      orgId: org.id,
      url: "https://acrobatics.finance/api/cyberplus-webhook",
      secret: "whsec_mock_hmac_secret_acrobatics_2026",
      events: "verification.succeeded,verification.failed,key.frozen,key.rotated",
      active: true,
    },
  });

  // Usage records
  const today = new Date().toISOString().split("T")[0];
  await prisma.usageRecord.create({
    data: {
      orgId: org.id,
      date: today,
      verificationsCount: 142,
      sandboxCount: 840,
    },
  });

  // 7. Seed Attack Attempts (Demonstrating Frozen Key Defense)
  console.log("Seeding attack attempts against a frozen key...");
  const compromisedKey = await prisma.identityKey.create({
    data: {
      profileId: demoProfile.id,
      commitment: "9988776655443322110099887766554433221100998877665544332211001122",
      tier: 1,
      status: KeyStatus.FROZEN,
      activatesAt: new Date(Date.now() - 86400 * 1000 * 30),
      revokedAt: new Date(Date.now() - 86400 * 1000 * 2), // Frozen 2 days ago
    },
  });

  await prisma.attackAttempt.createMany({
    data: [
      {
        keyId: compromisedKey.id,
        appId: "phishing.finance.portal",
        region: "AP-South (Tokyo)",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) NeuralAvatar/2.4 Bot",
        attemptType: "FROZEN_KEY_USE",
        timestamp: new Date(Date.now() - 3600 * 1000 * 5),
      },
      {
        keyId: compromisedKey.id,
        appId: "enterprise.wire.transfer",
        region: "EU-West (Frankfurt)",
        userAgent: "Python-urllib/3.11 DeepfakeAgent/1.0",
        attemptType: "FROZEN_KEY_USE",
        timestamp: new Date(Date.now() - 3600 * 1000 * 3),
      },
      {
        keyId: compromisedKey.id,
        appId: "enterprise.wire.transfer",
        region: "EU-West (Frankfurt)",
        userAgent: "Python-urllib/3.11 DeepfakeAgent/1.0",
        attemptType: "FROZEN_KEY_USE",
        timestamp: new Date(Date.now() - 3600 * 1000 * 1),
      },
    ],
  });

  // 8. Seed Hash-Chained Audit Log
  console.log("Building tamper-evident cryptographic hash chain...");
  const auditEntries = [
    {
      userId: adminUser.id,
      action: "GENESIS_NODE_INITIALIZED",
      detail: JSON.stringify({ version: "0.1.0-prototype", node: "CyberPlus Core Alpha" }),
    },
    {
      userId: demoUser.id,
      action: "USER_ENROLLMENT_COMPLETED",
      detail: JSON.stringify({ tier: 1, method: "TouchID WebAuthn PRF" }),
    },
    {
      userId: officer1.id,
      action: "TIER2_IN_PERSON_VERIFIED",
      detail: JSON.stringify({ candidate: demoUser.email, location: "Manhattan Partner Center" }),
    },
    {
      userId: demoUser.id,
      action: "KEY_FROZEN_ON_SUSPICION",
      detail: JSON.stringify({ reason: "Unrecognized video conference authorization request" }),
    },
    {
      userId: null,
      action: "ATTACK_ATTEMPT_BLOCKED",
      detail: JSON.stringify({ appId: "enterprise.wire.transfer", defense: "Key status FROZEN" }),
    },
  ];

  let prevHash = "0000000000000000000000000000000000000000000000000000000000000000";
  for (const entry of auditEntries) {
    const content = `${entry.userId || "anonymous"}|${entry.action}|${entry.detail}|${prevHash}`;
    const hashVal = sha256(content);

    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        detail: entry.detail,
        prevHash,
        hash: hashVal,
      },
    });

    prevHash = hashVal;
  }

  // 9. Seed Pending Recovery Request (for Officer Portal demo)
  console.log("Seeding pending two-officer recovery request...");
  const recoveryReq = await prisma.recoveryRequest.create({
    data: {
      userId: demoUser.id,
      status: "PENDING_SECOND_APPROVAL",
      duressTriggered: false,
      newCommitment: "7744112233885566990011223344556677889900112233445566778899001122",
      activatesAt: new Date(Date.now() + 48 * 3600 * 1000), // 48-hour delay
    },
  });

  // Approved by first officer (Sarah Jenkins), awaiting Marcus Thorne
  await prisma.recoveryApproval.create({
    data: {
      requestId: recoveryReq.id,
      officerId: officer1.id,
      step: 1,
      notes: "Citizen physically inspected with state driver's license. Hologram checked.",
      approvedAt: new Date(Date.now() - 3600 * 1000 * 2),
    },
  });

  console.log("✅ Seed completed successfully!\n");
  console.log("================ DEMO CREDENTIALS ================");
  console.log("👤 Demo Individual:   demo@cyberplus.id    / DemoPassword123!");
  console.log("🏢 Business Owner:     elena@acrobatics.finance / BusinessPassword123!");
  console.log("👮 Officer 1:          officer1@cyberplus.id / OfficerPassword123!");
  console.log("👮 Officer 2:          officer2@cyberplus.id / OfficerPassword123!");
  console.log("⚡ System Admin:       admin@cyberplus.id   / AdminPassword123!");
  console.log("===================================================");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

