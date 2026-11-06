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
 *    The temporary snapshot reuses this checkout's installed dependencies.
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
 * Husky invokes this script from .husky/pre-commit. Node.js and the project npm
 * dependencies must be installed. Stage builder and schema changes together,
 * since the build uses their staged versions.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { PROJECT_INDEX_FILE, PROJECTS_DIRECTORY } from './constants.js';

const git = (...args) => execFileSync('git', args);
let temporary;

try {
  // The generated file may contain manual edits; do not silently replace them.
  if (git('diff', '--name-only', '--', PROJECT_INDEX_FILE).length) {
    throw new Error(
      'index.json has unstaged changes. Stage or restore that generated file before committing.',
    );
  }

  temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-build-'));
  // Git does not track empty directories, including after the last project is deleted.
  fs.mkdirSync(path.join(temporary, PROJECTS_DIRECTORY));
  fs.symlinkSync(
    path.resolve('node_modules'),
    path.join(temporary, 'node_modules'),
  );
  // NUL separators preserve filenames containing spaces or newlines.
  const files = git(
    'ls-files',
    '-z',
    '--',
    'scripts',
    PROJECTS_DIRECTORY,
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

  const output = fs.readFileSync(path.join(temporary, PROJECT_INDEX_FILE));
  // Git includes this in the pending commit and ignores byte-identical output.
  fs.writeFileSync(PROJECT_INDEX_FILE, output);
  git('add', '--', PROJECT_INDEX_FILE);
} catch (error) {
  console.error(`Pre-commit build failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  // Cleanup must also run when Git or the builder reports an error.
  if (temporary) fs.rmSync(temporary, { recursive: true, force: true });
}
