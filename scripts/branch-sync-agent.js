import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, '../agents/branch-sync.config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const donorBranch = config.donorBranch;
const targetBranches = config.targetBranches;

console.log(`Starting branch synchronization from '${donorBranch}' to ${targetBranches.join(', ')}`);

function runCommand(command, options = {}) {
  console.log(`Executing: ${command}`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'inherit', ...options });
    return output;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    throw error;
  }
}

function getBranchHead(branchName) {
  return execSync(`git rev-parse ${branchName}`, { encoding: 'utf8' }).trim();
}

async function syncBranch(targetBranch) {
  console.log(`
--- Syncing ${targetBranch} ---`);
  const initialHead = getBranchHead(targetBranch);

  try {
    runCommand(`git checkout ${targetBranch}`);
    runCommand(`git fetch origin ${donorBranch}`);
    runCommand(`git merge origin/${donorBranch} --no-ff -m "Merge ${donorBranch} into ${targetBranch}"`);
    runCommand(`git push origin ${targetBranch}`);
    console.log(`Successfully synced ${targetBranch} with ${donorBranch}.`);
    return { branch: targetBranch, status: 'success' };
  } catch (error) {
    console.error(`Failed to sync ${targetBranch}. Attempting to revert...`);
    runCommand(`git merge --abort || true`); // Abort merge if in progress
    runCommand(`git reset --hard ${initialHead}`); // Revert to original state
    runCommand(`git checkout ${donorBranch}`); // Checkout donor branch to avoid being on a detached head
    console.error(`Reverted ${targetBranch} to ${initialHead}. Manual intervention required.`);
    return { branch: targetBranch, status: 'failure', error: error.message };
  }
}

async function main() {
  const results = [];
  for (const branch of targetBranches) {
    results.push(await syncBranch(branch));
  }

  console.log(`
--- Synchronization Summary ---`);
  results.forEach(result => {
    if (result.status === 'success') {
      console.log(`✅ ${result.branch}: Successfully synced.`);
    } else {
      console.error(`❌ ${result.branch}: Failed to sync. Error: ${result.error}`);
    }
  });

  const failedSyncs = results.filter(r => r.status === 'failure');
  if (failedSyncs.length > 0) {
    console.error(`
Some branches failed to sync. Please check the logs above for details and resolve conflicts manually.`);
    process.exit(1);
  } else {
    console.log(`
All branches synchronized successfully.`);
  }
}

main().catch(error => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});
