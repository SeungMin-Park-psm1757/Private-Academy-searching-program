type SeedPlan = {
  serviceRegions: string[];
  academyOrganizations: number;
  academyBranches: number;
};

const seedPlan: SeedPlan = {
  serviceRegions: ["seoul-gangnam"],
  academyOrganizations: 0,
  academyBranches: 0,
};

async function main() {
  console.log("Seed skeleton ready.");
  console.log(JSON.stringify(seedPlan, null, 2));
}

main().catch((error) => {
  console.error("Seed skeleton failed.", error);
  process.exitCode = 1;
});
