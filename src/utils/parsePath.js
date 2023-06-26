export default function (dirPath) {
	const spliterRegexp = /\\+|\/+/;
	const nameRegexp = /^\.{1,2}$|^(\_|\w|(\-))+$/;
	const rootRegexp = /[a-zA-Z]:/;
	const splitedPath = dirPath.split(spliterRegexp).filter(element => element);
	let isRoot = spliterRegexp.test(dirPath[0]);

	const checkPath = (element, index) => {
		const isValidName = nameRegexp.test(element);
		const isValidRoot = rootRegexp.test(element) && index === 0 && !isRoot;
		// console.log(element, isValidName, isValidRoot);
		return !(isValidName || isValidRoot);
	}
	const hasInvalidPath = splitedPath.some(checkPath);
	// console.log('has', hasInvalidPath);

	if (hasInvalidPath) {
		return null;
	}
	
	return isRoot ? ['/', ...splitedPath] : splitedPath;

}