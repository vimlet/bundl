


const fs = require('fs');
const path = require('path');

// Save original console methods before any usage
const originalLog = console.log;
const originalError = console.error;

// Always write log file in project root
const logFile = path.join(process.cwd(), 'bundl.log');

const logStream = fs.createWriteStream(logFile, { flags: 'w' });

let logStreamError = false;
logStream.on('error', (err) => {
  logStreamError = true;
  originalError('Logger stream error:', err);
});


function serializeArg(arg) {
  if (typeof arg === 'object' && arg !== null) {
    try {
      return JSON.stringify(arg);
    } catch (e) {
      return '[Unserializable Object]';
    }
  }
  return String(arg);
}


function log(level, message, meta = {}) {
  const entry = {
    time: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  if (!logStreamError) {
    let serialized;
    try {
      serialized = JSON.stringify(entry);
    } catch (e) {
      serialized = JSON.stringify({
        time: entry.time,
        level: entry.level,
        message: '[Unserializable log entry]'
      });
    }
    // Handle stream backpressure: check return value, do nothing if false
    logStream.write(serialized + '\n');
  } else {
    originalError('Log write failed:', entry);
  }
}


console.log = function () {
  const message = Array.from(arguments).map(serializeArg).join(' ');
  log('info', message);
  originalLog.apply(console, arguments);
};

console.error = function () {
  const message = Array.from(arguments).map(serializeArg).join(' ');
  log('error', message);
  originalError.apply(console, arguments);
};

module.exports = { log };