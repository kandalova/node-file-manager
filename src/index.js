import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import parseCLIUser from './utils/parseCLIUser.js';
import { sayGoodbye, sayHello } from './utils/printCommands.js';
import User from './utils/createUser.js';


async function startFileManger() {
	const userName = parseCLIUser();
	const user = new User(userName);
	const rl = readline.createInterface({ input, output });

	const close = ()=>{
		sayGoodbye(user.name);
		rl.close();
	}


	sayHello(user.name);

	rl.on('line', (input) => {
		if (input === '.exit') {
			close();
		}
	});
	rl.on('SIGINT', () => {
		close();
	});
}

startFileManger();