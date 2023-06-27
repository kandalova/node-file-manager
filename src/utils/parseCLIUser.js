export default function () {
	const usernameRegexp = /(--username)=(.+)/ig;
	const usernamePropRegexp = /(--username)=/;
	let userName = 'anonymus';
	process.argv.slice(2).map(arg => {
		const [nameMatch] = arg.match(usernameRegexp) || [];
		if (nameMatch) {
			userName = nameMatch.replace(usernamePropRegexp, '');
			return userName;
		}

	})
	return userName;
}