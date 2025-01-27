import { randomUUID } from "crypto";
import { stdTimeFunctions } from "pino";
import type { Options } from "pino-http";

import pinoHttp from "pino-http";
const devOptions: Options = {
  quietReqLogger: true, // turn off the default logging output
  transport: {
    target: "pino-http-print", // use the pino-http-print transport and its formatting output
    options: {
      destination: 1,
      all: true,
      translateTime: true,
    },
  },
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return "warn";
    }
    if (res.statusCode >= 500 || err) {
      return "error";
    }
    if (res.statusCode >= 300 && res.statusCode < 400) {
      return "silent";
    }
    return "info";
  },
};

const prodOptions: Options = {
  customProps: (req: any) => ({
    host_ip: req.socket.localAddress,
    request_id: randomUUID(),
    request_method: req.method,
    request_uri: req.url,
    source_ip: req.ip,
    protocol: req.protocol,
    port: req.socket.localPort,
    useragent: req.headers["user-agent"],
  }),

  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
    bindings: ({ hostname }) => ({ hostname }),
  },

  timestamp: stdTimeFunctions.isoTime,

  genReqId: () => randomUUID(),

  serializers: {
    req: () => undefined,
    res: () => undefined,
  },

  customAttributeKeys: {
    responseTime: "response_time",
  },

  messageKey: "description",
};

const options =
  process.env.NODE_ENV === "production" ? prodOptions : devOptions;

const pino = pinoHttp(options);

const { logger } = pino;

export { logger, pino };
