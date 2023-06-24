import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { EOL, homedir } from "node:os"

import parseCLIUser from './utils/parseCLIUser.js';
import { sayGoodbye, sayHello } from './utils/printCommands.js';
import User from './utils/createUser.js';


async function startFileManger() {
	const userName = parseCLIUser();
	const user = new User(userName);

	sayHello(user.name);
	const rl = readline.createInterface({ input, output });

	function close() {
		sayGoodbye(user.name);
		rl.close();
	}

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