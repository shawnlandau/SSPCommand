import { v4 as uuidv4 } from "uuid";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import type { Account, Opportunity } from "@/types";

const states = ["AK","AL","FL","GA","IL","IN","KY","LA","MI","MO","MS","OH","TN","WV"] as const;

function sample<T>(arr: readonly T[]): T { return arr[Math.floor(Math.random()*arr.length)] as T; }

function createAccounts(n: number): Account[] {
  const industries = ["Healthcare","Public Sector","Transportation","Education"]; 
  return Array.from({ length: n }).map(() => ({
    id: uuidv4(),
    name: `${sample(["State of","City of","County of","University of"]) } ${sample(["OH","TN","MI","GA","AL","MS","MO","WV"]) } Org ${Math.floor(Math.random()*900+100)}`,
    state: sample(states as unknown as string[] as any),
    industry: sample(industries),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

function createOpps(accounts: Account[], nPerAcct = 2): Opportunity[] {
  const stages = ["Prospect","Qualify","Develop","Propose","CloseWon","CloseLost"] as const;
  const opps: Opportunity[] = [];
  for (const a of accounts) {
    for (let i=0;i<nPerAcct;i++) {
      opps.push({
        id: uuidv4(),
        accountId: a.id,
        name: `${a.name} - ${sample(["Modernization","Data Platform","DevOps","AI"])} Initiative`,
        amount: Math.floor(Math.random()*700_000+150_000),
        stage: sample(stages as unknown as string[] as any) as any,
        state: a.state as any,
        coSell: Math.random() > 0.6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }
  return opps;
}

function main() {
  const dataDir = path.join(process.cwd(), "data");
  if (!existsSync(dataDir)) mkdirSync(dataDir);
  const accounts = createAccounts(20);
  const opps = createOpps(accounts, 2);
  writeFileSync(path.join(dataDir, "accounts.json"), JSON.stringify(accounts, null, 2));
  writeFileSync(path.join(dataDir, "opportunities.json"), JSON.stringify(opps, null, 2));
  console.log(`Seeded ${accounts.length} accounts and ${opps.length} opportunities to data/`);
}

main();



