import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { answerWebsiteQuestion } from '../src/assets/site-help.mjs';

const publicRoot = fileURLToPath(new URL('../public/', import.meta.url));
const excludedIdentity = /wajeeh|bakhsh|orthop(?:a)?edic surgeon/i;
const textExtensions = new Set(['.html', '.js', '.css', '.json', '.xml', '.txt', '.svg', '.webmanifest']);

async function checkDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    assert.doesNotMatch(entry.name, excludedIdentity, `Excluded identity in public asset name: ${entry.name}`);
    const file = join(directory, entry.name);
    if (entry.isDirectory()) await checkDirectory(file);
    else if (textExtensions.has(extname(file))) {
      assert.doesNotMatch(await readFile(file, 'utf8'), excludedIdentity, `Excluded identity in ${file}`);
    }
  }
}

test('all deployable pages, metadata, scripts and asset names honor the public identity exclusion', async () => {
  await checkDirectory(publicRoot);
});

test('website guide does not disclose the excluded physician even when asked directly', () => {
  for (const question of ['Who are the physicians?', 'Is Wajeeh Bakhsh a founder?', 'Who is the orthopaedic surgeon?']) {
    assert.doesNotMatch(JSON.stringify(answerWebsiteQuestion(question)), excludedIdentity);
  }
});
