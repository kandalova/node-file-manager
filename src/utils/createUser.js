import { homedir } from "node:os"
export default class User {
  constructor(userName) {
    this.name = userName;
    this.homedir = homedir();
		this.currentdir = this.homedir
  }
}