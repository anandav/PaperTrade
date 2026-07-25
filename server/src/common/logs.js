const utility = require("./utility");

const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

function currentLevelName() {
  const raw = String(
    global.appConfig?.logLevel || process.env.LOG_LEVEL || "info"
  )
    .toLowerCase()
    .trim();
  return LEVELS[raw] !== undefined ? raw : "info";
}

function shouldLog(level) {
  return LEVELS[level] <= LEVELS[currentLevelName()];
}

function formatArgs(args) {
  return args
    .map((arg) => {
      if (arg == null) {
        return String(arg);
      }
      if (typeof arg === "string") {
        return arg;
      }
      if (arg instanceof Error) {
        return arg.stack || arg.message;
      }
      if (typeof arg === "object") {
        try {
          return JSON.stringify(arg);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    })
    .join(" ");
}

function write(level, consoleFn, args) {
  if (!shouldLog(level)) {
    return;
  }
  consoleFn(utility.formatDate(), level.toUpperCase() + ":", formatArgs(args));
}

const logger = {
  log(...message) {
    this.info(...message);
  },
  error(...message) {
    write("error", console.error, message);
  },
  warn(...message) {
    write("warn", console.warn, message);
  },
  info(...message) {
    write("info", console.log, message);
  },
  debug(...message) {
    write("debug", console.debug, message);
  },
  getLevel() {
    return currentLevelName();
  },
};

module.exports = logger;
