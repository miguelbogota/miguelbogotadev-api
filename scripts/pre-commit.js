/**
 * Pre-Commit Build Script
 *
 * This script keeps index.json synchronized with the project data included in a
 * commit. It builds a temporary copy of Git's staging area rather than the working
 * directory, so unfinished edits in partially staged files are not published.
 *
 * Process:
 * 1. Checks for unstaged index.json changes to avoid overwriting manual work.
 * 2. Creates a temporary directory containing the staged builder and source files.
 * 3. Runs scripts/build.js from that directory using the current Node.js runtime.
 * 4. Copies the generated index.json back and stages it for the pending commit.
 * 5. Removes the temporary directory, whether the build succeeds or fails.
 *
 * Commit Behavior:
 * The hook runs before every commit, including content and documentation changes.
 * Project wording changes are included in the generated index. General site copy
 * in content/v03.json is served separately and does not affect the project index.
 * An identical build adds no diff. Generated changes join the pending commit;
 * this script never creates another commit or amends an existing one.
 *
 * Failure Behavior:
 * Unstaged index changes or a failed build stop the commit with a nonzero exit
 * code. Source files and their staged/unstaged selections are left untouched.
 * Only the generated index.json is automatically staged after a successful build.
 *
 * Usage:
 * Enable .githooks/pre-commit once per clone:
 *   git config core.hooksPath .githooks
 *
 * Git then invokes this script through the hook from the repository root.
 * Node.js must be available on PATH. Stage scripts/build.js when installing or
 * changing the builder, since the build uses its staged version as well.
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const git = (...args) => execFileSync('git', args);
let temporary;

try {
  // The generated file may contain manual edits; do not silently replace them.
  if (git('diff', '--name-only', '--', 'index.json').length) {
    throw new Error(
      'index.json has unstaged changes. Stage or restore that generated file before committing.',
    );
  }

  temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-build-'));
  // Git does not track empty directories, including after the last project is deleted.
  fs.mkdirSync(path.join(temporary, 'projects'));
  // NUL separators preserve filenames containing spaces or newlines.
  const files = git(
    'ls-files',
    '-z',
    '--',
    'scripts/build.js',
    'projects',
    'content',
    'types',
  )
    .toString()
    .split('\0')
    .filter(Boolean);

  for (const file of files) {
    const destination = path.join(temporary, file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    // The :path syntax reads the staging area, not HEAD or the working copy.
    fs.writeFileSync(destination, git('show', `:${file}`));
  }

  // The builder's relative paths resolve inside the isolated repository snapshot.
  execFileSync(process.execPath, ['scripts/build.js'], {
    cwd: temporary,
    stdio: 'inherit',
  });

  const output = fs.readFileSync(path.join(temporary, 'index.json'));
  // Git includes this in the pending commit and ignores byte-identical output.
  fs.writeFileSync('index.json', output);
  git('add', '--', 'index.json');
} catch (error) {
  console.error(`Pre-commit build failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  // Cleanup must also run when Git or the builder reports an error.
  if (temporary) fs.rmSync(temporary, { recursive: true, force: true });
}
