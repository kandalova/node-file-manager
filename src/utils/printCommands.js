const sayHello = (name) => console.log(`Welcome to the File Manager, ${name}!`);
const sayGoodbye = (name) => console.log(`Thank you for using File Manager, ${name}, goodbye!`);
const sayDirectory = (name) => console.log(`You are currently in ${name}`);
const sayInputError = () => console.log(`Invalid input`);
const sayOperationFailed = () => console.log(`Operation failed`);

export {
	sayHello,
	sayGoodbye,
	sayDirectory,
	sayInputError,
	sayOperationFailed
}