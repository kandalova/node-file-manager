import { homedir } from "node:os"
import * as path from "node:path"
import { stat } from 'node:fs/promises';

import { sayCurrentPath, sayHello, sayGoodbye, sayInputError, sayOperationFailed } from './printCommands.js';
import parsePath from "./parsePath.js";

export default class User {
  constructor(userName) {
    this.name = userName;
    this.sep = path.sep;
    this.currentdir = homedir();
    this.startUser();
  }

  get currentdirString() {
    return this.currentdir;
  }

  startUser() {
    sayHello(this.name);
    sayCurrentPath(this.currentdirString);
  }

  exitUser() {
    sayGoodbye(this.name);
  }

  up() {
    this.currentdir = path.join(this.currentdir, '..');
  }

  async cd(dirPath) {
    try {
      const isAbsolutePath = path.isAbsolute(dirPath);
      if (!isAbsolutePath) {
        dirPath = path.join(this.currentdirString, dirPath);
      }
      const dirStat = await stat(dirPath);
      if (dirStat && dirStat.isDirectory()) {
        this.currentdir = dirPath;
      }
    }
    catch {
      sayOperationFailed();
    }
  }

  ls() {
    console.log('ls');
  }

  async execCommand(command) {
    try {
      const trimedCommand = command.trim();
      const cdRegExp = /^cd (.+)$/;
      const cd = trimedCommand.match(cdRegExp);

      if (cd && cd[1]) {
        await this.cd(cd[1]);
      }
      else if (trimedCommand === 'up') {
        this.up();
      }
      else if (trimedCommand === 'ls') {
        this.ls();
      }
      else {
        throw new Error('input')
      }
    }
    catch (err) {
      sayInputError();
    }
    finally {
      sayCurrentPath(this.currentdirString);
    }

  }
}