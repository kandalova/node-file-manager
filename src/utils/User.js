import { homedir } from "node:os"
import * as path from "node:path"
import { stat, readdir, writeFile, rename, unlink } from 'node:fs/promises';
import { createWriteStream, createReadStream } from "node:fs"

import { sayCurrentPath, sayHello, sayGoodbye, sayInputError, sayOperationFailed } from './printCommands.js';
import { filterFiles, matchCommand, promisifyReadFile } from "./helper.js";
import regExp from "./constants.js";
import execOS from "./osHelper.js";
import { calculateHash } from "./hashHelper.js";

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
    this.currentdir = path.resolve(this.currentdir, '..');
  }

  async cd(dirPath) {
    try {
      const isAbsolutePath = path.isAbsolute(dirPath);
      if (!isAbsolutePath) {
        dirPath = path.resolve(this.currentdirString, dirPath);
      }
      else {
        dirPath = path.resolve(dirPath);
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

  async ls() {
    try {
      const files = await readdir(this.currentdir, { withFileTypes: true });
      const filteredFiles = filterFiles(files);
      console.table(filteredFiles);
    } catch (err) {
      sayOperationFailed();
    }
  }

  async cat(dirPath) {
    try {
      dirPath = path.resolve(dirPath);
      await promisifyReadFile(dirPath);
    } catch (err) {
      sayOperationFailed();
    }
  }

  async add(dirPath) {
    try {
      dirPath = path.resolve(this.currentdir, dirPath);
      await writeFile(dirPath, '', { encoding : 'utf8' });
    } catch (err) {
      sayOperationFailed();
    }
  }

  async rn(dirPath) {
    try {
      const src = path.resolve(dirPath[0]);
      const dest = path.resolve(path.dirname(src), dirPath[1]);
      await rename(src, dest);
    } catch (err) {
      sayOperationFailed();
    }
  }

  async cp(dirPath) {
    try {
      console.log('cp', dirPath);
      const src = path.resolve(dirPath[0]);
      const dest = path.resolve(dirPath[1], path.basename(src));
      // console.log(src);
      // console.log(dest);
      // await writeFile(dest, '', { encoding : 'utf8' });
      const writerStream = createWriteStream(dest);
      const readerStream = createReadStream(src);
      readerStream.pipe(writerStream);
    } catch (err) {
      sayOperationFailed();
    }
  }

  async mv(dirPath) {
    try {
      console.log('mv', dirPath);      
      await this.cp(dirPath);
      await this.rm(dirPath[0])
    } catch (err) {
      sayOperationFailed();
    }
  }

  async rm(dirPath) {
    try {
      console.log('rm', dirPath);
      const src = path.resolve(dirPath);
      await unlink(src);
    } catch (err) {
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
        await this.ls();
      }
      else if(params = matchCommand(trimedCommand, regExp.os)){
        execOS(params);
      }
      else if (params = matchCommand(trimedCommand, regExp.hash)) {
        console.log('HASH', params);
        await calculateHash(params);
      }
      else if (params = matchCommand(trimedCommand, regExp.cd)) {
        await this.cd(params);
      }
      else if (params = matchCommand(trimedCommand, regExp.cat)) {
        await this.cat(params);
      }
      else if (params = matchCommand(trimedCommand, regExp.add)) {
        await this.add(params);
      }
      else if (params = matchCommand(trimedCommand, regExp.rn, 2)) {
        await this.rn(params);
      }
      else if (params = matchCommand(trimedCommand, regExp.cp, 2)) {
        await this.cp(params);
      }
      else if (params = matchCommand(trimedCommand, regExp.cp, 2)) {
        await this.cp(params);
      }
      else if (params = matchCommand(trimedCommand, regExp.mv, 2)) {
        await this.mv(params);
      }
      else if (params = matchCommand(trimedCommand, regExp.rm)) {
        await this.rm(params);
      }
      else {
        throw new Error()
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