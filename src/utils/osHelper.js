import { EOL, cpus, homedir, userInfo, arch} from "node:os"
import { sayValue, sayInputError } from './printCommands.js';

export default async function execOS(param) {
	switch (param) {
		case 'EOL':
			sayValue(JSON.stringify(EOL));
			break
		case 'cpus':
			let cpusInfo = cpus().map(cpu=>({model: cpu.model,	speed: cpu.speed/1000}));
			sayValue(`Count: ${cpusInfo.length}`);
			sayValue(cpusInfo);
			break
		case 'homedir':
			sayValue(homedir());
			break
		case 'username':
			sayValue(userInfo().username);
			break
		case 'architecture':
			sayValue(arch());
			break
		default:
			sayInputError();
	}
}