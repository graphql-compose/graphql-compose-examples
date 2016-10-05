import path from 'path';
import fs from 'fs';

export const expressPort = process.env.PORT || 3000;
export const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/graphql-compose-mongoose';
export const examplesPath = './examples';

export function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
}

export function resolveExamplePath(...args) {
  return path.resolve(examplesPath, ...args);
}

export function getExampleNames() {
  const preferableOrder = ['user', 'userForRelay', 'northwind'];
  const dirs = getDirectories(examplesPath);

  const result = [];
  preferableOrder.forEach(name => {
    const idx = dirs.indexOf(name);
    if (idx !== -1) {
      result.push(name);
      dirs.splice(idx, 1);
    }
  });
  dirs.forEach(name => {
    result.push(name);
  });

  return result;
}
