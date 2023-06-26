import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import parseCLIUser from './utils/parseCLIUser.js';
import User from './utils/User.js';


async function startFileManger() {
	const userName = parseCLIUser();
	const user = new User(userName);
	const rl = readline.createInterface({ input, output });

	const close = ()=>{
		user.exitUser();
		rl.close();
	}

	rl.on('line', (input) => {
		if (input === '.exit') {
			close();
		}
		else{
			user.execCommand(input);
		}
	});
	rl.on('SIGINT', () => {
		close();
	});
}

startFileManger();