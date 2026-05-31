import { IAMClient, ListAttachedUserPoliciesCommand, ListUserPoliciesCommand, GetUserPolicyCommand, GetPolicyCommand, GetPolicyVersionCommand, SimulatePrincipalPolicyCommand } from "@aws-sdk/client-iam";
import { readFileSync } from "node:fs";

const raw = readFileSync(".env.local", "utf8");
for (const line of raw.split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const iam = new IAMClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.APP_SECRET_ACCESS_KEY,
  },
});

const userArn = "arn:aws:iam::095887736717:user/tsvocal";
const userName = "tsvocal";

console.log("=== Attached managed policies ===");
try {
  const out = await iam.send(new ListAttachedUserPoliciesCommand({ UserName: userName }));
  for (const p of out.AttachedPolicies ?? []) {
    console.log(`- ${p.PolicyName} (${p.PolicyArn})`);
    try {
      const pol = await iam.send(new GetPolicyCommand({ PolicyArn: p.PolicyArn }));
      const ver = await iam.send(new GetPolicyVersionCommand({
        PolicyArn: p.PolicyArn,
        VersionId: pol.Policy.DefaultVersionId,
      }));
      console.log("  JSON:", decodeURIComponent(ver.PolicyVersion.Document));
    } catch (e) {
      console.log(`  (cannot read policy doc: ${e.name})`);
    }
  }
  if ((out.AttachedPolicies ?? []).length === 0) console.log("  (none)");
} catch (e) {
  console.log(`  Failed: ${e.name}. Add iam:ListAttachedUserPolicies permission, or check in console.`);
}

console.log("");
console.log("=== Inline policies ===");
try {
  const out = await iam.send(new ListUserPoliciesCommand({ UserName: userName }));
  for (const n of out.PolicyNames ?? []) {
    console.log(`- ${n}`);
    try {
      const pol = await iam.send(new GetUserPolicyCommand({ UserName: userName, PolicyName: n }));
      console.log("  JSON:", decodeURIComponent(pol.PolicyDocument));
    } catch (e) {
      console.log(`  (cannot read: ${e.name})`);
    }
  }
  if ((out.PolicyNames ?? []).length === 0) console.log("  (none)");
} catch (e) {
  console.log(`  Failed: ${e.name}`);
}

console.log("");
console.log("=== Simulating s3:PutObject on tsvocal-bucket/test.jpg ===");
try {
  const out = await iam.send(new SimulatePrincipalPolicyCommand({
    PolicySourceArn: userArn,
    ActionNames: ["s3:PutObject"],
    ResourceArns: ["arn:aws:s3:::tsvocal-bucket/test.jpg"],
  }));
  for (const r of out.EvaluationResults ?? []) {
    console.log(`  ${r.EvalActionName} on ${r.EvalResourceName} → ${r.EvalDecision}`);
    if (r.MatchedStatements?.length) {
      for (const ms of r.MatchedStatements) {
        console.log(`    matched: ${ms.SourcePolicyId}`);
      }
    } else {
      console.log(`    (no matching statement — policy missing or wrong Resource)`);
    }
  }
} catch (e) {
  console.log(`  Failed: ${e.name}`);
}
