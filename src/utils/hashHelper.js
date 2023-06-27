import * as path from "node:path"
import { readFile } from 'node:fs/promises';
import { sayOperationFailed, sayValue } from "./printCommands.js";

export async function calculateHash(filePath) {
	try {
		const { createHash } = await import('node:crypto');
		const srcName = path.resolve(filePath);
		const hash = createHash('sha256');
		const contents = await readFile(srcName, { encoding: 'utf8' });
		hash.update(contents);
		sayValue(hash.digest('hex'));
	}
	catch (err) {
		sayOperationFailed();
	}
};