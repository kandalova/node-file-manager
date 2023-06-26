import * as path from "node:path"

export const filterFiles = (files) => {
	const filteredFiles = files.reduce((result, currentItem) => {
		if (currentItem.isDirectory()) {
			const item = { name: currentItem.name, type: 'directory' }
			result.push(item);
		}
		if (currentItem.isFile()) {
			const item = { name: currentItem.name, type: 'file' }
			result.push(item);
		}
		return result;
	}, [])
		.sort((a, b) => {
			return a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
		});
	return filteredFiles || [];
}

export const matchCommand = (command, regExp, count = 1) => {
	const result = command.match(regExp);
	console.log('result', result);
	if(result){
		return count === 1 ? result[1] : command.split(' ').slice(1);
	}
	return null;
}

export function getPath(dirPath, currentDir){
	const isAbsolutePath = path.isAbsolute(dirPath);
	let result;
	if (!isAbsolutePath) {
		result = path.resolve(currentDir, dirPath);
	}
	else {
		result = path.resolve(dirPath);
	}
	return result;
}