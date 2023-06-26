import { readdir, writeFile, unlink, rename } from 'node:fs/promises';
import * as path from "node:path"
import { createReadStream, createWriteStream } from "node:fs"

import { filterFiles, getPath } from "./helper.js";
import { printTable, sayOperationFailed } from './printCommands.js';

export async function ls(dirPath) {
	try {
		const files = await readdir(dirPath, { withFileTypes: true });
		const filteredFiles = filterFiles(files);
		printTable(filteredFiles);
	} catch (err) {
		sayOperationFailed();
	}
}
const promisifyReadFile = (filePath) => {
	return new Promise((res, rej) => {
		console.log('promise', filePath);
		const readerStream = createReadStream(filePath);
		readerStream.setEncoding('UTF8');

		readerStream.on('data', ((chunk) => {
			process.stdout.write(chunk);
		}));

		readerStream.on('end', (() => {
			console.log('');
			res();
		}));

		readerStream.on('error', ((err) => {
			rej();
		}));
	})
}

export async function cat(dirPath, currentDir) {
	try {
		dirPath = getPath(dirPath, currentDir);
		await promisifyReadFile(dirPath);
	} catch (err) {
		sayOperationFailed();
	}
}

export async function add(dirPath, currentDir) {
	try {
		dirPath = path.resolve(currentDir, dirPath);
		await writeFile(dirPath, '', { encoding : 'utf8' });
	} catch (err) {
		sayOperationFailed();
	}
}

export async function rm(dirPath, currentDir) {
	try {
		const src = getPath(dirPath, currentDir);
		await unlink(src);
	} catch (err) {
		sayOperationFailed();
	}
}

export async function rn(dirPath, currentDir) {
	try {
		const src = getPath(dirPath[0], currentDir);
		const dest = path.resolve(path.dirname(src), dirPath[1]);
		await rename(src, dest);
	} catch (err) {
		sayOperationFailed();
	}
}

export async function cp(dirPath, currentDir) {
	return new Promise((res, rej) => {
		const src = getPath(dirPath[0], currentDir);
		const destDir = getPath(dirPath[1], currentDir);
		const dest = path.resolve(destDir, path.basename(src));
		console.log('src', src);
		console.log("dest", dest);
		const writerStream = createWriteStream(dest);
		const readerStream = createReadStream(src);
		readerStream.setEncoding('UTF8');
	
		readerStream.on('end', (() => {
			res();
		}));
	
		readerStream.on('error', ((err) => {
			rej();
		}));
		writerStream.on('error', ((err) => {
			rej();
		}));

		readerStream.pipe(writerStream);
	})
}


export async function mv(dirPath ,currentDir) {
	try {   
		await cp(dirPath, currentDir);
		await rm(dirPath[0], currentDir);
	} catch (err) {
		sayOperationFailed();
	}
}



