const print = (command)=>{
	console.log(command);
}

const sayHello = (name) => print(`Welcome to the File Manager, ${name}!`);
const sayGoodbye = (name) => print(`Thank you for using File Manager, ${name}, goodbye!`);
const sayDirectory = (name) => print(`You are currently in ${name}`);
const sayInputError = () => print(`Invalid input`);
const sayOperationFailed = () => print(`Operation failed`);

export {
	sayHello,
	sayGoodbye,
	sayDirectory,
	sayInputError,
	sayOperationFailed
}