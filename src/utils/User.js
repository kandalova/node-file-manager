import { homedir } from "node:os"
import * as path from "node:path"
import { stat } from 'node:fs/promises';

import { sayCurrentPath, sayHello, sayGoodbye, sayInputError, sayOperationFailed } from './printCommands.js';
import { matchCommand, getPath } from "./helper.js";
import regExp from "./constants.js";
import execOS from "./osHelper.js";
import { calculateHash } from "./hashHelper.js";
import { compressFile, decompressFile } from "./zipHelper.js";
import { ls, cat, add, rm, rn, cp, mv } from "./fileHelper.js";

export default class User {
  constructor(userName) {
    this.name = userName;
    this.sep = path.sep;
    this.currentdir = homedir();
    this.startUser();
  }

  startUser() {
    sayHello(this.name);
    sayCurrentPath(this.currentdir);
  }

  exitUser() {
    sayGoodbye(this.name);
  }

  up() {
    this.currentdir = path.resolve(this.currentdir, '..');
  }

  async cd(dirPath) {
    try {
      dirPath = getPath(dirPath, this.currentdir);
      console.log(dirPath);
      const dirStat = await stat(dirPath);
      if (dirStat && dirStat.isDirectory()) {
        this.currentdir = dirPath;
      }
    }
    catch {
      sayOperationFailed();
    }
  }


  async execCommand(command) {
    try {
      const trimedCommand = command.trim();
      let params;

      if (trimedCommand === 'up') {
        this.up();
      }
      else if (trimedCommand === 'ls') {
        await ls(this.currentdir);
      }
      else if(params = matchCommand(trimedCommand, regExp.os)){
        await execOS(params);
      }
      else if (params = matchCommand(trimedCommand, regExp.hash)) {
        await calculateHash(params);
      }
      else if (params = matchCommand(trimedCommand, regExp.compress, 2)) {
        await compressFile(params);
      }
      else if (params = matchCommand(trimedCommand, regExp.decompress, 2)) {
        await decompressFile(params);
      }
      else if (params = matchCommand(trimedCommand, regExp.cd)) {
        await this.cd(params);
      }
      else if (params = matchCommand(trimedCommand, regExp.cat)) {
        await cat(params, this.currentdir);
      }
      else if (params = matchCommand(trimedCommand, regExp.add)) {
        await add(params, this.currentdir);
      }
      else if (params = matchCommand(trimedCommand, regExp.rn, 2)) {
        await rn(params, this.currentdir);
      }
      else if (params = matchCommand(trimedCommand, regExp.cp, 2)) {
        await cp(params, this.currentdir);
      }
      else if (params = matchCommand(trimedCommand, regExp.mv, 2)) {
        await mv(params, this.currentdir);
      }
      else if (params = matchCommand(trimedCommand, regExp.rm)) {
        await rm(params, this.currentdir);
      }
      else {
        throw new Error()
      }
    }
    catch (err) {
      sayInputError();
    }
    finally {
      sayCurrentPath(this.currentdir);
    }

  }
}