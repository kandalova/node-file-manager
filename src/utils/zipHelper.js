import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { createReadStream, createWriteStream } from 'node:fs';
import * as path from "node:path"
import { pipeline } from 'node:stream';

export async function compressFile(dirPath) {
	return new Promise((res, rej) => {
		const srcName = path.resolve(dirPath[0]);
		const destName = path.resolve(dirPath[1]);
		const bZip = createBrotliCompress();
		const srcStream = createReadStream(srcName);
		const destStream = createWriteStream(destName);

		pipeline(srcStream, bZip, destStream, (err) => {
			if (err) {
				rej();
			}
			res();
		});
	})
};

export async function decompressFile(dirPath) {
	return new Promise((res, rej) => {
		const srcName = path.resolve(dirPath[0]);
		const destName = path.resolve(dirPath[1]);
		const bZip = createBrotliDecompress();
		const srcStream = createReadStream(srcName);
		const destStream = createWriteStream(destName);

		srcStream.on('error', function(err) {
			sayOperationFailed();
		});
		destStream.on('error', function(err) {
			sayOperationFailed();
		});
		bZip.on('error', function(err) {
			sayOperationFailed();
		});

		pipeline(srcStream, bZip, destStream, (err) => {
			if (err) {
				rej();
			}
			res();
		});
	})
};