var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// app/shopify.real.server.js
var shopify_real_server_exports = {};
__export(shopify_real_server_exports, {
  BILLING_PLANS: () => BILLING_PLANS,
  authenticate: () => authenticate,
  default: () => shopify,
  login: () => login,
  registerWebhooks: () => registerWebhooks,
  unauthenticated: () => unauthenticated
});
import { shopifyApp, BillingInterval } from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { PrismaClient } from "@prisma/client";
var prisma, BILLING_PLANS, shopify, authenticate, unauthenticated, login, registerWebhooks, init_shopify_real_server = __esm({
  "app/shopify.real.server.js"() {
    prisma = new PrismaClient(), BILLING_PLANS = {
      starter: "Starter Plan",
      pro: "Pro Plan"
    }, shopify = shopifyApp({
      apiKey: process.env.SHOPIFY_API_KEY,
      apiSecretKey: process.env.SHOPIFY_API_SECRET,
      appUrl: process.env.SHOPIFY_APP_URL,
      scopes: [
        "read_products",
        "write_products",
        // required by app.descriptions.jsx to update product descriptions
        "read_content",
        "read_themes",
        "write_themes",
        "read_online_store_pages"
      ],
      // Pin to a stable version; never use 'unstable' in production.
      apiVersion: "2026-01",
      sessionStorage: new PrismaSessionStorage(prisma),
      isEmbeddedApp: !0,
      billing: {
        [BILLING_PLANS.starter]: {
          amount: 19,
          currencyCode: "USD",
          interval: BillingInterval.Every30Days,
          trialDays: 7
        },
        [BILLING_PLANS.pro]: {
          amount: 79,
          currencyCode: "USD",
          interval: BillingInterval.Every30Days,
          trialDays: 7
        }
      }
    }), { authenticate, unauthenticated, login, registerWebhooks } = shopify;
  }
});

// node_modules/@remix-run/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = {};
__export(entry_server_node_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  return userAgent ? "isbot" in isbotModule && typeof isbotModule.isbot == "function" ? isbotModule.isbot(userAgent) : "default" in isbotModule && typeof isbotModule.default == "function" ? isbotModule.default(userAgent) : !1 : !1;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.jsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links
});
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

// node_modules/@shopify/polaris/build/esm/types.js
var Key;
(function(Key2) {
  Key2[Key2.Backspace = 8] = "Backspace", Key2[Key2.Tab = 9] = "Tab", Key2[Key2.Enter = 13] = "Enter", Key2[Key2.Shift = 16] = "Shift", Key2[Key2.Ctrl = 17] = "Ctrl", Key2[Key2.Alt = 18] = "Alt", Key2[Key2.Pause = 19] = "Pause", Key2[Key2.CapsLock = 20] = "CapsLock", Key2[Key2.Escape = 27] = "Escape", Key2[Key2.Space = 32] = "Space", Key2[Key2.PageUp = 33] = "PageUp", Key2[Key2.PageDown = 34] = "PageDown", Key2[Key2.End = 35] = "End", Key2[Key2.Home = 36] = "Home", Key2[Key2.LeftArrow = 37] = "LeftArrow", Key2[Key2.UpArrow = 38] = "UpArrow", Key2[Key2.RightArrow = 39] = "RightArrow", Key2[Key2.DownArrow = 40] = "DownArrow", Key2[Key2.Insert = 45] = "Insert", Key2[Key2.Delete = 46] = "Delete", Key2[Key2.Key0 = 48] = "Key0", Key2[Key2.Key1 = 49] = "Key1", Key2[Key2.Key2 = 50] = "Key2", Key2[Key2.Key3 = 51] = "Key3", Key2[Key2.Key4 = 52] = "Key4", Key2[Key2.Key5 = 53] = "Key5", Key2[Key2.Key6 = 54] = "Key6", Key2[Key2.Key7 = 55] = "Key7", Key2[Key2.Key8 = 56] = "Key8", Key2[Key2.Key9 = 57] = "Key9", Key2[Key2.KeyA = 65] = "KeyA", Key2[Key2.KeyB = 66] = "KeyB", Key2[Key2.KeyC = 67] = "KeyC", Key2[Key2.KeyD = 68] = "KeyD", Key2[Key2.KeyE = 69] = "KeyE", Key2[Key2.KeyF = 70] = "KeyF", Key2[Key2.KeyG = 71] = "KeyG", Key2[Key2.KeyH = 72] = "KeyH", Key2[Key2.KeyI = 73] = "KeyI", Key2[Key2.KeyJ = 74] = "KeyJ", Key2[Key2.KeyK = 75] = "KeyK", Key2[Key2.KeyL = 76] = "KeyL", Key2[Key2.KeyM = 77] = "KeyM", Key2[Key2.KeyN = 78] = "KeyN", Key2[Key2.KeyO = 79] = "KeyO", Key2[Key2.KeyP = 80] = "KeyP", Key2[Key2.KeyQ = 81] = "KeyQ", Key2[Key2.KeyR = 82] = "KeyR", Key2[Key2.KeyS = 83] = "KeyS", Key2[Key2.KeyT = 84] = "KeyT", Key2[Key2.KeyU = 85] = "KeyU", Key2[Key2.KeyV = 86] = "KeyV", Key2[Key2.KeyW = 87] = "KeyW", Key2[Key2.KeyX = 88] = "KeyX", Key2[Key2.KeyY = 89] = "KeyY", Key2[Key2.KeyZ = 90] = "KeyZ", Key2[Key2.LeftMeta = 91] = "LeftMeta", Key2[Key2.RightMeta = 92] = "RightMeta", Key2[Key2.Select = 93] = "Select", Key2[Key2.Numpad0 = 96] = "Numpad0", Key2[Key2.Numpad1 = 97] = "Numpad1", Key2[Key2.Numpad2 = 98] = "Numpad2", Key2[Key2.Numpad3 = 99] = "Numpad3", Key2[Key2.Numpad4 = 100] = "Numpad4", Key2[Key2.Numpad5 = 101] = "Numpad5", Key2[Key2.Numpad6 = 102] = "Numpad6", Key2[Key2.Numpad7 = 103] = "Numpad7", Key2[Key2.Numpad8 = 104] = "Numpad8", Key2[Key2.Numpad9 = 105] = "Numpad9", Key2[Key2.Multiply = 106] = "Multiply", Key2[Key2.Add = 107] = "Add", Key2[Key2.Subtract = 109] = "Subtract", Key2[Key2.Decimal = 110] = "Decimal", Key2[Key2.Divide = 111] = "Divide", Key2[Key2.F1 = 112] = "F1", Key2[Key2.F2 = 113] = "F2", Key2[Key2.F3 = 114] = "F3", Key2[Key2.F4 = 115] = "F4", Key2[Key2.F5 = 116] = "F5", Key2[Key2.F6 = 117] = "F6", Key2[Key2.F7 = 118] = "F7", Key2[Key2.F8 = 119] = "F8", Key2[Key2.F9 = 120] = "F9", Key2[Key2.F10 = 121] = "F10", Key2[Key2.F11 = 122] = "F11", Key2[Key2.F12 = 123] = "F12", Key2[Key2.NumLock = 144] = "NumLock", Key2[Key2.ScrollLock = 145] = "ScrollLock", Key2[Key2.Semicolon = 186] = "Semicolon", Key2[Key2.Equals = 187] = "Equals", Key2[Key2.Comma = 188] = "Comma", Key2[Key2.Dash = 189] = "Dash", Key2[Key2.Period = 190] = "Period", Key2[Key2.ForwardSlash = 191] = "ForwardSlash", Key2[Key2.GraveAccent = 192] = "GraveAccent", Key2[Key2.OpenBracket = 219] = "OpenBracket", Key2[Key2.BackSlash = 220] = "BackSlash", Key2[Key2.CloseBracket = 221] = "CloseBracket", Key2[Key2.SingleQuote = 222] = "SingleQuote";
})(Key || (Key = {}));

// node_modules/@shopify/polaris/build/esm/components/shared.js
var scrollable = {
  props: {
    "data-polaris-scrollable": !0
  },
  selector: "[data-polaris-scrollable]"
}, overlay = {
  props: {
    "data-polaris-overlay": !0
  },
  selector: "[data-polaris-overlay]"
}, layer = {
  props: {
    "data-polaris-layer": !0
  },
  selector: "[data-polaris-layer]"
}, unstyled = {
  props: {
    "data-polaris-unstyled": !0
  },
  selector: "[data-polaris-unstyled]"
}, dataPolarisTopBar = {
  props: {
    "data-polaris-top-bar": !0
  },
  selector: "[data-polaris-top-bar]"
}, headerCell = {
  props: {
    "data-polaris-header-cell": !0
  },
  selector: "[data-polaris-header-cell]"
}, portal = {
  props: ["data-portal-id"],
  selector: "[data-portal-id]"
};

// node_modules/@shopify/polaris/build/esm/components/ThemeProvider/ThemeProvider.js
import React from "react";

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/base/breakpoints.mjs
var breakpointsAliases = ["xs", "sm", "md", "lg", "xl"], breakpoints = {
  "breakpoints-xs": {
    value: "0px",
    description: "Commonly used for sizing containers (e.g. max-width). See below for media query usage."
  },
  "breakpoints-sm": {
    value: "490px",
    description: "Commonly used for sizing containers (e.g. max-width). See below for media query usage."
  },
  "breakpoints-md": {
    value: "768px",
    description: "Commonly used for sizing containers (e.g. max-width). See below for media query usage."
  },
  "breakpoints-lg": {
    value: "1040px",
    description: "Commonly used for sizing containers (e.g. max-width). See below for media query usage."
  },
  "breakpoints-xl": {
    value: "1440px",
    description: "Commonly used for sizing containers (e.g. max-width). See below for media query usage."
  }
};

// node_modules/@shopify/polaris-tokens/dist/esm/_virtual/_rollupPluginBabelHelpers.mjs
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol < "u" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i != null) {
    var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, i === 0) {
        if (Object(_i) !== _i)
          return;
        _n = !1;
      } else
        for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0)
          ;
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && _i.return != null && (_r = _i.return(), Object(_r) !== _r))
          return;
      } finally {
        if (_d)
          throw _e;
      }
    }
    return _arr;
  }
}
function _taggedTemplateLiteralLoose(strings, raw) {
  return raw || (raw = strings.slice(0)), strings.raw = raw, strings;
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr))
    return arr;
}
function _unsupportedIterableToArray(o, minLen) {
  if (o) {
    if (typeof o == "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor && (n = o.constructor.name), n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
}
function _arrayLikeToArray(arr, len) {
  (len == null || len > arr.length) && (len = arr.length);
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _nonIterableRest() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}

// node_modules/@shopify/polaris-tokens/dist/esm/src/utils.mjs
var _templateObject, BASE_FONT_SIZE = 16, UNIT_PX = "px", UNIT_EM = "em", UNIT_REM = "rem", DIGIT_REGEX = new RegExp(String.raw(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["-?d+(?:.d+|d*)"], ["-?\\d+(?:\\.\\d+|\\d*)"])))), UNIT_REGEX = new RegExp(UNIT_PX + "|" + UNIT_EM + "|" + UNIT_REM);
function getUnit(value) {
  value === void 0 && (value = "");
  var unit = value.match(new RegExp(DIGIT_REGEX.source + "(" + UNIT_REGEX.source + ")"));
  return unit && unit[1];
}
function toPx(value) {
  value === void 0 && (value = "");
  var unit = getUnit(value);
  if (!unit || unit === UNIT_PX)
    return value;
  if (unit === UNIT_EM || unit === UNIT_REM)
    return "" + parseFloat(value) * BASE_FONT_SIZE + UNIT_PX;
}
function toEm(value, fontSize) {
  value === void 0 && (value = ""), fontSize === void 0 && (fontSize = BASE_FONT_SIZE);
  var unit = getUnit(value);
  if (!unit || unit === UNIT_EM)
    return value;
  if (unit === UNIT_PX)
    return "" + parseFloat(value) / fontSize + UNIT_EM;
  if (unit === UNIT_REM)
    return "" + parseFloat(value) * BASE_FONT_SIZE / fontSize + UNIT_EM;
}
function toRem(value) {
  value === void 0 && (value = "");
  var unit = getUnit(value);
  if (!unit || unit === UNIT_REM)
    return value;
  if (unit === UNIT_EM)
    return "" + parseFloat(value) + UNIT_REM;
  if (unit === UNIT_PX)
    return "" + parseFloat(value) / BASE_FONT_SIZE + UNIT_REM;
}
function rem(value) {
  return value.replace(new RegExp(DIGIT_REGEX.source + "(" + UNIT_PX + ")", "g"), function(px) {
    var _toRem;
    return (_toRem = toRem(px)) != null ? _toRem : px;
  });
}
function tokenGroupToRems(metaTokenGroup) {
  return Object.fromEntries(
    Object.entries(metaTokenGroup).map(function(_ref) {
      var _ref2 = _slicedToArray(_ref, 2), tokenName = _ref2[0], tokenProperties = _ref2[1];
      return [tokenName, Object.assign(Object.assign({}, tokenProperties), {}, {
        value: rem(tokenProperties.value)
      })];
    })
    // We loose the `metaTokenGroup` inference after transforming the object with
    // `Object.fromEntries()` and `Object.entries()`. Thus, we cast the result
    // back to `T` since we are simply converting the `value` from px to rem.
  );
}
function createVarName(tokenName) {
  return "--p-" + tokenName;
}
function createVar(tokenName) {
  return "var(" + createVarName(tokenName) + ")";
}
function getTokenNames(theme) {
  return Object.values(theme).flatMap(function(tokenGroup) {
    return Object.keys(tokenGroup);
  });
}
function getMediaConditions(breakpoints2) {
  var breakpointEntries = Object.entries(breakpoints2), lastBreakpointIndex = breakpointEntries.length - 1;
  return Object.fromEntries(breakpointEntries.map(function(entry2, index) {
    var _ref3 = entry2, _ref4 = _slicedToArray(_ref3, 2), breakpointsTokenName = _ref4[0], breakpoint = _ref4[1], upMediaCondition = getUpMediaCondition(breakpoint), downMediaCondition = getDownMediaCondition(breakpoint), onlyMediaCondition = index === lastBreakpointIndex ? upMediaCondition : upMediaCondition + " and " + getDownMediaCondition(breakpointEntries[index + 1][1]);
    return [breakpointsTokenName, {
      // Media condition for the current breakpoint and up
      up: upMediaCondition,
      // Media condition for current breakpoint and down
      down: downMediaCondition,
      // Media condition for only the current breakpoint
      only: onlyMediaCondition
    }];
  }));
}
function getUpMediaCondition(breakpoint) {
  return "(min-width: " + toEm(breakpoint) + ")";
}
function getDownMediaCondition(breakpoint) {
  var _toPx2, offsetBreakpoint = parseFloat((_toPx2 = toPx(breakpoint)) != null ? _toPx2 : "") - 0.04;
  return "(max-width: " + toEm(offsetBreakpoint + "px") + ")";
}
var tokenGroupNamesToRems = ["border", "breakpoints", "font", "height", "shadow", "space", "text", "width"];
function createMetaThemeBase(metaTheme) {
  return Object.fromEntries(Object.entries(metaTheme).map(function(_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2), tokenGroupName = _ref6[0], tokenGroup = _ref6[1];
    return [tokenGroupName, tokenGroupNamesToRems.includes(tokenGroupName) ? tokenGroupToRems(tokenGroup) : tokenGroup];
  }));
}

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/utils.mjs
import deepmerge from "deepmerge";

// node_modules/@shopify/polaris-tokens/dist/esm/src/size.mjs
var size = {
  0: "0px",
  "0165": "0.66px",
  "025": "1px",
  "050": "2px",
  100: "4px",
  150: "6px",
  200: "8px",
  275: "11px",
  300: "12px",
  325: "13px",
  350: "14px",
  400: "16px",
  450: "18px",
  500: "20px",
  550: "22px",
  600: "24px",
  700: "28px",
  750: "30px",
  800: "32px",
  900: "36px",
  1e3: "40px",
  1200: "48px",
  1600: "64px",
  2e3: "80px",
  2400: "96px",
  2800: "112px",
  3200: "128px"
};

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/base/border.mjs
var border = {
  "border-radius-0": {
    value: size[0]
  },
  "border-radius-050": {
    value: size["050"]
  },
  "border-radius-100": {
    value: size[100]
  },
  "border-radius-150": {
    value: size[150]
  },
  "border-radius-200": {
    value: size[200]
  },
  "border-radius-300": {
    value: size[300]
  },
  "border-radius-400": {
    value: size[400]
  },
  "border-radius-500": {
    value: size[500]
  },
  "border-radius-750": {
    value: size[750]
  },
  "border-radius-full": {
    value: "9999px"
  },
  "border-width-0": {
    value: size[0]
  },
  "border-width-0165": {
    value: size["0165"]
  },
  "border-width-025": {
    value: size["025"]
  },
  "border-width-050": {
    value: size["050"]
  },
  "border-width-100": {
    value: size[100]
  }
};

// node_modules/@shopify/polaris-tokens/dist/esm/src/colors.mjs
var gray = {
  1: "rgba(255, 255, 255, 1)",
  2: "rgba(253, 253, 253, 1)",
  3: "rgba(250, 250, 250, 1)",
  4: "rgba(247, 247, 247, 1)",
  5: "rgba(243, 243, 243, 1)",
  6: "rgba(241, 241, 241, 1)",
  7: "rgba(235, 235, 235, 1)",
  8: "rgba(227, 227, 227, 1)",
  9: "rgba(212, 212, 212, 1)",
  10: "rgba(204, 204, 204, 1)",
  11: "rgba(181, 181, 181, 1)",
  12: "rgba(138, 138, 138, 1)",
  13: "rgba(97, 97, 97, 1)",
  14: "rgba(74, 74, 74, 1)",
  15: "rgba(48, 48, 48, 1)",
  16: "rgba(26, 26, 26, 1)"
}, azure = {
  1: "rgba(251, 253, 255, 1)",
  2: "rgba(242, 249, 255, 1)",
  3: "rgba(234, 244, 255, 1)",
  4: "rgba(224, 240, 255, 1)",
  5: "rgba(213, 235, 255, 1)",
  6: "rgba(202, 230, 255, 1)",
  7: "rgba(192, 225, 255, 1)",
  8: "rgba(168, 216, 255, 1)",
  9: "rgba(145, 208, 255, 1)",
  10: "rgba(81, 192, 255, 1)",
  11: "rgba(0, 148, 213, 1)",
  12: "rgba(0, 124, 180, 1)",
  13: "rgba(0, 103, 155, 1)",
  14: "rgba(0, 82, 124, 1)",
  15: "rgba(0, 58, 90, 1)",
  16: "rgba(0, 33, 51, 1)"
}, blue = {
  1: "rgba(252, 253, 255, 1)",
  2: "rgba(246, 248, 255, 1)",
  3: "rgba(240, 242, 255, 1)",
  4: "rgba(234, 237, 255, 1)",
  5: "rgba(226, 231, 255, 1)",
  6: "rgba(219, 225, 255, 1)",
  7: "rgba(213, 220, 255, 1)",
  8: "rgba(197, 208, 255, 1)",
  9: "rgba(186, 199, 255, 1)",
  10: "rgba(151, 173, 255, 1)",
  11: "rgba(65, 136, 255, 1)",
  12: "rgba(0, 113, 233, 1)",
  13: "rgba(0, 91, 211, 1)",
  14: "rgba(0, 66, 153, 1)",
  15: "rgba(0, 46, 106, 1)",
  16: "rgba(0, 22, 51, 1)"
}, green = {
  1: "rgba(248, 255, 251, 1)",
  2: "rgba(227, 255, 237, 1)",
  3: "rgba(205, 254, 225, 1)",
  4: "rgba(180, 254, 210, 1)",
  5: "rgba(146, 254, 194, 1)",
  6: "rgba(99, 253, 176, 1)",
  7: "rgba(56, 250, 163, 1)",
  8: "rgba(53, 238, 155, 1)",
  9: "rgba(50, 225, 147, 1)",
  10: "rgba(46, 211, 137, 1)",
  11: "rgba(50, 160, 110, 1)",
  12: "rgba(41, 132, 90, 1)",
  13: "rgba(19, 111, 69, 1)",
  14: "rgba(12, 81, 50, 1)",
  15: "rgba(8, 61, 37, 1)",
  16: "rgba(9, 42, 27, 1)"
}, lime = {
  1: "rgba(250, 255, 250, 1)",
  2: "rgba(228, 255, 229, 1)",
  3: "rgba(208, 255, 209, 1)",
  4: "rgba(187, 254, 190, 1)",
  5: "rgba(157, 254, 160, 1)",
  6: "rgba(119, 254, 122, 1)",
  7: "rgba(56, 254, 62, 1)",
  8: "rgba(40, 242, 47, 1)",
  9: "rgba(37, 232, 43, 1)",
  10: "rgba(32, 207, 39, 1)",
  11: "rgba(24, 168, 29, 1)",
  12: "rgba(17, 135, 21, 1)",
  13: "rgba(12, 113, 15, 1)",
  14: "rgba(11, 85, 13, 1)",
  15: "rgba(3, 61, 5, 1)",
  16: "rgba(3, 33, 4, 1)"
}, magenta = {
  1: "rgba(255, 253, 255, 1)",
  2: "rgba(255, 245, 255, 1)",
  3: "rgba(253, 239, 253, 1)",
  4: "rgba(254, 231, 254, 1)",
  5: "rgba(252, 223, 252, 1)",
  6: "rgba(251, 215, 251, 1)",
  7: "rgba(251, 207, 251, 1)",
  8: "rgba(249, 190, 249, 1)",
  9: "rgba(248, 177, 248, 1)",
  10: "rgba(246, 141, 246, 1)",
  11: "rgba(225, 86, 225, 1)",
  12: "rgba(197, 48, 197, 1)",
  13: "rgba(159, 38, 159, 1)",
  14: "rgba(121, 26, 121, 1)",
  15: "rgba(86, 16, 86, 1)",
  16: "rgba(52, 6, 52, 1)"
}, orange = {
  1: "rgba(255, 253, 250, 1)",
  2: "rgba(255, 247, 238, 1)",
  3: "rgba(255, 241, 227, 1)",
  4: "rgba(255, 235, 213, 1)",
  5: "rgba(255, 228, 198, 1)",
  6: "rgba(255, 221, 182, 1)",
  7: "rgba(255, 214, 164, 1)",
  8: "rgba(255, 200, 121, 1)",
  9: "rgba(255, 184, 0, 1)",
  10: "rgba(229, 165, 0, 1)",
  11: "rgba(178, 132, 0, 1)",
  12: "rgba(149, 111, 0, 1)",
  13: "rgba(124, 88, 0, 1)",
  14: "rgba(94, 66, 0, 1)",
  15: "rgba(65, 45, 0, 1)",
  16: "rgba(37, 26, 0, 1)"
}, purple = {
  1: "rgba(253, 253, 255, 1)",
  2: "rgba(248, 247, 255, 1)",
  3: "rgba(243, 241, 255, 1)",
  4: "rgba(239, 236, 255, 1)",
  5: "rgba(233, 229, 255, 1)",
  6: "rgba(228, 222, 255, 1)",
  7: "rgba(223, 217, 255, 1)",
  8: "rgba(212, 204, 255, 1)",
  9: "rgba(199, 188, 255, 1)",
  10: "rgba(170, 149, 255, 1)",
  11: "rgba(148, 116, 255, 1)",
  12: "rgba(128, 81, 255, 1)",
  13: "rgba(113, 38, 255, 1)",
  14: "rgba(87, 0, 209, 1)",
  15: "rgba(59, 0, 147, 1)",
  16: "rgba(28, 0, 79, 1)"
}, red = {
  1: "rgba(255, 251, 251, 1)",
  2: "rgba(255, 246, 246, 1)",
  3: "rgba(255, 237, 236, 1)",
  4: "rgba(254, 233, 232, 1)",
  5: "rgba(254, 226, 225, 1)",
  6: "rgba(254, 218, 217, 1)",
  7: "rgba(254, 211, 209, 1)",
  8: "rgba(254, 195, 193, 1)",
  9: "rgba(253, 176, 172, 1)",
  10: "rgba(253, 129, 122, 1)",
  11: "rgba(239, 77, 47, 1)",
  12: "rgba(229, 28, 0, 1)",
  13: "rgba(181, 38, 11, 1)",
  14: "rgba(142, 31, 11, 1)",
  15: "rgba(95, 21, 7, 1)",
  16: "rgba(47, 10, 4, 1)"
}, rose = {
  1: "rgba(255, 253, 253, 1)",
  2: "rgba(255, 246, 248, 1)",
  3: "rgba(255, 239, 243, 1)",
  4: "rgba(255, 232, 238, 1)",
  5: "rgba(255, 225, 232, 1)",
  6: "rgba(255, 217, 227, 1)",
  7: "rgba(254, 209, 221, 1)",
  8: "rgba(254, 193, 210, 1)",
  9: "rgba(254, 181, 202, 1)",
  10: "rgba(254, 142, 177, 1)",
  11: "rgba(253, 75, 146, 1)",
  12: "rgba(227, 12, 118, 1)",
  13: "rgba(185, 7, 95, 1)",
  14: "rgba(141, 4, 72, 1)",
  15: "rgba(100, 2, 49, 1)",
  16: "rgba(62, 1, 28, 1)"
}, teal = {
  1: "rgba(248, 255, 254, 1)",
  2: "rgba(232, 252, 250, 1)",
  3: "rgba(215, 250, 247, 1)",
  4: "rgba(195, 247, 242, 1)",
  5: "rgba(170, 246, 239, 1)",
  6: "rgba(137, 245, 236, 1)",
  7: "rgba(112, 240, 229, 1)",
  8: "rgba(90, 230, 219, 1)",
  9: "rgba(44, 224, 212, 1)",
  10: "rgba(30, 199, 188, 1)",
  11: "rgba(0, 161, 152, 1)",
  12: "rgba(18, 131, 124, 1)",
  13: "rgba(12, 106, 100, 1)",
  14: "rgba(12, 83, 79, 1)",
  15: "rgba(3, 60, 57, 1)",
  16: "rgba(6, 44, 41, 1)"
}, yellow = {
  1: "rgba(255, 253, 246, 1)",
  2: "rgba(255, 248, 219, 1)",
  3: "rgba(255, 244, 191, 1)",
  4: "rgba(255, 239, 157, 1)",
  5: "rgba(255, 235, 120, 1)",
  6: "rgba(255, 230, 0, 1)",
  7: "rgba(247, 223, 0, 1)",
  8: "rgba(234, 211, 0, 1)",
  9: "rgba(225, 203, 0, 1)",
  10: "rgba(197, 178, 0, 1)",
  11: "rgba(153, 138, 0, 1)",
  12: "rgba(130, 117, 0, 1)",
  13: "rgba(105, 95, 0, 1)",
  14: "rgba(79, 71, 0, 1)",
  15: "rgba(51, 46, 0, 1)",
  16: "rgba(31, 28, 0, 1)"
}, blackAlpha = {
  1: "rgba(0, 0, 0, 0)",
  2: "rgba(0, 0, 0, 0.01)",
  3: "rgba(0, 0, 0, 0.02)",
  4: "rgba(0, 0, 0, 0.03)",
  5: "rgba(0, 0, 0, 0.05)",
  6: "rgba(0, 0, 0, 0.06)",
  7: "rgba(0, 0, 0, 0.08)",
  8: "rgba(0, 0, 0, 0.11)",
  9: "rgba(0, 0, 0, 0.17)",
  10: "rgba(0, 0, 0, 0.20)",
  11: "rgba(0, 0, 0, 0.29)",
  12: "rgba(0, 0, 0, 0.46)",
  13: "rgba(0, 0, 0, 0.62)",
  14: "rgba(0, 0, 0, 0.71)",
  15: "rgba(0, 0, 0, 0.81)",
  16: "rgba(0, 0, 0, 0.90)"
}, whiteAlpha = {
  1: "rgba(255, 255, 255, 0)",
  2: "rgba(255, 255, 255, 0.01)",
  3: "rgba(255, 255, 255, 0.02)",
  4: "rgba(255, 255, 255, 0.03)",
  5: "rgba(255, 255, 255, 0.05)",
  6: "rgba(255, 255, 255, 0.06)",
  7: "rgba(255, 255, 255, 0.08)",
  8: "rgba(255, 255, 255, 0.11)",
  9: "rgba(255, 255, 255, 0.17)",
  10: "rgba(255, 255, 255, 0.20)",
  11: "rgba(255, 255, 255, 0.28)",
  12: "rgba(255, 255, 255, 0.46)",
  13: "rgba(255, 255, 255, 0.62)",
  14: "rgba(255, 255, 255, 0.71)",
  15: "rgba(255, 255, 255, 0.81)",
  16: "rgba(255, 255, 255, 0.90)"
};

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/base/color.mjs
var color = {
  "color-scheme": {
    value: "light"
  },
  "color-bg": {
    value: gray[6],
    description: "The default background color of the admin."
  },
  "color-bg-inverse": {
    value: gray[16],
    description: "Use for high contrast page or component backgrounds."
  },
  "color-bg-surface": {
    value: gray[1],
    description: "The background color for elements with the highest level of prominence, like a card."
  },
  "color-bg-surface-hover": {
    value: gray[4],
    description: "The hover state color for elements with the highest level of prominence."
  },
  "color-bg-surface-active": {
    value: gray[5],
    description: "The active state (on press) color for elements with the highest level of prominence."
  },
  "color-bg-surface-selected": {
    value: gray[6],
    description: "The selected state color for elements with the highest level of prominence."
  },
  "color-bg-surface-disabled": {
    value: blackAlpha[5],
    description: "The disabled state color for elements."
  },
  "color-bg-surface-secondary": {
    value: gray[4],
    description: "The background color for elements with a secondary level of prominence."
  },
  "color-bg-surface-secondary-hover": {
    value: gray[6],
    description: "The hover state color for elements with a secondary level of prominence."
  },
  "color-bg-surface-secondary-active": {
    value: gray[7],
    description: "The active state (on press) color for elements with a secondary level of prominence."
  },
  "color-bg-surface-secondary-selected": {
    value: gray[7],
    description: "The selected state color for elements with a secondary level of prominence."
  },
  "color-bg-surface-tertiary": {
    value: gray[5],
    description: "The background color for elements with a third level of prominence."
  },
  "color-bg-surface-tertiary-hover": {
    value: gray[7],
    description: "The hover state color for elements with a third level of prominence."
  },
  "color-bg-surface-tertiary-active": {
    value: gray[8],
    description: "The active state (on press) color for elements with a third level of prominence."
  },
  "color-bg-surface-brand": {
    value: gray[8],
    description: "Use to apply the key color to elements."
  },
  "color-bg-surface-brand-hover": {
    value: gray[7],
    description: "The hover state color for key elements."
  },
  "color-bg-surface-brand-active": {
    value: gray[6],
    description: "The active state (on press) color for key elements."
  },
  "color-bg-surface-brand-selected": {
    value: gray[6],
    description: "The selected state color for key elements."
  },
  "color-bg-surface-info": {
    value: azure[3],
    description: "Use for backgrounds communicating important information, like banners."
  },
  "color-bg-surface-info-hover": {
    value: azure[4],
    description: "The hover state color for communicating important information."
  },
  "color-bg-surface-info-active": {
    value: azure[6],
    description: "The active state (on press) color for communicating important information."
  },
  "color-bg-surface-success": {
    value: green[3],
    description: "Use for backgrounds communicating success, like banners."
  },
  "color-bg-surface-success-hover": {
    value: green[4],
    description: "The hover state color for communicating success."
  },
  "color-bg-surface-success-active": {
    value: green[5],
    description: "The active state (on press) color for communicating success."
  },
  "color-bg-surface-caution": {
    value: yellow[2],
    description: "Use for backgrounds communicating caution, like banners."
  },
  "color-bg-surface-caution-hover": {
    value: yellow[3],
    description: "The hover state for communicating caution."
  },
  "color-bg-surface-caution-active": {
    value: yellow[4],
    description: "The active state (on press) color for communicating caution."
  },
  "color-bg-surface-warning": {
    value: orange[3],
    description: "Use for backgrounds communicating warning, like banners."
  },
  "color-bg-surface-warning-hover": {
    value: orange[4],
    description: "The hover state color for communicating warning."
  },
  "color-bg-surface-warning-active": {
    value: orange[5],
    description: "The active state (on press) color for communicating warning."
  },
  "color-bg-surface-critical": {
    value: red[4],
    description: "Use for backgrounds communicating critical information, like banners or input errors."
  },
  "color-bg-surface-critical-hover": {
    value: red[5],
    description: "The hover state color for communicating critical information."
  },
  "color-bg-surface-critical-active": {
    value: red[6],
    description: "The active state (on press) color for communicating critical information."
  },
  "color-bg-surface-emphasis": {
    value: blue[3],
    description: "Use for backgrounds indicating areas of focus in editors, such as the theme editor."
  },
  "color-bg-surface-emphasis-hover": {
    value: blue[4],
    description: "The hover state color for elements indicating areas of focus in editors."
  },
  "color-bg-surface-emphasis-active": {
    value: blue[5],
    description: "The active state (on press) color for elements indicating areas of focus in editors."
  },
  "color-bg-surface-magic": {
    value: purple[2],
    description: "Use for backgrounds of elements suggested by magic AI."
  },
  "color-bg-surface-magic-hover": {
    value: purple[3],
    description: "The hover state color for elements suggested by magic AI."
  },
  "color-bg-surface-magic-active": {
    value: purple[5],
    description: "The active state (on press) color for elements suggested by magic AI."
  },
  "color-bg-surface-inverse": {
    value: gray[15],
    description: "Use for elements on bg-inverse."
  },
  "color-bg-surface-transparent": {
    value: blackAlpha[1],
    description: "Use for elements that need a fully transparent background."
  },
  "color-bg-fill": {
    value: gray[1],
    description: "The background color of contained elements with a smaller surface area, like a button."
  },
  "color-bg-fill-hover": {
    value: gray[3],
    description: "The hover state color of contained elements with a smaller surface area, like a button."
  },
  "color-bg-fill-active": {
    value: gray[4],
    description: "The active state (on press) color of contained elements with a smaller surface area, like a button."
  },
  "color-bg-fill-selected": {
    value: gray[10],
    description: "The selected state color of contained elements with a smaller surface area, like a button or checkbox."
  },
  "color-bg-fill-disabled": {
    value: blackAlpha[5],
    description: "The disabled state color of contained elements with a smaller surface area, like a button."
  },
  "color-bg-fill-secondary": {
    value: gray[6],
    description: "The background color of elements with a smaller surface area and a secondary level of prominence."
  },
  "color-bg-fill-secondary-hover": {
    value: gray[7],
    description: "The hover state color of elements with a smaller surface area and a secondary level of prominence."
  },
  "color-bg-fill-secondary-active": {
    value: gray[8],
    description: "The active state (on press) color of elements with a smaller surface area and a secondary level of prominence."
  },
  "color-bg-fill-tertiary": {
    value: gray[8],
    description: "The background color of elements with a smaller surface area and a third level of prominence."
  },
  "color-bg-fill-tertiary-hover": {
    value: gray[9],
    description: "The hover state color of elements with a smaller surface area and a third level of prominence."
  },
  "color-bg-fill-tertiary-active": {
    value: gray[10],
    description: "The active state (on press) color of elements with a smaller surface area and a third level of prominence."
  },
  "color-bg-fill-brand": {
    value: gray[15],
    description: "The background color of main actions, like primary buttons."
  },
  "color-bg-fill-brand-hover": {
    value: gray[16],
    description: "The hover state color of main actions, like primary buttons."
  },
  "color-bg-fill-brand-active": {
    value: gray[16],
    description: "The active state (on press) color of main actions, like primary buttons."
  },
  "color-bg-fill-brand-selected": {
    value: gray[15],
    description: "The selected state color of main actions, like primary buttons."
  },
  "color-bg-fill-brand-disabled": {
    value: blackAlpha[9],
    description: "The disabled state color of main actions, like primary buttons."
  },
  "color-bg-fill-info": {
    value: azure[9],
    description: "Use for backgrounds communicating important information on elements with a smaller surface area, like a badge or button."
  },
  "color-bg-fill-info-hover": {
    value: azure[10],
    description: "The hover state color for communicating important information on elements with a smaller surface area."
  },
  "color-bg-fill-info-active": {
    value: azure[11],
    description: "The active state (on press) color for communicating important information on elements with a smaller surface area."
  },
  "color-bg-fill-info-secondary": {
    value: azure[5],
    description: "Use for backgrounds communicating important information on elements with a smaller surface area, with a secondary level of prominence."
  },
  "color-bg-fill-success": {
    value: green[12],
    description: "Use for backgrounds communicating success on elements with a smaller surface area, like a badge or a banner."
  },
  "color-bg-fill-success-hover": {
    value: green[13],
    description: "The hover state color for communicating success on elements with a smaller surface area."
  },
  "color-bg-fill-success-active": {
    value: green[14],
    description: "The active state (on press) color for communicating success on elements with a smaller surface area."
  },
  "color-bg-fill-success-secondary": {
    value: green[4],
    description: "Use for backgrounds communicating success on elements with a smaller surface area, with a secondary level of prominence."
  },
  "color-bg-fill-warning": {
    value: orange[9],
    description: "Use for backgrounds communicating warning on elements with a smaller surface area, like a badge or a banner."
  },
  "color-bg-fill-warning-hover": {
    value: orange[10],
    description: "The hover state color for communicating warning on elements with a smaller surface area."
  },
  "color-bg-fill-warning-active": {
    value: orange[11],
    description: "The active state (on press) color for communicating warning on elements with a smaller surface area."
  },
  "color-bg-fill-warning-secondary": {
    value: orange[7],
    description: "Use for backgrounds communicating warning on elements with a smaller surface area, with a secondary level of prominence."
  },
  "color-bg-fill-caution": {
    value: yellow[6],
    description: "Use for backgrounds communicating caution on elements with a smaller surface area, like a badge or a banner."
  },
  "color-bg-fill-caution-hover": {
    value: yellow[8],
    description: "The hover state color for communicating caution on elements with a smaller surface area."
  },
  "color-bg-fill-caution-active": {
    value: yellow[9],
    description: "The active state (on press) color for communicating caution on elements with a smaller surface area."
  },
  "color-bg-fill-caution-secondary": {
    value: yellow[5],
    description: "Use for backgrounds communicating caution on elements with a smaller surface area, with a secondary level of prominence."
  },
  "color-bg-fill-critical": {
    value: red[12],
    description: "Use for backgrounds communicating critical information on elements with a smaller surface area, like a badge or a banner."
  },
  "color-bg-fill-critical-hover": {
    value: red[13],
    description: "The hover state color for communicating critical information on elements with a smaller surface area."
  },
  "color-bg-fill-critical-active": {
    value: red[14],
    description: "The active state (on press) color for communicating critical information on elements with a smaller surface area."
  },
  "color-bg-fill-critical-selected": {
    value: red[14],
    description: "The selected state color for communicating critical information on elements with a smaller surface area."
  },
  "color-bg-fill-critical-secondary": {
    value: red[7],
    description: "Use for backgrounds communicating critical information on elements with a smaller surface area, with a secondary level of prominence."
  },
  "color-bg-fill-emphasis": {
    value: blue[13],
    description: "Use for backgrounds indicating areas of focus in editors on elements with a smaller surface area, like a button or a badge."
  },
  "color-bg-fill-emphasis-hover": {
    value: blue[14],
    description: "The hover state color for indicating areas of focus in editors on elements with a smaller surface area."
  },
  "color-bg-fill-emphasis-active": {
    value: blue[15],
    description: "The active state (on press) color for indicating areas of focus in editors on elements with a smaller surface area."
  },
  "color-bg-fill-magic": {
    value: purple[12],
    description: "The background color of elements suggested by magic AI, like a badge or a banner."
  },
  "color-bg-fill-magic-secondary": {
    value: purple[5],
    description: "The background color of elements suggested by magic AI, with a secondary level of prominence."
  },
  "color-bg-fill-magic-secondary-hover": {
    value: purple[6],
    description: "The hover state color of elements suggested by magic AI, with a secondary level of prominence."
  },
  "color-bg-fill-magic-secondary-active": {
    value: purple[7],
    description: "The active state (on press) color of elements suggested by magic AI, with a secondary level of prominence."
  },
  "color-bg-fill-inverse": {
    value: gray[15],
    description: "The background color of elements with a smaller surface area on an inverse background."
  },
  "color-bg-fill-inverse-hover": {
    value: gray[14],
    description: "The hover state color of elements with a smaller surface area on an inverse background."
  },
  "color-bg-fill-inverse-active": {
    value: gray[13],
    description: "The active state (on press) color of elements with a smaller surface area on an inverse background."
  },
  "color-bg-fill-transparent": {
    value: blackAlpha[3],
    description: "The background color of elements that need to sit on different background colors, like tabs."
  },
  "color-bg-fill-transparent-hover": {
    value: blackAlpha[5],
    description: "The hover state color of elements that need to sit on different background colors, like tabs."
  },
  "color-bg-fill-transparent-active": {
    value: blackAlpha[7],
    description: "The active state (on press) color of elements that need to sit on different background colors, like tabs."
  },
  "color-bg-fill-transparent-selected": {
    value: blackAlpha[7],
    description: "The selected state color of elements that need to sit on different background colors, like tabs."
  },
  "color-bg-fill-transparent-secondary": {
    value: blackAlpha[6],
    description: "The background color of elements that need to sit on different background colors, with a secondary level of prominence."
  },
  "color-bg-fill-transparent-secondary-hover": {
    value: blackAlpha[7],
    description: "The hover state color of elements that need to sit on different background colors, with a secondary level of prominence."
  },
  "color-bg-fill-transparent-secondary-active": {
    value: blackAlpha[8],
    description: "The active state (on press) color of elements that need to sit on different background colors, with a secondary level of prominence."
  },
  "color-text": {
    value: gray[15],
    description: "The default text color."
  },
  "color-text-secondary": {
    value: gray[13],
    description: "Use for text with a secondary level of prominence."
  },
  "color-text-disabled": {
    value: gray[11],
    description: "Use for text in a disabled state."
  },
  "color-text-link": {
    value: blue[13],
    description: "Use for text links."
  },
  "color-text-link-hover": {
    value: blue[14],
    description: "The hover state color for text links."
  },
  "color-text-link-active": {
    value: blue[15],
    description: "The active state (on press) color for text links."
  },
  "color-text-brand": {
    value: gray[14],
    description: "Use for text that needs to pull attention."
  },
  "color-text-brand-hover": {
    value: gray[15],
    description: "The hover state color for text that needs to pull attention."
  },
  "color-text-brand-on-bg-fill": {
    value: gray[1],
    description: "Use for text on bg-fill-brand, like primary buttons."
  },
  "color-text-brand-on-bg-fill-hover": {
    value: gray[8],
    description: "The hover state color for text on bg-fill-brand-hover."
  },
  "color-text-brand-on-bg-fill-active": {
    value: gray[10],
    description: "The active state (on press) color for text on bg-fill-brand."
  },
  "color-text-brand-on-bg-fill-disabled": {
    value: gray[1],
    description: "The disabled state color for text on bg-fill-brand-disabled."
  },
  "color-text-info": {
    value: azure[15],
    description: "Use for text communicating important information."
  },
  "color-text-info-hover": {
    value: azure[15],
    description: "The hover state color for text communicating important information."
  },
  "color-text-info-active": {
    value: azure[16],
    description: "The active state (on press) color for text communicating important information."
  },
  "color-text-info-secondary": {
    value: azure[12],
    description: "Use for text communicating important information with a secondary level of prominence."
  },
  "color-text-info-on-bg-fill": {
    value: azure[16],
    description: "Use for text and icons on bg-fill-info."
  },
  "color-text-success": {
    value: green[14],
    description: "Use for text communicating success."
  },
  "color-text-success-hover": {
    value: green[15],
    description: "The hover state color for text communicating success."
  },
  "color-text-success-active": {
    value: green[16],
    description: "The active state (on press) color for text communicating success."
  },
  "color-text-success-secondary": {
    value: green[12],
    description: "Use for text communicating success with a secondary level of prominence."
  },
  "color-text-success-on-bg-fill": {
    value: green[1],
    description: "Use for text and icons on bg-fill-success."
  },
  "color-text-caution": {
    value: yellow[14],
    description: "Use for text communicating caution."
  },
  "color-text-caution-hover": {
    value: yellow[15],
    description: "The hover state color for text communicating caution."
  },
  "color-text-caution-active": {
    value: yellow[16],
    description: "The active state (on press) color for text communicating caution."
  },
  "color-text-caution-secondary": {
    value: yellow[12],
    description: "Use for text communicating caution with a secondary level of prominence."
  },
  "color-text-caution-on-bg-fill": {
    value: yellow[15],
    description: "Use for text and icons on bg-fill-caution."
  },
  "color-text-warning": {
    value: orange[14],
    description: "Use for text communicating warning."
  },
  "color-text-warning-hover": {
    value: orange[15],
    description: "The hover state color for text communicating warning."
  },
  "color-text-warning-active": {
    value: orange[16],
    description: "The active state (on press) color for text communicating warning."
  },
  "color-text-warning-secondary": {
    value: orange[12],
    description: "Use for text communicating warning with a secondary level of prominence."
  },
  "color-text-warning-on-bg-fill": {
    value: orange[16],
    description: "Use for text and icons on bg-fill-warning."
  },
  "color-text-critical": {
    value: red[14],
    description: "Use for text communicating critical information."
  },
  "color-text-critical-hover": {
    value: red[15],
    description: "The hover state color for text communicating critical information."
  },
  "color-text-critical-active": {
    value: red[16],
    description: "The active state (on press) color for text communicating critical information."
  },
  "color-text-critical-secondary": {
    value: red[12],
    description: "Use for text communicating critical information with a secondary level of prominence."
  },
  "color-text-critical-on-bg-fill": {
    value: red[1],
    description: "Use for text and icons on bg-fill-critical."
  },
  "color-text-emphasis": {
    value: blue[13],
    description: "Use for text indicating areas of focus in editors, like the theme editor."
  },
  "color-text-emphasis-hover": {
    value: blue[14],
    description: "The hover state color for text indicating areas of focus."
  },
  "color-text-emphasis-active": {
    value: blue[15],
    description: "The active state (on press) color for text indicating areas of focus."
  },
  "color-text-emphasis-on-bg-fill": {
    value: blue[1],
    description: "Use for text and icons on bg-fill-emphasis."
  },
  "color-text-emphasis-on-bg-fill-hover": {
    value: blue[5],
    description: "Use for text and icons on bg-fill-emphasis-hover."
  },
  "color-text-emphasis-on-bg-fill-active": {
    value: blue[7],
    description: "Use for text and icons on bg-fill-emphasis-active."
  },
  "color-text-magic": {
    value: purple[14],
    description: "Use for text suggested by magic AI."
  },
  "color-text-magic-secondary": {
    value: purple[13],
    description: "Use for text suggested by magic AI with a secondary level of prominence."
  },
  "color-text-magic-on-bg-fill": {
    value: purple[1],
    description: "Use for text and icons on bg-fill-magic."
  },
  "color-text-inverse": {
    value: gray[8],
    description: "Use for text on an inverse background."
  },
  "color-text-inverse-secondary": {
    value: gray[11],
    description: "Use for secondary text on an inverse background."
  },
  "color-text-link-inverse": {
    value: blue[8],
    description: "Use for text links on an inverse background."
  },
  "color-border": {
    value: gray[8],
    description: "The default color for borders on any element."
  },
  "color-border-hover": {
    value: gray[10],
    description: "The hover color for borders on any element."
  },
  "color-border-disabled": {
    value: gray[7],
    description: "The disabled color for borders on any element."
  },
  "color-border-secondary": {
    value: gray[7],
    description: "The color for hr elements or any visual dividers."
  },
  "color-border-tertiary": {
    value: gray[10],
    description: "The border color on any element. Pair with bg-surface-tertiary or bg-fill-tertiary."
  },
  "color-border-focus": {
    value: blue[13],
    description: "The focus ring for any interactive element in a focused state."
  },
  "color-border-brand": {
    value: gray[8],
    description: "Use for borders paired with brand colors."
  },
  "color-border-info": {
    value: azure[8],
    description: "Use for borders communicating information."
  },
  "color-border-success": {
    value: green[5],
    description: "Use for borders communicating success."
  },
  "color-border-caution": {
    value: yellow[5],
    description: "Use for borders communicating caution."
  },
  "color-border-warning": {
    value: orange[8],
    description: "Use for borders communicating warning."
  },
  "color-border-critical": {
    value: red[8],
    description: "Use for borders communicating critical information."
  },
  "color-border-critical-secondary": {
    value: red[14],
    description: "Use for borders communicating critical information, such as borders on invalid text fields."
  },
  "color-border-emphasis": {
    value: blue[13],
    description: "Use for borders indicating areas of focus."
  },
  "color-border-emphasis-hover": {
    value: blue[14],
    description: "The hover state color for borders indicating areas of focus."
  },
  "color-border-emphasis-active": {
    value: blue[15],
    description: "The active state (on press) color for borders indicating areas of focus."
  },
  "color-border-magic": {
    value: purple[6],
    description: "Use for borders suggested by magic AI."
  },
  "color-border-magic-secondary": {
    value: purple[11],
    description: "Use for borders suggested by magic AI, such as borders on text fields."
  },
  "color-border-magic-secondary-hover": {
    value: purple[12],
    description: "Use for borders suggested by magic AI, such as borders on text fields."
  },
  "color-border-inverse": {
    value: gray[13],
    description: "Use for borders on an inverse background, such as borders on the global search."
  },
  "color-border-inverse-hover": {
    value: gray[10],
    description: "The hover state color for borders on an inverse background."
  },
  "color-border-inverse-active": {
    value: gray[8],
    description: "The active state (on press) color for borders on an inverse background."
  },
  "color-tooltip-tail-down-border-experimental": {
    value: gray[9],
    description: "The border color for tooltip tails pointing down."
  },
  "color-tooltip-tail-up-border-experimental": {
    value: gray[8],
    description: "The border color for tooltip tails pointing up."
  },
  "color-border-gradient-experimental": {
    value: "linear-gradient(to bottom, " + gray[7] + ", " + gray[10] + " 78%, " + gray[11] + ")"
  },
  "color-border-gradient-hover-experimental": {
    value: "linear-gradient(to bottom, " + gray[7] + ", " + gray[10] + " 78%, " + gray[11] + ")"
  },
  "color-border-gradient-selected-experimental": {
    value: "linear-gradient(to bottom, " + gray[7] + ", " + gray[10] + " 78%, " + gray[11] + ")"
  },
  "color-border-gradient-active-experimental": {
    value: "linear-gradient(to bottom, " + gray[7] + ", " + gray[10] + " 78%, " + gray[11] + ")"
  },
  "color-icon": {
    value: gray[14],
    description: "The default color for icons."
  },
  "color-icon-hover": {
    value: gray[15],
    description: "The hover state color for icons."
  },
  "color-icon-active": {
    value: gray[16],
    description: "The active state (on press) color for icons."
  },
  "color-icon-disabled": {
    value: gray[10],
    description: "The disabled state color for icons."
  },
  "color-icon-secondary": {
    value: gray[12],
    description: "Use for secondary icons."
  },
  "color-icon-secondary-hover": {
    value: gray[13],
    description: "The hover state color for secondary icons."
  },
  "color-icon-secondary-active": {
    value: gray[14],
    description: "The active state (on press) color for secondary icons."
  },
  "color-icon-brand": {
    value: gray[16],
    description: "Use for icons that need to pull more focus."
  },
  "color-icon-info": {
    value: azure[11],
    description: "Use for icons communicating information."
  },
  "color-icon-success": {
    value: green[12],
    description: "Use for icons communicating success."
  },
  "color-icon-caution": {
    value: yellow[11],
    description: "Use for icons communicating caution."
  },
  "color-icon-warning": {
    value: orange[11],
    description: "Use for icons communicating warning."
  },
  "color-icon-critical": {
    value: red[11],
    description: "Use for icons communicating critical information."
  },
  "color-icon-emphasis": {
    value: blue[13],
    description: "Use for icons indicating areas of focus in editors, like the theme editor."
  },
  "color-icon-emphasis-hover": {
    value: blue[14],
    description: "The hover color for icons indicating areas of focus in editors."
  },
  "color-icon-emphasis-active": {
    value: blue[15],
    description: "The active state (on press) color for icons indicating areas of focus in editors."
  },
  "color-icon-magic": {
    value: purple[12],
    description: "Use for icons suggested by magic AI."
  },
  "color-icon-inverse": {
    value: gray[8],
    description: "Use for icons on an inverse background."
  },
  "color-avatar-bg-fill": {
    value: gray[11]
  },
  "color-avatar-five-bg-fill": {
    value: rose[11]
  },
  "color-avatar-five-text-on-bg-fill": {
    value: rose[2]
  },
  "color-avatar-four-bg-fill": {
    value: azure[10]
  },
  "color-avatar-four-text-on-bg-fill": {
    value: azure[16]
  },
  "color-avatar-one-bg-fill": {
    value: magenta[12]
  },
  "color-avatar-one-text-on-bg-fill": {
    value: magenta[3]
  },
  "color-avatar-seven-bg-fill": {
    value: purple[11]
  },
  "color-avatar-seven-text-on-bg-fill": {
    value: purple[2]
  },
  "color-avatar-six-bg-fill": {
    value: lime[9]
  },
  "color-avatar-six-text-on-bg-fill": {
    value: lime[15]
  },
  "color-avatar-text-on-bg-fill": {
    value: gray[1]
  },
  "color-avatar-three-bg-fill": {
    value: teal[9]
  },
  "color-avatar-three-text-on-bg-fill": {
    value: teal[15]
  },
  "color-avatar-two-bg-fill": {
    value: green[7]
  },
  "color-avatar-two-text-on-bg-fill": {
    value: green[14]
  },
  "color-backdrop-bg": {
    value: blackAlpha[14]
  },
  "color-button-gradient-bg-fill": {
    value: "linear-gradient(180deg, rgba(48, 48, 48, 0) 63.53%, rgba(255, 255, 255, 0.15) 100%)"
  },
  "color-checkbox-bg-surface-disabled": {
    value: blackAlpha[7]
  },
  "color-checkbox-icon-disabled": {
    value: gray[1]
  },
  "color-input-bg-surface": {
    value: gray[2]
  },
  "color-input-bg-surface-hover": {
    value: gray[3]
  },
  "color-input-bg-surface-active": {
    value: gray[4]
  },
  "color-input-border": {
    value: gray[12]
  },
  "color-input-border-hover": {
    value: gray[13]
  },
  "color-input-border-active": {
    value: gray[16]
  },
  "color-nav-bg": {
    value: gray[7]
  },
  "color-nav-bg-surface": {
    value: blackAlpha[3]
  },
  "color-nav-bg-surface-hover": {
    value: gray[6]
  },
  "color-nav-bg-surface-active": {
    value: gray[3]
  },
  "color-nav-bg-surface-selected": {
    value: gray[3]
  },
  "color-radio-button-bg-surface-disabled": {
    value: blackAlpha[7]
  },
  "color-radio-button-icon-disabled": {
    value: gray[1]
  },
  "color-video-thumbnail-play-button-bg-fill-hover": {
    value: blackAlpha[15]
  },
  "color-video-thumbnail-play-button-bg-fill": {
    value: blackAlpha[14]
  },
  "color-video-thumbnail-play-button-text-on-bg-fill": {
    value: gray[1]
  },
  "color-scrollbar-thumb-bg-hover": {
    value: gray[12]
  }
};

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/base/font.mjs
var font = {
  "font-family-sans": {
    value: "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"
  },
  "font-family-mono": {
    value: "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace"
  },
  "font-size-275": {
    value: size[275]
  },
  "font-size-300": {
    value: size[300]
  },
  "font-size-325": {
    value: size[325]
  },
  "font-size-350": {
    value: size[350]
  },
  "font-size-400": {
    value: size[400]
  },
  "font-size-450": {
    value: size[450]
  },
  "font-size-500": {
    value: size[500]
  },
  "font-size-550": {
    value: size[550]
  },
  "font-size-600": {
    value: size[600]
  },
  "font-size-750": {
    value: size[750]
  },
  "font-size-800": {
    value: size[800]
  },
  "font-size-900": {
    value: size[900]
  },
  "font-size-1000": {
    value: size[1e3]
  },
  "font-weight-regular": {
    value: "450"
  },
  "font-weight-medium": {
    value: "550"
  },
  "font-weight-semibold": {
    value: "650"
  },
  "font-weight-bold": {
    value: "700"
  },
  "font-letter-spacing-densest": {
    value: "-0.54px"
  },
  "font-letter-spacing-denser": {
    value: "-0.3px"
  },
  "font-letter-spacing-dense": {
    value: "-0.2px"
  },
  "font-letter-spacing-normal": {
    value: "0px"
  },
  "font-line-height-300": {
    value: size[300]
  },
  "font-line-height-400": {
    value: size[400]
  },
  "font-line-height-500": {
    value: size[500]
  },
  "font-line-height-600": {
    value: size[600]
  },
  "font-line-height-700": {
    value: size[700]
  },
  "font-line-height-800": {
    value: size[800]
  },
  "font-line-height-1000": {
    value: size[1e3]
  },
  "font-line-height-1200": {
    value: size[1200]
  }
};

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/base/height.mjs
var height = {
  "height-0": {
    value: size[0]
  },
  "height-025": {
    value: size["025"]
  },
  "height-050": {
    value: size["050"]
  },
  "height-100": {
    value: size[100]
  },
  "height-150": {
    value: size[150]
  },
  "height-200": {
    value: size[200]
  },
  "height-300": {
    value: size[300]
  },
  "height-400": {
    value: size[400]
  },
  "height-500": {
    value: size[500]
  },
  "height-600": {
    value: size[600]
  },
  "height-700": {
    value: size[700]
  },
  "height-800": {
    value: size[800]
  },
  "height-900": {
    value: size[900]
  },
  "height-1000": {
    value: size[1e3]
  },
  "height-1200": {
    value: size[1200]
  },
  "height-1600": {
    value: size[1600]
  },
  "height-2000": {
    value: size[2e3]
  },
  "height-2400": {
    value: size[2400]
  },
  "height-2800": {
    value: size[2800]
  },
  "height-3200": {
    value: size[3200]
  }
};

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/base/motion.mjs
var motion = {
  "motion-duration-0": {
    value: "0ms"
  },
  "motion-duration-50": {
    value: "50ms"
  },
  "motion-duration-100": {
    value: "100ms"
  },
  "motion-duration-150": {
    value: "150ms"
  },
  "motion-duration-200": {
    value: "200ms"
  },
  "motion-duration-250": {
    value: "250ms"
  },
  "motion-duration-300": {
    value: "300ms"
  },
  "motion-duration-350": {
    value: "350ms"
  },
  "motion-duration-400": {
    value: "400ms"
  },
  "motion-duration-450": {
    value: "450ms"
  },
  "motion-duration-500": {
    value: "500ms"
  },
  "motion-duration-5000": {
    value: "5000ms"
  },
  "motion-ease": {
    value: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    description: "Responds quickly and finishes with control. A great default for any user interaction."
  },
  "motion-ease-in": {
    value: "cubic-bezier(0.42, 0, 1, 1)",
    description: "Starts slowly and finishes at top speed. Use sparingly."
  },
  "motion-ease-out": {
    value: "cubic-bezier(0.19, 0.91, 0.38, 1)",
    description: "Starts at top speed and finishes slowly. Use sparingly."
  },
  "motion-ease-in-out": {
    value: "cubic-bezier(0.42, 0, 0.58, 1)",
    description: "Starts and finishes with equal speed. A good default for transitions triggered by the system."
  },
  "motion-linear": {
    value: "cubic-bezier(0, 0, 1, 1)",
    description: "Moves with constant speed. Use for continuous and mechanical animations, such as rotating spinners."
  },
  "motion-keyframes-bounce": {
    value: "{ from, 65%, 85% { transform: scale(1) } 75% { transform: scale(0.85) } 82.5% { transform: scale(1.05) } }"
  },
  "motion-keyframes-fade-in": {
    value: "{ to { opacity: 1 } }"
  },
  "motion-keyframes-pulse": {
    value: "{ from, 75% { transform: scale(0.85); opacity: 1; } to { transform: scale(2.5); opacity: 0; } }"
  },
  "motion-keyframes-spin": {
    value: "{ to { transform: rotate(1turn) } }"
  },
  "motion-keyframes-appear-above": {
    value: "{ from { transform: translateY(var(--p-space-100)); opacity: 0; } to { transform: none; opacity: 1; } }"
  },
  "motion-keyframes-appear-below": {
    value: "{ from { transform: translateY(calc(var(--p-space-100) * -1)); opacity: 0; } to { transform: none; opacity: 1; } }"
  }
};

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/base/shadow.mjs
var shadow = {
  "shadow-0": {
    value: "none"
  },
  "shadow-100": {
    value: "0px 1px 0px 0px rgba(26, 26, 26, 0.07)"
  },
  "shadow-200": {
    value: "0px 3px 1px -1px rgba(26, 26, 26, 0.07)"
  },
  "shadow-300": {
    value: "0px 4px 6px -2px rgba(26, 26, 26, 0.20)"
  },
  "shadow-400": {
    value: "0px 8px 16px -4px rgba(26, 26, 26, 0.22)"
  },
  "shadow-500": {
    value: "0px 12px 20px -8px rgba(26, 26, 26, 0.24)"
  },
  "shadow-600": {
    value: "0px 20px 20px -8px rgba(26, 26, 26, 0.28)"
  },
  "shadow-bevel-100": {
    value: "1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset, -1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset, 0px -1px 0px 0px rgba(0, 0, 0, 0.17) inset, 0px 1px 0px 0px rgba(204, 204, 204, 0.5) inset"
  },
  "shadow-inset-100": {
    value: "0px 1px 2px 0px rgba(26, 26, 26, 0.15) inset, 0px 1px 1px 0px rgba(26, 26, 26, 0.15) inset"
  },
  "shadow-inset-200": {
    value: "0px 2px 1px 0px rgba(26, 26, 26, 0.20) inset, 1px 0px 1px 0px rgba(26, 26, 26, 0.12) inset, -1px 0px 1px 0px rgba(26, 26, 26, 0.12) inset"
  },
  "shadow-button": {
    value: "0px -1px 0px 0px #b5b5b5 inset, 0px 0px 0px 1px rgba(0, 0, 0, 0.1) inset, 0px 0.5px 0px 1.5px #FFF inset"
  },
  "shadow-button-hover": {
    value: "0px 1px 0px 0px #EBEBEB inset, -1px 0px 0px 0px #EBEBEB inset, 1px 0px 0px 0px #EBEBEB inset, 0px -1px 0px 0px #CCC inset"
  },
  "shadow-button-inset": {
    value: "-1px 0px 1px 0px rgba(26, 26, 26, 0.122) inset, 1px 0px 1px 0px rgba(26, 26, 26, 0.122) inset, 0px 2px 1px 0px rgba(26, 26, 26, 0.2) inset"
  },
  "shadow-button-primary": {
    value: "0px -1px 0px 1px rgba(0, 0, 0, 0.8) inset, 0px 0px 0px 1px rgba(48, 48, 48, 1) inset, 0px 0.5px 0px 1.5px rgba(255, 255, 255, 0.25) inset;"
  },
  "shadow-button-primary-hover": {
    value: "0px 1px 0px 0px rgba(255, 255, 255, 0.24) inset, 1px 0px 0px 0px rgba(255, 255, 255, 0.20) inset, -1px 0px 0px 0px rgba(255, 255, 255, 0.20) inset, 0px -1px 0px 0px #000 inset, 0px -1px 0px 1px #1A1A1A"
  },
  "shadow-button-primary-inset": {
    value: "0px 3px 0px 0px rgb(0, 0, 0) inset"
  },
  "shadow-button-primary-critical": {
    value: "0px -1px 0px 1px rgba(142, 31, 11, 0.8) inset, 0px 0px 0px 1px rgba(181, 38, 11, 0.8) inset, 0px 0.5px 0px 1.5px rgba(255, 255, 255, 0.349) inset"
  },
  "shadow-button-primary-critical-hover": {
    value: "0px 1px 0px 0px rgba(255, 255, 255, 0.48) inset, 1px 0px 0px 0px rgba(255, 255, 255, 0.20) inset, -1px 0px 0px 0px rgba(255, 255, 255, 0.20) inset, 0px -1.5px 0px 0px rgba(0, 0, 0, 0.25) inset"
  },
  "shadow-button-primary-critical-inset": {
    value: "-1px 0px 1px 0px rgba(0, 0, 0, 0.2) inset, 1px 0px 1px 0px rgba(0, 0, 0, 0.2) inset, 0px 2px 0px 0px rgba(0, 0, 0, 0.6) inset"
  },
  "shadow-button-primary-success": {
    value: "0px -1px 0px 1px rgba(12, 81, 50, 0.8) inset, 0px 0px 0px 1px rgba(19, 111, 69, 0.8) inset, 0px 0.5px 0px 1.5px rgba(255, 255, 255, 0.251) inset"
  },
  "shadow-button-primary-success-hover": {
    value: "0px 1px 0px 0px rgba(255, 255, 255, 0.48) inset, 1px 0px 0px 0px rgba(255, 255, 255, 0.20) inset, -1px 0px 0px 0px rgba(255, 255, 255, 0.20) inset, 0px -1.5px 0px 0px rgba(0, 0, 0, 0.25) inset"
  },
  "shadow-button-primary-success-inset": {
    value: "-1px 0px 1px 0px rgba(0, 0, 0, 0.2) inset, 1px 0px 1px 0px rgba(0, 0, 0, 0.2) inset, 0px 2px 0px 0px rgba(0, 0, 0, 0.6) inset"
  },
  "shadow-border-inset": {
    value: "0px 0px 0px 1px rgba(0, 0, 0, 0.08) inset"
  }
};

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/base/space.mjs
var space = {
  "space-0": {
    value: size[0]
  },
  "space-025": {
    value: size["025"]
  },
  "space-050": {
    value: size["050"]
  },
  "space-100": {
    value: size[100]
  },
  "space-150": {
    value: size[150]
  },
  "space-200": {
    value: size[200]
  },
  "space-300": {
    value: size[300]
  },
  "space-400": {
    value: size[400]
  },
  "space-500": {
    value: size[500]
  },
  "space-600": {
    value: size[600]
  },
  "space-800": {
    value: size[800]
  },
  "space-1000": {
    value: size[1e3]
  },
  "space-1200": {
    value: size[1200]
  },
  "space-1600": {
    value: size[1600]
  },
  "space-2000": {
    value: size[2e3]
  },
  "space-2400": {
    value: size[2400]
  },
  "space-2800": {
    value: size[2800]
  },
  "space-3200": {
    value: size[3200]
  },
  "space-button-group-gap": {
    value: createVar2("space-200")
  },
  "space-card-gap": {
    value: createVar2("space-400")
  },
  "space-card-padding": {
    value: createVar2("space-400")
  },
  "space-table-cell-padding": {
    value: createVar2("space-150")
  }
};
function createVar2(spaceTokenName) {
  return "var(" + createVarName(spaceTokenName) + ")";
}

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/base/text.mjs
var text = {
  // heading-3xl
  "text-heading-3xl-font-family": {
    value: createVar("font-family-sans")
  },
  "text-heading-3xl-font-size": {
    value: createVar("font-size-900")
  },
  "text-heading-3xl-font-weight": {
    value: createVar("font-weight-bold")
  },
  "text-heading-3xl-font-letter-spacing": {
    value: createVar("font-letter-spacing-densest")
  },
  "text-heading-3xl-font-line-height": {
    value: createVar("font-line-height-1200")
  },
  // heading-2xl
  "text-heading-2xl-font-family": {
    value: createVar("font-family-sans")
  },
  "text-heading-2xl-font-size": {
    value: createVar("font-size-750")
  },
  "text-heading-2xl-font-weight": {
    value: createVar("font-weight-bold")
  },
  "text-heading-2xl-font-letter-spacing": {
    value: createVar("font-letter-spacing-denser")
  },
  "text-heading-2xl-font-line-height": {
    value: createVar("font-line-height-1000")
  },
  // heading-xl
  "text-heading-xl-font-family": {
    value: createVar("font-family-sans")
  },
  "text-heading-xl-font-size": {
    value: createVar("font-size-600")
  },
  "text-heading-xl-font-weight": {
    value: createVar("font-weight-bold")
  },
  "text-heading-xl-font-letter-spacing": {
    value: createVar("font-letter-spacing-dense")
  },
  "text-heading-xl-font-line-height": {
    value: createVar("font-line-height-800")
  },
  // heading-lg
  "text-heading-lg-font-family": {
    value: createVar("font-family-sans")
  },
  "text-heading-lg-font-size": {
    value: createVar("font-size-500")
  },
  "text-heading-lg-font-weight": {
    value: createVar("font-weight-semibold")
  },
  "text-heading-lg-font-letter-spacing": {
    value: createVar("font-letter-spacing-dense")
  },
  "text-heading-lg-font-line-height": {
    value: createVar("font-line-height-600")
  },
  // heading-md
  "text-heading-md-font-family": {
    value: createVar("font-family-sans")
  },
  "text-heading-md-font-size": {
    value: createVar("font-size-350")
  },
  "text-heading-md-font-weight": {
    value: createVar("font-weight-semibold")
  },
  "text-heading-md-font-letter-spacing": {
    value: createVar("font-letter-spacing-normal")
  },
  "text-heading-md-font-line-height": {
    value: createVar("font-line-height-500")
  },
  // heading-sm
  "text-heading-sm-font-family": {
    value: createVar("font-family-sans")
  },
  "text-heading-sm-font-size": {
    value: createVar("font-size-325")
  },
  "text-heading-sm-font-weight": {
    value: createVar("font-weight-semibold")
  },
  "text-heading-sm-font-letter-spacing": {
    value: createVar("font-letter-spacing-normal")
  },
  "text-heading-sm-font-line-height": {
    value: createVar("font-line-height-500")
  },
  // heading-xs
  "text-heading-xs-font-family": {
    value: createVar("font-family-sans")
  },
  "text-heading-xs-font-size": {
    value: createVar("font-size-300")
  },
  "text-heading-xs-font-weight": {
    value: createVar("font-weight-semibold")
  },
  "text-heading-xs-font-letter-spacing": {
    value: createVar("font-letter-spacing-normal")
  },
  "text-heading-xs-font-line-height": {
    value: createVar("font-line-height-400")
  },
  // body-lg
  "text-body-lg-font-family": {
    value: createVar("font-family-sans")
  },
  "text-body-lg-font-size": {
    value: createVar("font-size-350")
  },
  "text-body-lg-font-weight": {
    value: createVar("font-weight-regular")
  },
  "text-body-lg-font-letter-spacing": {
    value: createVar("font-letter-spacing-normal")
  },
  "text-body-lg-font-line-height": {
    value: createVar("font-line-height-500")
  },
  // body-md
  "text-body-md-font-family": {
    value: createVar("font-family-sans")
  },
  "text-body-md-font-size": {
    value: createVar("font-size-325")
  },
  "text-body-md-font-weight": {
    value: createVar("font-weight-regular")
  },
  "text-body-md-font-letter-spacing": {
    value: createVar("font-letter-spacing-normal")
  },
  "text-body-md-font-line-height": {
    value: createVar("font-line-height-500")
  },
  // body-sm
  "text-body-sm-font-family": {
    value: createVar("font-family-sans")
  },
  "text-body-sm-font-size": {
    value: createVar("font-size-300")
  },
  "text-body-sm-font-weight": {
    value: createVar("font-weight-regular")
  },
  "text-body-sm-font-letter-spacing": {
    value: createVar("font-letter-spacing-normal")
  },
  "text-body-sm-font-line-height": {
    value: createVar("font-line-height-400")
  },
  // body-xs
  "text-body-xs-font-family": {
    value: createVar("font-family-sans")
  },
  "text-body-xs-font-size": {
    value: createVar("font-size-275")
  },
  "text-body-xs-font-weight": {
    value: createVar("font-weight-regular")
  },
  "text-body-xs-font-letter-spacing": {
    value: createVar("font-letter-spacing-normal")
  },
  "text-body-xs-font-line-height": {
    value: createVar("font-line-height-300")
  }
};

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/base/width.mjs
var width = {
  "width-0": {
    value: size[0]
  },
  "width-025": {
    value: size["025"]
  },
  "width-050": {
    value: size["050"]
  },
  "width-100": {
    value: size[100]
  },
  "width-150": {
    value: size[150]
  },
  "width-200": {
    value: size[200]
  },
  "width-300": {
    value: size[300]
  },
  "width-400": {
    value: size[400]
  },
  "width-500": {
    value: size[500]
  },
  "width-600": {
    value: size[600]
  },
  "width-700": {
    value: size[700]
  },
  "width-800": {
    value: size[800]
  },
  "width-900": {
    value: size[900]
  },
  "width-1000": {
    value: size[1e3]
  },
  "width-1200": {
    value: size[1200]
  },
  "width-1600": {
    value: size[1600]
  },
  "width-2000": {
    value: size[2e3]
  },
  "width-2400": {
    value: size[2400]
  },
  "width-2800": {
    value: size[2800]
  },
  "width-3200": {
    value: size[3200]
  }
};

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/base/zIndex.mjs
var zIndex = {
  "z-index-0": {
    value: "auto"
  },
  "z-index-1": {
    value: "100"
  },
  "z-index-2": {
    value: "400"
  },
  "z-index-3": {
    value: "510"
  },
  "z-index-4": {
    value: "512"
  },
  "z-index-5": {
    value: "513"
  },
  "z-index-6": {
    value: "514"
  },
  "z-index-7": {
    value: "515"
  },
  "z-index-8": {
    value: "516"
  },
  "z-index-9": {
    value: "517"
  },
  "z-index-10": {
    value: "518"
  },
  "z-index-11": {
    value: "519"
  },
  "z-index-12": {
    value: "520"
  }
};

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/base/index.mjs
var metaThemeBase = createMetaThemeBase({
  border,
  breakpoints,
  color,
  font,
  height,
  motion,
  shadow,
  space,
  text,
  width,
  zIndex
});

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/utils.mjs
function createMetaThemePartial(metaThemePartial) {
  return Object.fromEntries(Object.entries(metaThemePartial).map(function(_ref) {
    var _ref2 = _slicedToArray(_ref, 2), tokenGroupName = _ref2[0], tokenGroup = _ref2[1];
    return [tokenGroupName, tokenGroup && tokenGroupNamesToRems.includes(tokenGroupName) ? tokenGroupToRems(tokenGroup) : tokenGroup];
  }));
}
function createMetaTheme(metaThemePartial) {
  return deepmerge(metaThemeBase, metaThemePartial);
}
function createThemeClassName(themeName) {
  return "p-theme-" + themeName;
}
function createIsTokenName(theme) {
  var tokenNames = new Set(getTokenNames(theme));
  return function(tokenName) {
    return tokenNames.has(tokenName);
  };
}
createIsTokenName(metaThemeBase);

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/constants.mjs
var themeNameLight = "light", themeNameDefault = themeNameLight, themeNames = [themeNameLight, "light-mobile", "light-high-contrast-experimental", "dark-experimental"];

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/light.mjs
var metaThemeLightPartial = createMetaThemePartial({}), metaThemeLight = createMetaTheme(metaThemeLightPartial);

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/light-high-contrast.mjs
var metaThemeLightHighContrastPartial = createMetaThemePartial({
  color: {
    "color-text": {
      value: gray[16]
    },
    "color-text-secondary": {
      value: gray[16]
    },
    "color-text-brand": {
      value: gray[16]
    },
    "color-icon-secondary": {
      value: gray[14]
    },
    "color-border": {
      value: gray[12]
    },
    "color-input-border": {
      value: gray[14]
    },
    "color-border-secondary": {
      value: gray[12]
    },
    "color-bg-surface-secondary": {
      value: gray[6]
    }
  },
  shadow: {
    "shadow-bevel-100": {
      value: "0px 1px 0px 0px rgba(26, 26, 26, 0.07), 0px 1px 0px 0px rgba(208, 208, 208, 0.40) inset, 1px 0px 0px 0px #CCC inset, -1px 0px 0px 0px #CCC inset, 0px -1px 0px 0px #999 inset"
    }
  }
}), metaThemeLightHighContrast = createMetaTheme(metaThemeLightHighContrastPartial);

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/light-mobile.mjs
var buttonShadow = "0 0 0 " + createVar("border-width-025") + " " + createVar("color-border") + " inset", metaThemeLightMobilePartial = createMetaThemePartial({
  color: {
    "color-button-gradient-bg-fill": {
      value: "none"
    }
  },
  shadow: {
    "shadow-100": {
      value: "none"
    },
    "shadow-bevel-100": {
      value: "none"
    },
    "shadow-button": {
      value: buttonShadow
    },
    "shadow-button-hover": {
      value: buttonShadow
    },
    "shadow-button-inset": {
      value: buttonShadow
    },
    "shadow-button-primary": {
      value: "none"
    },
    "shadow-button-primary-hover": {
      value: "none"
    },
    "shadow-button-primary-inset": {
      value: "none"
    },
    "shadow-button-primary-critical": {
      value: "none"
    },
    "shadow-button-primary-critical-hover": {
      value: "none"
    },
    "shadow-button-primary-critical-inset": {
      value: "none"
    },
    "shadow-button-primary-success": {
      value: "none"
    },
    "shadow-button-primary-success-hover": {
      value: "none"
    },
    "shadow-button-primary-success-inset": {
      value: "none"
    }
  },
  space: {
    "space-card-gap": {
      value: createVar("space-200")
    }
  },
  text: {
    // heading-2xl
    "text-heading-2xl-font-size": {
      value: createVar("font-size-800")
    },
    // heading-xl
    "text-heading-xl-font-size": {
      value: createVar("font-size-550")
    },
    "text-heading-xl-font-line-height": {
      value: createVar("font-line-height-700")
    },
    // heading-lg
    "text-heading-lg-font-size": {
      value: createVar("font-size-450")
    },
    // heading-md
    "text-heading-md-font-size": {
      value: createVar("font-size-400")
    },
    // heading-sm
    "text-heading-sm-font-size": {
      value: createVar("font-size-350")
    },
    // body-lg
    "text-body-lg-font-size": {
      value: createVar("font-size-450")
    },
    "text-body-lg-font-line-height": {
      value: createVar("font-line-height-700")
    },
    // body-md
    "text-body-md-font-size": {
      value: createVar("font-size-400")
    },
    "text-body-md-font-line-height": {
      value: createVar("font-line-height-600")
    },
    // body-sm
    "text-body-sm-font-size": {
      value: createVar("font-size-350")
    },
    "text-body-sm-font-line-height": {
      value: createVar("font-line-height-500")
    },
    // body-xs
    "text-body-xs-font-size": {
      value: createVar("font-size-300")
    },
    "text-body-xs-font-line-height": {
      value: createVar("font-line-height-400")
    }
  }
}), metaThemeLightMobile = createMetaTheme(metaThemeLightMobilePartial);

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/dark.mjs
var metaThemeDarkPartial = createMetaThemePartial({
  color: {
    "color-scheme": {
      value: "dark"
    },
    "color-bg": {
      value: gray[16]
    },
    "color-bg-surface": {
      value: gray[15]
    },
    "color-bg-fill": {
      value: gray[15]
    },
    "color-icon": {
      value: gray[8]
    },
    "color-icon-secondary": {
      value: gray[12]
    },
    "color-text": {
      value: gray[8]
    },
    "color-text-secondary": {
      value: gray[11]
    },
    "color-bg-surface-secondary-active": {
      value: gray[13]
    },
    "color-bg-surface-secondary-hover": {
      value: gray[14]
    },
    "color-bg-fill-transparent": {
      value: whiteAlpha[8]
    },
    "color-bg-fill-brand": {
      value: gray[1]
    },
    "color-text-brand-on-bg-fill": {
      value: gray[15]
    },
    "color-bg-surface-hover": {
      value: gray[14]
    },
    "color-bg-fill-hover": {
      value: gray[14]
    },
    "color-bg-fill-transparent-hover": {
      value: whiteAlpha[9]
    },
    "color-bg-fill-brand-hover": {
      value: gray[5]
    },
    "color-bg-surface-selected": {
      value: gray[13]
    },
    "color-bg-fill-selected": {
      value: gray[13]
    },
    "color-bg-fill-transparent-selected": {
      value: whiteAlpha[11]
    },
    "color-bg-fill-brand-selected": {
      value: gray[9]
    },
    "color-bg-surface-active": {
      value: gray[13]
    },
    "color-bg-fill-active": {
      value: gray[13]
    },
    "color-bg-fill-transparent-active": {
      value: whiteAlpha[10]
    },
    "color-bg-fill-brand-active": {
      value: gray[4]
    },
    "color-bg-surface-brand-selected": {
      value: gray[14]
    },
    "color-border-secondary": {
      value: gray[13]
    },
    "color-tooltip-tail-down-border-experimental": {
      value: "rgba(60, 60, 60, 1)"
    },
    "color-tooltip-tail-up-border-experimental": {
      value: "rgba(71, 71, 71, 1)"
    },
    "color-border-gradient-experimental": {
      value: "linear-gradient(to bottom, " + whiteAlpha[9] + ", " + whiteAlpha[4] + ")"
    },
    "color-border-gradient-hover-experimental": {
      value: "linear-gradient(to bottom, " + whiteAlpha[9] + ", " + whiteAlpha[4] + ")"
    },
    "color-border-gradient-selected-experimental": {
      value: "linear-gradient(to bottom, " + blackAlpha[10] + ", " + whiteAlpha[10] + ")"
    },
    "color-border-gradient-active-experimental": {
      value: "linear-gradient(to bottom, " + whiteAlpha[10] + ", " + whiteAlpha[4] + ")"
    }
  },
  shadow: {
    "shadow-bevel-100": {
      value: "1px 0px 0px 0px rgba(204, 204, 204, 0.08) inset, -1px 0px 0px 0px rgba(204, 204, 204, 0.08) inset, 0px -1px 0px 0px rgba(204, 204, 204, 0.08) inset, 0px 1px 0px 0px rgba(204, 204, 204, 0.16) inset"
    }
  }
}), metaThemeDark = createMetaTheme(metaThemeDarkPartial);

// node_modules/@shopify/polaris-tokens/dist/esm/src/themes/index.mjs
var metaThemePartials = {
  light: metaThemeLightPartial,
  "light-mobile": metaThemeLightMobilePartial,
  "light-high-contrast-experimental": metaThemeLightHighContrastPartial,
  "dark-experimental": metaThemeDarkPartial
}, metaThemeDefaultPartial = metaThemePartials[themeNameDefault], metaThemeDefault = createMetaTheme(metaThemeDefaultPartial);

// node_modules/@shopify/polaris-tokens/dist/esm/build/index.mjs
var themes = {
  light: {
    border: {
      "border-radius-0": "0rem",
      "border-radius-050": "0.125rem",
      "border-radius-100": "0.25rem",
      "border-radius-150": "0.375rem",
      "border-radius-200": "0.5rem",
      "border-radius-300": "0.75rem",
      "border-radius-400": "1rem",
      "border-radius-500": "1.25rem",
      "border-radius-750": "1.875rem",
      "border-radius-full": "624.9375rem",
      "border-width-0": "0rem",
      "border-width-0165": "0.04125rem",
      "border-width-025": "0.0625rem",
      "border-width-050": "0.125rem",
      "border-width-100": "0.25rem"
    },
    breakpoints: {
      "breakpoints-xs": "0rem",
      "breakpoints-sm": "30.625rem",
      "breakpoints-md": "48rem",
      "breakpoints-lg": "65rem",
      "breakpoints-xl": "90rem"
    },
    color: {
      "color-scheme": "light",
      "color-bg": "rgba(241, 241, 241, 1)",
      "color-bg-inverse": "rgba(26, 26, 26, 1)",
      "color-bg-surface": "rgba(255, 255, 255, 1)",
      "color-bg-surface-hover": "rgba(247, 247, 247, 1)",
      "color-bg-surface-active": "rgba(243, 243, 243, 1)",
      "color-bg-surface-selected": "rgba(241, 241, 241, 1)",
      "color-bg-surface-disabled": "rgba(0, 0, 0, 0.05)",
      "color-bg-surface-secondary": "rgba(247, 247, 247, 1)",
      "color-bg-surface-secondary-hover": "rgba(241, 241, 241, 1)",
      "color-bg-surface-secondary-active": "rgba(235, 235, 235, 1)",
      "color-bg-surface-secondary-selected": "rgba(235, 235, 235, 1)",
      "color-bg-surface-tertiary": "rgba(243, 243, 243, 1)",
      "color-bg-surface-tertiary-hover": "rgba(235, 235, 235, 1)",
      "color-bg-surface-tertiary-active": "rgba(227, 227, 227, 1)",
      "color-bg-surface-brand": "rgba(227, 227, 227, 1)",
      "color-bg-surface-brand-hover": "rgba(235, 235, 235, 1)",
      "color-bg-surface-brand-active": "rgba(241, 241, 241, 1)",
      "color-bg-surface-brand-selected": "rgba(241, 241, 241, 1)",
      "color-bg-surface-info": "rgba(234, 244, 255, 1)",
      "color-bg-surface-info-hover": "rgba(224, 240, 255, 1)",
      "color-bg-surface-info-active": "rgba(202, 230, 255, 1)",
      "color-bg-surface-success": "rgba(205, 254, 225, 1)",
      "color-bg-surface-success-hover": "rgba(180, 254, 210, 1)",
      "color-bg-surface-success-active": "rgba(146, 254, 194, 1)",
      "color-bg-surface-caution": "rgba(255, 248, 219, 1)",
      "color-bg-surface-caution-hover": "rgba(255, 244, 191, 1)",
      "color-bg-surface-caution-active": "rgba(255, 239, 157, 1)",
      "color-bg-surface-warning": "rgba(255, 241, 227, 1)",
      "color-bg-surface-warning-hover": "rgba(255, 235, 213, 1)",
      "color-bg-surface-warning-active": "rgba(255, 228, 198, 1)",
      "color-bg-surface-critical": "rgba(254, 233, 232, 1)",
      "color-bg-surface-critical-hover": "rgba(254, 226, 225, 1)",
      "color-bg-surface-critical-active": "rgba(254, 218, 217, 1)",
      "color-bg-surface-emphasis": "rgba(240, 242, 255, 1)",
      "color-bg-surface-emphasis-hover": "rgba(234, 237, 255, 1)",
      "color-bg-surface-emphasis-active": "rgba(226, 231, 255, 1)",
      "color-bg-surface-magic": "rgba(248, 247, 255, 1)",
      "color-bg-surface-magic-hover": "rgba(243, 241, 255, 1)",
      "color-bg-surface-magic-active": "rgba(233, 229, 255, 1)",
      "color-bg-surface-inverse": "rgba(48, 48, 48, 1)",
      "color-bg-surface-transparent": "rgba(0, 0, 0, 0)",
      "color-bg-fill": "rgba(255, 255, 255, 1)",
      "color-bg-fill-hover": "rgba(250, 250, 250, 1)",
      "color-bg-fill-active": "rgba(247, 247, 247, 1)",
      "color-bg-fill-selected": "rgba(204, 204, 204, 1)",
      "color-bg-fill-disabled": "rgba(0, 0, 0, 0.05)",
      "color-bg-fill-secondary": "rgba(241, 241, 241, 1)",
      "color-bg-fill-secondary-hover": "rgba(235, 235, 235, 1)",
      "color-bg-fill-secondary-active": "rgba(227, 227, 227, 1)",
      "color-bg-fill-tertiary": "rgba(227, 227, 227, 1)",
      "color-bg-fill-tertiary-hover": "rgba(212, 212, 212, 1)",
      "color-bg-fill-tertiary-active": "rgba(204, 204, 204, 1)",
      "color-bg-fill-brand": "rgba(48, 48, 48, 1)",
      "color-bg-fill-brand-hover": "rgba(26, 26, 26, 1)",
      "color-bg-fill-brand-active": "rgba(26, 26, 26, 1)",
      "color-bg-fill-brand-selected": "rgba(48, 48, 48, 1)",
      "color-bg-fill-brand-disabled": "rgba(0, 0, 0, 0.17)",
      "color-bg-fill-info": "rgba(145, 208, 255, 1)",
      "color-bg-fill-info-hover": "rgba(81, 192, 255, 1)",
      "color-bg-fill-info-active": "rgba(0, 148, 213, 1)",
      "color-bg-fill-info-secondary": "rgba(213, 235, 255, 1)",
      "color-bg-fill-success": "rgba(41, 132, 90, 1)",
      "color-bg-fill-success-hover": "rgba(19, 111, 69, 1)",
      "color-bg-fill-success-active": "rgba(12, 81, 50, 1)",
      "color-bg-fill-success-secondary": "rgba(180, 254, 210, 1)",
      "color-bg-fill-warning": "rgba(255, 184, 0, 1)",
      "color-bg-fill-warning-hover": "rgba(229, 165, 0, 1)",
      "color-bg-fill-warning-active": "rgba(178, 132, 0, 1)",
      "color-bg-fill-warning-secondary": "rgba(255, 214, 164, 1)",
      "color-bg-fill-caution": "rgba(255, 230, 0, 1)",
      "color-bg-fill-caution-hover": "rgba(234, 211, 0, 1)",
      "color-bg-fill-caution-active": "rgba(225, 203, 0, 1)",
      "color-bg-fill-caution-secondary": "rgba(255, 235, 120, 1)",
      "color-bg-fill-critical": "rgba(229, 28, 0, 1)",
      "color-bg-fill-critical-hover": "rgba(181, 38, 11, 1)",
      "color-bg-fill-critical-active": "rgba(142, 31, 11, 1)",
      "color-bg-fill-critical-selected": "rgba(142, 31, 11, 1)",
      "color-bg-fill-critical-secondary": "rgba(254, 211, 209, 1)",
      "color-bg-fill-emphasis": "rgba(0, 91, 211, 1)",
      "color-bg-fill-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-bg-fill-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-bg-fill-magic": "rgba(128, 81, 255, 1)",
      "color-bg-fill-magic-secondary": "rgba(233, 229, 255, 1)",
      "color-bg-fill-magic-secondary-hover": "rgba(228, 222, 255, 1)",
      "color-bg-fill-magic-secondary-active": "rgba(223, 217, 255, 1)",
      "color-bg-fill-inverse": "rgba(48, 48, 48, 1)",
      "color-bg-fill-inverse-hover": "rgba(74, 74, 74, 1)",
      "color-bg-fill-inverse-active": "rgba(97, 97, 97, 1)",
      "color-bg-fill-transparent": "rgba(0, 0, 0, 0.02)",
      "color-bg-fill-transparent-hover": "rgba(0, 0, 0, 0.05)",
      "color-bg-fill-transparent-active": "rgba(0, 0, 0, 0.08)",
      "color-bg-fill-transparent-selected": "rgba(0, 0, 0, 0.08)",
      "color-bg-fill-transparent-secondary": "rgba(0, 0, 0, 0.06)",
      "color-bg-fill-transparent-secondary-hover": "rgba(0, 0, 0, 0.08)",
      "color-bg-fill-transparent-secondary-active": "rgba(0, 0, 0, 0.11)",
      "color-text": "rgba(48, 48, 48, 1)",
      "color-text-secondary": "rgba(97, 97, 97, 1)",
      "color-text-disabled": "rgba(181, 181, 181, 1)",
      "color-text-link": "rgba(0, 91, 211, 1)",
      "color-text-link-hover": "rgba(0, 66, 153, 1)",
      "color-text-link-active": "rgba(0, 46, 106, 1)",
      "color-text-brand": "rgba(74, 74, 74, 1)",
      "color-text-brand-hover": "rgba(48, 48, 48, 1)",
      "color-text-brand-on-bg-fill": "rgba(255, 255, 255, 1)",
      "color-text-brand-on-bg-fill-hover": "rgba(227, 227, 227, 1)",
      "color-text-brand-on-bg-fill-active": "rgba(204, 204, 204, 1)",
      "color-text-brand-on-bg-fill-disabled": "rgba(255, 255, 255, 1)",
      "color-text-info": "rgba(0, 58, 90, 1)",
      "color-text-info-hover": "rgba(0, 58, 90, 1)",
      "color-text-info-active": "rgba(0, 33, 51, 1)",
      "color-text-info-secondary": "rgba(0, 124, 180, 1)",
      "color-text-info-on-bg-fill": "rgba(0, 33, 51, 1)",
      "color-text-success": "rgba(12, 81, 50, 1)",
      "color-text-success-hover": "rgba(8, 61, 37, 1)",
      "color-text-success-active": "rgba(9, 42, 27, 1)",
      "color-text-success-secondary": "rgba(41, 132, 90, 1)",
      "color-text-success-on-bg-fill": "rgba(248, 255, 251, 1)",
      "color-text-caution": "rgba(79, 71, 0, 1)",
      "color-text-caution-hover": "rgba(51, 46, 0, 1)",
      "color-text-caution-active": "rgba(31, 28, 0, 1)",
      "color-text-caution-secondary": "rgba(130, 117, 0, 1)",
      "color-text-caution-on-bg-fill": "rgba(51, 46, 0, 1)",
      "color-text-warning": "rgba(94, 66, 0, 1)",
      "color-text-warning-hover": "rgba(65, 45, 0, 1)",
      "color-text-warning-active": "rgba(37, 26, 0, 1)",
      "color-text-warning-secondary": "rgba(149, 111, 0, 1)",
      "color-text-warning-on-bg-fill": "rgba(37, 26, 0, 1)",
      "color-text-critical": "rgba(142, 31, 11, 1)",
      "color-text-critical-hover": "rgba(95, 21, 7, 1)",
      "color-text-critical-active": "rgba(47, 10, 4, 1)",
      "color-text-critical-secondary": "rgba(229, 28, 0, 1)",
      "color-text-critical-on-bg-fill": "rgba(255, 251, 251, 1)",
      "color-text-emphasis": "rgba(0, 91, 211, 1)",
      "color-text-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-text-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-text-emphasis-on-bg-fill": "rgba(252, 253, 255, 1)",
      "color-text-emphasis-on-bg-fill-hover": "rgba(226, 231, 255, 1)",
      "color-text-emphasis-on-bg-fill-active": "rgba(213, 220, 255, 1)",
      "color-text-magic": "rgba(87, 0, 209, 1)",
      "color-text-magic-secondary": "rgba(113, 38, 255, 1)",
      "color-text-magic-on-bg-fill": "rgba(253, 253, 255, 1)",
      "color-text-inverse": "rgba(227, 227, 227, 1)",
      "color-text-inverse-secondary": "rgba(181, 181, 181, 1)",
      "color-text-link-inverse": "rgba(197, 208, 255, 1)",
      "color-border": "rgba(227, 227, 227, 1)",
      "color-border-hover": "rgba(204, 204, 204, 1)",
      "color-border-disabled": "rgba(235, 235, 235, 1)",
      "color-border-secondary": "rgba(235, 235, 235, 1)",
      "color-border-tertiary": "rgba(204, 204, 204, 1)",
      "color-border-focus": "rgba(0, 91, 211, 1)",
      "color-border-brand": "rgba(227, 227, 227, 1)",
      "color-border-info": "rgba(168, 216, 255, 1)",
      "color-border-success": "rgba(146, 254, 194, 1)",
      "color-border-caution": "rgba(255, 235, 120, 1)",
      "color-border-warning": "rgba(255, 200, 121, 1)",
      "color-border-critical": "rgba(254, 195, 193, 1)",
      "color-border-critical-secondary": "rgba(142, 31, 11, 1)",
      "color-border-emphasis": "rgba(0, 91, 211, 1)",
      "color-border-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-border-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-border-magic": "rgba(228, 222, 255, 1)",
      "color-border-magic-secondary": "rgba(148, 116, 255, 1)",
      "color-border-magic-secondary-hover": "rgba(128, 81, 255, 1)",
      "color-border-inverse": "rgba(97, 97, 97, 1)",
      "color-border-inverse-hover": "rgba(204, 204, 204, 1)",
      "color-border-inverse-active": "rgba(227, 227, 227, 1)",
      "color-tooltip-tail-down-border-experimental": "rgba(212, 212, 212, 1)",
      "color-tooltip-tail-up-border-experimental": "rgba(227, 227, 227, 1)",
      "color-border-gradient-experimental": "linear-gradient(to bottom, rgba(235, 235, 235, 1), rgba(204, 204, 204, 1) 78%, rgba(181, 181, 181, 1))",
      "color-border-gradient-hover-experimental": "linear-gradient(to bottom, rgba(235, 235, 235, 1), rgba(204, 204, 204, 1) 78%, rgba(181, 181, 181, 1))",
      "color-border-gradient-selected-experimental": "linear-gradient(to bottom, rgba(235, 235, 235, 1), rgba(204, 204, 204, 1) 78%, rgba(181, 181, 181, 1))",
      "color-border-gradient-active-experimental": "linear-gradient(to bottom, rgba(235, 235, 235, 1), rgba(204, 204, 204, 1) 78%, rgba(181, 181, 181, 1))",
      "color-icon": "rgba(74, 74, 74, 1)",
      "color-icon-hover": "rgba(48, 48, 48, 1)",
      "color-icon-active": "rgba(26, 26, 26, 1)",
      "color-icon-disabled": "rgba(204, 204, 204, 1)",
      "color-icon-secondary": "rgba(138, 138, 138, 1)",
      "color-icon-secondary-hover": "rgba(97, 97, 97, 1)",
      "color-icon-secondary-active": "rgba(74, 74, 74, 1)",
      "color-icon-brand": "rgba(26, 26, 26, 1)",
      "color-icon-info": "rgba(0, 148, 213, 1)",
      "color-icon-success": "rgba(41, 132, 90, 1)",
      "color-icon-caution": "rgba(153, 138, 0, 1)",
      "color-icon-warning": "rgba(178, 132, 0, 1)",
      "color-icon-critical": "rgba(239, 77, 47, 1)",
      "color-icon-emphasis": "rgba(0, 91, 211, 1)",
      "color-icon-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-icon-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-icon-magic": "rgba(128, 81, 255, 1)",
      "color-icon-inverse": "rgba(227, 227, 227, 1)",
      "color-avatar-bg-fill": "rgba(181, 181, 181, 1)",
      "color-avatar-five-bg-fill": "rgba(253, 75, 146, 1)",
      "color-avatar-five-text-on-bg-fill": "rgba(255, 246, 248, 1)",
      "color-avatar-four-bg-fill": "rgba(81, 192, 255, 1)",
      "color-avatar-four-text-on-bg-fill": "rgba(0, 33, 51, 1)",
      "color-avatar-one-bg-fill": "rgba(197, 48, 197, 1)",
      "color-avatar-one-text-on-bg-fill": "rgba(253, 239, 253, 1)",
      "color-avatar-seven-bg-fill": "rgba(148, 116, 255, 1)",
      "color-avatar-seven-text-on-bg-fill": "rgba(248, 247, 255, 1)",
      "color-avatar-six-bg-fill": "rgba(37, 232, 43, 1)",
      "color-avatar-six-text-on-bg-fill": "rgba(3, 61, 5, 1)",
      "color-avatar-text-on-bg-fill": "rgba(255, 255, 255, 1)",
      "color-avatar-three-bg-fill": "rgba(44, 224, 212, 1)",
      "color-avatar-three-text-on-bg-fill": "rgba(3, 60, 57, 1)",
      "color-avatar-two-bg-fill": "rgba(56, 250, 163, 1)",
      "color-avatar-two-text-on-bg-fill": "rgba(12, 81, 50, 1)",
      "color-backdrop-bg": "rgba(0, 0, 0, 0.71)",
      "color-button-gradient-bg-fill": "linear-gradient(180deg, rgba(48, 48, 48, 0) 63.53%, rgba(255, 255, 255, 0.15) 100%)",
      "color-checkbox-bg-surface-disabled": "rgba(0, 0, 0, 0.08)",
      "color-checkbox-icon-disabled": "rgba(255, 255, 255, 1)",
      "color-input-bg-surface": "rgba(253, 253, 253, 1)",
      "color-input-bg-surface-hover": "rgba(250, 250, 250, 1)",
      "color-input-bg-surface-active": "rgba(247, 247, 247, 1)",
      "color-input-border": "rgba(138, 138, 138, 1)",
      "color-input-border-hover": "rgba(97, 97, 97, 1)",
      "color-input-border-active": "rgba(26, 26, 26, 1)",
      "color-nav-bg": "rgba(235, 235, 235, 1)",
      "color-nav-bg-surface": "rgba(0, 0, 0, 0.02)",
      "color-nav-bg-surface-hover": "rgba(241, 241, 241, 1)",
      "color-nav-bg-surface-active": "rgba(250, 250, 250, 1)",
      "color-nav-bg-surface-selected": "rgba(250, 250, 250, 1)",
      "color-radio-button-bg-surface-disabled": "rgba(0, 0, 0, 0.08)",
      "color-radio-button-icon-disabled": "rgba(255, 255, 255, 1)",
      "color-video-thumbnail-play-button-bg-fill-hover": "rgba(0, 0, 0, 0.81)",
      "color-video-thumbnail-play-button-bg-fill": "rgba(0, 0, 0, 0.71)",
      "color-video-thumbnail-play-button-text-on-bg-fill": "rgba(255, 255, 255, 1)",
      "color-scrollbar-thumb-bg-hover": "rgba(138, 138, 138, 1)"
    },
    font: {
      "font-family-sans": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "font-family-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      "font-size-275": "0.6875rem",
      "font-size-300": "0.75rem",
      "font-size-325": "0.8125rem",
      "font-size-350": "0.875rem",
      "font-size-400": "1rem",
      "font-size-450": "1.125rem",
      "font-size-500": "1.25rem",
      "font-size-550": "1.375rem",
      "font-size-600": "1.5rem",
      "font-size-750": "1.875rem",
      "font-size-800": "2rem",
      "font-size-900": "2.25rem",
      "font-size-1000": "2.5rem",
      "font-weight-regular": "450",
      "font-weight-medium": "550",
      "font-weight-semibold": "650",
      "font-weight-bold": "700",
      "font-letter-spacing-densest": "-0.03375rem",
      "font-letter-spacing-denser": "-0.01875rem",
      "font-letter-spacing-dense": "-0.0125rem",
      "font-letter-spacing-normal": "0rem",
      "font-line-height-300": "0.75rem",
      "font-line-height-400": "1rem",
      "font-line-height-500": "1.25rem",
      "font-line-height-600": "1.5rem",
      "font-line-height-700": "1.75rem",
      "font-line-height-800": "2rem",
      "font-line-height-1000": "2.5rem",
      "font-line-height-1200": "3rem"
    },
    height: {
      "height-0": "0rem",
      "height-025": "0.0625rem",
      "height-050": "0.125rem",
      "height-100": "0.25rem",
      "height-150": "0.375rem",
      "height-200": "0.5rem",
      "height-300": "0.75rem",
      "height-400": "1rem",
      "height-500": "1.25rem",
      "height-600": "1.5rem",
      "height-700": "1.75rem",
      "height-800": "2rem",
      "height-900": "2.25rem",
      "height-1000": "2.5rem",
      "height-1200": "3rem",
      "height-1600": "4rem",
      "height-2000": "5rem",
      "height-2400": "6rem",
      "height-2800": "7rem",
      "height-3200": "8rem"
    },
    motion: {
      "motion-duration-0": "0ms",
      "motion-duration-50": "50ms",
      "motion-duration-100": "100ms",
      "motion-duration-150": "150ms",
      "motion-duration-200": "200ms",
      "motion-duration-250": "250ms",
      "motion-duration-300": "300ms",
      "motion-duration-350": "350ms",
      "motion-duration-400": "400ms",
      "motion-duration-450": "450ms",
      "motion-duration-500": "500ms",
      "motion-duration-5000": "5000ms",
      "motion-ease": "cubic-bezier(0.25, 0.1, 0.25, 1)",
      "motion-ease-in": "cubic-bezier(0.42, 0, 1, 1)",
      "motion-ease-out": "cubic-bezier(0.19, 0.91, 0.38, 1)",
      "motion-ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1)",
      "motion-linear": "cubic-bezier(0, 0, 1, 1)",
      "motion-keyframes-bounce": "{ from, 65%, 85% { transform: scale(1) } 75% { transform: scale(0.85) } 82.5% { transform: scale(1.05) } }",
      "motion-keyframes-fade-in": "{ to { opacity: 1 } }",
      "motion-keyframes-pulse": "{ from, 75% { transform: scale(0.85); opacity: 1; } to { transform: scale(2.5); opacity: 0; } }",
      "motion-keyframes-spin": "{ to { transform: rotate(1turn) } }",
      "motion-keyframes-appear-above": "{ from { transform: translateY(var(--p-space-100)); opacity: 0; } to { transform: none; opacity: 1; } }",
      "motion-keyframes-appear-below": "{ from { transform: translateY(calc(var(--p-space-100) * -1)); opacity: 0; } to { transform: none; opacity: 1; } }"
    },
    shadow: {
      "shadow-0": "none",
      "shadow-100": "0rem 0.0625rem 0rem 0rem rgba(26, 26, 26, 0.07)",
      "shadow-200": "0rem 0.1875rem 0.0625rem -0.0625rem rgba(26, 26, 26, 0.07)",
      "shadow-300": "0rem 0.25rem 0.375rem -0.125rem rgba(26, 26, 26, 0.20)",
      "shadow-400": "0rem 0.5rem 1rem -0.25rem rgba(26, 26, 26, 0.22)",
      "shadow-500": "0rem 0.75rem 1.25rem -0.5rem rgba(26, 26, 26, 0.24)",
      "shadow-600": "0rem 1.25rem 1.25rem -0.5rem rgba(26, 26, 26, 0.28)",
      "shadow-bevel-100": "0.0625rem 0rem 0rem 0rem rgba(0, 0, 0, 0.13) inset, -0.0625rem 0rem 0rem 0rem rgba(0, 0, 0, 0.13) inset, 0rem -0.0625rem 0rem 0rem rgba(0, 0, 0, 0.17) inset, 0rem 0.0625rem 0rem 0rem rgba(204, 204, 204, 0.5) inset",
      "shadow-inset-100": "0rem 0.0625rem 0.125rem 0rem rgba(26, 26, 26, 0.15) inset, 0rem 0.0625rem 0.0625rem 0rem rgba(26, 26, 26, 0.15) inset",
      "shadow-inset-200": "0rem 0.125rem 0.0625rem 0rem rgba(26, 26, 26, 0.20) inset, 0.0625rem 0rem 0.0625rem 0rem rgba(26, 26, 26, 0.12) inset, -0.0625rem 0rem 0.0625rem 0rem rgba(26, 26, 26, 0.12) inset",
      "shadow-button": "0rem -0.0625rem 0rem 0rem #b5b5b5 inset, 0rem 0rem 0rem 0.0625rem rgba(0, 0, 0, 0.1) inset, 0rem 0.03125rem 0rem 0.09375rem #FFF inset",
      "shadow-button-hover": "0rem 0.0625rem 0rem 0rem #EBEBEB inset, -0.0625rem 0rem 0rem 0rem #EBEBEB inset, 0.0625rem 0rem 0rem 0rem #EBEBEB inset, 0rem -0.0625rem 0rem 0rem #CCC inset",
      "shadow-button-inset": "-0.0625rem 0rem 0.0625rem 0rem rgba(26, 26, 26, 0.122) inset, 0.0625rem 0rem 0.0625rem 0rem rgba(26, 26, 26, 0.122) inset, 0rem 0.125rem 0.0625rem 0rem rgba(26, 26, 26, 0.2) inset",
      "shadow-button-primary": "0rem -0.0625rem 0rem 0.0625rem rgba(0, 0, 0, 0.8) inset, 0rem 0rem 0rem 0.0625rem rgba(48, 48, 48, 1) inset, 0rem 0.03125rem 0rem 0.09375rem rgba(255, 255, 255, 0.25) inset;",
      "shadow-button-primary-hover": "0rem 0.0625rem 0rem 0rem rgba(255, 255, 255, 0.24) inset, 0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, -0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, 0rem -0.0625rem 0rem 0rem #000 inset, 0rem -0.0625rem 0rem 0.0625rem #1A1A1A",
      "shadow-button-primary-inset": "0rem 0.1875rem 0rem 0rem rgb(0, 0, 0) inset",
      "shadow-button-primary-critical": "0rem -0.0625rem 0rem 0.0625rem rgba(142, 31, 11, 0.8) inset, 0rem 0rem 0rem 0.0625rem rgba(181, 38, 11, 0.8) inset, 0rem 0.03125rem 0rem 0.09375rem rgba(255, 255, 255, 0.349) inset",
      "shadow-button-primary-critical-hover": "0rem 0.0625rem 0rem 0rem rgba(255, 255, 255, 0.48) inset, 0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, -0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, 0rem -0.09375rem 0rem 0rem rgba(0, 0, 0, 0.25) inset",
      "shadow-button-primary-critical-inset": "-0.0625rem 0rem 0.0625rem 0rem rgba(0, 0, 0, 0.2) inset, 0.0625rem 0rem 0.0625rem 0rem rgba(0, 0, 0, 0.2) inset, 0rem 0.125rem 0rem 0rem rgba(0, 0, 0, 0.6) inset",
      "shadow-button-primary-success": "0rem -0.0625rem 0rem 0.0625rem rgba(12, 81, 50, 0.8) inset, 0rem 0rem 0rem 0.0625rem rgba(19, 111, 69, 0.8) inset, 0rem 0.03125rem 0rem 0.09375rem rgba(255, 255, 255, 0.251) inset",
      "shadow-button-primary-success-hover": "0rem 0.0625rem 0rem 0rem rgba(255, 255, 255, 0.48) inset, 0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, -0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, 0rem -0.09375rem 0rem 0rem rgba(0, 0, 0, 0.25) inset",
      "shadow-button-primary-success-inset": "-0.0625rem 0rem 0.0625rem 0rem rgba(0, 0, 0, 0.2) inset, 0.0625rem 0rem 0.0625rem 0rem rgba(0, 0, 0, 0.2) inset, 0rem 0.125rem 0rem 0rem rgba(0, 0, 0, 0.6) inset",
      "shadow-border-inset": "0rem 0rem 0rem 0.0625rem rgba(0, 0, 0, 0.08) inset"
    },
    space: {
      "space-0": "0rem",
      "space-025": "0.0625rem",
      "space-050": "0.125rem",
      "space-100": "0.25rem",
      "space-150": "0.375rem",
      "space-200": "0.5rem",
      "space-300": "0.75rem",
      "space-400": "1rem",
      "space-500": "1.25rem",
      "space-600": "1.5rem",
      "space-800": "2rem",
      "space-1000": "2.5rem",
      "space-1200": "3rem",
      "space-1600": "4rem",
      "space-2000": "5rem",
      "space-2400": "6rem",
      "space-2800": "7rem",
      "space-3200": "8rem",
      "space-button-group-gap": "0.5rem",
      "space-card-gap": "1rem",
      "space-card-padding": "1rem",
      "space-table-cell-padding": "0.375rem"
    },
    text: {
      "text-heading-3xl-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-3xl-font-size": "2.25rem",
      "text-heading-3xl-font-weight": "700",
      "text-heading-3xl-font-letter-spacing": "-0.03375rem",
      "text-heading-3xl-font-line-height": "3rem",
      "text-heading-2xl-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-2xl-font-size": "1.875rem",
      "text-heading-2xl-font-weight": "700",
      "text-heading-2xl-font-letter-spacing": "-0.01875rem",
      "text-heading-2xl-font-line-height": "2.5rem",
      "text-heading-xl-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-xl-font-size": "1.5rem",
      "text-heading-xl-font-weight": "700",
      "text-heading-xl-font-letter-spacing": "-0.0125rem",
      "text-heading-xl-font-line-height": "2rem",
      "text-heading-lg-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-lg-font-size": "1.25rem",
      "text-heading-lg-font-weight": "650",
      "text-heading-lg-font-letter-spacing": "-0.0125rem",
      "text-heading-lg-font-line-height": "1.5rem",
      "text-heading-md-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-md-font-size": "0.875rem",
      "text-heading-md-font-weight": "650",
      "text-heading-md-font-letter-spacing": "0rem",
      "text-heading-md-font-line-height": "1.25rem",
      "text-heading-sm-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-sm-font-size": "0.8125rem",
      "text-heading-sm-font-weight": "650",
      "text-heading-sm-font-letter-spacing": "0rem",
      "text-heading-sm-font-line-height": "1.25rem",
      "text-heading-xs-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-xs-font-size": "0.75rem",
      "text-heading-xs-font-weight": "650",
      "text-heading-xs-font-letter-spacing": "0rem",
      "text-heading-xs-font-line-height": "1rem",
      "text-body-lg-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-lg-font-size": "0.875rem",
      "text-body-lg-font-weight": "450",
      "text-body-lg-font-letter-spacing": "0rem",
      "text-body-lg-font-line-height": "1.25rem",
      "text-body-md-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-md-font-size": "0.8125rem",
      "text-body-md-font-weight": "450",
      "text-body-md-font-letter-spacing": "0rem",
      "text-body-md-font-line-height": "1.25rem",
      "text-body-sm-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-sm-font-size": "0.75rem",
      "text-body-sm-font-weight": "450",
      "text-body-sm-font-letter-spacing": "0rem",
      "text-body-sm-font-line-height": "1rem",
      "text-body-xs-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-xs-font-size": "0.6875rem",
      "text-body-xs-font-weight": "450",
      "text-body-xs-font-letter-spacing": "0rem",
      "text-body-xs-font-line-height": "0.75rem"
    },
    width: {
      "width-0": "0rem",
      "width-025": "0.0625rem",
      "width-050": "0.125rem",
      "width-100": "0.25rem",
      "width-150": "0.375rem",
      "width-200": "0.5rem",
      "width-300": "0.75rem",
      "width-400": "1rem",
      "width-500": "1.25rem",
      "width-600": "1.5rem",
      "width-700": "1.75rem",
      "width-800": "2rem",
      "width-900": "2.25rem",
      "width-1000": "2.5rem",
      "width-1200": "3rem",
      "width-1600": "4rem",
      "width-2000": "5rem",
      "width-2400": "6rem",
      "width-2800": "7rem",
      "width-3200": "8rem"
    },
    zIndex: {
      "z-index-0": "auto",
      "z-index-1": "100",
      "z-index-2": "400",
      "z-index-3": "510",
      "z-index-4": "512",
      "z-index-5": "513",
      "z-index-6": "514",
      "z-index-7": "515",
      "z-index-8": "516",
      "z-index-9": "517",
      "z-index-10": "518",
      "z-index-11": "519",
      "z-index-12": "520"
    }
  },
  "light-mobile": {
    border: {
      "border-radius-0": "0rem",
      "border-radius-050": "0.125rem",
      "border-radius-100": "0.25rem",
      "border-radius-150": "0.375rem",
      "border-radius-200": "0.5rem",
      "border-radius-300": "0.75rem",
      "border-radius-400": "1rem",
      "border-radius-500": "1.25rem",
      "border-radius-750": "1.875rem",
      "border-radius-full": "624.9375rem",
      "border-width-0": "0rem",
      "border-width-0165": "0.04125rem",
      "border-width-025": "0.0625rem",
      "border-width-050": "0.125rem",
      "border-width-100": "0.25rem"
    },
    breakpoints: {
      "breakpoints-xs": "0rem",
      "breakpoints-sm": "30.625rem",
      "breakpoints-md": "48rem",
      "breakpoints-lg": "65rem",
      "breakpoints-xl": "90rem"
    },
    color: {
      "color-scheme": "light",
      "color-bg": "rgba(241, 241, 241, 1)",
      "color-bg-inverse": "rgba(26, 26, 26, 1)",
      "color-bg-surface": "rgba(255, 255, 255, 1)",
      "color-bg-surface-hover": "rgba(247, 247, 247, 1)",
      "color-bg-surface-active": "rgba(243, 243, 243, 1)",
      "color-bg-surface-selected": "rgba(241, 241, 241, 1)",
      "color-bg-surface-disabled": "rgba(0, 0, 0, 0.05)",
      "color-bg-surface-secondary": "rgba(247, 247, 247, 1)",
      "color-bg-surface-secondary-hover": "rgba(241, 241, 241, 1)",
      "color-bg-surface-secondary-active": "rgba(235, 235, 235, 1)",
      "color-bg-surface-secondary-selected": "rgba(235, 235, 235, 1)",
      "color-bg-surface-tertiary": "rgba(243, 243, 243, 1)",
      "color-bg-surface-tertiary-hover": "rgba(235, 235, 235, 1)",
      "color-bg-surface-tertiary-active": "rgba(227, 227, 227, 1)",
      "color-bg-surface-brand": "rgba(227, 227, 227, 1)",
      "color-bg-surface-brand-hover": "rgba(235, 235, 235, 1)",
      "color-bg-surface-brand-active": "rgba(241, 241, 241, 1)",
      "color-bg-surface-brand-selected": "rgba(241, 241, 241, 1)",
      "color-bg-surface-info": "rgba(234, 244, 255, 1)",
      "color-bg-surface-info-hover": "rgba(224, 240, 255, 1)",
      "color-bg-surface-info-active": "rgba(202, 230, 255, 1)",
      "color-bg-surface-success": "rgba(205, 254, 225, 1)",
      "color-bg-surface-success-hover": "rgba(180, 254, 210, 1)",
      "color-bg-surface-success-active": "rgba(146, 254, 194, 1)",
      "color-bg-surface-caution": "rgba(255, 248, 219, 1)",
      "color-bg-surface-caution-hover": "rgba(255, 244, 191, 1)",
      "color-bg-surface-caution-active": "rgba(255, 239, 157, 1)",
      "color-bg-surface-warning": "rgba(255, 241, 227, 1)",
      "color-bg-surface-warning-hover": "rgba(255, 235, 213, 1)",
      "color-bg-surface-warning-active": "rgba(255, 228, 198, 1)",
      "color-bg-surface-critical": "rgba(254, 233, 232, 1)",
      "color-bg-surface-critical-hover": "rgba(254, 226, 225, 1)",
      "color-bg-surface-critical-active": "rgba(254, 218, 217, 1)",
      "color-bg-surface-emphasis": "rgba(240, 242, 255, 1)",
      "color-bg-surface-emphasis-hover": "rgba(234, 237, 255, 1)",
      "color-bg-surface-emphasis-active": "rgba(226, 231, 255, 1)",
      "color-bg-surface-magic": "rgba(248, 247, 255, 1)",
      "color-bg-surface-magic-hover": "rgba(243, 241, 255, 1)",
      "color-bg-surface-magic-active": "rgba(233, 229, 255, 1)",
      "color-bg-surface-inverse": "rgba(48, 48, 48, 1)",
      "color-bg-surface-transparent": "rgba(0, 0, 0, 0)",
      "color-bg-fill": "rgba(255, 255, 255, 1)",
      "color-bg-fill-hover": "rgba(250, 250, 250, 1)",
      "color-bg-fill-active": "rgba(247, 247, 247, 1)",
      "color-bg-fill-selected": "rgba(204, 204, 204, 1)",
      "color-bg-fill-disabled": "rgba(0, 0, 0, 0.05)",
      "color-bg-fill-secondary": "rgba(241, 241, 241, 1)",
      "color-bg-fill-secondary-hover": "rgba(235, 235, 235, 1)",
      "color-bg-fill-secondary-active": "rgba(227, 227, 227, 1)",
      "color-bg-fill-tertiary": "rgba(227, 227, 227, 1)",
      "color-bg-fill-tertiary-hover": "rgba(212, 212, 212, 1)",
      "color-bg-fill-tertiary-active": "rgba(204, 204, 204, 1)",
      "color-bg-fill-brand": "rgba(48, 48, 48, 1)",
      "color-bg-fill-brand-hover": "rgba(26, 26, 26, 1)",
      "color-bg-fill-brand-active": "rgba(26, 26, 26, 1)",
      "color-bg-fill-brand-selected": "rgba(48, 48, 48, 1)",
      "color-bg-fill-brand-disabled": "rgba(0, 0, 0, 0.17)",
      "color-bg-fill-info": "rgba(145, 208, 255, 1)",
      "color-bg-fill-info-hover": "rgba(81, 192, 255, 1)",
      "color-bg-fill-info-active": "rgba(0, 148, 213, 1)",
      "color-bg-fill-info-secondary": "rgba(213, 235, 255, 1)",
      "color-bg-fill-success": "rgba(41, 132, 90, 1)",
      "color-bg-fill-success-hover": "rgba(19, 111, 69, 1)",
      "color-bg-fill-success-active": "rgba(12, 81, 50, 1)",
      "color-bg-fill-success-secondary": "rgba(180, 254, 210, 1)",
      "color-bg-fill-warning": "rgba(255, 184, 0, 1)",
      "color-bg-fill-warning-hover": "rgba(229, 165, 0, 1)",
      "color-bg-fill-warning-active": "rgba(178, 132, 0, 1)",
      "color-bg-fill-warning-secondary": "rgba(255, 214, 164, 1)",
      "color-bg-fill-caution": "rgba(255, 230, 0, 1)",
      "color-bg-fill-caution-hover": "rgba(234, 211, 0, 1)",
      "color-bg-fill-caution-active": "rgba(225, 203, 0, 1)",
      "color-bg-fill-caution-secondary": "rgba(255, 235, 120, 1)",
      "color-bg-fill-critical": "rgba(229, 28, 0, 1)",
      "color-bg-fill-critical-hover": "rgba(181, 38, 11, 1)",
      "color-bg-fill-critical-active": "rgba(142, 31, 11, 1)",
      "color-bg-fill-critical-selected": "rgba(142, 31, 11, 1)",
      "color-bg-fill-critical-secondary": "rgba(254, 211, 209, 1)",
      "color-bg-fill-emphasis": "rgba(0, 91, 211, 1)",
      "color-bg-fill-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-bg-fill-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-bg-fill-magic": "rgba(128, 81, 255, 1)",
      "color-bg-fill-magic-secondary": "rgba(233, 229, 255, 1)",
      "color-bg-fill-magic-secondary-hover": "rgba(228, 222, 255, 1)",
      "color-bg-fill-magic-secondary-active": "rgba(223, 217, 255, 1)",
      "color-bg-fill-inverse": "rgba(48, 48, 48, 1)",
      "color-bg-fill-inverse-hover": "rgba(74, 74, 74, 1)",
      "color-bg-fill-inverse-active": "rgba(97, 97, 97, 1)",
      "color-bg-fill-transparent": "rgba(0, 0, 0, 0.02)",
      "color-bg-fill-transparent-hover": "rgba(0, 0, 0, 0.05)",
      "color-bg-fill-transparent-active": "rgba(0, 0, 0, 0.08)",
      "color-bg-fill-transparent-selected": "rgba(0, 0, 0, 0.08)",
      "color-bg-fill-transparent-secondary": "rgba(0, 0, 0, 0.06)",
      "color-bg-fill-transparent-secondary-hover": "rgba(0, 0, 0, 0.08)",
      "color-bg-fill-transparent-secondary-active": "rgba(0, 0, 0, 0.11)",
      "color-text": "rgba(48, 48, 48, 1)",
      "color-text-secondary": "rgba(97, 97, 97, 1)",
      "color-text-disabled": "rgba(181, 181, 181, 1)",
      "color-text-link": "rgba(0, 91, 211, 1)",
      "color-text-link-hover": "rgba(0, 66, 153, 1)",
      "color-text-link-active": "rgba(0, 46, 106, 1)",
      "color-text-brand": "rgba(74, 74, 74, 1)",
      "color-text-brand-hover": "rgba(48, 48, 48, 1)",
      "color-text-brand-on-bg-fill": "rgba(255, 255, 255, 1)",
      "color-text-brand-on-bg-fill-hover": "rgba(227, 227, 227, 1)",
      "color-text-brand-on-bg-fill-active": "rgba(204, 204, 204, 1)",
      "color-text-brand-on-bg-fill-disabled": "rgba(255, 255, 255, 1)",
      "color-text-info": "rgba(0, 58, 90, 1)",
      "color-text-info-hover": "rgba(0, 58, 90, 1)",
      "color-text-info-active": "rgba(0, 33, 51, 1)",
      "color-text-info-secondary": "rgba(0, 124, 180, 1)",
      "color-text-info-on-bg-fill": "rgba(0, 33, 51, 1)",
      "color-text-success": "rgba(12, 81, 50, 1)",
      "color-text-success-hover": "rgba(8, 61, 37, 1)",
      "color-text-success-active": "rgba(9, 42, 27, 1)",
      "color-text-success-secondary": "rgba(41, 132, 90, 1)",
      "color-text-success-on-bg-fill": "rgba(248, 255, 251, 1)",
      "color-text-caution": "rgba(79, 71, 0, 1)",
      "color-text-caution-hover": "rgba(51, 46, 0, 1)",
      "color-text-caution-active": "rgba(31, 28, 0, 1)",
      "color-text-caution-secondary": "rgba(130, 117, 0, 1)",
      "color-text-caution-on-bg-fill": "rgba(51, 46, 0, 1)",
      "color-text-warning": "rgba(94, 66, 0, 1)",
      "color-text-warning-hover": "rgba(65, 45, 0, 1)",
      "color-text-warning-active": "rgba(37, 26, 0, 1)",
      "color-text-warning-secondary": "rgba(149, 111, 0, 1)",
      "color-text-warning-on-bg-fill": "rgba(37, 26, 0, 1)",
      "color-text-critical": "rgba(142, 31, 11, 1)",
      "color-text-critical-hover": "rgba(95, 21, 7, 1)",
      "color-text-critical-active": "rgba(47, 10, 4, 1)",
      "color-text-critical-secondary": "rgba(229, 28, 0, 1)",
      "color-text-critical-on-bg-fill": "rgba(255, 251, 251, 1)",
      "color-text-emphasis": "rgba(0, 91, 211, 1)",
      "color-text-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-text-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-text-emphasis-on-bg-fill": "rgba(252, 253, 255, 1)",
      "color-text-emphasis-on-bg-fill-hover": "rgba(226, 231, 255, 1)",
      "color-text-emphasis-on-bg-fill-active": "rgba(213, 220, 255, 1)",
      "color-text-magic": "rgba(87, 0, 209, 1)",
      "color-text-magic-secondary": "rgba(113, 38, 255, 1)",
      "color-text-magic-on-bg-fill": "rgba(253, 253, 255, 1)",
      "color-text-inverse": "rgba(227, 227, 227, 1)",
      "color-text-inverse-secondary": "rgba(181, 181, 181, 1)",
      "color-text-link-inverse": "rgba(197, 208, 255, 1)",
      "color-border": "rgba(227, 227, 227, 1)",
      "color-border-hover": "rgba(204, 204, 204, 1)",
      "color-border-disabled": "rgba(235, 235, 235, 1)",
      "color-border-secondary": "rgba(235, 235, 235, 1)",
      "color-border-tertiary": "rgba(204, 204, 204, 1)",
      "color-border-focus": "rgba(0, 91, 211, 1)",
      "color-border-brand": "rgba(227, 227, 227, 1)",
      "color-border-info": "rgba(168, 216, 255, 1)",
      "color-border-success": "rgba(146, 254, 194, 1)",
      "color-border-caution": "rgba(255, 235, 120, 1)",
      "color-border-warning": "rgba(255, 200, 121, 1)",
      "color-border-critical": "rgba(254, 195, 193, 1)",
      "color-border-critical-secondary": "rgba(142, 31, 11, 1)",
      "color-border-emphasis": "rgba(0, 91, 211, 1)",
      "color-border-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-border-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-border-magic": "rgba(228, 222, 255, 1)",
      "color-border-magic-secondary": "rgba(148, 116, 255, 1)",
      "color-border-magic-secondary-hover": "rgba(128, 81, 255, 1)",
      "color-border-inverse": "rgba(97, 97, 97, 1)",
      "color-border-inverse-hover": "rgba(204, 204, 204, 1)",
      "color-border-inverse-active": "rgba(227, 227, 227, 1)",
      "color-tooltip-tail-down-border-experimental": "rgba(212, 212, 212, 1)",
      "color-tooltip-tail-up-border-experimental": "rgba(227, 227, 227, 1)",
      "color-border-gradient-experimental": "linear-gradient(to bottom, rgba(235, 235, 235, 1), rgba(204, 204, 204, 1) 78%, rgba(181, 181, 181, 1))",
      "color-border-gradient-hover-experimental": "linear-gradient(to bottom, rgba(235, 235, 235, 1), rgba(204, 204, 204, 1) 78%, rgba(181, 181, 181, 1))",
      "color-border-gradient-selected-experimental": "linear-gradient(to bottom, rgba(235, 235, 235, 1), rgba(204, 204, 204, 1) 78%, rgba(181, 181, 181, 1))",
      "color-border-gradient-active-experimental": "linear-gradient(to bottom, rgba(235, 235, 235, 1), rgba(204, 204, 204, 1) 78%, rgba(181, 181, 181, 1))",
      "color-icon": "rgba(74, 74, 74, 1)",
      "color-icon-hover": "rgba(48, 48, 48, 1)",
      "color-icon-active": "rgba(26, 26, 26, 1)",
      "color-icon-disabled": "rgba(204, 204, 204, 1)",
      "color-icon-secondary": "rgba(138, 138, 138, 1)",
      "color-icon-secondary-hover": "rgba(97, 97, 97, 1)",
      "color-icon-secondary-active": "rgba(74, 74, 74, 1)",
      "color-icon-brand": "rgba(26, 26, 26, 1)",
      "color-icon-info": "rgba(0, 148, 213, 1)",
      "color-icon-success": "rgba(41, 132, 90, 1)",
      "color-icon-caution": "rgba(153, 138, 0, 1)",
      "color-icon-warning": "rgba(178, 132, 0, 1)",
      "color-icon-critical": "rgba(239, 77, 47, 1)",
      "color-icon-emphasis": "rgba(0, 91, 211, 1)",
      "color-icon-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-icon-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-icon-magic": "rgba(128, 81, 255, 1)",
      "color-icon-inverse": "rgba(227, 227, 227, 1)",
      "color-avatar-bg-fill": "rgba(181, 181, 181, 1)",
      "color-avatar-five-bg-fill": "rgba(253, 75, 146, 1)",
      "color-avatar-five-text-on-bg-fill": "rgba(255, 246, 248, 1)",
      "color-avatar-four-bg-fill": "rgba(81, 192, 255, 1)",
      "color-avatar-four-text-on-bg-fill": "rgba(0, 33, 51, 1)",
      "color-avatar-one-bg-fill": "rgba(197, 48, 197, 1)",
      "color-avatar-one-text-on-bg-fill": "rgba(253, 239, 253, 1)",
      "color-avatar-seven-bg-fill": "rgba(148, 116, 255, 1)",
      "color-avatar-seven-text-on-bg-fill": "rgba(248, 247, 255, 1)",
      "color-avatar-six-bg-fill": "rgba(37, 232, 43, 1)",
      "color-avatar-six-text-on-bg-fill": "rgba(3, 61, 5, 1)",
      "color-avatar-text-on-bg-fill": "rgba(255, 255, 255, 1)",
      "color-avatar-three-bg-fill": "rgba(44, 224, 212, 1)",
      "color-avatar-three-text-on-bg-fill": "rgba(3, 60, 57, 1)",
      "color-avatar-two-bg-fill": "rgba(56, 250, 163, 1)",
      "color-avatar-two-text-on-bg-fill": "rgba(12, 81, 50, 1)",
      "color-backdrop-bg": "rgba(0, 0, 0, 0.71)",
      "color-button-gradient-bg-fill": "none",
      "color-checkbox-bg-surface-disabled": "rgba(0, 0, 0, 0.08)",
      "color-checkbox-icon-disabled": "rgba(255, 255, 255, 1)",
      "color-input-bg-surface": "rgba(253, 253, 253, 1)",
      "color-input-bg-surface-hover": "rgba(250, 250, 250, 1)",
      "color-input-bg-surface-active": "rgba(247, 247, 247, 1)",
      "color-input-border": "rgba(138, 138, 138, 1)",
      "color-input-border-hover": "rgba(97, 97, 97, 1)",
      "color-input-border-active": "rgba(26, 26, 26, 1)",
      "color-nav-bg": "rgba(235, 235, 235, 1)",
      "color-nav-bg-surface": "rgba(0, 0, 0, 0.02)",
      "color-nav-bg-surface-hover": "rgba(241, 241, 241, 1)",
      "color-nav-bg-surface-active": "rgba(250, 250, 250, 1)",
      "color-nav-bg-surface-selected": "rgba(250, 250, 250, 1)",
      "color-radio-button-bg-surface-disabled": "rgba(0, 0, 0, 0.08)",
      "color-radio-button-icon-disabled": "rgba(255, 255, 255, 1)",
      "color-video-thumbnail-play-button-bg-fill-hover": "rgba(0, 0, 0, 0.81)",
      "color-video-thumbnail-play-button-bg-fill": "rgba(0, 0, 0, 0.71)",
      "color-video-thumbnail-play-button-text-on-bg-fill": "rgba(255, 255, 255, 1)",
      "color-scrollbar-thumb-bg-hover": "rgba(138, 138, 138, 1)"
    },
    font: {
      "font-family-sans": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "font-family-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      "font-size-275": "0.6875rem",
      "font-size-300": "0.75rem",
      "font-size-325": "0.8125rem",
      "font-size-350": "0.875rem",
      "font-size-400": "1rem",
      "font-size-450": "1.125rem",
      "font-size-500": "1.25rem",
      "font-size-550": "1.375rem",
      "font-size-600": "1.5rem",
      "font-size-750": "1.875rem",
      "font-size-800": "2rem",
      "font-size-900": "2.25rem",
      "font-size-1000": "2.5rem",
      "font-weight-regular": "450",
      "font-weight-medium": "550",
      "font-weight-semibold": "650",
      "font-weight-bold": "700",
      "font-letter-spacing-densest": "-0.03375rem",
      "font-letter-spacing-denser": "-0.01875rem",
      "font-letter-spacing-dense": "-0.0125rem",
      "font-letter-spacing-normal": "0rem",
      "font-line-height-300": "0.75rem",
      "font-line-height-400": "1rem",
      "font-line-height-500": "1.25rem",
      "font-line-height-600": "1.5rem",
      "font-line-height-700": "1.75rem",
      "font-line-height-800": "2rem",
      "font-line-height-1000": "2.5rem",
      "font-line-height-1200": "3rem"
    },
    height: {
      "height-0": "0rem",
      "height-025": "0.0625rem",
      "height-050": "0.125rem",
      "height-100": "0.25rem",
      "height-150": "0.375rem",
      "height-200": "0.5rem",
      "height-300": "0.75rem",
      "height-400": "1rem",
      "height-500": "1.25rem",
      "height-600": "1.5rem",
      "height-700": "1.75rem",
      "height-800": "2rem",
      "height-900": "2.25rem",
      "height-1000": "2.5rem",
      "height-1200": "3rem",
      "height-1600": "4rem",
      "height-2000": "5rem",
      "height-2400": "6rem",
      "height-2800": "7rem",
      "height-3200": "8rem"
    },
    motion: {
      "motion-duration-0": "0ms",
      "motion-duration-50": "50ms",
      "motion-duration-100": "100ms",
      "motion-duration-150": "150ms",
      "motion-duration-200": "200ms",
      "motion-duration-250": "250ms",
      "motion-duration-300": "300ms",
      "motion-duration-350": "350ms",
      "motion-duration-400": "400ms",
      "motion-duration-450": "450ms",
      "motion-duration-500": "500ms",
      "motion-duration-5000": "5000ms",
      "motion-ease": "cubic-bezier(0.25, 0.1, 0.25, 1)",
      "motion-ease-in": "cubic-bezier(0.42, 0, 1, 1)",
      "motion-ease-out": "cubic-bezier(0.19, 0.91, 0.38, 1)",
      "motion-ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1)",
      "motion-linear": "cubic-bezier(0, 0, 1, 1)",
      "motion-keyframes-bounce": "{ from, 65%, 85% { transform: scale(1) } 75% { transform: scale(0.85) } 82.5% { transform: scale(1.05) } }",
      "motion-keyframes-fade-in": "{ to { opacity: 1 } }",
      "motion-keyframes-pulse": "{ from, 75% { transform: scale(0.85); opacity: 1; } to { transform: scale(2.5); opacity: 0; } }",
      "motion-keyframes-spin": "{ to { transform: rotate(1turn) } }",
      "motion-keyframes-appear-above": "{ from { transform: translateY(var(--p-space-100)); opacity: 0; } to { transform: none; opacity: 1; } }",
      "motion-keyframes-appear-below": "{ from { transform: translateY(calc(var(--p-space-100) * -1)); opacity: 0; } to { transform: none; opacity: 1; } }"
    },
    shadow: {
      "shadow-0": "none",
      "shadow-100": "none",
      "shadow-200": "0rem 0.1875rem 0.0625rem -0.0625rem rgba(26, 26, 26, 0.07)",
      "shadow-300": "0rem 0.25rem 0.375rem -0.125rem rgba(26, 26, 26, 0.20)",
      "shadow-400": "0rem 0.5rem 1rem -0.25rem rgba(26, 26, 26, 0.22)",
      "shadow-500": "0rem 0.75rem 1.25rem -0.5rem rgba(26, 26, 26, 0.24)",
      "shadow-600": "0rem 1.25rem 1.25rem -0.5rem rgba(26, 26, 26, 0.28)",
      "shadow-bevel-100": "none",
      "shadow-inset-100": "0rem 0.0625rem 0.125rem 0rem rgba(26, 26, 26, 0.15) inset, 0rem 0.0625rem 0.0625rem 0rem rgba(26, 26, 26, 0.15) inset",
      "shadow-inset-200": "0rem 0.125rem 0.0625rem 0rem rgba(26, 26, 26, 0.20) inset, 0.0625rem 0rem 0.0625rem 0rem rgba(26, 26, 26, 0.12) inset, -0.0625rem 0rem 0.0625rem 0rem rgba(26, 26, 26, 0.12) inset",
      "shadow-button": "0 0 0 var(--p-border-width-025) var(--p-color-border) inset",
      "shadow-button-hover": "0 0 0 var(--p-border-width-025) var(--p-color-border) inset",
      "shadow-button-inset": "0 0 0 var(--p-border-width-025) var(--p-color-border) inset",
      "shadow-button-primary": "none",
      "shadow-button-primary-hover": "none",
      "shadow-button-primary-inset": "none",
      "shadow-button-primary-critical": "none",
      "shadow-button-primary-critical-hover": "none",
      "shadow-button-primary-critical-inset": "none",
      "shadow-button-primary-success": "none",
      "shadow-button-primary-success-hover": "none",
      "shadow-button-primary-success-inset": "none",
      "shadow-border-inset": "0rem 0rem 0rem 0.0625rem rgba(0, 0, 0, 0.08) inset"
    },
    space: {
      "space-0": "0rem",
      "space-025": "0.0625rem",
      "space-050": "0.125rem",
      "space-100": "0.25rem",
      "space-150": "0.375rem",
      "space-200": "0.5rem",
      "space-300": "0.75rem",
      "space-400": "1rem",
      "space-500": "1.25rem",
      "space-600": "1.5rem",
      "space-800": "2rem",
      "space-1000": "2.5rem",
      "space-1200": "3rem",
      "space-1600": "4rem",
      "space-2000": "5rem",
      "space-2400": "6rem",
      "space-2800": "7rem",
      "space-3200": "8rem",
      "space-button-group-gap": "0.5rem",
      "space-card-gap": "0.5rem",
      "space-card-padding": "1rem",
      "space-table-cell-padding": "0.375rem"
    },
    text: {
      "text-heading-3xl-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-3xl-font-size": "2.25rem",
      "text-heading-3xl-font-weight": "700",
      "text-heading-3xl-font-letter-spacing": "-0.03375rem",
      "text-heading-3xl-font-line-height": "3rem",
      "text-heading-2xl-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-2xl-font-size": "2rem",
      "text-heading-2xl-font-weight": "700",
      "text-heading-2xl-font-letter-spacing": "-0.01875rem",
      "text-heading-2xl-font-line-height": "2.5rem",
      "text-heading-xl-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-xl-font-size": "1.375rem",
      "text-heading-xl-font-weight": "700",
      "text-heading-xl-font-letter-spacing": "-0.0125rem",
      "text-heading-xl-font-line-height": "1.75rem",
      "text-heading-lg-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-lg-font-size": "1.125rem",
      "text-heading-lg-font-weight": "650",
      "text-heading-lg-font-letter-spacing": "-0.0125rem",
      "text-heading-lg-font-line-height": "1.5rem",
      "text-heading-md-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-md-font-size": "1rem",
      "text-heading-md-font-weight": "650",
      "text-heading-md-font-letter-spacing": "0rem",
      "text-heading-md-font-line-height": "1.25rem",
      "text-heading-sm-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-sm-font-size": "0.875rem",
      "text-heading-sm-font-weight": "650",
      "text-heading-sm-font-letter-spacing": "0rem",
      "text-heading-sm-font-line-height": "1.25rem",
      "text-heading-xs-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-xs-font-size": "0.75rem",
      "text-heading-xs-font-weight": "650",
      "text-heading-xs-font-letter-spacing": "0rem",
      "text-heading-xs-font-line-height": "1rem",
      "text-body-lg-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-lg-font-size": "1.125rem",
      "text-body-lg-font-weight": "450",
      "text-body-lg-font-letter-spacing": "0rem",
      "text-body-lg-font-line-height": "1.75rem",
      "text-body-md-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-md-font-size": "1rem",
      "text-body-md-font-weight": "450",
      "text-body-md-font-letter-spacing": "0rem",
      "text-body-md-font-line-height": "1.5rem",
      "text-body-sm-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-sm-font-size": "0.875rem",
      "text-body-sm-font-weight": "450",
      "text-body-sm-font-letter-spacing": "0rem",
      "text-body-sm-font-line-height": "1.25rem",
      "text-body-xs-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-xs-font-size": "0.75rem",
      "text-body-xs-font-weight": "450",
      "text-body-xs-font-letter-spacing": "0rem",
      "text-body-xs-font-line-height": "1rem"
    },
    width: {
      "width-0": "0rem",
      "width-025": "0.0625rem",
      "width-050": "0.125rem",
      "width-100": "0.25rem",
      "width-150": "0.375rem",
      "width-200": "0.5rem",
      "width-300": "0.75rem",
      "width-400": "1rem",
      "width-500": "1.25rem",
      "width-600": "1.5rem",
      "width-700": "1.75rem",
      "width-800": "2rem",
      "width-900": "2.25rem",
      "width-1000": "2.5rem",
      "width-1200": "3rem",
      "width-1600": "4rem",
      "width-2000": "5rem",
      "width-2400": "6rem",
      "width-2800": "7rem",
      "width-3200": "8rem"
    },
    zIndex: {
      "z-index-0": "auto",
      "z-index-1": "100",
      "z-index-2": "400",
      "z-index-3": "510",
      "z-index-4": "512",
      "z-index-5": "513",
      "z-index-6": "514",
      "z-index-7": "515",
      "z-index-8": "516",
      "z-index-9": "517",
      "z-index-10": "518",
      "z-index-11": "519",
      "z-index-12": "520"
    }
  },
  "light-high-contrast-experimental": {
    border: {
      "border-radius-0": "0rem",
      "border-radius-050": "0.125rem",
      "border-radius-100": "0.25rem",
      "border-radius-150": "0.375rem",
      "border-radius-200": "0.5rem",
      "border-radius-300": "0.75rem",
      "border-radius-400": "1rem",
      "border-radius-500": "1.25rem",
      "border-radius-750": "1.875rem",
      "border-radius-full": "624.9375rem",
      "border-width-0": "0rem",
      "border-width-0165": "0.04125rem",
      "border-width-025": "0.0625rem",
      "border-width-050": "0.125rem",
      "border-width-100": "0.25rem"
    },
    breakpoints: {
      "breakpoints-xs": "0rem",
      "breakpoints-sm": "30.625rem",
      "breakpoints-md": "48rem",
      "breakpoints-lg": "65rem",
      "breakpoints-xl": "90rem"
    },
    color: {
      "color-scheme": "light",
      "color-bg": "rgba(241, 241, 241, 1)",
      "color-bg-inverse": "rgba(26, 26, 26, 1)",
      "color-bg-surface": "rgba(255, 255, 255, 1)",
      "color-bg-surface-hover": "rgba(247, 247, 247, 1)",
      "color-bg-surface-active": "rgba(243, 243, 243, 1)",
      "color-bg-surface-selected": "rgba(241, 241, 241, 1)",
      "color-bg-surface-disabled": "rgba(0, 0, 0, 0.05)",
      "color-bg-surface-secondary": "rgba(241, 241, 241, 1)",
      "color-bg-surface-secondary-hover": "rgba(241, 241, 241, 1)",
      "color-bg-surface-secondary-active": "rgba(235, 235, 235, 1)",
      "color-bg-surface-secondary-selected": "rgba(235, 235, 235, 1)",
      "color-bg-surface-tertiary": "rgba(243, 243, 243, 1)",
      "color-bg-surface-tertiary-hover": "rgba(235, 235, 235, 1)",
      "color-bg-surface-tertiary-active": "rgba(227, 227, 227, 1)",
      "color-bg-surface-brand": "rgba(227, 227, 227, 1)",
      "color-bg-surface-brand-hover": "rgba(235, 235, 235, 1)",
      "color-bg-surface-brand-active": "rgba(241, 241, 241, 1)",
      "color-bg-surface-brand-selected": "rgba(241, 241, 241, 1)",
      "color-bg-surface-info": "rgba(234, 244, 255, 1)",
      "color-bg-surface-info-hover": "rgba(224, 240, 255, 1)",
      "color-bg-surface-info-active": "rgba(202, 230, 255, 1)",
      "color-bg-surface-success": "rgba(205, 254, 225, 1)",
      "color-bg-surface-success-hover": "rgba(180, 254, 210, 1)",
      "color-bg-surface-success-active": "rgba(146, 254, 194, 1)",
      "color-bg-surface-caution": "rgba(255, 248, 219, 1)",
      "color-bg-surface-caution-hover": "rgba(255, 244, 191, 1)",
      "color-bg-surface-caution-active": "rgba(255, 239, 157, 1)",
      "color-bg-surface-warning": "rgba(255, 241, 227, 1)",
      "color-bg-surface-warning-hover": "rgba(255, 235, 213, 1)",
      "color-bg-surface-warning-active": "rgba(255, 228, 198, 1)",
      "color-bg-surface-critical": "rgba(254, 233, 232, 1)",
      "color-bg-surface-critical-hover": "rgba(254, 226, 225, 1)",
      "color-bg-surface-critical-active": "rgba(254, 218, 217, 1)",
      "color-bg-surface-emphasis": "rgba(240, 242, 255, 1)",
      "color-bg-surface-emphasis-hover": "rgba(234, 237, 255, 1)",
      "color-bg-surface-emphasis-active": "rgba(226, 231, 255, 1)",
      "color-bg-surface-magic": "rgba(248, 247, 255, 1)",
      "color-bg-surface-magic-hover": "rgba(243, 241, 255, 1)",
      "color-bg-surface-magic-active": "rgba(233, 229, 255, 1)",
      "color-bg-surface-inverse": "rgba(48, 48, 48, 1)",
      "color-bg-surface-transparent": "rgba(0, 0, 0, 0)",
      "color-bg-fill": "rgba(255, 255, 255, 1)",
      "color-bg-fill-hover": "rgba(250, 250, 250, 1)",
      "color-bg-fill-active": "rgba(247, 247, 247, 1)",
      "color-bg-fill-selected": "rgba(204, 204, 204, 1)",
      "color-bg-fill-disabled": "rgba(0, 0, 0, 0.05)",
      "color-bg-fill-secondary": "rgba(241, 241, 241, 1)",
      "color-bg-fill-secondary-hover": "rgba(235, 235, 235, 1)",
      "color-bg-fill-secondary-active": "rgba(227, 227, 227, 1)",
      "color-bg-fill-tertiary": "rgba(227, 227, 227, 1)",
      "color-bg-fill-tertiary-hover": "rgba(212, 212, 212, 1)",
      "color-bg-fill-tertiary-active": "rgba(204, 204, 204, 1)",
      "color-bg-fill-brand": "rgba(48, 48, 48, 1)",
      "color-bg-fill-brand-hover": "rgba(26, 26, 26, 1)",
      "color-bg-fill-brand-active": "rgba(26, 26, 26, 1)",
      "color-bg-fill-brand-selected": "rgba(48, 48, 48, 1)",
      "color-bg-fill-brand-disabled": "rgba(0, 0, 0, 0.17)",
      "color-bg-fill-info": "rgba(145, 208, 255, 1)",
      "color-bg-fill-info-hover": "rgba(81, 192, 255, 1)",
      "color-bg-fill-info-active": "rgba(0, 148, 213, 1)",
      "color-bg-fill-info-secondary": "rgba(213, 235, 255, 1)",
      "color-bg-fill-success": "rgba(41, 132, 90, 1)",
      "color-bg-fill-success-hover": "rgba(19, 111, 69, 1)",
      "color-bg-fill-success-active": "rgba(12, 81, 50, 1)",
      "color-bg-fill-success-secondary": "rgba(180, 254, 210, 1)",
      "color-bg-fill-warning": "rgba(255, 184, 0, 1)",
      "color-bg-fill-warning-hover": "rgba(229, 165, 0, 1)",
      "color-bg-fill-warning-active": "rgba(178, 132, 0, 1)",
      "color-bg-fill-warning-secondary": "rgba(255, 214, 164, 1)",
      "color-bg-fill-caution": "rgba(255, 230, 0, 1)",
      "color-bg-fill-caution-hover": "rgba(234, 211, 0, 1)",
      "color-bg-fill-caution-active": "rgba(225, 203, 0, 1)",
      "color-bg-fill-caution-secondary": "rgba(255, 235, 120, 1)",
      "color-bg-fill-critical": "rgba(229, 28, 0, 1)",
      "color-bg-fill-critical-hover": "rgba(181, 38, 11, 1)",
      "color-bg-fill-critical-active": "rgba(142, 31, 11, 1)",
      "color-bg-fill-critical-selected": "rgba(142, 31, 11, 1)",
      "color-bg-fill-critical-secondary": "rgba(254, 211, 209, 1)",
      "color-bg-fill-emphasis": "rgba(0, 91, 211, 1)",
      "color-bg-fill-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-bg-fill-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-bg-fill-magic": "rgba(128, 81, 255, 1)",
      "color-bg-fill-magic-secondary": "rgba(233, 229, 255, 1)",
      "color-bg-fill-magic-secondary-hover": "rgba(228, 222, 255, 1)",
      "color-bg-fill-magic-secondary-active": "rgba(223, 217, 255, 1)",
      "color-bg-fill-inverse": "rgba(48, 48, 48, 1)",
      "color-bg-fill-inverse-hover": "rgba(74, 74, 74, 1)",
      "color-bg-fill-inverse-active": "rgba(97, 97, 97, 1)",
      "color-bg-fill-transparent": "rgba(0, 0, 0, 0.02)",
      "color-bg-fill-transparent-hover": "rgba(0, 0, 0, 0.05)",
      "color-bg-fill-transparent-active": "rgba(0, 0, 0, 0.08)",
      "color-bg-fill-transparent-selected": "rgba(0, 0, 0, 0.08)",
      "color-bg-fill-transparent-secondary": "rgba(0, 0, 0, 0.06)",
      "color-bg-fill-transparent-secondary-hover": "rgba(0, 0, 0, 0.08)",
      "color-bg-fill-transparent-secondary-active": "rgba(0, 0, 0, 0.11)",
      "color-text": "rgba(26, 26, 26, 1)",
      "color-text-secondary": "rgba(26, 26, 26, 1)",
      "color-text-disabled": "rgba(181, 181, 181, 1)",
      "color-text-link": "rgba(0, 91, 211, 1)",
      "color-text-link-hover": "rgba(0, 66, 153, 1)",
      "color-text-link-active": "rgba(0, 46, 106, 1)",
      "color-text-brand": "rgba(26, 26, 26, 1)",
      "color-text-brand-hover": "rgba(48, 48, 48, 1)",
      "color-text-brand-on-bg-fill": "rgba(255, 255, 255, 1)",
      "color-text-brand-on-bg-fill-hover": "rgba(227, 227, 227, 1)",
      "color-text-brand-on-bg-fill-active": "rgba(204, 204, 204, 1)",
      "color-text-brand-on-bg-fill-disabled": "rgba(255, 255, 255, 1)",
      "color-text-info": "rgba(0, 58, 90, 1)",
      "color-text-info-hover": "rgba(0, 58, 90, 1)",
      "color-text-info-active": "rgba(0, 33, 51, 1)",
      "color-text-info-secondary": "rgba(0, 124, 180, 1)",
      "color-text-info-on-bg-fill": "rgba(0, 33, 51, 1)",
      "color-text-success": "rgba(12, 81, 50, 1)",
      "color-text-success-hover": "rgba(8, 61, 37, 1)",
      "color-text-success-active": "rgba(9, 42, 27, 1)",
      "color-text-success-secondary": "rgba(41, 132, 90, 1)",
      "color-text-success-on-bg-fill": "rgba(248, 255, 251, 1)",
      "color-text-caution": "rgba(79, 71, 0, 1)",
      "color-text-caution-hover": "rgba(51, 46, 0, 1)",
      "color-text-caution-active": "rgba(31, 28, 0, 1)",
      "color-text-caution-secondary": "rgba(130, 117, 0, 1)",
      "color-text-caution-on-bg-fill": "rgba(51, 46, 0, 1)",
      "color-text-warning": "rgba(94, 66, 0, 1)",
      "color-text-warning-hover": "rgba(65, 45, 0, 1)",
      "color-text-warning-active": "rgba(37, 26, 0, 1)",
      "color-text-warning-secondary": "rgba(149, 111, 0, 1)",
      "color-text-warning-on-bg-fill": "rgba(37, 26, 0, 1)",
      "color-text-critical": "rgba(142, 31, 11, 1)",
      "color-text-critical-hover": "rgba(95, 21, 7, 1)",
      "color-text-critical-active": "rgba(47, 10, 4, 1)",
      "color-text-critical-secondary": "rgba(229, 28, 0, 1)",
      "color-text-critical-on-bg-fill": "rgba(255, 251, 251, 1)",
      "color-text-emphasis": "rgba(0, 91, 211, 1)",
      "color-text-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-text-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-text-emphasis-on-bg-fill": "rgba(252, 253, 255, 1)",
      "color-text-emphasis-on-bg-fill-hover": "rgba(226, 231, 255, 1)",
      "color-text-emphasis-on-bg-fill-active": "rgba(213, 220, 255, 1)",
      "color-text-magic": "rgba(87, 0, 209, 1)",
      "color-text-magic-secondary": "rgba(113, 38, 255, 1)",
      "color-text-magic-on-bg-fill": "rgba(253, 253, 255, 1)",
      "color-text-inverse": "rgba(227, 227, 227, 1)",
      "color-text-inverse-secondary": "rgba(181, 181, 181, 1)",
      "color-text-link-inverse": "rgba(197, 208, 255, 1)",
      "color-border": "rgba(138, 138, 138, 1)",
      "color-border-hover": "rgba(204, 204, 204, 1)",
      "color-border-disabled": "rgba(235, 235, 235, 1)",
      "color-border-secondary": "rgba(138, 138, 138, 1)",
      "color-border-tertiary": "rgba(204, 204, 204, 1)",
      "color-border-focus": "rgba(0, 91, 211, 1)",
      "color-border-brand": "rgba(227, 227, 227, 1)",
      "color-border-info": "rgba(168, 216, 255, 1)",
      "color-border-success": "rgba(146, 254, 194, 1)",
      "color-border-caution": "rgba(255, 235, 120, 1)",
      "color-border-warning": "rgba(255, 200, 121, 1)",
      "color-border-critical": "rgba(254, 195, 193, 1)",
      "color-border-critical-secondary": "rgba(142, 31, 11, 1)",
      "color-border-emphasis": "rgba(0, 91, 211, 1)",
      "color-border-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-border-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-border-magic": "rgba(228, 222, 255, 1)",
      "color-border-magic-secondary": "rgba(148, 116, 255, 1)",
      "color-border-magic-secondary-hover": "rgba(128, 81, 255, 1)",
      "color-border-inverse": "rgba(97, 97, 97, 1)",
      "color-border-inverse-hover": "rgba(204, 204, 204, 1)",
      "color-border-inverse-active": "rgba(227, 227, 227, 1)",
      "color-tooltip-tail-down-border-experimental": "rgba(212, 212, 212, 1)",
      "color-tooltip-tail-up-border-experimental": "rgba(227, 227, 227, 1)",
      "color-border-gradient-experimental": "linear-gradient(to bottom, rgba(235, 235, 235, 1), rgba(204, 204, 204, 1) 78%, rgba(181, 181, 181, 1))",
      "color-border-gradient-hover-experimental": "linear-gradient(to bottom, rgba(235, 235, 235, 1), rgba(204, 204, 204, 1) 78%, rgba(181, 181, 181, 1))",
      "color-border-gradient-selected-experimental": "linear-gradient(to bottom, rgba(235, 235, 235, 1), rgba(204, 204, 204, 1) 78%, rgba(181, 181, 181, 1))",
      "color-border-gradient-active-experimental": "linear-gradient(to bottom, rgba(235, 235, 235, 1), rgba(204, 204, 204, 1) 78%, rgba(181, 181, 181, 1))",
      "color-icon": "rgba(74, 74, 74, 1)",
      "color-icon-hover": "rgba(48, 48, 48, 1)",
      "color-icon-active": "rgba(26, 26, 26, 1)",
      "color-icon-disabled": "rgba(204, 204, 204, 1)",
      "color-icon-secondary": "rgba(74, 74, 74, 1)",
      "color-icon-secondary-hover": "rgba(97, 97, 97, 1)",
      "color-icon-secondary-active": "rgba(74, 74, 74, 1)",
      "color-icon-brand": "rgba(26, 26, 26, 1)",
      "color-icon-info": "rgba(0, 148, 213, 1)",
      "color-icon-success": "rgba(41, 132, 90, 1)",
      "color-icon-caution": "rgba(153, 138, 0, 1)",
      "color-icon-warning": "rgba(178, 132, 0, 1)",
      "color-icon-critical": "rgba(239, 77, 47, 1)",
      "color-icon-emphasis": "rgba(0, 91, 211, 1)",
      "color-icon-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-icon-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-icon-magic": "rgba(128, 81, 255, 1)",
      "color-icon-inverse": "rgba(227, 227, 227, 1)",
      "color-avatar-bg-fill": "rgba(181, 181, 181, 1)",
      "color-avatar-five-bg-fill": "rgba(253, 75, 146, 1)",
      "color-avatar-five-text-on-bg-fill": "rgba(255, 246, 248, 1)",
      "color-avatar-four-bg-fill": "rgba(81, 192, 255, 1)",
      "color-avatar-four-text-on-bg-fill": "rgba(0, 33, 51, 1)",
      "color-avatar-one-bg-fill": "rgba(197, 48, 197, 1)",
      "color-avatar-one-text-on-bg-fill": "rgba(253, 239, 253, 1)",
      "color-avatar-seven-bg-fill": "rgba(148, 116, 255, 1)",
      "color-avatar-seven-text-on-bg-fill": "rgba(248, 247, 255, 1)",
      "color-avatar-six-bg-fill": "rgba(37, 232, 43, 1)",
      "color-avatar-six-text-on-bg-fill": "rgba(3, 61, 5, 1)",
      "color-avatar-text-on-bg-fill": "rgba(255, 255, 255, 1)",
      "color-avatar-three-bg-fill": "rgba(44, 224, 212, 1)",
      "color-avatar-three-text-on-bg-fill": "rgba(3, 60, 57, 1)",
      "color-avatar-two-bg-fill": "rgba(56, 250, 163, 1)",
      "color-avatar-two-text-on-bg-fill": "rgba(12, 81, 50, 1)",
      "color-backdrop-bg": "rgba(0, 0, 0, 0.71)",
      "color-button-gradient-bg-fill": "linear-gradient(180deg, rgba(48, 48, 48, 0) 63.53%, rgba(255, 255, 255, 0.15) 100%)",
      "color-checkbox-bg-surface-disabled": "rgba(0, 0, 0, 0.08)",
      "color-checkbox-icon-disabled": "rgba(255, 255, 255, 1)",
      "color-input-bg-surface": "rgba(253, 253, 253, 1)",
      "color-input-bg-surface-hover": "rgba(250, 250, 250, 1)",
      "color-input-bg-surface-active": "rgba(247, 247, 247, 1)",
      "color-input-border": "rgba(74, 74, 74, 1)",
      "color-input-border-hover": "rgba(97, 97, 97, 1)",
      "color-input-border-active": "rgba(26, 26, 26, 1)",
      "color-nav-bg": "rgba(235, 235, 235, 1)",
      "color-nav-bg-surface": "rgba(0, 0, 0, 0.02)",
      "color-nav-bg-surface-hover": "rgba(241, 241, 241, 1)",
      "color-nav-bg-surface-active": "rgba(250, 250, 250, 1)",
      "color-nav-bg-surface-selected": "rgba(250, 250, 250, 1)",
      "color-radio-button-bg-surface-disabled": "rgba(0, 0, 0, 0.08)",
      "color-radio-button-icon-disabled": "rgba(255, 255, 255, 1)",
      "color-video-thumbnail-play-button-bg-fill-hover": "rgba(0, 0, 0, 0.81)",
      "color-video-thumbnail-play-button-bg-fill": "rgba(0, 0, 0, 0.71)",
      "color-video-thumbnail-play-button-text-on-bg-fill": "rgba(255, 255, 255, 1)",
      "color-scrollbar-thumb-bg-hover": "rgba(138, 138, 138, 1)"
    },
    font: {
      "font-family-sans": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "font-family-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      "font-size-275": "0.6875rem",
      "font-size-300": "0.75rem",
      "font-size-325": "0.8125rem",
      "font-size-350": "0.875rem",
      "font-size-400": "1rem",
      "font-size-450": "1.125rem",
      "font-size-500": "1.25rem",
      "font-size-550": "1.375rem",
      "font-size-600": "1.5rem",
      "font-size-750": "1.875rem",
      "font-size-800": "2rem",
      "font-size-900": "2.25rem",
      "font-size-1000": "2.5rem",
      "font-weight-regular": "450",
      "font-weight-medium": "550",
      "font-weight-semibold": "650",
      "font-weight-bold": "700",
      "font-letter-spacing-densest": "-0.03375rem",
      "font-letter-spacing-denser": "-0.01875rem",
      "font-letter-spacing-dense": "-0.0125rem",
      "font-letter-spacing-normal": "0rem",
      "font-line-height-300": "0.75rem",
      "font-line-height-400": "1rem",
      "font-line-height-500": "1.25rem",
      "font-line-height-600": "1.5rem",
      "font-line-height-700": "1.75rem",
      "font-line-height-800": "2rem",
      "font-line-height-1000": "2.5rem",
      "font-line-height-1200": "3rem"
    },
    height: {
      "height-0": "0rem",
      "height-025": "0.0625rem",
      "height-050": "0.125rem",
      "height-100": "0.25rem",
      "height-150": "0.375rem",
      "height-200": "0.5rem",
      "height-300": "0.75rem",
      "height-400": "1rem",
      "height-500": "1.25rem",
      "height-600": "1.5rem",
      "height-700": "1.75rem",
      "height-800": "2rem",
      "height-900": "2.25rem",
      "height-1000": "2.5rem",
      "height-1200": "3rem",
      "height-1600": "4rem",
      "height-2000": "5rem",
      "height-2400": "6rem",
      "height-2800": "7rem",
      "height-3200": "8rem"
    },
    motion: {
      "motion-duration-0": "0ms",
      "motion-duration-50": "50ms",
      "motion-duration-100": "100ms",
      "motion-duration-150": "150ms",
      "motion-duration-200": "200ms",
      "motion-duration-250": "250ms",
      "motion-duration-300": "300ms",
      "motion-duration-350": "350ms",
      "motion-duration-400": "400ms",
      "motion-duration-450": "450ms",
      "motion-duration-500": "500ms",
      "motion-duration-5000": "5000ms",
      "motion-ease": "cubic-bezier(0.25, 0.1, 0.25, 1)",
      "motion-ease-in": "cubic-bezier(0.42, 0, 1, 1)",
      "motion-ease-out": "cubic-bezier(0.19, 0.91, 0.38, 1)",
      "motion-ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1)",
      "motion-linear": "cubic-bezier(0, 0, 1, 1)",
      "motion-keyframes-bounce": "{ from, 65%, 85% { transform: scale(1) } 75% { transform: scale(0.85) } 82.5% { transform: scale(1.05) } }",
      "motion-keyframes-fade-in": "{ to { opacity: 1 } }",
      "motion-keyframes-pulse": "{ from, 75% { transform: scale(0.85); opacity: 1; } to { transform: scale(2.5); opacity: 0; } }",
      "motion-keyframes-spin": "{ to { transform: rotate(1turn) } }",
      "motion-keyframes-appear-above": "{ from { transform: translateY(var(--p-space-100)); opacity: 0; } to { transform: none; opacity: 1; } }",
      "motion-keyframes-appear-below": "{ from { transform: translateY(calc(var(--p-space-100) * -1)); opacity: 0; } to { transform: none; opacity: 1; } }"
    },
    shadow: {
      "shadow-0": "none",
      "shadow-100": "0rem 0.0625rem 0rem 0rem rgba(26, 26, 26, 0.07)",
      "shadow-200": "0rem 0.1875rem 0.0625rem -0.0625rem rgba(26, 26, 26, 0.07)",
      "shadow-300": "0rem 0.25rem 0.375rem -0.125rem rgba(26, 26, 26, 0.20)",
      "shadow-400": "0rem 0.5rem 1rem -0.25rem rgba(26, 26, 26, 0.22)",
      "shadow-500": "0rem 0.75rem 1.25rem -0.5rem rgba(26, 26, 26, 0.24)",
      "shadow-600": "0rem 1.25rem 1.25rem -0.5rem rgba(26, 26, 26, 0.28)",
      "shadow-bevel-100": "0rem 0.0625rem 0rem 0rem rgba(26, 26, 26, 0.07), 0rem 0.0625rem 0rem 0rem rgba(208, 208, 208, 0.40) inset, 0.0625rem 0rem 0rem 0rem #CCC inset, -0.0625rem 0rem 0rem 0rem #CCC inset, 0rem -0.0625rem 0rem 0rem #999 inset",
      "shadow-inset-100": "0rem 0.0625rem 0.125rem 0rem rgba(26, 26, 26, 0.15) inset, 0rem 0.0625rem 0.0625rem 0rem rgba(26, 26, 26, 0.15) inset",
      "shadow-inset-200": "0rem 0.125rem 0.0625rem 0rem rgba(26, 26, 26, 0.20) inset, 0.0625rem 0rem 0.0625rem 0rem rgba(26, 26, 26, 0.12) inset, -0.0625rem 0rem 0.0625rem 0rem rgba(26, 26, 26, 0.12) inset",
      "shadow-button": "0rem -0.0625rem 0rem 0rem #b5b5b5 inset, 0rem 0rem 0rem 0.0625rem rgba(0, 0, 0, 0.1) inset, 0rem 0.03125rem 0rem 0.09375rem #FFF inset",
      "shadow-button-hover": "0rem 0.0625rem 0rem 0rem #EBEBEB inset, -0.0625rem 0rem 0rem 0rem #EBEBEB inset, 0.0625rem 0rem 0rem 0rem #EBEBEB inset, 0rem -0.0625rem 0rem 0rem #CCC inset",
      "shadow-button-inset": "-0.0625rem 0rem 0.0625rem 0rem rgba(26, 26, 26, 0.122) inset, 0.0625rem 0rem 0.0625rem 0rem rgba(26, 26, 26, 0.122) inset, 0rem 0.125rem 0.0625rem 0rem rgba(26, 26, 26, 0.2) inset",
      "shadow-button-primary": "0rem -0.0625rem 0rem 0.0625rem rgba(0, 0, 0, 0.8) inset, 0rem 0rem 0rem 0.0625rem rgba(48, 48, 48, 1) inset, 0rem 0.03125rem 0rem 0.09375rem rgba(255, 255, 255, 0.25) inset;",
      "shadow-button-primary-hover": "0rem 0.0625rem 0rem 0rem rgba(255, 255, 255, 0.24) inset, 0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, -0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, 0rem -0.0625rem 0rem 0rem #000 inset, 0rem -0.0625rem 0rem 0.0625rem #1A1A1A",
      "shadow-button-primary-inset": "0rem 0.1875rem 0rem 0rem rgb(0, 0, 0) inset",
      "shadow-button-primary-critical": "0rem -0.0625rem 0rem 0.0625rem rgba(142, 31, 11, 0.8) inset, 0rem 0rem 0rem 0.0625rem rgba(181, 38, 11, 0.8) inset, 0rem 0.03125rem 0rem 0.09375rem rgba(255, 255, 255, 0.349) inset",
      "shadow-button-primary-critical-hover": "0rem 0.0625rem 0rem 0rem rgba(255, 255, 255, 0.48) inset, 0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, -0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, 0rem -0.09375rem 0rem 0rem rgba(0, 0, 0, 0.25) inset",
      "shadow-button-primary-critical-inset": "-0.0625rem 0rem 0.0625rem 0rem rgba(0, 0, 0, 0.2) inset, 0.0625rem 0rem 0.0625rem 0rem rgba(0, 0, 0, 0.2) inset, 0rem 0.125rem 0rem 0rem rgba(0, 0, 0, 0.6) inset",
      "shadow-button-primary-success": "0rem -0.0625rem 0rem 0.0625rem rgba(12, 81, 50, 0.8) inset, 0rem 0rem 0rem 0.0625rem rgba(19, 111, 69, 0.8) inset, 0rem 0.03125rem 0rem 0.09375rem rgba(255, 255, 255, 0.251) inset",
      "shadow-button-primary-success-hover": "0rem 0.0625rem 0rem 0rem rgba(255, 255, 255, 0.48) inset, 0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, -0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, 0rem -0.09375rem 0rem 0rem rgba(0, 0, 0, 0.25) inset",
      "shadow-button-primary-success-inset": "-0.0625rem 0rem 0.0625rem 0rem rgba(0, 0, 0, 0.2) inset, 0.0625rem 0rem 0.0625rem 0rem rgba(0, 0, 0, 0.2) inset, 0rem 0.125rem 0rem 0rem rgba(0, 0, 0, 0.6) inset",
      "shadow-border-inset": "0rem 0rem 0rem 0.0625rem rgba(0, 0, 0, 0.08) inset"
    },
    space: {
      "space-0": "0rem",
      "space-025": "0.0625rem",
      "space-050": "0.125rem",
      "space-100": "0.25rem",
      "space-150": "0.375rem",
      "space-200": "0.5rem",
      "space-300": "0.75rem",
      "space-400": "1rem",
      "space-500": "1.25rem",
      "space-600": "1.5rem",
      "space-800": "2rem",
      "space-1000": "2.5rem",
      "space-1200": "3rem",
      "space-1600": "4rem",
      "space-2000": "5rem",
      "space-2400": "6rem",
      "space-2800": "7rem",
      "space-3200": "8rem",
      "space-button-group-gap": "0.5rem",
      "space-card-gap": "1rem",
      "space-card-padding": "1rem",
      "space-table-cell-padding": "0.375rem"
    },
    text: {
      "text-heading-3xl-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-3xl-font-size": "2.25rem",
      "text-heading-3xl-font-weight": "700",
      "text-heading-3xl-font-letter-spacing": "-0.03375rem",
      "text-heading-3xl-font-line-height": "3rem",
      "text-heading-2xl-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-2xl-font-size": "1.875rem",
      "text-heading-2xl-font-weight": "700",
      "text-heading-2xl-font-letter-spacing": "-0.01875rem",
      "text-heading-2xl-font-line-height": "2.5rem",
      "text-heading-xl-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-xl-font-size": "1.5rem",
      "text-heading-xl-font-weight": "700",
      "text-heading-xl-font-letter-spacing": "-0.0125rem",
      "text-heading-xl-font-line-height": "2rem",
      "text-heading-lg-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-lg-font-size": "1.25rem",
      "text-heading-lg-font-weight": "650",
      "text-heading-lg-font-letter-spacing": "-0.0125rem",
      "text-heading-lg-font-line-height": "1.5rem",
      "text-heading-md-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-md-font-size": "0.875rem",
      "text-heading-md-font-weight": "650",
      "text-heading-md-font-letter-spacing": "0rem",
      "text-heading-md-font-line-height": "1.25rem",
      "text-heading-sm-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-sm-font-size": "0.8125rem",
      "text-heading-sm-font-weight": "650",
      "text-heading-sm-font-letter-spacing": "0rem",
      "text-heading-sm-font-line-height": "1.25rem",
      "text-heading-xs-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-xs-font-size": "0.75rem",
      "text-heading-xs-font-weight": "650",
      "text-heading-xs-font-letter-spacing": "0rem",
      "text-heading-xs-font-line-height": "1rem",
      "text-body-lg-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-lg-font-size": "0.875rem",
      "text-body-lg-font-weight": "450",
      "text-body-lg-font-letter-spacing": "0rem",
      "text-body-lg-font-line-height": "1.25rem",
      "text-body-md-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-md-font-size": "0.8125rem",
      "text-body-md-font-weight": "450",
      "text-body-md-font-letter-spacing": "0rem",
      "text-body-md-font-line-height": "1.25rem",
      "text-body-sm-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-sm-font-size": "0.75rem",
      "text-body-sm-font-weight": "450",
      "text-body-sm-font-letter-spacing": "0rem",
      "text-body-sm-font-line-height": "1rem",
      "text-body-xs-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-xs-font-size": "0.6875rem",
      "text-body-xs-font-weight": "450",
      "text-body-xs-font-letter-spacing": "0rem",
      "text-body-xs-font-line-height": "0.75rem"
    },
    width: {
      "width-0": "0rem",
      "width-025": "0.0625rem",
      "width-050": "0.125rem",
      "width-100": "0.25rem",
      "width-150": "0.375rem",
      "width-200": "0.5rem",
      "width-300": "0.75rem",
      "width-400": "1rem",
      "width-500": "1.25rem",
      "width-600": "1.5rem",
      "width-700": "1.75rem",
      "width-800": "2rem",
      "width-900": "2.25rem",
      "width-1000": "2.5rem",
      "width-1200": "3rem",
      "width-1600": "4rem",
      "width-2000": "5rem",
      "width-2400": "6rem",
      "width-2800": "7rem",
      "width-3200": "8rem"
    },
    zIndex: {
      "z-index-0": "auto",
      "z-index-1": "100",
      "z-index-2": "400",
      "z-index-3": "510",
      "z-index-4": "512",
      "z-index-5": "513",
      "z-index-6": "514",
      "z-index-7": "515",
      "z-index-8": "516",
      "z-index-9": "517",
      "z-index-10": "518",
      "z-index-11": "519",
      "z-index-12": "520"
    }
  },
  "dark-experimental": {
    border: {
      "border-radius-0": "0rem",
      "border-radius-050": "0.125rem",
      "border-radius-100": "0.25rem",
      "border-radius-150": "0.375rem",
      "border-radius-200": "0.5rem",
      "border-radius-300": "0.75rem",
      "border-radius-400": "1rem",
      "border-radius-500": "1.25rem",
      "border-radius-750": "1.875rem",
      "border-radius-full": "624.9375rem",
      "border-width-0": "0rem",
      "border-width-0165": "0.04125rem",
      "border-width-025": "0.0625rem",
      "border-width-050": "0.125rem",
      "border-width-100": "0.25rem"
    },
    breakpoints: {
      "breakpoints-xs": "0rem",
      "breakpoints-sm": "30.625rem",
      "breakpoints-md": "48rem",
      "breakpoints-lg": "65rem",
      "breakpoints-xl": "90rem"
    },
    color: {
      "color-scheme": "dark",
      "color-bg": "rgba(26, 26, 26, 1)",
      "color-bg-inverse": "rgba(26, 26, 26, 1)",
      "color-bg-surface": "rgba(48, 48, 48, 1)",
      "color-bg-surface-hover": "rgba(74, 74, 74, 1)",
      "color-bg-surface-active": "rgba(97, 97, 97, 1)",
      "color-bg-surface-selected": "rgba(97, 97, 97, 1)",
      "color-bg-surface-disabled": "rgba(0, 0, 0, 0.05)",
      "color-bg-surface-secondary": "rgba(247, 247, 247, 1)",
      "color-bg-surface-secondary-hover": "rgba(74, 74, 74, 1)",
      "color-bg-surface-secondary-active": "rgba(97, 97, 97, 1)",
      "color-bg-surface-secondary-selected": "rgba(235, 235, 235, 1)",
      "color-bg-surface-tertiary": "rgba(243, 243, 243, 1)",
      "color-bg-surface-tertiary-hover": "rgba(235, 235, 235, 1)",
      "color-bg-surface-tertiary-active": "rgba(227, 227, 227, 1)",
      "color-bg-surface-brand": "rgba(227, 227, 227, 1)",
      "color-bg-surface-brand-hover": "rgba(235, 235, 235, 1)",
      "color-bg-surface-brand-active": "rgba(241, 241, 241, 1)",
      "color-bg-surface-brand-selected": "rgba(74, 74, 74, 1)",
      "color-bg-surface-info": "rgba(234, 244, 255, 1)",
      "color-bg-surface-info-hover": "rgba(224, 240, 255, 1)",
      "color-bg-surface-info-active": "rgba(202, 230, 255, 1)",
      "color-bg-surface-success": "rgba(205, 254, 225, 1)",
      "color-bg-surface-success-hover": "rgba(180, 254, 210, 1)",
      "color-bg-surface-success-active": "rgba(146, 254, 194, 1)",
      "color-bg-surface-caution": "rgba(255, 248, 219, 1)",
      "color-bg-surface-caution-hover": "rgba(255, 244, 191, 1)",
      "color-bg-surface-caution-active": "rgba(255, 239, 157, 1)",
      "color-bg-surface-warning": "rgba(255, 241, 227, 1)",
      "color-bg-surface-warning-hover": "rgba(255, 235, 213, 1)",
      "color-bg-surface-warning-active": "rgba(255, 228, 198, 1)",
      "color-bg-surface-critical": "rgba(254, 233, 232, 1)",
      "color-bg-surface-critical-hover": "rgba(254, 226, 225, 1)",
      "color-bg-surface-critical-active": "rgba(254, 218, 217, 1)",
      "color-bg-surface-emphasis": "rgba(240, 242, 255, 1)",
      "color-bg-surface-emphasis-hover": "rgba(234, 237, 255, 1)",
      "color-bg-surface-emphasis-active": "rgba(226, 231, 255, 1)",
      "color-bg-surface-magic": "rgba(248, 247, 255, 1)",
      "color-bg-surface-magic-hover": "rgba(243, 241, 255, 1)",
      "color-bg-surface-magic-active": "rgba(233, 229, 255, 1)",
      "color-bg-surface-inverse": "rgba(48, 48, 48, 1)",
      "color-bg-surface-transparent": "rgba(0, 0, 0, 0)",
      "color-bg-fill": "rgba(48, 48, 48, 1)",
      "color-bg-fill-hover": "rgba(74, 74, 74, 1)",
      "color-bg-fill-active": "rgba(97, 97, 97, 1)",
      "color-bg-fill-selected": "rgba(97, 97, 97, 1)",
      "color-bg-fill-disabled": "rgba(0, 0, 0, 0.05)",
      "color-bg-fill-secondary": "rgba(241, 241, 241, 1)",
      "color-bg-fill-secondary-hover": "rgba(235, 235, 235, 1)",
      "color-bg-fill-secondary-active": "rgba(227, 227, 227, 1)",
      "color-bg-fill-tertiary": "rgba(227, 227, 227, 1)",
      "color-bg-fill-tertiary-hover": "rgba(212, 212, 212, 1)",
      "color-bg-fill-tertiary-active": "rgba(204, 204, 204, 1)",
      "color-bg-fill-brand": "rgba(255, 255, 255, 1)",
      "color-bg-fill-brand-hover": "rgba(243, 243, 243, 1)",
      "color-bg-fill-brand-active": "rgba(247, 247, 247, 1)",
      "color-bg-fill-brand-selected": "rgba(212, 212, 212, 1)",
      "color-bg-fill-brand-disabled": "rgba(0, 0, 0, 0.17)",
      "color-bg-fill-info": "rgba(145, 208, 255, 1)",
      "color-bg-fill-info-hover": "rgba(81, 192, 255, 1)",
      "color-bg-fill-info-active": "rgba(0, 148, 213, 1)",
      "color-bg-fill-info-secondary": "rgba(213, 235, 255, 1)",
      "color-bg-fill-success": "rgba(41, 132, 90, 1)",
      "color-bg-fill-success-hover": "rgba(19, 111, 69, 1)",
      "color-bg-fill-success-active": "rgba(12, 81, 50, 1)",
      "color-bg-fill-success-secondary": "rgba(180, 254, 210, 1)",
      "color-bg-fill-warning": "rgba(255, 184, 0, 1)",
      "color-bg-fill-warning-hover": "rgba(229, 165, 0, 1)",
      "color-bg-fill-warning-active": "rgba(178, 132, 0, 1)",
      "color-bg-fill-warning-secondary": "rgba(255, 214, 164, 1)",
      "color-bg-fill-caution": "rgba(255, 230, 0, 1)",
      "color-bg-fill-caution-hover": "rgba(234, 211, 0, 1)",
      "color-bg-fill-caution-active": "rgba(225, 203, 0, 1)",
      "color-bg-fill-caution-secondary": "rgba(255, 235, 120, 1)",
      "color-bg-fill-critical": "rgba(229, 28, 0, 1)",
      "color-bg-fill-critical-hover": "rgba(181, 38, 11, 1)",
      "color-bg-fill-critical-active": "rgba(142, 31, 11, 1)",
      "color-bg-fill-critical-selected": "rgba(142, 31, 11, 1)",
      "color-bg-fill-critical-secondary": "rgba(254, 211, 209, 1)",
      "color-bg-fill-emphasis": "rgba(0, 91, 211, 1)",
      "color-bg-fill-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-bg-fill-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-bg-fill-magic": "rgba(128, 81, 255, 1)",
      "color-bg-fill-magic-secondary": "rgba(233, 229, 255, 1)",
      "color-bg-fill-magic-secondary-hover": "rgba(228, 222, 255, 1)",
      "color-bg-fill-magic-secondary-active": "rgba(223, 217, 255, 1)",
      "color-bg-fill-inverse": "rgba(48, 48, 48, 1)",
      "color-bg-fill-inverse-hover": "rgba(74, 74, 74, 1)",
      "color-bg-fill-inverse-active": "rgba(97, 97, 97, 1)",
      "color-bg-fill-transparent": "rgba(255, 255, 255, 0.11)",
      "color-bg-fill-transparent-hover": "rgba(255, 255, 255, 0.17)",
      "color-bg-fill-transparent-active": "rgba(255, 255, 255, 0.20)",
      "color-bg-fill-transparent-selected": "rgba(255, 255, 255, 0.28)",
      "color-bg-fill-transparent-secondary": "rgba(0, 0, 0, 0.06)",
      "color-bg-fill-transparent-secondary-hover": "rgba(0, 0, 0, 0.08)",
      "color-bg-fill-transparent-secondary-active": "rgba(0, 0, 0, 0.11)",
      "color-text": "rgba(227, 227, 227, 1)",
      "color-text-secondary": "rgba(181, 181, 181, 1)",
      "color-text-disabled": "rgba(181, 181, 181, 1)",
      "color-text-link": "rgba(0, 91, 211, 1)",
      "color-text-link-hover": "rgba(0, 66, 153, 1)",
      "color-text-link-active": "rgba(0, 46, 106, 1)",
      "color-text-brand": "rgba(74, 74, 74, 1)",
      "color-text-brand-hover": "rgba(48, 48, 48, 1)",
      "color-text-brand-on-bg-fill": "rgba(48, 48, 48, 1)",
      "color-text-brand-on-bg-fill-hover": "rgba(227, 227, 227, 1)",
      "color-text-brand-on-bg-fill-active": "rgba(204, 204, 204, 1)",
      "color-text-brand-on-bg-fill-disabled": "rgba(255, 255, 255, 1)",
      "color-text-info": "rgba(0, 58, 90, 1)",
      "color-text-info-hover": "rgba(0, 58, 90, 1)",
      "color-text-info-active": "rgba(0, 33, 51, 1)",
      "color-text-info-secondary": "rgba(0, 124, 180, 1)",
      "color-text-info-on-bg-fill": "rgba(0, 33, 51, 1)",
      "color-text-success": "rgba(12, 81, 50, 1)",
      "color-text-success-hover": "rgba(8, 61, 37, 1)",
      "color-text-success-active": "rgba(9, 42, 27, 1)",
      "color-text-success-secondary": "rgba(41, 132, 90, 1)",
      "color-text-success-on-bg-fill": "rgba(248, 255, 251, 1)",
      "color-text-caution": "rgba(79, 71, 0, 1)",
      "color-text-caution-hover": "rgba(51, 46, 0, 1)",
      "color-text-caution-active": "rgba(31, 28, 0, 1)",
      "color-text-caution-secondary": "rgba(130, 117, 0, 1)",
      "color-text-caution-on-bg-fill": "rgba(51, 46, 0, 1)",
      "color-text-warning": "rgba(94, 66, 0, 1)",
      "color-text-warning-hover": "rgba(65, 45, 0, 1)",
      "color-text-warning-active": "rgba(37, 26, 0, 1)",
      "color-text-warning-secondary": "rgba(149, 111, 0, 1)",
      "color-text-warning-on-bg-fill": "rgba(37, 26, 0, 1)",
      "color-text-critical": "rgba(142, 31, 11, 1)",
      "color-text-critical-hover": "rgba(95, 21, 7, 1)",
      "color-text-critical-active": "rgba(47, 10, 4, 1)",
      "color-text-critical-secondary": "rgba(229, 28, 0, 1)",
      "color-text-critical-on-bg-fill": "rgba(255, 251, 251, 1)",
      "color-text-emphasis": "rgba(0, 91, 211, 1)",
      "color-text-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-text-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-text-emphasis-on-bg-fill": "rgba(252, 253, 255, 1)",
      "color-text-emphasis-on-bg-fill-hover": "rgba(226, 231, 255, 1)",
      "color-text-emphasis-on-bg-fill-active": "rgba(213, 220, 255, 1)",
      "color-text-magic": "rgba(87, 0, 209, 1)",
      "color-text-magic-secondary": "rgba(113, 38, 255, 1)",
      "color-text-magic-on-bg-fill": "rgba(253, 253, 255, 1)",
      "color-text-inverse": "rgba(227, 227, 227, 1)",
      "color-text-inverse-secondary": "rgba(181, 181, 181, 1)",
      "color-text-link-inverse": "rgba(197, 208, 255, 1)",
      "color-border": "rgba(227, 227, 227, 1)",
      "color-border-hover": "rgba(204, 204, 204, 1)",
      "color-border-disabled": "rgba(235, 235, 235, 1)",
      "color-border-secondary": "rgba(97, 97, 97, 1)",
      "color-border-tertiary": "rgba(204, 204, 204, 1)",
      "color-border-focus": "rgba(0, 91, 211, 1)",
      "color-border-brand": "rgba(227, 227, 227, 1)",
      "color-border-info": "rgba(168, 216, 255, 1)",
      "color-border-success": "rgba(146, 254, 194, 1)",
      "color-border-caution": "rgba(255, 235, 120, 1)",
      "color-border-warning": "rgba(255, 200, 121, 1)",
      "color-border-critical": "rgba(254, 195, 193, 1)",
      "color-border-critical-secondary": "rgba(142, 31, 11, 1)",
      "color-border-emphasis": "rgba(0, 91, 211, 1)",
      "color-border-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-border-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-border-magic": "rgba(228, 222, 255, 1)",
      "color-border-magic-secondary": "rgba(148, 116, 255, 1)",
      "color-border-magic-secondary-hover": "rgba(128, 81, 255, 1)",
      "color-border-inverse": "rgba(97, 97, 97, 1)",
      "color-border-inverse-hover": "rgba(204, 204, 204, 1)",
      "color-border-inverse-active": "rgba(227, 227, 227, 1)",
      "color-tooltip-tail-down-border-experimental": "rgba(60, 60, 60, 1)",
      "color-tooltip-tail-up-border-experimental": "rgba(71, 71, 71, 1)",
      "color-border-gradient-experimental": "linear-gradient(to bottom, rgba(255, 255, 255, 0.17), rgba(255, 255, 255, 0.03))",
      "color-border-gradient-hover-experimental": "linear-gradient(to bottom, rgba(255, 255, 255, 0.17), rgba(255, 255, 255, 0.03))",
      "color-border-gradient-selected-experimental": "linear-gradient(to bottom, rgba(0, 0, 0, 0.20), rgba(255, 255, 255, 0.20))",
      "color-border-gradient-active-experimental": "linear-gradient(to bottom, rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.03))",
      "color-icon": "rgba(227, 227, 227, 1)",
      "color-icon-hover": "rgba(48, 48, 48, 1)",
      "color-icon-active": "rgba(26, 26, 26, 1)",
      "color-icon-disabled": "rgba(204, 204, 204, 1)",
      "color-icon-secondary": "rgba(138, 138, 138, 1)",
      "color-icon-secondary-hover": "rgba(97, 97, 97, 1)",
      "color-icon-secondary-active": "rgba(74, 74, 74, 1)",
      "color-icon-brand": "rgba(26, 26, 26, 1)",
      "color-icon-info": "rgba(0, 148, 213, 1)",
      "color-icon-success": "rgba(41, 132, 90, 1)",
      "color-icon-caution": "rgba(153, 138, 0, 1)",
      "color-icon-warning": "rgba(178, 132, 0, 1)",
      "color-icon-critical": "rgba(239, 77, 47, 1)",
      "color-icon-emphasis": "rgba(0, 91, 211, 1)",
      "color-icon-emphasis-hover": "rgba(0, 66, 153, 1)",
      "color-icon-emphasis-active": "rgba(0, 46, 106, 1)",
      "color-icon-magic": "rgba(128, 81, 255, 1)",
      "color-icon-inverse": "rgba(227, 227, 227, 1)",
      "color-avatar-bg-fill": "rgba(181, 181, 181, 1)",
      "color-avatar-five-bg-fill": "rgba(253, 75, 146, 1)",
      "color-avatar-five-text-on-bg-fill": "rgba(255, 246, 248, 1)",
      "color-avatar-four-bg-fill": "rgba(81, 192, 255, 1)",
      "color-avatar-four-text-on-bg-fill": "rgba(0, 33, 51, 1)",
      "color-avatar-one-bg-fill": "rgba(197, 48, 197, 1)",
      "color-avatar-one-text-on-bg-fill": "rgba(253, 239, 253, 1)",
      "color-avatar-seven-bg-fill": "rgba(148, 116, 255, 1)",
      "color-avatar-seven-text-on-bg-fill": "rgba(248, 247, 255, 1)",
      "color-avatar-six-bg-fill": "rgba(37, 232, 43, 1)",
      "color-avatar-six-text-on-bg-fill": "rgba(3, 61, 5, 1)",
      "color-avatar-text-on-bg-fill": "rgba(255, 255, 255, 1)",
      "color-avatar-three-bg-fill": "rgba(44, 224, 212, 1)",
      "color-avatar-three-text-on-bg-fill": "rgba(3, 60, 57, 1)",
      "color-avatar-two-bg-fill": "rgba(56, 250, 163, 1)",
      "color-avatar-two-text-on-bg-fill": "rgba(12, 81, 50, 1)",
      "color-backdrop-bg": "rgba(0, 0, 0, 0.71)",
      "color-button-gradient-bg-fill": "linear-gradient(180deg, rgba(48, 48, 48, 0) 63.53%, rgba(255, 255, 255, 0.15) 100%)",
      "color-checkbox-bg-surface-disabled": "rgba(0, 0, 0, 0.08)",
      "color-checkbox-icon-disabled": "rgba(255, 255, 255, 1)",
      "color-input-bg-surface": "rgba(253, 253, 253, 1)",
      "color-input-bg-surface-hover": "rgba(250, 250, 250, 1)",
      "color-input-bg-surface-active": "rgba(247, 247, 247, 1)",
      "color-input-border": "rgba(138, 138, 138, 1)",
      "color-input-border-hover": "rgba(97, 97, 97, 1)",
      "color-input-border-active": "rgba(26, 26, 26, 1)",
      "color-nav-bg": "rgba(235, 235, 235, 1)",
      "color-nav-bg-surface": "rgba(0, 0, 0, 0.02)",
      "color-nav-bg-surface-hover": "rgba(241, 241, 241, 1)",
      "color-nav-bg-surface-active": "rgba(250, 250, 250, 1)",
      "color-nav-bg-surface-selected": "rgba(250, 250, 250, 1)",
      "color-radio-button-bg-surface-disabled": "rgba(0, 0, 0, 0.08)",
      "color-radio-button-icon-disabled": "rgba(255, 255, 255, 1)",
      "color-video-thumbnail-play-button-bg-fill-hover": "rgba(0, 0, 0, 0.81)",
      "color-video-thumbnail-play-button-bg-fill": "rgba(0, 0, 0, 0.71)",
      "color-video-thumbnail-play-button-text-on-bg-fill": "rgba(255, 255, 255, 1)",
      "color-scrollbar-thumb-bg-hover": "rgba(138, 138, 138, 1)"
    },
    font: {
      "font-family-sans": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "font-family-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace",
      "font-size-275": "0.6875rem",
      "font-size-300": "0.75rem",
      "font-size-325": "0.8125rem",
      "font-size-350": "0.875rem",
      "font-size-400": "1rem",
      "font-size-450": "1.125rem",
      "font-size-500": "1.25rem",
      "font-size-550": "1.375rem",
      "font-size-600": "1.5rem",
      "font-size-750": "1.875rem",
      "font-size-800": "2rem",
      "font-size-900": "2.25rem",
      "font-size-1000": "2.5rem",
      "font-weight-regular": "450",
      "font-weight-medium": "550",
      "font-weight-semibold": "650",
      "font-weight-bold": "700",
      "font-letter-spacing-densest": "-0.03375rem",
      "font-letter-spacing-denser": "-0.01875rem",
      "font-letter-spacing-dense": "-0.0125rem",
      "font-letter-spacing-normal": "0rem",
      "font-line-height-300": "0.75rem",
      "font-line-height-400": "1rem",
      "font-line-height-500": "1.25rem",
      "font-line-height-600": "1.5rem",
      "font-line-height-700": "1.75rem",
      "font-line-height-800": "2rem",
      "font-line-height-1000": "2.5rem",
      "font-line-height-1200": "3rem"
    },
    height: {
      "height-0": "0rem",
      "height-025": "0.0625rem",
      "height-050": "0.125rem",
      "height-100": "0.25rem",
      "height-150": "0.375rem",
      "height-200": "0.5rem",
      "height-300": "0.75rem",
      "height-400": "1rem",
      "height-500": "1.25rem",
      "height-600": "1.5rem",
      "height-700": "1.75rem",
      "height-800": "2rem",
      "height-900": "2.25rem",
      "height-1000": "2.5rem",
      "height-1200": "3rem",
      "height-1600": "4rem",
      "height-2000": "5rem",
      "height-2400": "6rem",
      "height-2800": "7rem",
      "height-3200": "8rem"
    },
    motion: {
      "motion-duration-0": "0ms",
      "motion-duration-50": "50ms",
      "motion-duration-100": "100ms",
      "motion-duration-150": "150ms",
      "motion-duration-200": "200ms",
      "motion-duration-250": "250ms",
      "motion-duration-300": "300ms",
      "motion-duration-350": "350ms",
      "motion-duration-400": "400ms",
      "motion-duration-450": "450ms",
      "motion-duration-500": "500ms",
      "motion-duration-5000": "5000ms",
      "motion-ease": "cubic-bezier(0.25, 0.1, 0.25, 1)",
      "motion-ease-in": "cubic-bezier(0.42, 0, 1, 1)",
      "motion-ease-out": "cubic-bezier(0.19, 0.91, 0.38, 1)",
      "motion-ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1)",
      "motion-linear": "cubic-bezier(0, 0, 1, 1)",
      "motion-keyframes-bounce": "{ from, 65%, 85% { transform: scale(1) } 75% { transform: scale(0.85) } 82.5% { transform: scale(1.05) } }",
      "motion-keyframes-fade-in": "{ to { opacity: 1 } }",
      "motion-keyframes-pulse": "{ from, 75% { transform: scale(0.85); opacity: 1; } to { transform: scale(2.5); opacity: 0; } }",
      "motion-keyframes-spin": "{ to { transform: rotate(1turn) } }",
      "motion-keyframes-appear-above": "{ from { transform: translateY(var(--p-space-100)); opacity: 0; } to { transform: none; opacity: 1; } }",
      "motion-keyframes-appear-below": "{ from { transform: translateY(calc(var(--p-space-100) * -1)); opacity: 0; } to { transform: none; opacity: 1; } }"
    },
    shadow: {
      "shadow-0": "none",
      "shadow-100": "0rem 0.0625rem 0rem 0rem rgba(26, 26, 26, 0.07)",
      "shadow-200": "0rem 0.1875rem 0.0625rem -0.0625rem rgba(26, 26, 26, 0.07)",
      "shadow-300": "0rem 0.25rem 0.375rem -0.125rem rgba(26, 26, 26, 0.20)",
      "shadow-400": "0rem 0.5rem 1rem -0.25rem rgba(26, 26, 26, 0.22)",
      "shadow-500": "0rem 0.75rem 1.25rem -0.5rem rgba(26, 26, 26, 0.24)",
      "shadow-600": "0rem 1.25rem 1.25rem -0.5rem rgba(26, 26, 26, 0.28)",
      "shadow-bevel-100": "0.0625rem 0rem 0rem 0rem rgba(204, 204, 204, 0.08) inset, -0.0625rem 0rem 0rem 0rem rgba(204, 204, 204, 0.08) inset, 0rem -0.0625rem 0rem 0rem rgba(204, 204, 204, 0.08) inset, 0rem 0.0625rem 0rem 0rem rgba(204, 204, 204, 0.16) inset",
      "shadow-inset-100": "0rem 0.0625rem 0.125rem 0rem rgba(26, 26, 26, 0.15) inset, 0rem 0.0625rem 0.0625rem 0rem rgba(26, 26, 26, 0.15) inset",
      "shadow-inset-200": "0rem 0.125rem 0.0625rem 0rem rgba(26, 26, 26, 0.20) inset, 0.0625rem 0rem 0.0625rem 0rem rgba(26, 26, 26, 0.12) inset, -0.0625rem 0rem 0.0625rem 0rem rgba(26, 26, 26, 0.12) inset",
      "shadow-button": "0rem -0.0625rem 0rem 0rem #b5b5b5 inset, 0rem 0rem 0rem 0.0625rem rgba(0, 0, 0, 0.1) inset, 0rem 0.03125rem 0rem 0.09375rem #FFF inset",
      "shadow-button-hover": "0rem 0.0625rem 0rem 0rem #EBEBEB inset, -0.0625rem 0rem 0rem 0rem #EBEBEB inset, 0.0625rem 0rem 0rem 0rem #EBEBEB inset, 0rem -0.0625rem 0rem 0rem #CCC inset",
      "shadow-button-inset": "-0.0625rem 0rem 0.0625rem 0rem rgba(26, 26, 26, 0.122) inset, 0.0625rem 0rem 0.0625rem 0rem rgba(26, 26, 26, 0.122) inset, 0rem 0.125rem 0.0625rem 0rem rgba(26, 26, 26, 0.2) inset",
      "shadow-button-primary": "0rem -0.0625rem 0rem 0.0625rem rgba(0, 0, 0, 0.8) inset, 0rem 0rem 0rem 0.0625rem rgba(48, 48, 48, 1) inset, 0rem 0.03125rem 0rem 0.09375rem rgba(255, 255, 255, 0.25) inset;",
      "shadow-button-primary-hover": "0rem 0.0625rem 0rem 0rem rgba(255, 255, 255, 0.24) inset, 0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, -0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, 0rem -0.0625rem 0rem 0rem #000 inset, 0rem -0.0625rem 0rem 0.0625rem #1A1A1A",
      "shadow-button-primary-inset": "0rem 0.1875rem 0rem 0rem rgb(0, 0, 0) inset",
      "shadow-button-primary-critical": "0rem -0.0625rem 0rem 0.0625rem rgba(142, 31, 11, 0.8) inset, 0rem 0rem 0rem 0.0625rem rgba(181, 38, 11, 0.8) inset, 0rem 0.03125rem 0rem 0.09375rem rgba(255, 255, 255, 0.349) inset",
      "shadow-button-primary-critical-hover": "0rem 0.0625rem 0rem 0rem rgba(255, 255, 255, 0.48) inset, 0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, -0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, 0rem -0.09375rem 0rem 0rem rgba(0, 0, 0, 0.25) inset",
      "shadow-button-primary-critical-inset": "-0.0625rem 0rem 0.0625rem 0rem rgba(0, 0, 0, 0.2) inset, 0.0625rem 0rem 0.0625rem 0rem rgba(0, 0, 0, 0.2) inset, 0rem 0.125rem 0rem 0rem rgba(0, 0, 0, 0.6) inset",
      "shadow-button-primary-success": "0rem -0.0625rem 0rem 0.0625rem rgba(12, 81, 50, 0.8) inset, 0rem 0rem 0rem 0.0625rem rgba(19, 111, 69, 0.8) inset, 0rem 0.03125rem 0rem 0.09375rem rgba(255, 255, 255, 0.251) inset",
      "shadow-button-primary-success-hover": "0rem 0.0625rem 0rem 0rem rgba(255, 255, 255, 0.48) inset, 0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, -0.0625rem 0rem 0rem 0rem rgba(255, 255, 255, 0.20) inset, 0rem -0.09375rem 0rem 0rem rgba(0, 0, 0, 0.25) inset",
      "shadow-button-primary-success-inset": "-0.0625rem 0rem 0.0625rem 0rem rgba(0, 0, 0, 0.2) inset, 0.0625rem 0rem 0.0625rem 0rem rgba(0, 0, 0, 0.2) inset, 0rem 0.125rem 0rem 0rem rgba(0, 0, 0, 0.6) inset",
      "shadow-border-inset": "0rem 0rem 0rem 0.0625rem rgba(0, 0, 0, 0.08) inset"
    },
    space: {
      "space-0": "0rem",
      "space-025": "0.0625rem",
      "space-050": "0.125rem",
      "space-100": "0.25rem",
      "space-150": "0.375rem",
      "space-200": "0.5rem",
      "space-300": "0.75rem",
      "space-400": "1rem",
      "space-500": "1.25rem",
      "space-600": "1.5rem",
      "space-800": "2rem",
      "space-1000": "2.5rem",
      "space-1200": "3rem",
      "space-1600": "4rem",
      "space-2000": "5rem",
      "space-2400": "6rem",
      "space-2800": "7rem",
      "space-3200": "8rem",
      "space-button-group-gap": "0.5rem",
      "space-card-gap": "1rem",
      "space-card-padding": "1rem",
      "space-table-cell-padding": "0.375rem"
    },
    text: {
      "text-heading-3xl-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-3xl-font-size": "2.25rem",
      "text-heading-3xl-font-weight": "700",
      "text-heading-3xl-font-letter-spacing": "-0.03375rem",
      "text-heading-3xl-font-line-height": "3rem",
      "text-heading-2xl-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-2xl-font-size": "1.875rem",
      "text-heading-2xl-font-weight": "700",
      "text-heading-2xl-font-letter-spacing": "-0.01875rem",
      "text-heading-2xl-font-line-height": "2.5rem",
      "text-heading-xl-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-xl-font-size": "1.5rem",
      "text-heading-xl-font-weight": "700",
      "text-heading-xl-font-letter-spacing": "-0.0125rem",
      "text-heading-xl-font-line-height": "2rem",
      "text-heading-lg-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-lg-font-size": "1.25rem",
      "text-heading-lg-font-weight": "650",
      "text-heading-lg-font-letter-spacing": "-0.0125rem",
      "text-heading-lg-font-line-height": "1.5rem",
      "text-heading-md-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-md-font-size": "0.875rem",
      "text-heading-md-font-weight": "650",
      "text-heading-md-font-letter-spacing": "0rem",
      "text-heading-md-font-line-height": "1.25rem",
      "text-heading-sm-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-sm-font-size": "0.8125rem",
      "text-heading-sm-font-weight": "650",
      "text-heading-sm-font-letter-spacing": "0rem",
      "text-heading-sm-font-line-height": "1.25rem",
      "text-heading-xs-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-heading-xs-font-size": "0.75rem",
      "text-heading-xs-font-weight": "650",
      "text-heading-xs-font-letter-spacing": "0rem",
      "text-heading-xs-font-line-height": "1rem",
      "text-body-lg-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-lg-font-size": "0.875rem",
      "text-body-lg-font-weight": "450",
      "text-body-lg-font-letter-spacing": "0rem",
      "text-body-lg-font-line-height": "1.25rem",
      "text-body-md-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-md-font-size": "0.8125rem",
      "text-body-md-font-weight": "450",
      "text-body-md-font-letter-spacing": "0rem",
      "text-body-md-font-line-height": "1.25rem",
      "text-body-sm-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-sm-font-size": "0.75rem",
      "text-body-sm-font-weight": "450",
      "text-body-sm-font-letter-spacing": "0rem",
      "text-body-sm-font-line-height": "1rem",
      "text-body-xs-font-family": "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
      "text-body-xs-font-size": "0.6875rem",
      "text-body-xs-font-weight": "450",
      "text-body-xs-font-letter-spacing": "0rem",
      "text-body-xs-font-line-height": "0.75rem"
    },
    width: {
      "width-0": "0rem",
      "width-025": "0.0625rem",
      "width-050": "0.125rem",
      "width-100": "0.25rem",
      "width-150": "0.375rem",
      "width-200": "0.5rem",
      "width-300": "0.75rem",
      "width-400": "1rem",
      "width-500": "1.25rem",
      "width-600": "1.5rem",
      "width-700": "1.75rem",
      "width-800": "2rem",
      "width-900": "2.25rem",
      "width-1000": "2.5rem",
      "width-1200": "3rem",
      "width-1600": "4rem",
      "width-2000": "5rem",
      "width-2400": "6rem",
      "width-2800": "7rem",
      "width-3200": "8rem"
    },
    zIndex: {
      "z-index-0": "auto",
      "z-index-1": "100",
      "z-index-2": "400",
      "z-index-3": "510",
      "z-index-4": "512",
      "z-index-5": "513",
      "z-index-6": "514",
      "z-index-7": "515",
      "z-index-8": "516",
      "z-index-9": "517",
      "z-index-10": "518",
      "z-index-11": "519",
      "z-index-12": "520"
    }
  }
}, themeDefault = themes[themeNameDefault], isTokenName = createIsTokenName(themes[themeNameDefault]);

// node_modules/@shopify/polaris/build/esm/utilities/use-theme.js
import { useContext, createContext } from "react";
var ThemeContext = /* @__PURE__ */ createContext(null), ThemeNameContext = /* @__PURE__ */ createContext(null);
function getTheme(themeName) {
  return themes[themeName];
}
function useTheme() {
  let theme = useContext(ThemeContext);
  if (!theme)
    throw new Error("No theme was provided. Your application must be wrapped in an <AppProvider> or <ThemeProvider> component. See https://polaris.shopify.com/components/app-provider for implementation instructions.");
  return theme;
}
function useThemeName() {
  let themeName = useContext(ThemeNameContext);
  if (!themeName)
    throw new Error("No themeName was provided. Your application must be wrapped in an <AppProvider> or <ThemeProvider> component. See https://polaris.shopify.com/components/app-provider for implementation instructions.");
  return themeName;
}

// node_modules/@shopify/polaris/build/esm/utilities/is-object.js
function isObject(value) {
  let type = typeof value;
  return value != null && (type === "object" || type === "function");
}

// node_modules/@shopify/polaris/build/esm/utilities/css.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function variationName(name, value) {
  return `${name}${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
function sanitizeCustomProperties(styles42) {
  let nonNullValues = Object.entries(styles42).filter(([_, value]) => value != null);
  return nonNullValues.length ? Object.fromEntries(nonNullValues) : void 0;
}
function getResponsiveProps(componentName, componentProp, tokenSubgroup, responsiveProp) {
  if (!responsiveProp)
    return {};
  let result;
  return isObject(responsiveProp) ? result = Object.fromEntries(Object.entries(responsiveProp).map(([breakpointAlias, aliasOrScale]) => [breakpointAlias, `var(--p-${tokenSubgroup}-${aliasOrScale})`])) : result = {
    [breakpointsAliases[0]]: `var(--p-${tokenSubgroup}-${responsiveProp})`
  }, Object.fromEntries(Object.entries(result).map(([breakpointAlias, value]) => [`--pc-${componentName}-${componentProp}-${breakpointAlias}`, value]));
}
function getResponsiveValue(componentName, componentProp, responsiveProp) {
  return responsiveProp ? isObject(responsiveProp) ? Object.fromEntries(Object.entries(responsiveProp).map(([breakpointAlias, responsiveValue]) => [`--pc-${componentName}-${componentProp}-${breakpointAlias}`, responsiveValue])) : {
    [`--pc-${componentName}-${componentProp}-${breakpointsAliases[0]}`]: responsiveProp
  } : {};
}

// node_modules/@shopify/polaris/build/esm/components/ThemeProvider/ThemeProvider.css.js
var styles = {
  themeContainer: "Polaris-ThemeProvider--themeContainer"
};

// node_modules/@shopify/polaris/build/esm/components/ThemeProvider/ThemeProvider.js
var themeNamesLocal = ["light", "dark-experimental"], isThemeNameLocal = (name) => themeNamesLocal.includes(name);
function ThemeProvider(props) {
  let {
    as: ThemeContainer = "div",
    children,
    className,
    theme: themeName = themeNameDefault
  } = props;
  return /* @__PURE__ */ React.createElement(ThemeNameContext.Provider, {
    value: themeName
  }, /* @__PURE__ */ React.createElement(ThemeContext.Provider, {
    value: getTheme(themeName)
  }, /* @__PURE__ */ React.createElement(ThemeContainer, {
    "data-portal-id": props["data-portal-id"],
    className: classNames(createThemeClassName(themeName), styles.themeContainer, className)
  }, children)));
}

// node_modules/@shopify/polaris/build/esm/utilities/within-content-context.js
import { createContext as createContext2 } from "react";
var WithinContentContext = /* @__PURE__ */ createContext2(!1);

// node_modules/@shopify/polaris/build/esm/utilities/use-event-listener.js
import { useRef, useEffect as useEffect2 } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/use-isomorphic-layout-effect.js
import { useEffect, useLayoutEffect } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/target.js
var isServer = typeof window > "u" || typeof document > "u";

// node_modules/@shopify/polaris/build/esm/utilities/use-isomorphic-layout-effect.js
var useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect;

// node_modules/@shopify/polaris/build/esm/utilities/use-event-listener.js
function useEventListener(eventName, handler, target, options) {
  let handlerRef = useRef(handler), optionsRef = useRef(options);
  useIsomorphicLayoutEffect(() => {
    handlerRef.current = handler;
  }, [handler]), useIsomorphicLayoutEffect(() => {
    optionsRef.current = options;
  }, [options]), useEffect2(() => {
    if (!(typeof eventName == "string" && target !== null))
      return;
    let targetElement;
    if (typeof target > "u")
      targetElement = window;
    else if ("current" in target) {
      if (target.current === null)
        return;
      targetElement = target.current;
    } else
      targetElement = target;
    let eventOptions = optionsRef.current, eventListener = (event) => handlerRef.current(event);
    return targetElement.addEventListener(eventName, eventListener, eventOptions), () => {
      targetElement.removeEventListener(eventName, eventListener, eventOptions);
    };
  }, [eventName, target]);
}

// node_modules/@shopify/polaris/build/esm/utilities/breakpoints.js
import { useState } from "react";
var Breakpoints = {
  // TODO: Update to smDown
  navigationBarCollapsed: "767.95px",
  // TODO: Update to lgDown
  stackedContent: "1039.95px"
}, noWindowMatches = {
  media: "",
  addListener: noop,
  removeListener: noop,
  matches: !1,
  onchange: noop,
  addEventListener: noop,
  removeEventListener: noop,
  dispatchEvent: (_) => !0
};
function noop() {
}
function navigationBarCollapsed() {
  return typeof window > "u" ? noWindowMatches : window.matchMedia(`(max-width: ${Breakpoints.navigationBarCollapsed})`);
}
function stackedContent() {
  return typeof window > "u" ? noWindowMatches : window.matchMedia(`(max-width: ${Breakpoints.stackedContent})`);
}
var breakpointsQueryEntries = getBreakpointsQueryEntries(themeDefault.breakpoints);
function getMatches(defaults, forceDefaults) {
  return Object.fromEntries(!isServer && !forceDefaults ? breakpointsQueryEntries.map(([directionAlias, query]) => [directionAlias, window.matchMedia(query).matches]) : typeof defaults == "object" && defaults !== null ? breakpointsQueryEntries.map(([directionAlias]) => [directionAlias, defaults[directionAlias] ?? !1]) : breakpointsQueryEntries.map(([directionAlias]) => [directionAlias, defaults ?? !1]));
}
function useBreakpoints(options) {
  let [breakpoints2, setBreakpoints] = useState(getMatches(options?.defaults, !0));
  return useIsomorphicLayoutEffect(() => {
    let mediaQueryLists = breakpointsQueryEntries.map(([_, query]) => window.matchMedia(query)), handler = () => setBreakpoints(getMatches());
    return mediaQueryLists.forEach((mql) => {
      mql.addListener ? mql.addListener(handler) : mql.addEventListener("change", handler);
    }), handler(), () => {
      mediaQueryLists.forEach((mql) => {
        mql.removeListener ? mql.removeListener(handler) : mql.removeEventListener("change", handler);
      });
    };
  }, []), breakpoints2;
}
function getBreakpointsQueryEntries(breakpoints2) {
  return Object.entries(getMediaConditions(breakpoints2)).map(([breakpointsToken, mediaConditions]) => Object.entries(mediaConditions).map(([direction, mediaCondition]) => [`${breakpointsToken.split("-")[1]}${capitalize(direction)}`, mediaCondition])).flat();
}
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// node_modules/@shopify/polaris/build/esm/components/AppProvider/AppProvider.js
import React7, { Component } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/debounce.js
function debounce(func, waitArg, options) {
  let lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = !1, maxing = !1, trailing = !0, useRAF = !waitArg && waitArg !== 0;
  if (typeof func != "function")
    throw new TypeError("Expected a function");
  let wait = waitArg || 0;
  typeof options == "object" && (leading = Boolean(options.leading), maxing = "maxWait" in options, maxWait = maxing ? Math.max(Number(options.maxWait) || 0, wait) : void 0, trailing = "trailing" in options ? Boolean(options.trailing) : trailing);
  function invokeFunc(time) {
    let args = lastArgs, thisArg = lastThis;
    return lastArgs = void 0, lastThis = void 0, lastInvokeTime = time, result = func.apply(thisArg, args), result;
  }
  function startTimer(pendingFunc, wait2) {
    return useRAF ? (cancelAnimationFrame(timerId), requestAnimationFrame(pendingFunc)) : setTimeout(pendingFunc, wait2);
  }
  function cancelTimer(id) {
    if (useRAF)
      return cancelAnimationFrame(id);
    clearTimeout(id);
  }
  function leadingEdge(time) {
    return lastInvokeTime = time, timerId = startTimer(timerExpired, wait), leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    let timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
    return maxing && maxWait ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }
  function shouldInvoke(time) {
    let timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && maxWait && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    let time = Date.now();
    if (shouldInvoke(time))
      return trailingEdge(time);
    timerId = startTimer(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    return timerId = void 0, trailing && lastArgs ? invokeFunc(time) : (lastArgs = lastThis = void 0, result);
  }
  function cancel() {
    timerId !== void 0 && cancelTimer(timerId), lastInvokeTime = 0, lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(Date.now());
  }
  function pending() {
    return timerId !== void 0;
  }
  function debounced(...args) {
    let time = Date.now(), isInvoking = shouldInvoke(time);
    if (lastArgs = args, lastThis = this, lastCallTime = time, isInvoking) {
      if (timerId === void 0)
        return leadingEdge(lastCallTime);
      if (maxing)
        return timerId = startTimer(timerExpired, wait), invokeFunc(lastCallTime);
    }
    return timerId === void 0 && (timerId = startTimer(timerExpired, wait)), result;
  }
  return debounced.cancel = cancel, debounced.flush = flush, debounced.pending = pending, debounced;
}

// node_modules/@shopify/polaris/build/esm/utilities/geometry.js
var Rect = class {
  static get zero() {
    return new Rect();
  }
  constructor({
    top = 0,
    left = 0,
    width: width2 = 0,
    height: height2 = 0
  } = {}) {
    this.top = top, this.left = left, this.width = width2, this.height = height2;
  }
  get center() {
    return {
      x: this.left + this.width / 2,
      y: this.top + this.height / 2
    };
  }
};
function getRectForNode(node) {
  if (!(node instanceof Element))
    return new Rect({
      width: window.innerWidth,
      height: window.innerHeight
    });
  let rect = node.getBoundingClientRect();
  return new Rect({
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height
  });
}

// node_modules/@shopify/polaris/build/esm/utilities/sticky-manager/sticky-manager.js
var SIXTY_FPS = 1e3 / 60, StickyManager = class {
  constructor(container) {
    this.stickyItems = [], this.stuckItems = [], this.container = null, this.topBarOffset = 0, this.handleResize = debounce(() => {
      this.manageStickyItems();
    }, SIXTY_FPS, {
      leading: !0,
      trailing: !0,
      maxWait: SIXTY_FPS
    }), this.handleScroll = debounce(() => {
      this.manageStickyItems();
    }, SIXTY_FPS, {
      leading: !0,
      trailing: !0,
      maxWait: SIXTY_FPS
    }), container && this.setContainer(container);
  }
  registerStickyItem(stickyItem) {
    this.stickyItems.push(stickyItem);
  }
  unregisterStickyItem(nodeToRemove) {
    let nodeIndex = this.stickyItems.findIndex(({
      stickyNode
    }) => nodeToRemove === stickyNode);
    this.stickyItems.splice(nodeIndex, 1);
  }
  setContainer(el) {
    this.container = el, isDocument(el) && this.setTopBarOffset(el), this.container.addEventListener("scroll", this.handleScroll), window.addEventListener("resize", this.handleResize), this.manageStickyItems();
  }
  removeScrollListener() {
    this.container && (this.container.removeEventListener("scroll", this.handleScroll), window.removeEventListener("resize", this.handleResize));
  }
  manageStickyItems() {
    if (this.stickyItems.length <= 0)
      return;
    let scrollTop = this.container ? scrollTopFor(this.container) : 0, containerTop = getRectForNode(this.container).top + this.topBarOffset;
    this.stickyItems.forEach((stickyItem) => {
      let {
        handlePositioning
      } = stickyItem, {
        sticky,
        top,
        left,
        width: width2
      } = this.evaluateStickyItem(stickyItem, scrollTop, containerTop);
      this.updateStuckItems(stickyItem, sticky), handlePositioning(sticky, top, left, width2);
    });
  }
  evaluateStickyItem(stickyItem, scrollTop, containerTop) {
    let {
      stickyNode,
      placeHolderNode,
      boundingElement,
      offset,
      disableWhenStacked
    } = stickyItem;
    if (disableWhenStacked && stackedContent().matches)
      return {
        sticky: !1,
        top: 0,
        left: 0,
        width: "auto"
      };
    let stickyOffset = offset ? this.getOffset(stickyNode) + parseInt(
      // Important: This will not update when the active theme changes.
      // Update this to `useTheme` once converted to a function component.
      themeDefault.space["space-500"],
      10
    ) : this.getOffset(stickyNode), scrollPosition2 = scrollTop + stickyOffset, placeHolderNodeCurrentTop = placeHolderNode.getBoundingClientRect().top - containerTop + scrollTop, top = containerTop + stickyOffset, width2 = placeHolderNode.getBoundingClientRect().width, left = placeHolderNode.getBoundingClientRect().left, sticky;
    if (boundingElement == null)
      sticky = scrollPosition2 >= placeHolderNodeCurrentTop;
    else {
      let stickyItemHeight = stickyNode.getBoundingClientRect().height || stickyNode.firstElementChild?.getBoundingClientRect().height || 0, stickyItemBottomPosition = boundingElement.getBoundingClientRect().bottom - stickyItemHeight + scrollTop - containerTop;
      sticky = scrollPosition2 >= placeHolderNodeCurrentTop && scrollPosition2 < stickyItemBottomPosition;
    }
    return {
      sticky,
      top,
      left,
      width: width2
    };
  }
  updateStuckItems(item, sticky) {
    let {
      stickyNode
    } = item;
    sticky && !this.isNodeStuck(stickyNode) ? this.addStuckItem(item) : !sticky && this.isNodeStuck(stickyNode) && this.removeStuckItem(item);
  }
  addStuckItem(stickyItem) {
    this.stuckItems.push(stickyItem);
  }
  removeStuckItem(stickyItem) {
    let {
      stickyNode: nodeToRemove
    } = stickyItem, nodeIndex = this.stuckItems.findIndex(({
      stickyNode
    }) => nodeToRemove === stickyNode);
    this.stuckItems.splice(nodeIndex, 1);
  }
  getOffset(node) {
    if (this.stuckItems.length === 0)
      return 0;
    let offset = 0, count = 0, stuckNodesLength = this.stuckItems.length, nodeRect = getRectForNode(node);
    for (; count < stuckNodesLength; ) {
      let stuckNode = this.stuckItems[count].stickyNode;
      if (stuckNode !== node) {
        let stuckNodeRect = getRectForNode(stuckNode);
        horizontallyOverlaps(nodeRect, stuckNodeRect) || (offset += getRectForNode(stuckNode).height);
      } else
        break;
      count++;
    }
    return offset;
  }
  isNodeStuck(node) {
    return this.stuckItems.findIndex(({
      stickyNode
    }) => node === stickyNode) >= 0;
  }
  setTopBarOffset(container) {
    let topbarElement = container.querySelector(`:not(${scrollable.selector}) ${dataPolarisTopBar.selector}`);
    this.topBarOffset = topbarElement ? topbarElement.clientHeight : 0;
  }
};
function isDocument(node) {
  return node === document;
}
function scrollTopFor(container) {
  return isDocument(container) ? document.body.scrollTop || document.documentElement.scrollTop : container.scrollTop;
}
function horizontallyOverlaps(rect1, rect2) {
  let rect1Left = rect1.left, rect1Right = rect1.left + rect1.width, rect2Left = rect2.left;
  return rect2.left + rect2.width < rect1Left || rect1Right < rect2Left;
}

// node_modules/@shopify/polaris/build/esm/utilities/scroll-lock-manager/scroll-lock-manager.js
var SCROLL_LOCKING_ATTRIBUTE = "data-lock-scrolling", SCROLL_LOCKING_HIDDEN_ATTRIBUTE = "data-lock-scrolling-hidden", SCROLL_LOCKING_WRAPPER_ATTRIBUTE = "data-lock-scrolling-wrapper", scrollPosition = 0;
function isScrollBarVisible() {
  let {
    body
  } = document;
  return body.scrollHeight > body.clientHeight;
}
var ScrollLockManager = class {
  constructor() {
    this.scrollLocks = 0, this.locked = !1;
  }
  registerScrollLock() {
    this.scrollLocks += 1, this.handleScrollLocking();
  }
  unregisterScrollLock() {
    this.scrollLocks -= 1, this.handleScrollLocking();
  }
  handleScrollLocking() {
    if (isServer)
      return;
    let {
      scrollLocks
    } = this, {
      body
    } = document, wrapper = body.firstElementChild;
    scrollLocks === 0 ? (body.removeAttribute(SCROLL_LOCKING_ATTRIBUTE), body.removeAttribute(SCROLL_LOCKING_HIDDEN_ATTRIBUTE), wrapper && wrapper.removeAttribute(SCROLL_LOCKING_WRAPPER_ATTRIBUTE), window.scroll(0, scrollPosition), this.locked = !1) : scrollLocks > 0 && !this.locked && (scrollPosition = window.pageYOffset, body.setAttribute(SCROLL_LOCKING_ATTRIBUTE, ""), isScrollBarVisible() || body.setAttribute(SCROLL_LOCKING_HIDDEN_ATTRIBUTE, ""), wrapper && (wrapper.setAttribute(SCROLL_LOCKING_WRAPPER_ATTRIBUTE, ""), wrapper.scrollTop = scrollPosition), this.locked = !0);
  }
  resetScrollPosition() {
    scrollPosition = 0;
  }
};

// node_modules/@shopify/polaris/build/esm/utilities/get.js
var OBJECT_NOTATION_MATCHER = /\[(.*?)\]|(\w+)/g;
function get(obj, keypath, defaultValue) {
  if (obj == null)
    return;
  let keys = Array.isArray(keypath) ? keypath : getKeypath(keypath), acc = obj;
  for (let i = 0; i < keys.length; i++) {
    let val = acc[keys[i]];
    if (val === void 0)
      return defaultValue;
    acc = val;
  }
  return acc;
}
function getKeypath(str) {
  let path = [], result;
  for (; result = OBJECT_NOTATION_MATCHER.exec(str); ) {
    let [, first, second] = result;
    path.push(first || second);
  }
  return path;
}

// node_modules/@shopify/polaris/build/esm/utilities/merge.js
function merge(...objs) {
  let final = {};
  for (let obj of objs)
    final = mergeRecursively(final, obj);
  return final;
}
function mergeRecursively(inputObjA, objB) {
  let objA = Array.isArray(inputObjA) ? [...inputObjA] : {
    ...inputObjA
  };
  for (let key in objB)
    if (Object.prototype.hasOwnProperty.call(objB, key))
      isMergeableValue(objB[key]) && isMergeableValue(objA[key]) ? objA[key] = mergeRecursively(objA[key], objB[key]) : objA[key] = objB[key];
    else
      continue;
  return objA;
}
function isMergeableValue(value) {
  return value !== null && typeof value == "object";
}

// node_modules/@shopify/polaris/build/esm/utilities/i18n/I18n.js
var REPLACE_REGEX = /{([^}]*)}/g, I18n = class {
  /**
   * @param translation A locale object or array of locale objects that overrides default translations. If specifying an array then your desired language dictionary should come first, followed by your fallback language dictionaries
   */
  constructor(translation) {
    this.translation = {}, this.translation = Array.isArray(translation) ? merge(...translation.slice().reverse()) : translation;
  }
  translate(id, replacements) {
    let text2 = get(this.translation, id, "");
    return text2 ? replacements ? text2.replace(REPLACE_REGEX, (match) => {
      let replacement = match.substring(1, match.length - 1);
      if (replacements[replacement] === void 0) {
        let replacementData = JSON.stringify(replacements);
        throw new Error(`Error in translation for key '${id}'. No replacement found for key '${replacement}'. The following replacements were passed: '${replacementData}'`);
      }
      return replacements[replacement];
    }) : text2 : "";
  }
  translationKeyExists(path) {
    return Boolean(get(this.translation, path));
  }
};

// node_modules/@shopify/polaris/build/esm/utilities/features/context.js
import { createContext as createContext3 } from "react";
var FeaturesContext = /* @__PURE__ */ createContext3(void 0);

// node_modules/@shopify/polaris/build/esm/utilities/i18n/context.js
import { createContext as createContext4 } from "react";
var I18nContext = /* @__PURE__ */ createContext4(void 0);

// node_modules/@shopify/polaris/build/esm/utilities/scroll-lock-manager/context.js
import { createContext as createContext5 } from "react";
var ScrollLockManagerContext = /* @__PURE__ */ createContext5(void 0);

// node_modules/@shopify/polaris/build/esm/utilities/sticky-manager/context.js
import { createContext as createContext6 } from "react";
var StickyManagerContext = /* @__PURE__ */ createContext6(void 0);

// node_modules/@shopify/polaris/build/esm/utilities/link/context.js
import { createContext as createContext7 } from "react";
var LinkContext = /* @__PURE__ */ createContext7(void 0);

// node_modules/@shopify/polaris/build/esm/components/MediaQueryProvider/MediaQueryProvider.js
import React2, { useState as useState2, useCallback, useEffect as useEffect3, useMemo } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/media-query/context.js
import { createContext as createContext8 } from "react";
var MediaQueryContext = /* @__PURE__ */ createContext8(void 0);

// node_modules/@shopify/polaris/build/esm/components/EventListener/EventListener.js
import { PureComponent } from "react";
var EventListener = class extends PureComponent {
  componentDidMount() {
    this.attachListener();
  }
  componentDidUpdate({
    passive,
    ...detachProps
  }) {
    this.detachListener(detachProps), this.attachListener();
  }
  componentWillUnmount() {
    this.detachListener();
  }
  render() {
    return null;
  }
  attachListener() {
    let {
      event,
      handler,
      capture,
      passive
    } = this.props;
    window.addEventListener(event, handler, {
      capture,
      passive
    });
  }
  detachListener(prevProps) {
    let {
      event,
      handler,
      capture
    } = prevProps || this.props;
    window.removeEventListener(event, handler, capture);
  }
};

// node_modules/@shopify/polaris/build/esm/components/MediaQueryProvider/MediaQueryProvider.js
var MediaQueryProvider = function({
  children
}) {
  let [isNavigationCollapsed, setIsNavigationCollapsed] = useState2(navigationBarCollapsed().matches), handleResize = useCallback(debounce(() => {
    isNavigationCollapsed !== navigationBarCollapsed().matches && setIsNavigationCollapsed(!isNavigationCollapsed);
  }, 40, {
    trailing: !0,
    leading: !0,
    maxWait: 40
  }), [isNavigationCollapsed]);
  useEffect3(() => {
    setIsNavigationCollapsed(navigationBarCollapsed().matches);
  }, []);
  let context = useMemo(() => ({
    isNavigationCollapsed
  }), [isNavigationCollapsed]);
  return /* @__PURE__ */ React2.createElement(MediaQueryContext.Provider, {
    value: context
  }, /* @__PURE__ */ React2.createElement(EventListener, {
    event: "resize",
    handler: handleResize
  }), children);
};

// node_modules/@shopify/polaris/build/esm/components/PortalsManager/PortalsManager.js
import React4, { useRef as useRef2, useMemo as useMemo2 } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/use-is-after-initial-mount.js
import { useState as useState3, useEffect as useEffect4 } from "react";
function useIsAfterInitialMount() {
  let [isAfterInitialMount, setIsAfterInitialMount] = useState3(!1);
  return useEffect4(() => {
    setIsAfterInitialMount(!0);
  }, []), isAfterInitialMount;
}

// node_modules/@shopify/polaris/build/esm/utilities/portals/context.js
import { createContext as createContext9 } from "react";
var PortalsManagerContext = /* @__PURE__ */ createContext9(void 0);

// node_modules/@shopify/polaris/build/esm/components/PortalsManager/components/PortalsContainer/PortalsContainer.js
import React3, { forwardRef } from "react";
function PortalsContainerComponent(_props, ref) {
  return /* @__PURE__ */ React3.createElement("div", {
    id: "PolarisPortalsContainer",
    ref
  });
}
var PortalsContainer = /* @__PURE__ */ forwardRef(PortalsContainerComponent);

// node_modules/@shopify/polaris/build/esm/components/PortalsManager/PortalsManager.js
function PortalsManager({
  children,
  container
}) {
  let isMounted = useIsAfterInitialMount(), ref = useRef2(null), contextValue = useMemo2(() => container ? {
    container
  } : isMounted ? {
    container: ref.current
  } : {
    container: null
  }, [container, isMounted]);
  return /* @__PURE__ */ React4.createElement(PortalsManagerContext.Provider, {
    value: contextValue
  }, children, container ? null : /* @__PURE__ */ React4.createElement(PortalsContainer, {
    ref
  }));
}

// node_modules/@shopify/polaris/build/esm/components/FocusManager/FocusManager.js
import React5, { useState as useState4, useCallback as useCallback2, useMemo as useMemo3 } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/focus-manager/context.js
import { createContext as createContext10 } from "react";
var FocusManagerContext = /* @__PURE__ */ createContext10(void 0);

// node_modules/@shopify/polaris/build/esm/components/FocusManager/FocusManager.js
function FocusManager({
  children
}) {
  let [trapFocusList, setTrapFocusList] = useState4([]), add = useCallback2((id) => {
    setTrapFocusList((list) => [...list, id]);
  }, []), remove = useCallback2((id) => {
    let removed = !0;
    return setTrapFocusList((list) => {
      let clone = [...list], index = clone.indexOf(id);
      return index === -1 ? removed = !1 : clone.splice(index, 1), clone;
    }), removed;
  }, []), value = useMemo3(() => ({
    trapFocusList,
    add,
    remove
  }), [add, trapFocusList, remove]);
  return /* @__PURE__ */ React5.createElement(FocusManagerContext.Provider, {
    value
  }, children);
}

// node_modules/@shopify/polaris/build/esm/components/EphemeralPresenceManager/EphemeralPresenceManager.js
import React6, { useState as useState5, useCallback as useCallback3, useMemo as useMemo4 } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/ephemeral-presence-manager/context.js
import { createContext as createContext11 } from "react";
var EphemeralPresenceManagerContext = /* @__PURE__ */ createContext11(void 0);

// node_modules/@shopify/polaris/build/esm/components/EphemeralPresenceManager/EphemeralPresenceManager.js
var defaultState = {
  tooltip: 0,
  hovercard: 0
};
function EphemeralPresenceManager({
  children
}) {
  let [presenceCounter, setPresenceCounter] = useState5(defaultState), addPresence = useCallback3((key) => {
    setPresenceCounter((prevList) => ({
      ...prevList,
      [key]: prevList[key] + 1
    }));
  }, []), removePresence = useCallback3((key) => {
    setPresenceCounter((prevList) => ({
      ...prevList,
      [key]: prevList[key] - 1
    }));
  }, []), value = useMemo4(() => ({
    presenceList: Object.entries(presenceCounter).reduce((previousValue, currentValue) => {
      let [key, value2] = currentValue;
      return {
        ...previousValue,
        [key]: value2 >= 1
      };
    }, {}),
    presenceCounter,
    addPresence,
    removePresence
  }), [addPresence, removePresence, presenceCounter]);
  return /* @__PURE__ */ React6.createElement(EphemeralPresenceManagerContext.Provider, {
    value
  }, children);
}

// node_modules/@shopify/polaris/build/esm/components/AppProvider/AppProvider.js
var MAX_SCROLLBAR_WIDTH = 20, SCROLLBAR_TEST_ELEMENT_PARENT_SIZE = 30, SCROLLBAR_TEST_ELEMENT_CHILD_SIZE = SCROLLBAR_TEST_ELEMENT_PARENT_SIZE + 10;
function measureScrollbars() {
  let parentEl = document.createElement("div");
  parentEl.setAttribute("style", `position: absolute; opacity: 0; transform: translate3d(-9999px, -9999px, 0); pointer-events: none; width:${SCROLLBAR_TEST_ELEMENT_PARENT_SIZE}px; height:${SCROLLBAR_TEST_ELEMENT_PARENT_SIZE}px;`);
  let child = document.createElement("div");
  child.setAttribute("style", `width:100%; height: ${SCROLLBAR_TEST_ELEMENT_CHILD_SIZE}; overflow:scroll; scrollbar-width: thin;`), parentEl.appendChild(child), document.body.appendChild(parentEl);
  let scrollbarWidth = SCROLLBAR_TEST_ELEMENT_PARENT_SIZE - (parentEl.firstElementChild?.clientWidth ?? 0), scrollbarWidthWithSafetyHatch = Math.min(scrollbarWidth, MAX_SCROLLBAR_WIDTH);
  document.documentElement.style.setProperty("--pc-app-provider-scrollbar-width", `${scrollbarWidthWithSafetyHatch}px`), document.body.removeChild(parentEl);
}
var AppProvider = class extends Component {
  constructor(props) {
    super(props), this.setBodyStyles = () => {
      document.body.style.backgroundColor = "var(--p-color-bg)", document.body.style.color = "var(--p-color-text)";
    }, this.setRootAttributes = () => {
      let activeThemeName = this.getThemeName();
      themeNames.forEach((themeName) => {
        document.documentElement.classList.toggle(createThemeClassName(themeName), themeName === activeThemeName);
      });
    }, this.getThemeName = () => this.props.theme ?? themeNameDefault, this.stickyManager = new StickyManager(), this.scrollLockManager = new ScrollLockManager();
    let {
      i18n,
      linkComponent
    } = this.props;
    this.state = {
      link: linkComponent,
      intl: new I18n(i18n)
    };
  }
  componentDidMount() {
    if (document != null) {
      this.stickyManager.setContainer(document), this.setBodyStyles(), this.setRootAttributes();
      let isSafari16 = navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome") && (navigator.userAgent.includes("Version/16.1") || navigator.userAgent.includes("Version/16.2") || navigator.userAgent.includes("Version/16.3")), isMobileApp16 = navigator.userAgent.includes("Shopify Mobile/iOS") && (navigator.userAgent.includes("OS 16_1") || navigator.userAgent.includes("OS 16_2") || navigator.userAgent.includes("OS 16_3"));
      (isSafari16 || isMobileApp16) && document.documentElement.classList.add("Polaris-Safari-16-Font-Optical-Sizing-Patch");
    }
    measureScrollbars();
  }
  componentDidUpdate({
    i18n: prevI18n,
    linkComponent: prevLinkComponent
  }) {
    let {
      i18n,
      linkComponent
    } = this.props;
    this.setRootAttributes(), !(i18n === prevI18n && linkComponent === prevLinkComponent) && this.setState({
      link: linkComponent,
      intl: new I18n(i18n)
    });
  }
  render() {
    let {
      children,
      features
    } = this.props, themeName = this.getThemeName(), {
      intl,
      link
    } = this.state;
    return /* @__PURE__ */ React7.createElement(ThemeNameContext.Provider, {
      value: themeName
    }, /* @__PURE__ */ React7.createElement(ThemeContext.Provider, {
      value: getTheme(themeName)
    }, /* @__PURE__ */ React7.createElement(FeaturesContext.Provider, {
      value: features
    }, /* @__PURE__ */ React7.createElement(I18nContext.Provider, {
      value: intl
    }, /* @__PURE__ */ React7.createElement(ScrollLockManagerContext.Provider, {
      value: this.scrollLockManager
    }, /* @__PURE__ */ React7.createElement(StickyManagerContext.Provider, {
      value: this.stickyManager
    }, /* @__PURE__ */ React7.createElement(LinkContext.Provider, {
      value: link
    }, /* @__PURE__ */ React7.createElement(MediaQueryProvider, null, /* @__PURE__ */ React7.createElement(PortalsManager, null, /* @__PURE__ */ React7.createElement(FocusManager, null, /* @__PURE__ */ React7.createElement(EphemeralPresenceManager, null, children)))))))))));
  }
};

// node_modules/@shopify/polaris/build/esm/components/Button/utils.js
import React31 from "react";

// node_modules/@shopify/polaris/build/esm/components/Button/Button.js
import React30 from "react";

// node_modules/@shopify/polaris-icons/dist/icons/AlertCircleIcon.svg.mjs
import React8 from "react";
var SvgAlertCircleIcon = function(props) {
  return /* @__PURE__ */ React8.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React8.createElement("path", {
    d: "M10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z"
  }), /* @__PURE__ */ React8.createElement("path", {
    d: "M11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
  }), /* @__PURE__ */ React8.createElement("path", {
    fillRule: "evenodd",
    d: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
  }));
};
SvgAlertCircleIcon.displayName = "AlertCircleIcon";

// node_modules/@shopify/polaris-icons/dist/icons/AlertDiamondIcon.svg.mjs
import React9 from "react";
var SvgAlertDiamondIcon = function(props) {
  return /* @__PURE__ */ React9.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React9.createElement("path", {
    d: "M10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z"
  }), /* @__PURE__ */ React9.createElement("path", {
    d: "M11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
  }), /* @__PURE__ */ React9.createElement("path", {
    fillRule: "evenodd",
    d: "M11.237 3.177a1.75 1.75 0 0 0-2.474 0l-5.586 5.585a1.75 1.75 0 0 0 0 2.475l5.586 5.586a1.75 1.75 0 0 0 2.474 0l5.586-5.586a1.75 1.75 0 0 0 0-2.475l-5.586-5.585Zm-1.414 1.06a.25.25 0 0 1 .354 0l5.586 5.586a.25.25 0 0 1 0 .354l-5.586 5.585a.25.25 0 0 1-.354 0l-5.586-5.585a.25.25 0 0 1 0-.354l5.586-5.586Z"
  }));
};
SvgAlertDiamondIcon.displayName = "AlertDiamondIcon";

// node_modules/@shopify/polaris-icons/dist/icons/AlertTriangleIcon.svg.mjs
import React10 from "react";
var SvgAlertTriangleIcon = function(props) {
  return /* @__PURE__ */ React10.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React10.createElement("path", {
    d: "M10 6.75a.75.75 0 0 1 .75.75v3.5a.75.75 0 1 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z"
  }), /* @__PURE__ */ React10.createElement("path", {
    d: "M11 13.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
  }), /* @__PURE__ */ React10.createElement("path", {
    fillRule: "evenodd",
    d: "M10 3.5c-1.045 0-1.784.702-2.152 1.447a449.26 449.26 0 0 1-2.005 3.847l-.028.052a403.426 403.426 0 0 0-2.008 3.856c-.372.752-.478 1.75.093 2.614.57.863 1.542 1.184 2.464 1.184h7.272c.922 0 1.895-.32 2.464-1.184.57-.864.465-1.862.093-2.614-.21-.424-1.113-2.147-2.004-3.847l-.032-.061a429.497 429.497 0 0 1-2.005-3.847c-.368-.745-1.107-1.447-2.152-1.447Zm-.808 2.112c.404-.816 1.212-.816 1.616 0 .202.409 1.112 2.145 2.022 3.88a418.904 418.904 0 0 1 2.018 3.875c.404.817 0 1.633-1.212 1.633h-7.272c-1.212 0-1.617-.816-1.212-1.633.202-.408 1.113-2.147 2.023-3.883a421.932 421.932 0 0 0 2.017-3.872Z"
  }));
};
SvgAlertTriangleIcon.displayName = "AlertTriangleIcon";

// node_modules/@shopify/polaris-icons/dist/icons/ArrowLeftIcon.svg.mjs
import React11 from "react";
var SvgArrowLeftIcon = function(props) {
  return /* @__PURE__ */ React11.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React11.createElement("path", {
    fillRule: "evenodd",
    d: "M16.5 10a.75.75 0 0 1-.75.75h-9.69l2.72 2.72a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 1 1 1.06 1.06l-2.72 2.72h9.69a.75.75 0 0 1 .75.75Z"
  }));
};
SvgArrowLeftIcon.displayName = "ArrowLeftIcon";

// node_modules/@shopify/polaris-icons/dist/icons/CheckIcon.svg.mjs
import React12 from "react";
var SvgCheckIcon = function(props) {
  return /* @__PURE__ */ React12.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React12.createElement("path", {
    fillRule: "evenodd",
    d: "M15.78 5.97a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 1 1 1.06-1.06l2.72 2.72 5.97-5.97a.75.75 0 0 1 1.06 0Z"
  }));
};
SvgCheckIcon.displayName = "CheckIcon";

// node_modules/@shopify/polaris-icons/dist/icons/ChevronDownIcon.svg.mjs
import React13 from "react";
var SvgChevronDownIcon = function(props) {
  return /* @__PURE__ */ React13.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React13.createElement("path", {
    fillRule: "evenodd",
    d: "M5.72 8.47a.75.75 0 0 1 1.06 0l3.47 3.47 3.47-3.47a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 0-1.06Z"
  }));
};
SvgChevronDownIcon.displayName = "ChevronDownIcon";

// node_modules/@shopify/polaris-icons/dist/icons/ChevronLeftIcon.svg.mjs
import React14 from "react";
var SvgChevronLeftIcon = function(props) {
  return /* @__PURE__ */ React14.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React14.createElement("path", {
    fillRule: "evenodd",
    d: "M11.764 5.204a.75.75 0 0 1 .032 1.06l-3.516 3.736 3.516 3.736a.75.75 0 1 1-1.092 1.028l-4-4.25a.75.75 0 0 1 0-1.028l4-4.25a.75.75 0 0 1 1.06-.032Z"
  }));
};
SvgChevronLeftIcon.displayName = "ChevronLeftIcon";

// node_modules/@shopify/polaris-icons/dist/icons/ChevronRightIcon.svg.mjs
import React15 from "react";
var SvgChevronRightIcon = function(props) {
  return /* @__PURE__ */ React15.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React15.createElement("path", {
    fillRule: "evenodd",
    d: "M7.72 14.53a.75.75 0 0 1 0-1.06l3.47-3.47-3.47-3.47a.75.75 0 0 1 1.06-1.06l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0Z"
  }));
};
SvgChevronRightIcon.displayName = "ChevronRightIcon";

// node_modules/@shopify/polaris-icons/dist/icons/ChevronUpIcon.svg.mjs
import React16 from "react";
var SvgChevronUpIcon = function(props) {
  return /* @__PURE__ */ React16.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React16.createElement("path", {
    fillRule: "evenodd",
    d: "M14.53 12.28a.75.75 0 0 1-1.06 0l-3.47-3.47-3.47 3.47a.75.75 0 0 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06Z"
  }));
};
SvgChevronUpIcon.displayName = "ChevronUpIcon";

// node_modules/@shopify/polaris-icons/dist/icons/InfoIcon.svg.mjs
import React17 from "react";
var SvgInfoIcon = function(props) {
  return /* @__PURE__ */ React17.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React17.createElement("path", {
    d: "M10 14a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-.75.75Z"
  }), /* @__PURE__ */ React17.createElement("path", {
    d: "M9 7a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
  }), /* @__PURE__ */ React17.createElement("path", {
    fillRule: "evenodd",
    d: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
  }));
};
SvgInfoIcon.displayName = "InfoIcon";

// node_modules/@shopify/polaris-icons/dist/icons/MenuHorizontalIcon.svg.mjs
import React18 from "react";
var SvgMenuHorizontalIcon = function(props) {
  return /* @__PURE__ */ React18.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React18.createElement("path", {
    d: "M6 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
  }), /* @__PURE__ */ React18.createElement("path", {
    d: "M11.5 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
  }), /* @__PURE__ */ React18.createElement("path", {
    d: "M17 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
  }));
};
SvgMenuHorizontalIcon.displayName = "MenuHorizontalIcon";

// node_modules/@shopify/polaris-icons/dist/icons/SearchIcon.svg.mjs
import React19 from "react";
var SvgSearchIcon = function(props) {
  return /* @__PURE__ */ React19.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React19.createElement("path", {
    fillRule: "evenodd",
    d: "M12.323 13.383a5.5 5.5 0 1 1 1.06-1.06l2.897 2.897a.75.75 0 1 1-1.06 1.06l-2.897-2.897Zm.677-4.383a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
  }));
};
SvgSearchIcon.displayName = "SearchIcon";

// node_modules/@shopify/polaris-icons/dist/icons/SelectIcon.svg.mjs
import React20 from "react";
var SvgSelectIcon = function(props) {
  return /* @__PURE__ */ React20.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React20.createElement("path", {
    d: "M10.884 4.323a1.25 1.25 0 0 0-1.768 0l-2.646 2.647a.75.75 0 0 0 1.06 1.06l2.47-2.47 2.47 2.47a.75.75 0 1 0 1.06-1.06l-2.646-2.647Z"
  }), /* @__PURE__ */ React20.createElement("path", {
    d: "m13.53 13.03-2.646 2.647a1.25 1.25 0 0 1-1.768 0l-2.646-2.647a.75.75 0 0 1 1.06-1.06l2.47 2.47 2.47-2.47a.75.75 0 0 1 1.06 1.06Z"
  }));
};
SvgSelectIcon.displayName = "SelectIcon";

// node_modules/@shopify/polaris-icons/dist/icons/SortAscendingIcon.svg.mjs
import React21 from "react";
var SvgSortAscendingIcon = function(props) {
  return /* @__PURE__ */ React21.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React21.createElement("path", {
    fillRule: "evenodd",
    d: "M9.116 4.323a1.25 1.25 0 0 1 1.768 0l2.646 2.647a.75.75 0 0 1-1.06 1.06l-2.47-2.47-2.47 2.47a.75.75 0 1 1-1.06-1.06l2.646-2.647Z"
  }), /* @__PURE__ */ React21.createElement("path", {
    fillOpacity: 0.33,
    fillRule: "evenodd",
    d: "M9.116 15.677a1.25 1.25 0 0 0 1.768 0l2.646-2.647a.75.75 0 0 0-1.06-1.06l-2.47 2.47-2.47-2.47a.75.75 0 0 0-1.06 1.06l2.646 2.647Z"
  }));
};
SvgSortAscendingIcon.displayName = "SortAscendingIcon";

// node_modules/@shopify/polaris-icons/dist/icons/SortDescendingIcon.svg.mjs
import React22 from "react";
var SvgSortDescendingIcon = function(props) {
  return /* @__PURE__ */ React22.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React22.createElement("path", {
    fillOpacity: 0.33,
    fillRule: "evenodd",
    d: "M9.116 4.823a1.25 1.25 0 0 1 1.768 0l2.646 2.647a.75.75 0 0 1-1.06 1.06l-2.47-2.47-2.47 2.47a.75.75 0 1 1-1.06-1.06l2.646-2.647Z"
  }), /* @__PURE__ */ React22.createElement("path", {
    fillRule: "evenodd",
    d: "M9.116 15.177a1.25 1.25 0 0 0 1.768 0l2.646-2.647a.75.75 0 0 0-1.06-1.06l-2.47 2.47-2.47-2.47a.75.75 0 0 0-1.06 1.06l2.646 2.647Z"
  }));
};
SvgSortDescendingIcon.displayName = "SortDescendingIcon";

// node_modules/@shopify/polaris-icons/dist/icons/XCircleIcon.svg.mjs
import React23 from "react";
var SvgXCircleIcon = function(props) {
  return /* @__PURE__ */ React23.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React23.createElement("path", {
    d: "M13.03 6.97a.75.75 0 0 1 0 1.06l-1.97 1.97 1.97 1.97a.75.75 0 1 1-1.06 1.06l-1.97-1.97-1.97 1.97a.75.75 0 0 1-1.06-1.06l1.97-1.97-1.97-1.97a.75.75 0 0 1 1.06-1.06l1.97 1.97 1.97-1.97a.75.75 0 0 1 1.06 0Z"
  }), /* @__PURE__ */ React23.createElement("path", {
    fillRule: "evenodd",
    d: "M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm0-1.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
  }));
};
SvgXCircleIcon.displayName = "XCircleIcon";

// node_modules/@shopify/polaris-icons/dist/icons/XIcon.svg.mjs
import React24 from "react";
var SvgXIcon = function(props) {
  return /* @__PURE__ */ React24.createElement("svg", Object.assign({
    viewBox: "0 0 20 20"
  }, props), /* @__PURE__ */ React24.createElement("path", {
    d: "M12.72 13.78a.75.75 0 1 0 1.06-1.06l-2.72-2.72 2.72-2.72a.75.75 0 0 0-1.06-1.06l-2.72 2.72-2.72-2.72a.75.75 0 0 0-1.06 1.06l2.72 2.72-2.72 2.72a.75.75 0 1 0 1.06 1.06l2.72-2.72 2.72 2.72Z"
  }));
};
SvgXIcon.displayName = "XIcon";

// node_modules/@shopify/polaris-icons/dist/index.mjs
import "react";

// node_modules/@shopify/polaris/build/esm/utilities/is-element-in-viewport.js
function isElementInViewport(element) {
  let {
    top,
    left,
    bottom,
    right
  } = element.getBoundingClientRect();
  return top >= 0 && right <= window.innerWidth && bottom <= window.innerHeight && left >= 0;
}

// node_modules/@shopify/polaris/build/esm/utilities/focus.js
var FOCUSABLE_SELECTOR = 'a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not([aria-disabled="true"]):not([tabindex="-1"]):not(:disabled),*[tabindex]', KEYBOARD_FOCUSABLE_SELECTORS = 'a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not([aria-disabled="true"]):not([tabindex="-1"]):not(:disabled),*[tabindex]:not([tabindex="-1"])', MENUITEM_FOCUSABLE_SELECTORS = 'a[role="menuitem"],frame[role="menuitem"],iframe[role="menuitem"],input[role="menuitem"]:not([type=hidden]):not(:disabled),select[role="menuitem"]:not(:disabled),textarea[role="menuitem"]:not(:disabled),button[role="menuitem"]:not(:disabled),*[tabindex]:not([tabindex="-1"])', handleMouseUpByBlurring = ({
  currentTarget
}) => currentTarget.blur();
function nextFocusableNode(node, filter) {
  let allFocusableElements = [...document.querySelectorAll(FOCUSABLE_SELECTOR)], sliceLocation = allFocusableElements.indexOf(node) + 1, focusableElementsAfterNode = allFocusableElements.slice(sliceLocation);
  for (let focusableElement of focusableElementsAfterNode)
    if (isElementInViewport(focusableElement) && (!filter || filter && filter(focusableElement)))
      return focusableElement;
  return null;
}
function findFirstFocusableNode(element, onlyDescendants = !0) {
  return !onlyDescendants && matches(element, FOCUSABLE_SELECTOR) ? element : element.querySelector(FOCUSABLE_SELECTOR);
}
function findFirstFocusableNodeIncludingDisabled(element) {
  let focusableSelector = "a,button,frame,iframe,input:not([type=hidden]),select,textarea,*[tabindex]";
  return matches(element, focusableSelector) ? element : element.querySelector(focusableSelector);
}
function focusNextFocusableNode(node, filter) {
  let nextFocusable = nextFocusableNode(node, filter);
  return nextFocusable && nextFocusable instanceof HTMLElement ? (nextFocusable.focus(), !0) : !1;
}
function findFirstKeyboardFocusableNode(element, onlyDescendants = !0) {
  return !onlyDescendants && matches(element, KEYBOARD_FOCUSABLE_SELECTORS) ? element : element.querySelector(KEYBOARD_FOCUSABLE_SELECTORS);
}
function wrapFocusPreviousFocusableMenuItem(parentElement, currentFocusedElement) {
  let allFocusableChildren = getMenuFocusableDescendants(parentElement), currentItemIdx = getCurrentFocusedElementIndex(allFocusableChildren, currentFocusedElement);
  currentItemIdx === -1 ? allFocusableChildren[0].focus() : allFocusableChildren[(currentItemIdx - 1 + allFocusableChildren.length) % allFocusableChildren.length].focus();
}
function wrapFocusNextFocusableMenuItem(parentElement, currentFocusedElement) {
  let allFocusableChildren = getMenuFocusableDescendants(parentElement), currentItemIdx = getCurrentFocusedElementIndex(allFocusableChildren, currentFocusedElement);
  currentItemIdx === -1 ? allFocusableChildren[0].focus() : allFocusableChildren[(currentItemIdx + 1) % allFocusableChildren.length].focus();
}
function getMenuFocusableDescendants(element) {
  return element.querySelectorAll(MENUITEM_FOCUSABLE_SELECTORS);
}
function getCurrentFocusedElementIndex(allFocusableChildren, currentFocusedElement) {
  let currentItemIdx = 0;
  for (let focusableChild of allFocusableChildren) {
    if (focusableChild === currentFocusedElement)
      break;
    currentItemIdx++;
  }
  return currentItemIdx === allFocusableChildren.length ? -1 : currentItemIdx;
}
function matches(node, selector) {
  if (node.matches)
    return node.matches(selector);
  let matches2 = (node.ownerDocument || document).querySelectorAll(selector), i = matches2.length;
  for (; --i >= 0 && matches2.item(i) !== node; )
    return i > -1;
}

// node_modules/@shopify/polaris/build/esm/components/Button/Button.css.js
var styles2 = {
  Button: "Polaris-Button",
  disabled: "Polaris-Button--disabled",
  pressed: "Polaris-Button--pressed",
  variantPrimary: "Polaris-Button--variantPrimary",
  variantSecondary: "Polaris-Button--variantSecondary",
  variantTertiary: "Polaris-Button--variantTertiary",
  variantPlain: "Polaris-Button--variantPlain",
  removeUnderline: "Polaris-Button--removeUnderline",
  variantMonochromePlain: "Polaris-Button--variantMonochromePlain",
  toneSuccess: "Polaris-Button--toneSuccess",
  toneCritical: "Polaris-Button--toneCritical",
  sizeMicro: "Polaris-Button--sizeMicro",
  sizeSlim: "Polaris-Button--sizeSlim",
  sizeMedium: "Polaris-Button--sizeMedium",
  sizeLarge: "Polaris-Button--sizeLarge",
  textAlignCenter: "Polaris-Button--textAlignCenter",
  textAlignStart: "Polaris-Button--textAlignStart",
  textAlignLeft: "Polaris-Button--textAlignLeft",
  textAlignEnd: "Polaris-Button--textAlignEnd",
  textAlignRight: "Polaris-Button--textAlignRight",
  fullWidth: "Polaris-Button--fullWidth",
  iconOnly: "Polaris-Button--iconOnly",
  iconWithText: "Polaris-Button--iconWithText",
  disclosure: "Polaris-Button--disclosure",
  loading: "Polaris-Button--loading",
  pressable: "Polaris-Button--pressable",
  hidden: "Polaris-Button--hidden",
  Icon: "Polaris-Button__Icon",
  Spinner: "Polaris-Button__Spinner"
};

// node_modules/@shopify/polaris/build/esm/components/Icon/Icon.js
import React26 from "react";

// node_modules/@shopify/polaris/build/esm/components/Icon/Icon.css.js
var styles3 = {
  Icon: "Polaris-Icon",
  toneInherit: "Polaris-Icon--toneInherit",
  toneBase: "Polaris-Icon--toneBase",
  toneSubdued: "Polaris-Icon--toneSubdued",
  toneCaution: "Polaris-Icon--toneCaution",
  toneWarning: "Polaris-Icon--toneWarning",
  toneCritical: "Polaris-Icon--toneCritical",
  toneInteractive: "Polaris-Icon--toneInteractive",
  toneInfo: "Polaris-Icon--toneInfo",
  toneSuccess: "Polaris-Icon--toneSuccess",
  tonePrimary: "Polaris-Icon--tonePrimary",
  toneEmphasis: "Polaris-Icon--toneEmphasis",
  toneMagic: "Polaris-Icon--toneMagic",
  toneTextCaution: "Polaris-Icon--toneTextCaution",
  toneTextWarning: "Polaris-Icon--toneTextWarning",
  toneTextCritical: "Polaris-Icon--toneTextCritical",
  toneTextInfo: "Polaris-Icon--toneTextInfo",
  toneTextPrimary: "Polaris-Icon--toneTextPrimary",
  toneTextSuccess: "Polaris-Icon--toneTextSuccess",
  toneTextMagic: "Polaris-Icon--toneTextMagic",
  Svg: "Polaris-Icon__Svg",
  Img: "Polaris-Icon__Img",
  Placeholder: "Polaris-Icon__Placeholder"
};

// node_modules/@shopify/polaris/build/esm/components/Text/Text.js
import React25 from "react";

// node_modules/@shopify/polaris/build/esm/components/Text/Text.css.js
var styles4 = {
  root: "Polaris-Text--root",
  block: "Polaris-Text--block",
  truncate: "Polaris-Text--truncate",
  visuallyHidden: "Polaris-Text--visuallyHidden",
  start: "Polaris-Text--start",
  center: "Polaris-Text--center",
  end: "Polaris-Text--end",
  justify: "Polaris-Text--justify",
  base: "Polaris-Text--base",
  inherit: "Polaris-Text--inherit",
  disabled: "Polaris-Text--disabled",
  success: "Polaris-Text--success",
  critical: "Polaris-Text--critical",
  caution: "Polaris-Text--caution",
  subdued: "Polaris-Text--subdued",
  magic: "Polaris-Text--magic",
  "magic-subdued": "Polaris-Text__magic--subdued",
  "text-inverse": "Polaris-Text__text--inverse",
  "text-inverse-secondary": "Polaris-Text--textInverseSecondary",
  headingXs: "Polaris-Text--headingXs",
  headingSm: "Polaris-Text--headingSm",
  headingMd: "Polaris-Text--headingMd",
  headingLg: "Polaris-Text--headingLg",
  headingXl: "Polaris-Text--headingXl",
  heading2xl: "Polaris-Text--heading2xl",
  heading3xl: "Polaris-Text--heading3xl",
  bodyXs: "Polaris-Text--bodyXs",
  bodySm: "Polaris-Text--bodySm",
  bodyMd: "Polaris-Text--bodyMd",
  bodyLg: "Polaris-Text--bodyLg",
  regular: "Polaris-Text--regular",
  medium: "Polaris-Text--medium",
  semibold: "Polaris-Text--semibold",
  bold: "Polaris-Text--bold",
  break: "Polaris-Text--break",
  numeric: "Polaris-Text--numeric",
  "line-through": "Polaris-Text__line--through"
};

// node_modules/@shopify/polaris/build/esm/components/Text/Text.js
var Text = ({
  alignment,
  as,
  breakWord,
  children,
  tone,
  fontWeight,
  id,
  numeric = !1,
  truncate = !1,
  variant,
  visuallyHidden = !1,
  textDecorationLine
}) => {
  let Component3 = as || (visuallyHidden ? "span" : "p"), className = classNames(styles4.root, variant && styles4[variant], fontWeight && styles4[fontWeight], (alignment || truncate) && styles4.block, alignment && styles4[alignment], breakWord && styles4.break, tone && styles4[tone], numeric && styles4.numeric, truncate && styles4.truncate, visuallyHidden && styles4.visuallyHidden, textDecorationLine && styles4[textDecorationLine]);
  return /* @__PURE__ */ React25.createElement(Component3, Object.assign({
    className
  }, id && {
    id
  }), children);
};

// node_modules/@shopify/polaris/build/esm/components/Icon/Icon.js
function Icon({
  source,
  tone,
  accessibilityLabel
}) {
  let sourceType;
  typeof source == "function" ? sourceType = "function" : source === "placeholder" ? sourceType = "placeholder" : sourceType = "external";
  let className = classNames(styles3.Icon, tone && styles3[variationName("tone", tone)]), {
    mdDown
  } = useBreakpoints(), SourceComponent = source, contentMarkup = {
    function: /* @__PURE__ */ React26.createElement(SourceComponent, Object.assign({
      className: styles3.Svg,
      focusable: "false",
      "aria-hidden": "true"
      // On Mobile we're scaling the viewBox to 18x18 to make the icons bigger
      // Also, we're setting the viewport origin to 1x1 to center the icon
      // We use this syntax so we don't override the existing viewBox value if we don't need to.
    }, mdDown ? {
      viewBox: "1 1 18 18"
    } : {})),
    placeholder: /* @__PURE__ */ React26.createElement("div", {
      className: styles3.Placeholder
    }),
    external: /* @__PURE__ */ React26.createElement("img", {
      className: styles3.Img,
      src: `data:image/svg+xml;utf8,${source}`,
      alt: "",
      "aria-hidden": "true"
    })
  };
  return /* @__PURE__ */ React26.createElement("span", {
    className
  }, accessibilityLabel && /* @__PURE__ */ React26.createElement(Text, {
    as: "span",
    visuallyHidden: !0
  }, accessibilityLabel), contentMarkup[sourceType]);
}

// node_modules/@shopify/polaris/build/esm/components/Spinner/Spinner.js
import React27 from "react";

// node_modules/@shopify/polaris/build/esm/components/Spinner/Spinner.css.js
var styles5 = {
  Spinner: "Polaris-Spinner",
  sizeSmall: "Polaris-Spinner--sizeSmall",
  sizeLarge: "Polaris-Spinner--sizeLarge"
};

// node_modules/@shopify/polaris/build/esm/components/Spinner/Spinner.js
function Spinner({
  size: size2 = "large",
  accessibilityLabel,
  hasFocusableParent
}) {
  let isAfterInitialMount = useIsAfterInitialMount(), className = classNames(styles5.Spinner, size2 && styles5[variationName("size", size2)]), spinnerSVGMarkup = size2 === "large" ? /* @__PURE__ */ React27.createElement("svg", {
    viewBox: "0 0 44 44",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ React27.createElement("path", {
    d: "M15.542 1.487A21.507 21.507 0 00.5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 00-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 10-.9-2.863z"
  })) : /* @__PURE__ */ React27.createElement("svg", {
    viewBox: "0 0 20 20",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ React27.createElement("path", {
    d: "M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"
  })), spanAttributes = {
    ...!hasFocusableParent && {
      role: "status"
    }
  }, accessibilityLabelMarkup = (isAfterInitialMount || !hasFocusableParent) && /* @__PURE__ */ React27.createElement(Text, {
    as: "span",
    visuallyHidden: !0
  }, accessibilityLabel);
  return /* @__PURE__ */ React27.createElement(React27.Fragment, null, /* @__PURE__ */ React27.createElement("span", {
    className
  }, spinnerSVGMarkup), /* @__PURE__ */ React27.createElement("span", spanAttributes, accessibilityLabelMarkup));
}

// node_modules/@shopify/polaris/build/esm/components/UnstyledButton/UnstyledButton.js
import React29 from "react";

// node_modules/@shopify/polaris/build/esm/utilities/use-disable-interaction.js
import { useCallback as useCallback4 } from "react";
function useDisableClick(disabled, handleClick) {
  let handleClickWrapper = useCallback4((event) => {
    disabled && (event.preventDefault(), event.stopPropagation());
  }, [disabled]);
  return disabled ? handleClickWrapper : handleClick;
}

// node_modules/@shopify/polaris/build/esm/components/UnstyledLink/UnstyledLink.js
import React28, { memo, forwardRef as forwardRef2 } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/link/hooks.js
import { useContext as useContext2 } from "react";
function useLink() {
  return useContext2(LinkContext);
}

// node_modules/@shopify/polaris/build/esm/components/UnstyledLink/UnstyledLink.js
var UnstyledLink = /* @__PURE__ */ memo(/* @__PURE__ */ forwardRef2(function(props, _ref) {
  let LinkComponent = useLink();
  if (LinkComponent)
    return /* @__PURE__ */ React28.createElement(LinkComponent, Object.assign({}, unstyled.props, props, {
      ref: _ref
    }));
  let {
    external,
    url,
    target: targetProp,
    ...rest
  } = props, target;
  external ? target = "_blank" : target = targetProp ?? void 0;
  let rel = target === "_blank" ? "noopener noreferrer" : void 0;
  return /* @__PURE__ */ React28.createElement("a", Object.assign({
    target
  }, rest, {
    href: url,
    rel
  }, unstyled.props, {
    ref: _ref
  }));
}));

// node_modules/@shopify/polaris/build/esm/components/UnstyledButton/UnstyledButton.js
function UnstyledButton({
  id,
  children,
  className,
  url,
  external,
  target,
  download,
  submit,
  disabled,
  loading,
  pressed,
  accessibilityLabel,
  role,
  ariaControls,
  ariaExpanded,
  ariaDescribedBy,
  ariaChecked,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyPress,
  onKeyUp,
  onMouseEnter,
  onTouchStart,
  ...rest
}) {
  let buttonMarkup, commonProps = {
    id,
    className,
    "aria-label": accessibilityLabel
  }, interactiveProps = {
    ...commonProps,
    role,
    onClick,
    onFocus,
    onBlur,
    onMouseUp: handleMouseUpByBlurring,
    onMouseEnter,
    onTouchStart
  }, handleClick = useDisableClick(disabled, onClick);
  return url ? buttonMarkup = disabled ? (
    // Render an `<a>` so toggling disabled/enabled state changes only the
    // `href` attribute instead of replacing the whole element.
    /* @__PURE__ */ React29.createElement("a", commonProps, children)
  ) : /* @__PURE__ */ React29.createElement(UnstyledLink, Object.assign({}, interactiveProps, {
    url,
    external,
    target,
    download
  }, rest), children) : buttonMarkup = /* @__PURE__ */ React29.createElement("button", Object.assign({}, interactiveProps, {
    "aria-disabled": disabled,
    type: submit ? "submit" : "button",
    "aria-busy": loading ? !0 : void 0,
    "aria-controls": ariaControls,
    "aria-expanded": ariaExpanded,
    "aria-describedby": ariaDescribedBy,
    "aria-checked": ariaChecked,
    "aria-pressed": pressed,
    onKeyDown,
    onKeyUp,
    onKeyPress,
    onClick: handleClick,
    tabIndex: disabled ? -1 : void 0
  }, rest), children), buttonMarkup;
}

// node_modules/@shopify/polaris/build/esm/utilities/i18n/hooks.js
import { useContext as useContext3 } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/errors.js
var MissingAppProviderError = class extends Error {
  constructor(message = "") {
    super(`${message && `${message} `}Your application must be wrapped in an <AppProvider> component. See https://polaris.shopify.com/components/app-provider for implementation instructions.`), this.name = "MissingAppProviderError";
  }
};

// node_modules/@shopify/polaris/build/esm/utilities/i18n/hooks.js
function useI18n() {
  let i18n = useContext3(I18nContext);
  if (!i18n)
    throw new MissingAppProviderError("No i18n was provided.");
  return i18n;
}

// node_modules/@shopify/polaris/build/esm/components/Button/Button.js
function Button({
  id,
  children,
  url,
  disabled,
  external,
  download,
  target,
  submit,
  loading,
  pressed,
  accessibilityLabel,
  role,
  ariaControls,
  ariaExpanded,
  ariaDescribedBy,
  ariaChecked,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyPress,
  onKeyUp,
  onMouseEnter,
  onTouchStart,
  onPointerDown,
  icon,
  disclosure,
  removeUnderline,
  size: size2 = "medium",
  textAlign = "center",
  fullWidth,
  dataPrimaryLink,
  tone,
  variant = "secondary"
}) {
  let i18n = useI18n(), isDisabled = disabled || loading, {
    mdUp
  } = useBreakpoints(), className = classNames(styles2.Button, styles2.pressable, styles2[variationName("variant", variant)], styles2[variationName("size", size2)], styles2[variationName("textAlign", textAlign)], fullWidth && styles2.fullWidth, disclosure && styles2.disclosure, icon && children && styles2.iconWithText, icon && children == null && styles2.iconOnly, isDisabled && styles2.disabled, loading && styles2.loading, pressed && !disabled && !url && styles2.pressed, removeUnderline && styles2.removeUnderline, tone && styles2[variationName("tone", tone)]), disclosureMarkup = disclosure ? /* @__PURE__ */ React30.createElement("span", {
    className: loading ? styles2.hidden : styles2.Icon
  }, /* @__PURE__ */ React30.createElement(Icon, {
    source: loading ? "placeholder" : getDisclosureIconSource(disclosure, SvgChevronUpIcon, SvgChevronDownIcon)
  })) : null, iconSource = isIconSource(icon) ? /* @__PURE__ */ React30.createElement(Icon, {
    source: loading ? "placeholder" : icon
  }) : icon, iconMarkup = iconSource ? /* @__PURE__ */ React30.createElement("span", {
    className: loading ? styles2.hidden : styles2.Icon
  }, iconSource) : null, hasPlainText = ["plain", "monochromePlain"].includes(variant), textFontWeight = "medium";
  hasPlainText ? textFontWeight = "regular" : variant === "primary" && (textFontWeight = mdUp ? "medium" : "semibold");
  let textVariant = "bodySm";
  (size2 === "large" || hasPlainText && size2 !== "micro") && (textVariant = "bodyMd");
  let childMarkup = children ? /* @__PURE__ */ React30.createElement(Text, {
    as: "span",
    variant: textVariant,
    fontWeight: textFontWeight,
    key: disabled ? "text-disabled" : "text"
  }, children) : null, spinnerSVGMarkup = loading ? /* @__PURE__ */ React30.createElement("span", {
    className: styles2.Spinner
  }, /* @__PURE__ */ React30.createElement(Spinner, {
    size: "small",
    accessibilityLabel: i18n.translate("Polaris.Button.spinnerAccessibilityLabel")
  })) : null, commonProps = {
    id,
    className,
    accessibilityLabel,
    ariaDescribedBy,
    role,
    onClick,
    onFocus,
    onBlur,
    onMouseUp: handleMouseUpByBlurring,
    onMouseEnter,
    onTouchStart,
    "data-primary-link": dataPrimaryLink
  }, linkProps = {
    url,
    external,
    download,
    target
  }, actionProps = {
    submit,
    disabled: isDisabled,
    loading,
    ariaControls,
    ariaExpanded,
    ariaChecked,
    pressed,
    onKeyDown,
    onKeyUp,
    onKeyPress,
    onPointerDown
  };
  return /* @__PURE__ */ React30.createElement(UnstyledButton, Object.assign({}, commonProps, linkProps, actionProps), spinnerSVGMarkup, iconMarkup, childMarkup, disclosureMarkup);
}
function isIconSource(x) {
  return typeof x == "string" || typeof x == "object" && x.body || typeof x == "function";
}
function getDisclosureIconSource(disclosure, upIcon, downIcon) {
  return disclosure === "select" ? SvgSelectIcon : disclosure === "up" ? upIcon : downIcon;
}

// node_modules/@shopify/polaris/build/esm/components/Button/utils.js
function buttonFrom({
  content,
  onAction,
  plain,
  destructive,
  ...action6
}, overrides, key) {
  let plainVariant = plain ? "plain" : void 0, destructiveVariant = destructive ? "primary" : void 0, tone = !overrides?.tone && destructive ? "critical" : overrides?.tone;
  return /* @__PURE__ */ React31.createElement(Button, Object.assign({
    key,
    onClick: onAction,
    tone,
    variant: plainVariant || destructiveVariant
  }, action6, overrides), content);
}

// node_modules/@shopify/polaris/build/esm/components/Card/Card.js
import React34 from "react";

// node_modules/@shopify/polaris/build/esm/components/ShadowBevel/ShadowBevel.js
import React32 from "react";

// node_modules/@shopify/polaris/build/esm/components/ShadowBevel/ShadowBevel.css.js
var styles6 = {
  ShadowBevel: "Polaris-ShadowBevel"
};

// node_modules/@shopify/polaris/build/esm/components/ShadowBevel/ShadowBevel.js
function ShadowBevel(props) {
  let {
    as = "div",
    bevel = !0,
    borderRadius,
    boxShadow,
    children,
    zIndex: zIndex2 = "0"
  } = props, Component3 = as;
  return /* @__PURE__ */ React32.createElement(Component3, {
    className: styles6.ShadowBevel,
    style: {
      "--pc-shadow-bevel-z-index": zIndex2,
      ...getResponsiveValue("shadow-bevel", "content", mapResponsiveProp(bevel, (bevel2) => bevel2 ? '""' : "none")),
      ...getResponsiveValue("shadow-bevel", "box-shadow", mapResponsiveProp(bevel, (bevel2) => bevel2 ? `var(--p-shadow-${boxShadow})` : "none")),
      ...getResponsiveValue("shadow-bevel", "border-radius", mapResponsiveProp(bevel, (bevel2) => bevel2 ? `var(--p-border-radius-${borderRadius})` : "var(--p-border-radius-0)"))
    }
  }, children);
}
function mapResponsiveProp(responsiveProp, callback) {
  return typeof responsiveProp == "boolean" ? callback(responsiveProp) : Object.fromEntries(Object.entries(responsiveProp).map(([breakpointsAlias, value]) => [breakpointsAlias, callback(value)]));
}

// node_modules/@shopify/polaris/build/esm/components/Box/Box.js
import React33, { forwardRef as forwardRef3 } from "react";

// node_modules/@shopify/polaris/build/esm/components/Box/Box.css.js
var styles7 = {
  listReset: "Polaris-Box--listReset",
  Box: "Polaris-Box",
  visuallyHidden: "Polaris-Box--visuallyHidden",
  printHidden: "Polaris-Box--printHidden"
};

// node_modules/@shopify/polaris/build/esm/components/Box/Box.js
var Box = /* @__PURE__ */ forwardRef3(({
  as = "div",
  background,
  borderColor,
  borderStyle,
  borderWidth,
  borderBlockStartWidth,
  borderBlockEndWidth,
  borderInlineStartWidth,
  borderInlineEndWidth,
  borderRadius,
  borderEndStartRadius,
  borderEndEndRadius,
  borderStartStartRadius,
  borderStartEndRadius,
  children,
  color: color2,
  id,
  minHeight,
  minWidth,
  maxWidth,
  overflowX,
  overflowY,
  outlineColor,
  outlineStyle,
  outlineWidth,
  padding,
  paddingBlock,
  paddingBlockStart,
  paddingBlockEnd,
  paddingInline,
  paddingInlineStart,
  paddingInlineEnd,
  role,
  shadow: shadow2,
  tabIndex,
  width: width2,
  printHidden,
  visuallyHidden,
  position,
  insetBlockStart,
  insetBlockEnd,
  insetInlineStart,
  insetInlineEnd,
  zIndex: zIndex2,
  opacity,
  ...restProps
}, ref) => {
  let borderStyleValue = borderStyle || (borderColor || borderWidth || borderBlockStartWidth || borderBlockEndWidth || borderInlineStartWidth || borderInlineEndWidth ? "solid" : void 0), outlineStyleValue = outlineStyle || (outlineColor || outlineWidth ? "solid" : void 0), style = {
    "--pc-box-color": color2 ? `var(--p-color-${color2})` : void 0,
    "--pc-box-background": background ? `var(--p-color-${background})` : void 0,
    // eslint-disable-next-line no-nested-ternary
    "--pc-box-border-color": borderColor ? borderColor === "transparent" ? "transparent" : `var(--p-color-${borderColor})` : void 0,
    "--pc-box-border-style": borderStyleValue,
    "--pc-box-border-radius": borderRadius ? `var(--p-border-radius-${borderRadius})` : void 0,
    "--pc-box-border-end-start-radius": borderEndStartRadius ? `var(--p-border-radius-${borderEndStartRadius})` : void 0,
    "--pc-box-border-end-end-radius": borderEndEndRadius ? `var(--p-border-radius-${borderEndEndRadius})` : void 0,
    "--pc-box-border-start-start-radius": borderStartStartRadius ? `var(--p-border-radius-${borderStartStartRadius})` : void 0,
    "--pc-box-border-start-end-radius": borderStartEndRadius ? `var(--p-border-radius-${borderStartEndRadius})` : void 0,
    "--pc-box-border-width": borderWidth ? `var(--p-border-width-${borderWidth})` : void 0,
    "--pc-box-border-block-start-width": borderBlockStartWidth ? `var(--p-border-width-${borderBlockStartWidth})` : void 0,
    "--pc-box-border-block-end-width": borderBlockEndWidth ? `var(--p-border-width-${borderBlockEndWidth})` : void 0,
    "--pc-box-border-inline-start-width": borderInlineStartWidth ? `var(--p-border-width-${borderInlineStartWidth})` : void 0,
    "--pc-box-border-inline-end-width": borderInlineEndWidth ? `var(--p-border-width-${borderInlineEndWidth})` : void 0,
    "--pc-box-min-height": minHeight,
    "--pc-box-min-width": minWidth,
    "--pc-box-max-width": maxWidth,
    "--pc-box-outline-color": outlineColor ? `var(--p-color-${outlineColor})` : void 0,
    "--pc-box-outline-style": outlineStyleValue,
    "--pc-box-outline-width": outlineWidth ? `var(--p-border-width-${outlineWidth})` : void 0,
    "--pc-box-overflow-x": overflowX,
    "--pc-box-overflow-y": overflowY,
    ...getResponsiveProps("box", "padding-block-start", "space", paddingBlockStart || paddingBlock || padding),
    ...getResponsiveProps("box", "padding-block-end", "space", paddingBlockEnd || paddingBlock || padding),
    ...getResponsiveProps("box", "padding-inline-start", "space", paddingInlineStart || paddingInline || padding),
    ...getResponsiveProps("box", "padding-inline-end", "space", paddingInlineEnd || paddingInline || padding),
    "--pc-box-shadow": shadow2 ? `var(--p-shadow-${shadow2})` : void 0,
    "--pc-box-width": width2,
    position,
    "--pc-box-inset-block-start": insetBlockStart ? `var(--p-space-${insetBlockStart})` : void 0,
    "--pc-box-inset-block-end": insetBlockEnd ? `var(--p-space-${insetBlockEnd})` : void 0,
    "--pc-box-inset-inline-start": insetInlineStart ? `var(--p-space-${insetInlineStart})` : void 0,
    "--pc-box-inset-inline-end": insetInlineEnd ? `var(--p-space-${insetInlineEnd})` : void 0,
    zIndex: zIndex2,
    opacity
  }, className = classNames(styles7.Box, visuallyHidden && styles7.visuallyHidden, printHidden && styles7.printHidden, as === "ul" && styles7.listReset);
  return /* @__PURE__ */ React33.createElement(as, {
    className,
    id,
    ref,
    style: sanitizeCustomProperties(style),
    role,
    tabIndex,
    ...restProps
  }, children);
});
Box.displayName = "Box";

// node_modules/@shopify/polaris/build/esm/components/Card/Card.js
var Card = ({
  children,
  background = "bg-surface",
  padding = {
    xs: "400"
  },
  roundedAbove = "sm"
}) => {
  let breakpoints2 = useBreakpoints(), defaultBorderRadius = "300", hasBorderRadius = Boolean(breakpoints2[`${roundedAbove}Up`]);
  return /* @__PURE__ */ React34.createElement(WithinContentContext.Provider, {
    value: !0
  }, /* @__PURE__ */ React34.createElement(ShadowBevel, {
    boxShadow: "100",
    borderRadius: hasBorderRadius ? defaultBorderRadius : "0",
    zIndex: "32"
  }, /* @__PURE__ */ React34.createElement(Box, {
    background,
    padding,
    overflowX: "clip",
    overflowY: "clip",
    minHeight: "100%"
  }, children)));
};

// node_modules/@shopify/polaris/build/esm/components/InlineStack/InlineStack.js
import React35 from "react";

// node_modules/@shopify/polaris/build/esm/components/InlineStack/InlineStack.css.js
var styles8 = {
  InlineStack: "Polaris-InlineStack"
};

// node_modules/@shopify/polaris/build/esm/components/InlineStack/InlineStack.js
var InlineStack = function({
  as: Element2 = "div",
  align,
  direction = "row",
  blockAlign,
  gap,
  wrap = !0,
  children
}) {
  let style = {
    "--pc-inline-stack-align": align,
    "--pc-inline-stack-block-align": blockAlign,
    "--pc-inline-stack-wrap": wrap ? "wrap" : "nowrap",
    ...getResponsiveProps("inline-stack", "gap", "space", gap),
    ...getResponsiveValue("inline-stack", "flex-direction", direction)
  };
  return /* @__PURE__ */ React35.createElement(Element2, {
    className: styles8.InlineStack,
    style
  }, children);
};

// node_modules/@shopify/polaris/build/esm/components/BlockStack/BlockStack.js
import React36 from "react";

// node_modules/@shopify/polaris/build/esm/components/BlockStack/BlockStack.css.js
var styles9 = {
  BlockStack: "Polaris-BlockStack",
  listReset: "Polaris-BlockStack--listReset",
  fieldsetReset: "Polaris-BlockStack--fieldsetReset"
};

// node_modules/@shopify/polaris/build/esm/components/BlockStack/BlockStack.js
var BlockStack = ({
  as = "div",
  children,
  align,
  inlineAlign,
  gap,
  id,
  reverseOrder = !1,
  ...restProps
}) => {
  let className = classNames(styles9.BlockStack, (as === "ul" || as === "ol") && styles9.listReset, as === "fieldset" && styles9.fieldsetReset), style = {
    "--pc-block-stack-align": align ? `${align}` : null,
    "--pc-block-stack-inline-align": inlineAlign ? `${inlineAlign}` : null,
    "--pc-block-stack-order": reverseOrder ? "column-reverse" : "column",
    ...getResponsiveProps("block-stack", "gap", "space", gap)
  };
  return /* @__PURE__ */ React36.createElement(as, {
    className,
    id,
    style: sanitizeCustomProperties(style),
    ...restProps
  }, children);
};

// node_modules/@shopify/polaris/build/esm/components/Image/Image.js
import React37, { useCallback as useCallback5 } from "react";
function Image({
  alt,
  sourceSet,
  source,
  crossOrigin,
  onLoad,
  className,
  ...rest
}) {
  let finalSourceSet = sourceSet ? sourceSet.map(({
    source: subSource,
    descriptor
  }) => `${subSource} ${descriptor}`).join(",") : null, handleLoad = useCallback5(() => {
    onLoad && onLoad();
  }, [onLoad]);
  return /* @__PURE__ */ React37.createElement("img", Object.assign({
    alt,
    src: source,
    crossOrigin,
    className,
    onLoad: handleLoad
  }, finalSourceSet ? {
    srcSet: finalSourceSet
  } : {}, rest));
}

// node_modules/@shopify/polaris/build/esm/components/ActionList/ActionList.js
import React57, { useContext as useContext8, useRef as useRef12, useState as useState11, useMemo as useMemo5 } from "react";

// node_modules/@shopify/polaris/build/esm/components/FilterActionsProvider/FilterActionsProvider.js
import React38, { createContext as createContext12 } from "react";
var FilterActionsContext = /* @__PURE__ */ createContext12(!1);
function FilterActionsProvider({
  children,
  filterActions
}) {
  return /* @__PURE__ */ React38.createElement(FilterActionsContext.Provider, {
    value: filterActions
  }, children);
}

// node_modules/@shopify/polaris/build/esm/components/ActionList/components/Section/Section.js
import React48 from "react";

// node_modules/@shopify/polaris/build/esm/components/ActionList/components/Item/Item.js
import React47, { useRef as useRef8, useState as useState9 } from "react";

// node_modules/@shopify/polaris/build/esm/components/ActionList/ActionList.css.js
var styles10 = {
  Item: "Polaris-ActionList__Item",
  default: "Polaris-ActionList--default",
  active: "Polaris-ActionList--active",
  destructive: "Polaris-ActionList--destructive",
  disabled: "Polaris-ActionList--disabled",
  Prefix: "Polaris-ActionList__Prefix",
  Suffix: "Polaris-ActionList__Suffix",
  indented: "Polaris-ActionList--indented",
  menu: "Polaris-ActionList--menu",
  Text: "Polaris-ActionList__Text"
};

// node_modules/@shopify/polaris/build/esm/components/Badge/Badge.js
import React40, { useContext as useContext4 } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/within-filter-context.js
import { createContext as createContext13 } from "react";
var WithinFilterContext = /* @__PURE__ */ createContext13(!1);

// node_modules/@shopify/polaris/build/esm/components/Badge/Badge.css.js
var styles11 = {
  Badge: "Polaris-Badge",
  toneSuccess: "Polaris-Badge--toneSuccess",
  "toneSuccess-strong": "Polaris-Badge__toneSuccess--strong",
  toneInfo: "Polaris-Badge--toneInfo",
  "toneInfo-strong": "Polaris-Badge__toneInfo--strong",
  toneAttention: "Polaris-Badge--toneAttention",
  "toneAttention-strong": "Polaris-Badge__toneAttention--strong",
  toneWarning: "Polaris-Badge--toneWarning",
  "toneWarning-strong": "Polaris-Badge__toneWarning--strong",
  toneCritical: "Polaris-Badge--toneCritical",
  "toneCritical-strong": "Polaris-Badge__toneCritical--strong",
  toneNew: "Polaris-Badge--toneNew",
  toneMagic: "Polaris-Badge--toneMagic",
  "toneRead-only": "Polaris-Badge__toneRead--only",
  toneEnabled: "Polaris-Badge--toneEnabled",
  sizeLarge: "Polaris-Badge--sizeLarge",
  withinFilter: "Polaris-Badge--withinFilter",
  Icon: "Polaris-Badge__Icon",
  PipContainer: "Polaris-Badge__PipContainer"
};

// node_modules/@shopify/polaris/build/esm/components/Badge/types.js
var ToneValue;
(function(ToneValue2) {
  ToneValue2.Info = "info", ToneValue2.Success = "success", ToneValue2.Warning = "warning", ToneValue2.Critical = "critical", ToneValue2.Attention = "attention", ToneValue2.New = "new", ToneValue2.Magic = "magic", ToneValue2.InfoStrong = "info-strong", ToneValue2.SuccessStrong = "success-strong", ToneValue2.WarningStrong = "warning-strong", ToneValue2.CriticalStrong = "critical-strong", ToneValue2.AttentionStrong = "attention-strong", ToneValue2.ReadOnly = "read-only", ToneValue2.Enabled = "enabled";
})(ToneValue || (ToneValue = {}));
var ProgressValue;
(function(ProgressValue2) {
  ProgressValue2.Incomplete = "incomplete", ProgressValue2.PartiallyComplete = "partiallyComplete", ProgressValue2.Complete = "complete";
})(ProgressValue || (ProgressValue = {}));

// node_modules/@shopify/polaris/build/esm/components/Badge/utils.js
function getDefaultAccessibilityLabel(i18n, progress, tone) {
  let progressLabel = "", toneLabel = "";
  if (!progress && !tone)
    return "";
  switch (progress) {
    case ProgressValue.Incomplete:
      progressLabel = i18n.translate("Polaris.Badge.PROGRESS_LABELS.incomplete");
      break;
    case ProgressValue.PartiallyComplete:
      progressLabel = i18n.translate("Polaris.Badge.PROGRESS_LABELS.partiallyComplete");
      break;
    case ProgressValue.Complete:
      progressLabel = i18n.translate("Polaris.Badge.PROGRESS_LABELS.complete");
      break;
  }
  switch (tone) {
    case ToneValue.Info:
    case ToneValue.InfoStrong:
      toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.info");
      break;
    case ToneValue.Success:
    case ToneValue.SuccessStrong:
      toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.success");
      break;
    case ToneValue.Warning:
    case ToneValue.WarningStrong:
      toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.warning");
      break;
    case ToneValue.Critical:
    case ToneValue.CriticalStrong:
      toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.critical");
      break;
    case ToneValue.Attention:
    case ToneValue.AttentionStrong:
      toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.attention");
      break;
    case ToneValue.New:
      toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.new");
      break;
    case ToneValue.ReadOnly:
      toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.readOnly");
      break;
    case ToneValue.Enabled:
      toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.enabled");
      break;
  }
  return !tone && progress ? progressLabel : tone && !progress ? toneLabel : i18n.translate("Polaris.Badge.progressAndTone", {
    progressLabel,
    toneLabel
  });
}

// node_modules/@shopify/polaris/build/esm/components/Badge/components/Pip/Pip.js
import React39 from "react";

// node_modules/@shopify/polaris/build/esm/components/Badge/components/Pip/Pip.css.js
var styles12 = {
  Pip: "Polaris-Badge-Pip",
  toneInfo: "Polaris-Badge-Pip--toneInfo",
  toneSuccess: "Polaris-Badge-Pip--toneSuccess",
  toneNew: "Polaris-Badge-Pip--toneNew",
  toneAttention: "Polaris-Badge-Pip--toneAttention",
  toneWarning: "Polaris-Badge-Pip--toneWarning",
  toneCritical: "Polaris-Badge-Pip--toneCritical",
  progressIncomplete: "Polaris-Badge-Pip--progressIncomplete",
  progressPartiallyComplete: "Polaris-Badge-Pip--progressPartiallyComplete",
  progressComplete: "Polaris-Badge-Pip--progressComplete"
};

// node_modules/@shopify/polaris/build/esm/components/Badge/components/Pip/Pip.js
function Pip({
  tone,
  progress = "complete",
  accessibilityLabelOverride
}) {
  let i18n = useI18n(), className = classNames(styles12.Pip, tone && styles12[variationName("tone", tone)], progress && styles12[variationName("progress", progress)]), accessibilityLabel = accessibilityLabelOverride || getDefaultAccessibilityLabel(i18n, progress, tone);
  return /* @__PURE__ */ React39.createElement("span", {
    className
  }, /* @__PURE__ */ React39.createElement(Text, {
    as: "span",
    visuallyHidden: !0
  }, accessibilityLabel));
}

// node_modules/@shopify/polaris/build/esm/components/Badge/Badge.js
var DEFAULT_SIZE = "medium", progressIconMap = {
  complete: () => /* @__PURE__ */ React40.createElement("svg", {
    viewBox: "0 0 20 20"
  }, /* @__PURE__ */ React40.createElement("path", {
    d: "M6 10c0-.93 0-1.395.102-1.776a3 3 0 0 1 2.121-2.122C8.605 6 9.07 6 10 6c.93 0 1.395 0 1.776.102a3 3 0 0 1 2.122 2.122C14 8.605 14 9.07 14 10s0 1.395-.102 1.777a3 3 0 0 1-2.122 2.12C11.395 14 10.93 14 10 14s-1.395 0-1.777-.102a3 3 0 0 1-2.12-2.121C6 11.395 6 10.93 6 10Z"
  })),
  partiallyComplete: () => /* @__PURE__ */ React40.createElement("svg", {
    viewBox: "0 0 20 20"
  }, /* @__PURE__ */ React40.createElement("path", {
    fillRule: "evenodd",
    d: "m8.888 6.014-.017-.018-.02.02c-.253.013-.45.038-.628.086a3 3 0 0 0-2.12 2.122C6 8.605 6 9.07 6 10s0 1.395.102 1.777a3 3 0 0 0 2.121 2.12C8.605 14 9.07 14 10 14c.93 0 1.395 0 1.776-.102a3 3 0 0 0 2.122-2.121C14 11.395 14 10.93 14 10c0-.93 0-1.395-.102-1.776a3 3 0 0 0-2.122-2.122C11.395 6 10.93 6 10 6c-.475 0-.829 0-1.112.014ZM8.446 7.34a1.75 1.75 0 0 0-1.041.94l4.314 4.315c.443-.2.786-.576.941-1.042L8.446 7.34Zm4.304 2.536L10.124 7.25c.908.001 1.154.013 1.329.06a1.75 1.75 0 0 1 1.237 1.237c.047.175.059.42.06 1.329ZM8.547 12.69c.182.05.442.06 1.453.06h.106L7.25 9.894V10c0 1.01.01 1.27.06 1.453a1.75 1.75 0 0 0 1.237 1.237Z"
  })),
  incomplete: () => /* @__PURE__ */ React40.createElement("svg", {
    viewBox: "0 0 20 20"
  }, /* @__PURE__ */ React40.createElement("path", {
    fillRule: "evenodd",
    d: "M8.547 12.69c.183.05.443.06 1.453.06s1.27-.01 1.453-.06a1.75 1.75 0 0 0 1.237-1.237c.05-.182.06-.443.06-1.453s-.01-1.27-.06-1.453a1.75 1.75 0 0 0-1.237-1.237c-.182-.05-.443-.06-1.453-.06s-1.27.01-1.453.06A1.75 1.75 0 0 0 7.31 8.547c-.05.183-.06.443-.06 1.453s.01 1.27.06 1.453a1.75 1.75 0 0 0 1.237 1.237ZM6.102 8.224C6 8.605 6 9.07 6 10s0 1.395.102 1.777a3 3 0 0 0 2.122 2.12C8.605 14 9.07 14 10 14s1.395 0 1.777-.102a3 3 0 0 0 2.12-2.121C14 11.395 14 10.93 14 10c0-.93 0-1.395-.102-1.776a3 3 0 0 0-2.121-2.122C11.395 6 10.93 6 10 6c-.93 0-1.395 0-1.776.102a3 3 0 0 0-2.122 2.122Z"
  }))
};
function Badge({
  children,
  tone,
  progress,
  icon,
  size: size2 = DEFAULT_SIZE,
  toneAndProgressLabelOverride
}) {
  let i18n = useI18n(), withinFilter = useContext4(WithinFilterContext), className = classNames(styles11.Badge, tone && styles11[variationName("tone", tone)], size2 && size2 !== DEFAULT_SIZE && styles11[variationName("size", size2)], withinFilter && styles11.withinFilter), accessibilityLabel = toneAndProgressLabelOverride || getDefaultAccessibilityLabel(i18n, progress, tone), accessibilityMarkup = Boolean(accessibilityLabel) && /* @__PURE__ */ React40.createElement(Text, {
    as: "span",
    visuallyHidden: !0
  }, accessibilityLabel);
  return progress && !icon && (accessibilityMarkup = /* @__PURE__ */ React40.createElement("span", {
    className: styles11.Icon
  }, /* @__PURE__ */ React40.createElement(Icon, {
    accessibilityLabel,
    source: progressIconMap[progress]
  }))), /* @__PURE__ */ React40.createElement("span", {
    className
  }, accessibilityMarkup, icon && /* @__PURE__ */ React40.createElement("span", {
    className: styles11.Icon
  }, /* @__PURE__ */ React40.createElement(Icon, {
    source: icon
  })), children && /* @__PURE__ */ React40.createElement(Text, {
    as: "span",
    variant: "bodySm",
    fontWeight: tone === "new" ? "medium" : void 0
  }, children));
}
Badge.Pip = Pip;

// node_modules/@shopify/polaris/build/esm/components/Tooltip/Tooltip.js
import React46, { useState as useState8, useId as useId3, useRef as useRef7, useCallback as useCallback8, useEffect as useEffect8 } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/use-toggle.js
import { useState as useState6, useCallback as useCallback6 } from "react";
function useToggle(initialState) {
  let [value, setState] = useState6(initialState);
  return {
    value,
    toggle: useCallback6(() => setState((state) => !state), []),
    setTrue: useCallback6(() => setState(!0), []),
    setFalse: useCallback6(() => setState(!1), [])
  };
}

// node_modules/@shopify/polaris/build/esm/components/Tooltip/Tooltip.css.js
var styles13 = {
  TooltipContainer: "Polaris-Tooltip__TooltipContainer",
  HasUnderline: "Polaris-Tooltip__HasUnderline"
};

// node_modules/@shopify/polaris/build/esm/utilities/ephemeral-presence-manager/hooks.js
import { useContext as useContext5 } from "react";
function useEphemeralPresenceManager() {
  let ephemeralPresenceManager = useContext5(EphemeralPresenceManagerContext);
  if (!ephemeralPresenceManager)
    throw new Error("No ephemeral presence manager was provided. Your application must be wrapped in an <AppProvider> component. See https://polaris.shopify.com/components/app-provider for implementation instructions.");
  return ephemeralPresenceManager;
}

// node_modules/@shopify/polaris/build/esm/components/Portal/Portal.js
import React41, { useId, useEffect as useEffect5 } from "react";
import { createPortal } from "react-dom";

// node_modules/@shopify/polaris/build/esm/utilities/portals/hooks.js
import { useContext as useContext6 } from "react";
function usePortalsManager() {
  let portalsManager = useContext6(PortalsManagerContext);
  if (!portalsManager)
    throw new Error("No portals manager was provided. Your application must be wrapped in an <AppProvider> component. See https://polaris.shopify.com/components/app-provider for implementation instructions.");
  return portalsManager;
}

// node_modules/@shopify/polaris/build/esm/components/Portal/Portal.js
function Portal({
  children,
  idPrefix = "",
  onPortalCreated = noop2
}) {
  let themeName = useThemeName(), {
    container
  } = usePortalsManager(), uniqueId = useId(), portalId = idPrefix !== "" ? `${idPrefix}-${uniqueId}` : uniqueId;
  return useEffect5(() => {
    onPortalCreated();
  }, [onPortalCreated]), container ? /* @__PURE__ */ createPortal(/* @__PURE__ */ React41.createElement(ThemeProvider, {
    theme: isThemeNameLocal(themeName) ? themeName : themeNameDefault,
    "data-portal-id": portalId
  }, children), container) : null;
}
function noop2() {
}

// node_modules/@shopify/polaris/build/esm/components/Tooltip/components/TooltipOverlay/TooltipOverlay.js
import React45 from "react";

// node_modules/@shopify/polaris/build/esm/components/Tooltip/components/TooltipOverlay/TooltipOverlay.css.js
var styles14 = {
  TooltipOverlay: "Polaris-Tooltip-TooltipOverlay",
  Tail: "Polaris-Tooltip-TooltipOverlay__Tail",
  positionedAbove: "Polaris-Tooltip-TooltipOverlay--positionedAbove",
  measuring: "Polaris-Tooltip-TooltipOverlay--measuring",
  measured: "Polaris-Tooltip-TooltipOverlay--measured",
  instant: "Polaris-Tooltip-TooltipOverlay--instant",
  Content: "Polaris-Tooltip-TooltipOverlay__Content",
  default: "Polaris-Tooltip-TooltipOverlay--default",
  wide: "Polaris-Tooltip-TooltipOverlay--wide"
};

// node_modules/@shopify/polaris/build/esm/components/PositionedOverlay/PositionedOverlay.js
import React44, { PureComponent as PureComponent2 } from "react";

// node_modules/@shopify/polaris/build/esm/components/PositionedOverlay/utilities/math.js
function calculateVerticalPosition(activatorRect, overlayRect, overlayMargins, scrollableContainerRect, containerRect, preferredPosition, fixed, topBarOffset = 0) {
  let activatorTop = activatorRect.top, activatorBottom = activatorTop + activatorRect.height, spaceAbove = activatorRect.top - topBarOffset, spaceBelow = containerRect.height - activatorRect.top - activatorRect.height, desiredHeight = overlayRect.height, verticalMargins = overlayMargins.activator + overlayMargins.container, minimumSpaceToScroll = overlayMargins.container, distanceToTopScroll = activatorRect.top - Math.max(scrollableContainerRect.top, 0), distanceToBottomScroll = containerRect.top + Math.min(containerRect.height, scrollableContainerRect.top + scrollableContainerRect.height) - (activatorRect.top + activatorRect.height), enoughSpaceFromTopScroll = distanceToTopScroll >= minimumSpaceToScroll, enoughSpaceFromBottomScroll = distanceToBottomScroll >= minimumSpaceToScroll, heightIfAbove = Math.min(spaceAbove, desiredHeight), heightIfBelow = Math.min(spaceBelow, desiredHeight), heightIfAboveCover = Math.min(spaceAbove + activatorRect.height, desiredHeight), heightIfBelowCover = Math.min(spaceBelow + activatorRect.height, desiredHeight), containerRectTop = fixed ? 0 : containerRect.top, positionIfAbove = {
    height: heightIfAbove - verticalMargins,
    top: activatorTop + containerRectTop - heightIfAbove,
    positioning: "above"
  }, positionIfBelow = {
    height: heightIfBelow - verticalMargins,
    top: activatorBottom + containerRectTop,
    positioning: "below"
  }, positionIfCoverBelow = {
    height: heightIfBelowCover - verticalMargins,
    top: activatorTop + containerRectTop,
    positioning: "cover"
  }, positionIfCoverAbove = {
    height: heightIfAboveCover - verticalMargins,
    top: activatorTop + containerRectTop - heightIfAbove + activatorRect.height + verticalMargins,
    positioning: "cover"
  };
  return preferredPosition === "above" ? (enoughSpaceFromTopScroll || distanceToTopScroll >= distanceToBottomScroll && !enoughSpaceFromBottomScroll) && (spaceAbove > desiredHeight || spaceAbove > spaceBelow) ? positionIfAbove : positionIfBelow : preferredPosition === "below" ? (enoughSpaceFromBottomScroll || distanceToBottomScroll >= distanceToTopScroll && !enoughSpaceFromTopScroll) && (spaceBelow > desiredHeight || spaceBelow > spaceAbove) ? positionIfBelow : positionIfAbove : preferredPosition === "cover" ? (enoughSpaceFromBottomScroll || distanceToBottomScroll >= distanceToTopScroll && !enoughSpaceFromTopScroll) && (spaceBelow + activatorRect.height > desiredHeight || spaceBelow > spaceAbove) ? positionIfCoverBelow : positionIfCoverAbove : enoughSpaceFromTopScroll && enoughSpaceFromBottomScroll ? spaceAbove > spaceBelow ? positionIfAbove : positionIfBelow : distanceToTopScroll > minimumSpaceToScroll ? positionIfAbove : positionIfBelow;
}
function calculateHorizontalPosition(activatorRect, overlayRect, containerRect, overlayMargins, preferredAlignment) {
  let maximum = containerRect.width - overlayRect.width;
  if (preferredAlignment === "left")
    return Math.min(maximum, Math.max(0, activatorRect.left - overlayMargins.horizontal));
  if (preferredAlignment === "right") {
    let activatorRight = containerRect.width - (activatorRect.left + activatorRect.width);
    return Math.min(maximum, Math.max(0, activatorRight - overlayMargins.horizontal));
  }
  return Math.min(maximum, Math.max(0, activatorRect.center.x - overlayRect.width / 2));
}
function rectIsOutsideOfRect(inner, outer) {
  let {
    center
  } = inner;
  return center.y < outer.top || center.y > outer.top + outer.height;
}
function intersectionWithViewport(rect, viewport = windowRect()) {
  let top = Math.max(rect.top, 0), left = Math.max(rect.left, 0), bottom = Math.min(rect.top + rect.height, viewport.height), right = Math.min(rect.left + rect.width, viewport.width);
  return new Rect({
    top,
    left,
    height: bottom - top,
    width: right - left
  });
}
function windowRect() {
  return new Rect({
    top: window.scrollY,
    left: window.scrollX,
    height: window.innerHeight,
    width: document.body.clientWidth
  });
}

// node_modules/@shopify/polaris/build/esm/components/PositionedOverlay/PositionedOverlay.css.js
var styles15 = {
  PositionedOverlay: "Polaris-PositionedOverlay",
  fixed: "Polaris-PositionedOverlay--fixed",
  calculating: "Polaris-PositionedOverlay--calculating",
  preventInteraction: "Polaris-PositionedOverlay--preventInteraction"
};

// node_modules/@shopify/polaris/build/esm/components/Scrollable/Scrollable.js
import React43, { forwardRef as forwardRef4, useState as useState7, useRef as useRef6, useCallback as useCallback7, useImperativeHandle, useEffect as useEffect7 } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/use-lazy-ref.js
import { useRef as useRef3 } from "react";
var UNIQUE_IDENTIFIER = Symbol("unique_identifier");
function useLazyRef(initialValue) {
  let lazyRef = useRef3(UNIQUE_IDENTIFIER);
  return lazyRef.current === UNIQUE_IDENTIFIER && (lazyRef.current = initialValue()), lazyRef;
}

// node_modules/@shopify/polaris/build/esm/utilities/use-component-did-mount.js
import { useRef as useRef4 } from "react";
function useComponentDidMount(callback) {
  let isAfterInitialMount = useIsAfterInitialMount(), hasInvokedLifeCycle = useRef4(!1);
  if (isAfterInitialMount && !hasInvokedLifeCycle.current)
    return hasInvokedLifeCycle.current = !0, callback();
}

// node_modules/@shopify/polaris/build/esm/components/Scrollable/context.js
import { createContext as createContext14 } from "react";
var ScrollableContext = /* @__PURE__ */ createContext14(void 0);

// node_modules/@shopify/polaris/build/esm/components/Scrollable/Scrollable.css.js
var styles16 = {
  Scrollable: "Polaris-Scrollable",
  hasTopShadow: "Polaris-Scrollable--hasTopShadow",
  hasBottomShadow: "Polaris-Scrollable--hasBottomShadow",
  horizontal: "Polaris-Scrollable--horizontal",
  vertical: "Polaris-Scrollable--vertical",
  scrollbarWidthThin: "Polaris-Scrollable--scrollbarWidthThin",
  scrollbarWidthNone: "Polaris-Scrollable--scrollbarWidthNone",
  scrollbarWidthAuto: "Polaris-Scrollable--scrollbarWidthAuto",
  scrollbarGutterStable: "Polaris-Scrollable--scrollbarGutterStable",
  "scrollbarGutterStableboth-edges": "Polaris-Scrollable__scrollbarGutterStableboth--edges"
};

// node_modules/@shopify/polaris/build/esm/components/Scrollable/components/ScrollTo/ScrollTo.js
import React42, { useRef as useRef5, useContext as useContext7, useEffect as useEffect6, useId as useId2 } from "react";
function ScrollTo() {
  let anchorNode = useRef5(null), scrollToPosition = useContext7(ScrollableContext);
  useEffect6(() => {
    !scrollToPosition || !anchorNode.current || scrollToPosition(anchorNode.current.offsetTop);
  }, [scrollToPosition]);
  let id = useId2();
  return /* @__PURE__ */ React42.createElement("a", {
    id,
    ref: anchorNode
  });
}

// node_modules/@shopify/polaris/build/esm/components/Scrollable/Scrollable.js
var MAX_SCROLL_HINT_DISTANCE = 100, LOW_RES_BUFFER = 2, ScrollableComponent = /* @__PURE__ */ forwardRef4(({
  children,
  className,
  horizontal = !0,
  vertical = !0,
  shadow: shadow2,
  hint,
  focusable,
  scrollbarWidth = "thin",
  scrollbarGutter,
  onScrolledToBottom,
  ...rest
}, forwardedRef) => {
  let [topShadow, setTopShadow] = useState7(!1), [bottomShadow, setBottomShadow] = useState7(!1), stickyManager = useLazyRef(() => new StickyManager()), scrollArea = useRef6(null), scrollTo = useCallback7((scrollY, options = {}) => {
    let optionsBehavior = options.behavior || "smooth", behavior = prefersReducedMotion() ? "auto" : optionsBehavior;
    scrollArea.current?.scrollTo({
      top: scrollY,
      behavior
    });
  }, []), defaultRef = useRef6();
  useImperativeHandle(forwardedRef || defaultRef, () => ({
    scrollTo
  }));
  let handleScroll = useCallback7(() => {
    let currentScrollArea = scrollArea.current;
    currentScrollArea && requestAnimationFrame(() => {
      let {
        scrollTop,
        clientHeight,
        scrollHeight
      } = currentScrollArea, canScroll = Boolean(scrollHeight > clientHeight), isBelowTopOfScroll = Boolean(scrollTop > 0), isAtBottomOfScroll = Boolean(scrollTop + clientHeight >= scrollHeight - LOW_RES_BUFFER);
      setTopShadow(isBelowTopOfScroll), setBottomShadow(!isAtBottomOfScroll), canScroll && isAtBottomOfScroll && onScrolledToBottom && onScrolledToBottom();
    });
  }, [onScrolledToBottom]);
  useComponentDidMount(() => {
    handleScroll(), hint && requestAnimationFrame(() => performScrollHint(scrollArea.current));
  }), useEffect7(() => {
    let currentScrollArea = scrollArea.current;
    if (!currentScrollArea)
      return;
    let handleResize = debounce(handleScroll, 50, {
      trailing: !0
    });
    return stickyManager.current?.setContainer(currentScrollArea), currentScrollArea.addEventListener("scroll", handleScroll), globalThis.addEventListener("resize", handleResize), () => {
      currentScrollArea.removeEventListener("scroll", handleScroll), globalThis.removeEventListener("resize", handleResize);
    };
  }, [stickyManager, handleScroll]);
  let finalClassName = classNames(className, styles16.Scrollable, vertical && styles16.vertical, horizontal && styles16.horizontal, shadow2 && topShadow && styles16.hasTopShadow, shadow2 && bottomShadow && styles16.hasBottomShadow, scrollbarWidth && styles16[variationName("scrollbarWidth", scrollbarWidth)], scrollbarGutter && styles16[variationName("scrollbarGutter", scrollbarGutter.replace(" ", ""))]);
  return /* @__PURE__ */ React43.createElement(ScrollableContext.Provider, {
    value: scrollTo
  }, /* @__PURE__ */ React43.createElement(StickyManagerContext.Provider, {
    value: stickyManager.current
  }, /* @__PURE__ */ React43.createElement("div", Object.assign({
    className: finalClassName
  }, scrollable.props, rest, {
    ref: scrollArea,
    tabIndex: focusable ? 0 : void 0
  }), children)));
});
ScrollableComponent.displayName = "Scrollable";
function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
function performScrollHint(elem) {
  if (!elem || prefersReducedMotion())
    return;
  let scrollableDistance = elem.scrollHeight - elem.clientHeight, distanceToPeek = Math.min(MAX_SCROLL_HINT_DISTANCE, scrollableDistance) - LOW_RES_BUFFER, goBackToTop = () => {
    requestAnimationFrame(() => {
      elem.scrollTop >= distanceToPeek && (elem.removeEventListener("scroll", goBackToTop), elem.scrollTo({
        top: 0,
        behavior: "smooth"
      }));
    });
  };
  elem.addEventListener("scroll", goBackToTop), elem.scrollTo({
    top: MAX_SCROLL_HINT_DISTANCE,
    behavior: "smooth"
  });
}
var forNode = (node) => {
  let closestElement = node.closest(scrollable.selector);
  return closestElement instanceof HTMLElement ? closestElement : document;
}, Scrollable = ScrollableComponent;
Scrollable.ScrollTo = ScrollTo;
Scrollable.forNode = forNode;

// node_modules/@shopify/polaris/build/esm/components/PositionedOverlay/PositionedOverlay.js
var OBSERVER_CONFIG = {
  childList: !0,
  subtree: !0,
  characterData: !0,
  attributeFilter: ["style"]
}, PositionedOverlay = class extends PureComponent2 {
  constructor(props) {
    super(props), this.state = {
      measuring: !0,
      activatorRect: getRectForNode(this.props.activator),
      right: void 0,
      left: void 0,
      top: 0,
      height: 0,
      width: null,
      positioning: "below",
      zIndex: null,
      outsideScrollableContainer: !1,
      lockPosition: !1,
      chevronOffset: 0
    }, this.overlay = null, this.scrollableContainers = [], this.overlayDetails = () => {
      let {
        measuring,
        left,
        right,
        positioning,
        height: height2,
        activatorRect,
        chevronOffset
      } = this.state;
      return {
        measuring,
        left,
        right,
        desiredHeight: height2,
        positioning,
        activatorRect,
        chevronOffset
      };
    }, this.setOverlay = (node) => {
      this.overlay = node;
    }, this.setScrollableContainers = () => {
      let containers = [], scrollableContainer = Scrollable.forNode(this.props.activator);
      if (scrollableContainer)
        for (containers.push(scrollableContainer); scrollableContainer?.parentElement; )
          scrollableContainer = Scrollable.forNode(scrollableContainer.parentElement), containers.push(scrollableContainer);
      this.scrollableContainers = containers;
    }, this.registerScrollHandlers = () => {
      this.scrollableContainers.forEach((node) => {
        node.addEventListener("scroll", this.handleMeasurement);
      });
    }, this.unregisterScrollHandlers = () => {
      this.scrollableContainers.forEach((node) => {
        node.removeEventListener("scroll", this.handleMeasurement);
      });
    }, this.handleMeasurement = () => {
      let {
        lockPosition,
        top
      } = this.state;
      this.observer.disconnect(), this.setState(({
        left,
        top: top2,
        right
      }) => ({
        left,
        right,
        top: top2,
        height: 0,
        positioning: "below",
        measuring: !0
      }), () => {
        if (this.overlay == null || this.firstScrollableContainer == null)
          return;
        let {
          activator,
          preferredPosition = "below",
          preferredAlignment = "center",
          onScrollOut,
          fullWidth,
          fixed,
          preferInputActivator = !0
        } = this.props, preferredActivator = preferInputActivator && activator.querySelector("input") || activator, activatorRect = getRectForNode(preferredActivator), currentOverlayRect = getRectForNode(this.overlay), scrollableElement = isDocument2(this.firstScrollableContainer) ? document.body : this.firstScrollableContainer, scrollableContainerRect = getRectForNode(scrollableElement), overlayRect = fullWidth || preferredPosition === "cover" ? new Rect({
          ...currentOverlayRect,
          width: activatorRect.width
        }) : currentOverlayRect;
        scrollableElement === document.body && (scrollableContainerRect.height = document.body.scrollHeight);
        let topBarOffset = 0, topBarElement = scrollableElement.querySelector(`${dataPolarisTopBar.selector}`);
        topBarElement && (topBarOffset = topBarElement.clientHeight);
        let overlayMargins = this.overlay.firstElementChild && this.overlay.firstChild instanceof HTMLElement ? getMarginsForNode(this.overlay.firstElementChild) : {
          activator: 0,
          container: 0,
          horizontal: 0
        }, containerRect = windowRect(), zIndexForLayer = getZIndexForLayerFromNode(activator), zIndex2 = zIndexForLayer == null ? zIndexForLayer : zIndexForLayer + 1, verticalPosition = calculateVerticalPosition(activatorRect, overlayRect, overlayMargins, scrollableContainerRect, containerRect, preferredPosition, fixed, topBarOffset), horizontalPosition = calculateHorizontalPosition(activatorRect, overlayRect, containerRect, overlayMargins, preferredAlignment), chevronOffset = activatorRect.center.x - horizontalPosition + overlayMargins.horizontal * 2;
        this.setState({
          measuring: !1,
          activatorRect: getRectForNode(activator),
          left: preferredAlignment !== "right" ? horizontalPosition : void 0,
          right: preferredAlignment === "right" ? horizontalPosition : void 0,
          top: lockPosition ? top : verticalPosition.top,
          lockPosition: Boolean(fixed),
          height: verticalPosition.height || 0,
          width: fullWidth || preferredPosition === "cover" ? overlayRect.width : null,
          positioning: verticalPosition.positioning,
          outsideScrollableContainer: onScrollOut != null && rectIsOutsideOfRect(activatorRect, intersectionWithViewport(scrollableContainerRect)),
          zIndex: zIndex2,
          chevronOffset
        }, () => {
          this.overlay && (this.observer.observe(this.overlay, OBSERVER_CONFIG), this.observer.observe(activator, OBSERVER_CONFIG));
        });
      });
    }, this.observer = new MutationObserver(this.handleMeasurement);
  }
  componentDidMount() {
    this.setScrollableContainers(), this.scrollableContainers.length && !this.props.fixed && this.registerScrollHandlers(), this.handleMeasurement();
  }
  componentWillUnmount() {
    this.observer.disconnect(), this.scrollableContainers.length && !this.props.fixed && this.unregisterScrollHandlers();
  }
  componentDidUpdate() {
    let {
      outsideScrollableContainer,
      top
    } = this.state, {
      onScrollOut,
      active
    } = this.props;
    active && onScrollOut != null && top !== 0 && outsideScrollableContainer && onScrollOut();
  }
  render() {
    let {
      left,
      right,
      top,
      zIndex: zIndex2,
      width: width2
    } = this.state, {
      render,
      fixed,
      preventInteraction,
      classNames: propClassNames,
      zIndexOverride
    } = this.props, style = {
      top: top == null || isNaN(top) ? void 0 : top,
      left: left == null || isNaN(left) ? void 0 : left,
      right: right == null || isNaN(right) ? void 0 : right,
      width: width2 == null || isNaN(width2) ? void 0 : width2,
      zIndex: zIndexOverride || zIndex2 || void 0
    }, className = classNames(styles15.PositionedOverlay, fixed && styles15.fixed, preventInteraction && styles15.preventInteraction, propClassNames);
    return /* @__PURE__ */ React44.createElement("div", {
      className,
      style,
      ref: this.setOverlay
    }, /* @__PURE__ */ React44.createElement(EventListener, {
      event: "resize",
      handler: this.handleMeasurement
    }), render(this.overlayDetails()));
  }
  get firstScrollableContainer() {
    return this.scrollableContainers[0] ?? null;
  }
  forceUpdatePosition() {
    requestAnimationFrame(this.handleMeasurement);
  }
};
function getMarginsForNode(node) {
  let nodeStyles = window.getComputedStyle(node);
  return {
    activator: parseFloat(nodeStyles.marginTop || "0"),
    container: parseFloat(nodeStyles.marginBottom || "0"),
    horizontal: parseFloat(nodeStyles.marginLeft || "0")
  };
}
function getZIndexForLayerFromNode(node) {
  let layerNode = node.closest(layer.selector) || document.body, zIndex2 = layerNode === document.body ? "auto" : parseInt(window.getComputedStyle(layerNode).zIndex || "0", 10);
  return zIndex2 === "auto" || isNaN(zIndex2) ? null : zIndex2;
}
function isDocument2(node) {
  return node === document;
}

// node_modules/@shopify/polaris/build/esm/components/Tooltip/components/TooltipOverlay/TooltipOverlay.js
var tailUpPaths = /* @__PURE__ */ React45.createElement(React45.Fragment, null, /* @__PURE__ */ React45.createElement("path", {
  d: "M18.829 8.171 11.862.921A3 3 0 0 0 7.619.838L0 8.171h1.442l6.87-6.612a2 2 0 0 1 2.83.055l6.3 6.557h1.387Z",
  fill: "var(--p-color-tooltip-tail-up-border-experimental)"
}), /* @__PURE__ */ React45.createElement("path", {
  d: "M17.442 10.171h-16v-2l6.87-6.612a2 2 0 0 1 2.83.055l6.3 6.557v2Z",
  fill: "var(--p-color-bg-surface)"
})), tailDownPaths = /* @__PURE__ */ React45.createElement(React45.Fragment, null, /* @__PURE__ */ React45.createElement("path", {
  d: "m0 2 6.967 7.25a3 3 0 0 0 4.243.083L18.829 2h-1.442l-6.87 6.612a2 2 0 0 1-2.83-.055L1.387 2H0Z",
  fill: "var(--p-color-tooltip-tail-down-border-experimental)"
}), /* @__PURE__ */ React45.createElement("path", {
  d: "M1.387 0h16v2l-6.87 6.612a2 2 0 0 1-2.83-.055L1.387 2V0Z",
  fill: "var(--p-color-bg-surface)"
}));
function TooltipOverlay({
  active,
  activator,
  preferredPosition = "above",
  preventInteraction,
  id,
  children,
  accessibilityLabel,
  width: width2,
  padding,
  borderRadius,
  zIndexOverride,
  instant
}) {
  let i18n = useI18n();
  return active ? /* @__PURE__ */ React45.createElement(PositionedOverlay, {
    active,
    activator,
    preferredPosition,
    preventInteraction,
    render: renderTooltip,
    zIndexOverride
  }) : null;
  function renderTooltip(overlayDetails) {
    let {
      measuring,
      desiredHeight,
      positioning,
      chevronOffset
    } = overlayDetails, containerClassName = classNames(styles14.TooltipOverlay, measuring && styles14.measuring, !measuring && styles14.measured, instant && styles14.instant, positioning === "above" && styles14.positionedAbove), contentClassName = classNames(styles14.Content, width2 && styles14[width2]), contentStyles = measuring ? void 0 : {
      minHeight: desiredHeight
    }, style = {
      "--pc-tooltip-chevron-x-pos": `${chevronOffset}px`,
      "--pc-tooltip-border-radius": borderRadius ? `var(--p-border-radius-${borderRadius})` : void 0,
      "--pc-tooltip-padding": padding && padding === "default" ? "var(--p-space-100) var(--p-space-200)" : `var(--p-space-${padding})`
    };
    return /* @__PURE__ */ React45.createElement("div", Object.assign({
      style,
      className: containerClassName
    }, layer.props), /* @__PURE__ */ React45.createElement("svg", {
      className: styles14.Tail,
      width: "19",
      height: "11",
      fill: "none"
    }, positioning === "above" ? tailDownPaths : tailUpPaths), /* @__PURE__ */ React45.createElement("div", {
      id,
      role: "tooltip",
      className: contentClassName,
      style: {
        ...contentStyles,
        ...style
      },
      "aria-label": accessibilityLabel ? i18n.translate("Polaris.TooltipOverlay.accessibilityLabel", {
        label: accessibilityLabel
      }) : void 0
    }, children));
  }
}

// node_modules/@shopify/polaris/build/esm/components/Tooltip/Tooltip.js
var HOVER_OUT_TIMEOUT = 150;
function Tooltip({
  children,
  content,
  dismissOnMouseOut,
  active: originalActive,
  hoverDelay,
  preferredPosition = "above",
  activatorWrapper = "span",
  accessibilityLabel,
  width: width2 = "default",
  padding = "default",
  borderRadius: borderRadiusProp,
  zIndexOverride,
  hasUnderline,
  persistOnClick,
  onOpen,
  onClose
}) {
  let borderRadius = borderRadiusProp || "200", WrapperComponent = activatorWrapper, {
    value: active,
    setTrue: setActiveTrue,
    setFalse: handleBlur
  } = useToggle(Boolean(originalActive)), {
    value: persist,
    toggle: togglePersisting
  } = useToggle(Boolean(originalActive) && Boolean(persistOnClick)), [activatorNode, setActivatorNode] = useState8(null), {
    presenceList,
    addPresence,
    removePresence
  } = useEphemeralPresenceManager(), id = useId3(), activatorContainer = useRef7(null), mouseEntered = useRef7(!1), [shouldAnimate, setShouldAnimate] = useState8(Boolean(!originalActive)), hoverDelayTimeout = useRef7(null), hoverOutTimeout = useRef7(null), handleFocus = useCallback8(() => {
    originalActive !== !1 && setActiveTrue();
  }, [originalActive, setActiveTrue]);
  useEffect8(() => {
    let accessibilityNode = (activatorContainer.current ? findFirstFocusableNode(activatorContainer.current) : null) || activatorContainer.current;
    accessibilityNode && (accessibilityNode.tabIndex = 0, accessibilityNode.setAttribute("aria-describedby", id), accessibilityNode.setAttribute("data-polaris-tooltip-activator", "true"));
  }, [id, children]), useEffect8(() => () => {
    hoverDelayTimeout.current && clearTimeout(hoverDelayTimeout.current), hoverOutTimeout.current && clearTimeout(hoverOutTimeout.current);
  }, []);
  let handleOpen = useCallback8(() => {
    setShouldAnimate(!presenceList.tooltip && !active), onOpen?.(), addPresence("tooltip");
  }, [addPresence, presenceList.tooltip, onOpen, active]), handleClose = useCallback8(() => {
    onClose?.(), setShouldAnimate(!1), hoverOutTimeout.current = setTimeout(() => {
      removePresence("tooltip");
    }, HOVER_OUT_TIMEOUT);
  }, [removePresence, onClose]), handleKeyUp = useCallback8((event) => {
    event.key === "Escape" && (handleClose?.(), handleBlur(), persistOnClick && togglePersisting());
  }, [handleBlur, handleClose, persistOnClick, togglePersisting]);
  useEffect8(() => {
    originalActive === !1 && active && (handleClose(), handleBlur());
  }, [originalActive, active, handleClose, handleBlur]);
  let portal2 = activatorNode ? /* @__PURE__ */ React46.createElement(Portal, {
    idPrefix: "tooltip"
  }, /* @__PURE__ */ React46.createElement(TooltipOverlay, {
    id,
    preferredPosition,
    activator: activatorNode,
    active,
    accessibilityLabel,
    onClose: noop3,
    preventInteraction: dismissOnMouseOut,
    width: width2,
    padding,
    borderRadius,
    zIndexOverride,
    instant: !shouldAnimate
  }, /* @__PURE__ */ React46.createElement(Text, {
    as: "span",
    variant: "bodyMd"
  }, content))) : null, wrapperClassNames = classNames(activatorWrapper === "div" && styles13.TooltipContainer, hasUnderline && styles13.HasUnderline);
  return /* @__PURE__ */ React46.createElement(WrapperComponent, {
    onFocus: () => {
      handleOpen(), handleFocus();
    },
    onBlur: () => {
      handleClose(), handleBlur(), persistOnClick && togglePersisting();
    },
    onMouseLeave: handleMouseLeave,
    onMouseOver: handleMouseEnterFix,
    onMouseDown: persistOnClick ? togglePersisting : void 0,
    ref: setActivator,
    onKeyUp: handleKeyUp,
    className: wrapperClassNames
  }, children, portal2);
  function setActivator(node) {
    let activatorContainerRef = activatorContainer;
    if (node == null) {
      activatorContainerRef.current = null, setActivatorNode(null);
      return;
    }
    node.firstElementChild instanceof HTMLElement && setActivatorNode(node.firstElementChild), activatorContainerRef.current = node;
  }
  function handleMouseEnter() {
    mouseEntered.current = !0, hoverDelay && !presenceList.tooltip ? hoverDelayTimeout.current = setTimeout(() => {
      handleOpen(), handleFocus();
    }, hoverDelay) : (handleOpen(), handleFocus());
  }
  function handleMouseLeave() {
    hoverDelayTimeout.current && (clearTimeout(hoverDelayTimeout.current), hoverDelayTimeout.current = null), mouseEntered.current = !1, handleClose(), persist || handleBlur();
  }
  function handleMouseEnterFix() {
    !mouseEntered.current && handleMouseEnter();
  }
}
function noop3() {
}

// node_modules/@shopify/polaris/build/esm/components/ActionList/components/Item/Item.js
function Item({
  id,
  badge,
  content,
  accessibilityLabel,
  helpText,
  url,
  onAction,
  onMouseEnter,
  icon,
  image,
  prefix,
  suffix,
  disabled,
  external,
  destructive,
  ellipsis,
  truncate,
  active,
  role,
  variant = "default"
}) {
  let className = classNames(styles10.Item, disabled && styles10.disabled, destructive && styles10.destructive, active && styles10.active, variant === "default" && styles10.default, variant === "indented" && styles10.indented, variant === "menu" && styles10.menu), prefixMarkup = null;
  prefix ? prefixMarkup = /* @__PURE__ */ React47.createElement("span", {
    className: styles10.Prefix
  }, prefix) : icon ? prefixMarkup = /* @__PURE__ */ React47.createElement("span", {
    className: styles10.Prefix
  }, /* @__PURE__ */ React47.createElement(Icon, {
    source: icon
  })) : image && (prefixMarkup = /* @__PURE__ */ React47.createElement("span", {
    role: "presentation",
    className: styles10.Prefix,
    style: {
      backgroundImage: `url(${image}`
    }
  }));
  let contentText = content || "";
  truncate && content ? contentText = /* @__PURE__ */ React47.createElement(TruncateText, null, content) : ellipsis && (contentText = `${content}\u2026`);
  let contentMarkup = helpText ? /* @__PURE__ */ React47.createElement(React47.Fragment, null, /* @__PURE__ */ React47.createElement(Box, null, contentText), /* @__PURE__ */ React47.createElement(Text, {
    as: "span",
    variant: "bodySm",
    tone: active || disabled ? void 0 : "subdued"
  }, helpText)) : /* @__PURE__ */ React47.createElement(Text, {
    as: "span",
    variant: "bodyMd",
    fontWeight: active ? "semibold" : "regular"
  }, contentText), badgeMarkup = badge && /* @__PURE__ */ React47.createElement("span", {
    className: styles10.Suffix
  }, /* @__PURE__ */ React47.createElement(Badge, {
    tone: badge.tone
  }, badge.content)), suffixMarkup = suffix && /* @__PURE__ */ React47.createElement(Box, null, /* @__PURE__ */ React47.createElement("span", {
    className: styles10.Suffix
  }, suffix)), textMarkup = /* @__PURE__ */ React47.createElement("span", {
    className: styles10.Text
  }, /* @__PURE__ */ React47.createElement(Text, {
    as: "span",
    variant: "bodyMd",
    fontWeight: active ? "semibold" : "regular"
  }, contentMarkup)), contentElement = /* @__PURE__ */ React47.createElement(InlineStack, {
    blockAlign: "center",
    gap: "150",
    wrap: !1
  }, prefixMarkup, textMarkup, badgeMarkup, suffixMarkup), contentWrapper = /* @__PURE__ */ React47.createElement(Box, {
    width: "100%"
  }, contentElement), scrollMarkup = active ? /* @__PURE__ */ React47.createElement(Scrollable.ScrollTo, null) : null, control = url ? /* @__PURE__ */ React47.createElement(UnstyledLink, {
    id,
    url: disabled ? null : url,
    className,
    external,
    "aria-label": accessibilityLabel,
    onClick: disabled ? null : onAction,
    role
  }, contentWrapper) : /* @__PURE__ */ React47.createElement("button", {
    id,
    type: "button",
    className,
    disabled,
    "aria-label": accessibilityLabel,
    onClick: onAction,
    onMouseUp: handleMouseUpByBlurring,
    role,
    onMouseEnter
  }, contentWrapper);
  return /* @__PURE__ */ React47.createElement(React47.Fragment, null, scrollMarkup, control);
}
var TruncateText = ({
  children
}) => {
  let theme = useTheme(), textRef = useRef8(null), [isOverflowing, setIsOverflowing] = useState9(!1);
  return useIsomorphicLayoutEffect(() => {
    textRef.current && setIsOverflowing(textRef.current.scrollWidth > textRef.current.offsetWidth);
  }, [children]), isOverflowing ? /* @__PURE__ */ React47.createElement(Tooltip, {
    zIndexOverride: Number(theme.zIndex["z-index-11"]),
    preferredPosition: "above",
    hoverDelay: 1e3,
    content: children,
    dismissOnMouseOut: !0
  }, /* @__PURE__ */ React47.createElement(Text, {
    as: "span",
    truncate: !0
  }, children)) : /* @__PURE__ */ React47.createElement(Text, {
    as: "span",
    truncate: !0
  }, /* @__PURE__ */ React47.createElement(Box, {
    width: "100%",
    ref: textRef
  }, children));
};

// node_modules/@shopify/polaris/build/esm/components/ActionList/components/Section/Section.js
function Section({
  section,
  hasMultipleSections,
  isFirst,
  actionRole,
  onActionAnyItem
}) {
  let handleAction = (itemOnAction) => () => {
    itemOnAction && itemOnAction(), onActionAnyItem && onActionAnyItem();
  }, actionMarkup = section.items.map(({
    content,
    helpText,
    onAction,
    ...item
  }, index) => {
    let itemMarkup = /* @__PURE__ */ React48.createElement(Item, Object.assign({
      content,
      helpText,
      role: actionRole,
      onAction: handleAction(onAction)
    }, item));
    return /* @__PURE__ */ React48.createElement(Box, {
      as: "li",
      key: `${content}-${index}`,
      role: actionRole === "menuitem" ? "presentation" : void 0
    }, /* @__PURE__ */ React48.createElement(InlineStack, {
      wrap: !1
    }, itemMarkup));
  }), titleMarkup = null;
  section.title && (titleMarkup = typeof section.title == "string" ? /* @__PURE__ */ React48.createElement(Box, {
    paddingBlockStart: "300",
    paddingBlockEnd: "100",
    paddingInlineStart: "300",
    paddingInlineEnd: "300"
  }, /* @__PURE__ */ React48.createElement(Text, {
    as: "p",
    variant: "headingSm"
  }, section.title)) : /* @__PURE__ */ React48.createElement(Box, {
    padding: "200",
    paddingInlineEnd: "150"
  }, section.title));
  let sectionRole;
  switch (actionRole) {
    case "option":
      sectionRole = "presentation";
      break;
    case "menuitem":
      sectionRole = hasMultipleSections ? "presentation" : "menu";
      break;
    default:
      sectionRole = void 0;
      break;
  }
  let sectionMarkup = /* @__PURE__ */ React48.createElement(React48.Fragment, null, titleMarkup, /* @__PURE__ */ React48.createElement(Box, Object.assign({
    as: "div",
    padding: "150"
  }, hasMultipleSections && {
    paddingBlockStart: "0"
  }, {
    tabIndex: hasMultipleSections ? void 0 : -1
  }), /* @__PURE__ */ React48.createElement(BlockStack, Object.assign({
    gap: "050",
    as: "ul"
  }, sectionRole && {
    role: sectionRole
  }), actionMarkup)));
  return hasMultipleSections ? /* @__PURE__ */ React48.createElement(Box, Object.assign({
    as: "li",
    role: "presentation",
    borderColor: "border-secondary"
  }, !isFirst && {
    borderBlockStartWidth: "025"
  }, !section.title && {
    paddingBlockStart: "150"
  }), sectionMarkup) : sectionMarkup;
}

// node_modules/@shopify/polaris/build/esm/components/KeypressListener/KeypressListener.js
import { useRef as useRef9, useCallback as useCallback9, useEffect as useEffect9 } from "react";
function KeypressListener({
  keyCode,
  handler,
  keyEvent = "keyup",
  options,
  useCapture
}) {
  let tracked = useRef9({
    handler,
    keyCode
  });
  useIsomorphicLayoutEffect(() => {
    tracked.current = {
      handler,
      keyCode
    };
  }, [handler, keyCode]);
  let handleKeyEvent = useCallback9((event) => {
    let {
      handler: handler2,
      keyCode: keyCode2
    } = tracked.current;
    event.keyCode === keyCode2 && handler2(event);
  }, []);
  return useEffect9(() => (document.addEventListener(keyEvent, handleKeyEvent, useCapture || options), () => {
    document.removeEventListener(keyEvent, handleKeyEvent, useCapture || options);
  }), [keyEvent, handleKeyEvent, useCapture, options]), null;
}

// node_modules/@shopify/polaris/build/esm/components/TextField/TextField.js
import React56, { useState as useState10, useId as useId4, useRef as useRef11, useCallback as useCallback11, useEffect as useEffect11, createElement } from "react";

// node_modules/@shopify/polaris/build/esm/components/TextField/TextField.css.js
var styles17 = {
  TextField: "Polaris-TextField",
  ClearButton: "Polaris-TextField__ClearButton",
  Loading: "Polaris-TextField__Loading",
  disabled: "Polaris-TextField--disabled",
  error: "Polaris-TextField--error",
  readOnly: "Polaris-TextField--readOnly",
  Input: "Polaris-TextField__Input",
  Backdrop: "Polaris-TextField__Backdrop",
  multiline: "Polaris-TextField--multiline",
  hasValue: "Polaris-TextField--hasValue",
  focus: "Polaris-TextField--focus",
  VerticalContent: "Polaris-TextField__VerticalContent",
  InputAndSuffixWrapper: "Polaris-TextField__InputAndSuffixWrapper",
  toneMagic: "Polaris-TextField--toneMagic",
  Prefix: "Polaris-TextField__Prefix",
  Suffix: "Polaris-TextField__Suffix",
  AutoSizeWrapper: "Polaris-TextField__AutoSizeWrapper",
  AutoSizeWrapperWithSuffix: "Polaris-TextField__AutoSizeWrapperWithSuffix",
  suggestion: "Polaris-TextField--suggestion",
  borderless: "Polaris-TextField--borderless",
  slim: "Polaris-TextField--slim",
  "Input-hasClearButton": "Polaris-TextField__Input--hasClearButton",
  "Input-suffixed": "Polaris-TextField__Input--suffixed",
  "Input-alignRight": "Polaris-TextField__Input--alignRight",
  "Input-alignLeft": "Polaris-TextField__Input--alignLeft",
  "Input-alignCenter": "Polaris-TextField__Input--alignCenter",
  "Input-autoSize": "Polaris-TextField__Input--autoSize",
  PrefixIcon: "Polaris-TextField__PrefixIcon",
  CharacterCount: "Polaris-TextField__CharacterCount",
  AlignFieldBottom: "Polaris-TextField__AlignFieldBottom",
  Spinner: "Polaris-TextField__Spinner",
  SpinnerIcon: "Polaris-TextField__SpinnerIcon",
  Resizer: "Polaris-TextField__Resizer",
  DummyInput: "Polaris-TextField__DummyInput",
  Segment: "Polaris-TextField__Segment",
  monospaced: "Polaris-TextField--monospaced"
};

// node_modules/@shopify/polaris/build/esm/components/TextField/components/Spinner/Spinner.js
import React49 from "react";
var Spinner2 = /* @__PURE__ */ React49.forwardRef(function({
  onChange,
  onClick,
  onMouseDown,
  onMouseUp,
  onBlur
}, ref) {
  function handleStep(step) {
    return () => onChange(step);
  }
  function handleMouseDown(onChange2) {
    return (event) => {
      event.button === 0 && onMouseDown?.(onChange2);
    };
  }
  return /* @__PURE__ */ React49.createElement("div", {
    className: styles17.Spinner,
    onClick,
    "aria-hidden": !0,
    ref
  }, /* @__PURE__ */ React49.createElement("div", {
    role: "button",
    className: styles17.Segment,
    tabIndex: -1,
    onClick: handleStep(1),
    onMouseDown: handleMouseDown(handleStep(1)),
    onMouseUp,
    onBlur
  }, /* @__PURE__ */ React49.createElement("div", {
    className: styles17.SpinnerIcon
  }, /* @__PURE__ */ React49.createElement(Icon, {
    source: SvgChevronUpIcon
  }))), /* @__PURE__ */ React49.createElement("div", {
    role: "button",
    className: styles17.Segment,
    tabIndex: -1,
    onClick: handleStep(-1),
    onMouseDown: handleMouseDown(handleStep(-1)),
    onMouseUp,
    onBlur
  }, /* @__PURE__ */ React49.createElement("div", {
    className: styles17.SpinnerIcon
  }, /* @__PURE__ */ React49.createElement(Icon, {
    source: SvgChevronDownIcon
  }))));
});

// node_modules/@shopify/polaris/build/esm/components/Labelled/Labelled.js
import React52 from "react";

// node_modules/@shopify/polaris/build/esm/components/Labelled/Labelled.css.js
var styles18 = {
  hidden: "Polaris-Labelled--hidden",
  LabelWrapper: "Polaris-Labelled__LabelWrapper",
  disabled: "Polaris-Labelled--disabled",
  HelpText: "Polaris-Labelled__HelpText",
  readOnly: "Polaris-Labelled--readOnly",
  Error: "Polaris-Labelled__Error",
  Action: "Polaris-Labelled__Action"
};

// node_modules/@shopify/polaris/build/esm/components/InlineError/InlineError.js
import React50 from "react";

// node_modules/@shopify/polaris/build/esm/components/InlineError/InlineError.css.js
var styles19 = {
  InlineError: "Polaris-InlineError",
  Icon: "Polaris-InlineError__Icon"
};

// node_modules/@shopify/polaris/build/esm/components/InlineError/InlineError.js
function InlineError({
  message,
  fieldID
}) {
  return message ? /* @__PURE__ */ React50.createElement("div", {
    id: errorTextID(fieldID),
    className: styles19.InlineError
  }, /* @__PURE__ */ React50.createElement("div", {
    className: styles19.Icon
  }, /* @__PURE__ */ React50.createElement(Icon, {
    source: SvgAlertCircleIcon
  })), /* @__PURE__ */ React50.createElement(Text, {
    as: "span",
    variant: "bodyMd"
  }, message)) : null;
}
function errorTextID(id) {
  return `${id}Error`;
}

// node_modules/@shopify/polaris/build/esm/components/Label/Label.js
import React51 from "react";

// node_modules/@shopify/polaris/build/esm/components/Label/Label.css.js
var styles20 = {
  Label: "Polaris-Label",
  hidden: "Polaris-Label--hidden",
  Text: "Polaris-Label__Text",
  RequiredIndicator: "Polaris-Label__RequiredIndicator"
};

// node_modules/@shopify/polaris/build/esm/components/Label/Label.js
function labelID(id) {
  return `${id}Label`;
}
function Label({
  children,
  id,
  hidden,
  requiredIndicator
}) {
  let className = classNames(styles20.Label, hidden && styles20.hidden);
  return /* @__PURE__ */ React51.createElement("div", {
    className
  }, /* @__PURE__ */ React51.createElement("label", {
    id: labelID(id),
    htmlFor: id,
    className: classNames(styles20.Text, requiredIndicator && styles20.RequiredIndicator)
  }, /* @__PURE__ */ React51.createElement(Text, {
    as: "span",
    variant: "bodyMd"
  }, children)));
}

// node_modules/@shopify/polaris/build/esm/components/Labelled/Labelled.js
function Labelled({
  id,
  label,
  error,
  action: action6,
  helpText,
  children,
  labelHidden,
  requiredIndicator,
  disabled,
  readOnly,
  ...rest
}) {
  let className = classNames(labelHidden && styles18.hidden, disabled && styles18.disabled, readOnly && styles18.readOnly), actionMarkup = action6 ? /* @__PURE__ */ React52.createElement("div", {
    className: styles18.Action
  }, buttonFrom(action6, {
    variant: "plain"
  })) : null, helpTextMarkup = helpText ? /* @__PURE__ */ React52.createElement("div", {
    className: styles18.HelpText,
    id: helpTextID(id),
    "aria-disabled": disabled
  }, /* @__PURE__ */ React52.createElement(Text, {
    as: "span",
    tone: "subdued",
    variant: "bodyMd",
    breakWord: !0
  }, helpText)) : null, errorMarkup = error && typeof error != "boolean" && /* @__PURE__ */ React52.createElement("div", {
    className: styles18.Error
  }, /* @__PURE__ */ React52.createElement(InlineError, {
    message: error,
    fieldID: id
  })), labelMarkup = label ? /* @__PURE__ */ React52.createElement("div", {
    className: styles18.LabelWrapper
  }, /* @__PURE__ */ React52.createElement(Label, Object.assign({
    id,
    requiredIndicator
  }, rest, {
    hidden: !1
  }), label), actionMarkup) : null;
  return /* @__PURE__ */ React52.createElement("div", {
    className
  }, labelMarkup, children, errorMarkup, helpTextMarkup);
}
function helpTextID(id) {
  return `${id}HelpText`;
}

// node_modules/@shopify/polaris/build/esm/components/Connected/Connected.js
import React54 from "react";

// node_modules/@shopify/polaris/build/esm/components/Connected/Connected.css.js
var styles21 = {
  Connected: "Polaris-Connected",
  Item: "Polaris-Connected__Item",
  "Item-primary": "Polaris-Connected__Item--primary",
  "Item-focused": "Polaris-Connected__Item--focused"
};

// node_modules/@shopify/polaris/build/esm/components/Connected/components/Item/Item.js
import React53 from "react";
function Item2({
  children,
  position
}) {
  let {
    value: focused,
    setTrue: forceTrueFocused,
    setFalse: forceFalseFocused
  } = useToggle(!1), className = classNames(styles21.Item, focused && styles21["Item-focused"], position === "primary" ? styles21["Item-primary"] : styles21["Item-connection"]);
  return /* @__PURE__ */ React53.createElement("div", {
    onBlur: forceFalseFocused,
    onFocus: forceTrueFocused,
    className
  }, children);
}

// node_modules/@shopify/polaris/build/esm/components/Connected/Connected.js
function Connected({
  children,
  left,
  right
}) {
  let leftConnectionMarkup = left ? /* @__PURE__ */ React54.createElement(Item2, {
    position: "left"
  }, left) : null, rightConnectionMarkup = right ? /* @__PURE__ */ React54.createElement(Item2, {
    position: "right"
  }, right) : null;
  return /* @__PURE__ */ React54.createElement("div", {
    className: styles21.Connected
  }, leftConnectionMarkup, /* @__PURE__ */ React54.createElement(Item2, {
    position: "primary"
  }, children), rightConnectionMarkup);
}

// node_modules/@shopify/polaris/build/esm/components/TextField/components/Resizer/Resizer.js
import React55, { useRef as useRef10, useEffect as useEffect10, useCallback as useCallback10 } from "react";
function Resizer({
  contents,
  currentHeight: currentHeightProp = null,
  minimumLines,
  onHeightChange
}) {
  let contentNode = useRef10(null), minimumLinesNode = useRef10(null), animationFrame = useRef10(), currentHeight = useRef10(currentHeightProp);
  currentHeightProp !== currentHeight.current && (currentHeight.current = currentHeightProp), useEffect10(() => () => {
    animationFrame.current && cancelAnimationFrame(animationFrame.current);
  }, []);
  let minimumLinesMarkup = minimumLines ? /* @__PURE__ */ React55.createElement("div", {
    ref: minimumLinesNode,
    className: styles17.DummyInput,
    dangerouslySetInnerHTML: {
      __html: getContentsForMinimumLines(minimumLines)
    }
  }) : null, handleHeightCheck = useCallback10(() => {
    animationFrame.current && cancelAnimationFrame(animationFrame.current), animationFrame.current = requestAnimationFrame(() => {
      if (!contentNode.current || !minimumLinesNode.current)
        return;
      let newHeight = Math.max(contentNode.current.offsetHeight, minimumLinesNode.current.offsetHeight);
      newHeight !== currentHeight.current && onHeightChange(newHeight);
    });
  }, [onHeightChange]);
  return useIsomorphicLayoutEffect(() => {
    handleHeightCheck();
  }), /* @__PURE__ */ React55.createElement("div", {
    "aria-hidden": !0,
    className: styles17.Resizer
  }, /* @__PURE__ */ React55.createElement(EventListener, {
    event: "resize",
    handler: handleHeightCheck
  }), /* @__PURE__ */ React55.createElement("div", {
    ref: contentNode,
    className: styles17.DummyInput,
    dangerouslySetInnerHTML: {
      __html: getFinalContents(contents)
    }
  }), minimumLinesMarkup);
}
var ENTITIES_TO_REPLACE = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\n": "<br>",
  "\r": ""
}, REPLACE_REGEX2 = new RegExp(`[${Object.keys(ENTITIES_TO_REPLACE).join()}]`, "g");
function replaceEntity(entity) {
  return ENTITIES_TO_REPLACE[entity];
}
function getContentsForMinimumLines(minimumLines) {
  let content = "";
  for (let line = 0; line < minimumLines; line++)
    content += "<br>";
  return content;
}
function getFinalContents(contents) {
  return contents ? `${contents.replace(REPLACE_REGEX2, replaceEntity)}<br>` : "<br>";
}

// node_modules/@shopify/polaris/build/esm/components/TextField/TextField.js
function TextField({
  prefix,
  suffix,
  verticalContent,
  placeholder,
  value = "",
  helpText,
  label,
  labelAction,
  labelHidden,
  disabled,
  clearButton,
  readOnly,
  autoFocus,
  focused,
  multiline,
  error,
  connectedRight,
  connectedLeft,
  type = "text",
  name,
  id: idProp,
  role,
  step,
  largeStep,
  autoComplete,
  max,
  maxLength,
  maxHeight,
  min,
  minLength,
  pattern,
  inputMode,
  spellCheck,
  ariaOwns,
  ariaControls,
  ariaExpanded,
  ariaActiveDescendant,
  ariaAutocomplete,
  showCharacterCount,
  align,
  requiredIndicator,
  monospaced,
  selectTextOnFocus,
  suggestion,
  variant = "inherit",
  size: size2 = "medium",
  onClearButtonClick,
  onChange,
  onSpinnerChange,
  onFocus,
  onBlur,
  tone,
  autoSize,
  loading
}) {
  let i18n = useI18n(), [height2, setHeight] = useState10(null), [focus, setFocus] = useState10(Boolean(focused)), isAfterInitial = useIsAfterInitialMount(), uniqId = useId4(), id = idProp ?? uniqId, textFieldRef = useRef11(null), inputRef = useRef11(null), textAreaRef = useRef11(null), prefixRef = useRef11(null), suffixRef = useRef11(null), loadingRef = useRef11(null), verticalContentRef = useRef11(null), buttonPressTimer = useRef11(), spinnerRef = useRef11(null), getInputRef = useCallback11(() => multiline ? textAreaRef.current : inputRef.current, [multiline]);
  useEffect11(() => {
    let input2 = getInputRef();
    !input2 || focused === void 0 || (focused ? input2.focus() : input2.blur());
  }, [focused, verticalContent, getInputRef]), useEffect11(() => {
    let input2 = inputRef.current;
    !input2 || !(type === "text" || type === "tel" || type === "search" || type === "url" || type === "password") || !suggestion || input2.setSelectionRange(value.length, suggestion.length);
  }, [focus, value, type, suggestion]);
  let normalizedValue = suggestion || value, normalizedStep = step ?? 1, normalizedMax = max ?? 1 / 0, normalizedMin = min ?? -1 / 0, className = classNames(styles17.TextField, Boolean(normalizedValue) && styles17.hasValue, disabled && styles17.disabled, readOnly && styles17.readOnly, error && styles17.error, tone && styles17[variationName("tone", tone)], multiline && styles17.multiline, focus && !disabled && styles17.focus, variant !== "inherit" && styles17[variant], size2 === "slim" && styles17.slim), inputType = type === "currency" ? "text" : type, isNumericType = type === "number" || type === "integer", iconPrefix = /* @__PURE__ */ React56.isValidElement(prefix) && prefix.type === Icon, prefixMarkup = prefix ? /* @__PURE__ */ React56.createElement("div", {
    className: classNames(styles17.Prefix, iconPrefix && styles17.PrefixIcon),
    id: `${id}-Prefix`,
    ref: prefixRef
  }, /* @__PURE__ */ React56.createElement(Text, {
    as: "span",
    variant: "bodyMd"
  }, prefix)) : null, suffixMarkup = suffix ? /* @__PURE__ */ React56.createElement("div", {
    className: styles17.Suffix,
    id: `${id}-Suffix`,
    ref: suffixRef
  }, /* @__PURE__ */ React56.createElement(Text, {
    as: "span",
    variant: "bodyMd"
  }, suffix)) : null, loadingMarkup = loading ? /* @__PURE__ */ React56.createElement("div", {
    className: styles17.Loading,
    id: `${id}-Loading`,
    ref: loadingRef
  }, /* @__PURE__ */ React56.createElement(Spinner, {
    size: "small"
  })) : null, characterCountMarkup = null;
  if (showCharacterCount) {
    let characterCount = normalizedValue.length, characterCountLabel = maxLength ? i18n.translate("Polaris.TextField.characterCountWithMaxLength", {
      count: characterCount,
      limit: maxLength
    }) : i18n.translate("Polaris.TextField.characterCount", {
      count: characterCount
    }), characterCountClassName = classNames(styles17.CharacterCount, multiline && styles17.AlignFieldBottom), characterCountText = maxLength ? `${characterCount}/${maxLength}` : characterCount;
    characterCountMarkup = /* @__PURE__ */ React56.createElement("div", {
      id: `${id}-CharacterCounter`,
      className: characterCountClassName,
      "aria-label": characterCountLabel,
      "aria-live": focus ? "polite" : "off",
      "aria-atomic": "true",
      onClick: handleClickChild
    }, /* @__PURE__ */ React56.createElement(Text, {
      as: "span",
      variant: "bodyMd"
    }, characterCountText));
  }
  let clearButtonMarkup = clearButton && normalizedValue !== "" ? /* @__PURE__ */ React56.createElement("button", {
    type: "button",
    className: styles17.ClearButton,
    onClick: handleClearButtonPress,
    disabled
  }, /* @__PURE__ */ React56.createElement(Text, {
    as: "span",
    visuallyHidden: !0
  }, i18n.translate("Polaris.Common.clear")), /* @__PURE__ */ React56.createElement(Icon, {
    source: SvgXCircleIcon,
    tone: "base"
  })) : null, handleNumberChange = useCallback11((steps, stepAmount = normalizedStep) => {
    if (onChange == null && onSpinnerChange == null)
      return;
    let dpl = (num) => (num.toString().split(".")[1] || []).length, numericValue = value ? parseFloat(value) : 0;
    if (isNaN(numericValue))
      return;
    let decimalPlaces = type === "integer" ? 0 : Math.max(dpl(numericValue), dpl(stepAmount)), newValue = Math.min(Number(normalizedMax), Math.max(numericValue + steps * stepAmount, Number(normalizedMin)));
    onSpinnerChange != null ? onSpinnerChange(String(newValue.toFixed(decimalPlaces)), id) : onChange?.(String(newValue.toFixed(decimalPlaces)), id);
  }, [id, normalizedMax, normalizedMin, onChange, onSpinnerChange, normalizedStep, type, value]), handleSpinnerButtonRelease = useCallback11(() => {
    clearTimeout(buttonPressTimer.current);
  }, []), handleSpinnerButtonPress = useCallback11((onChange2) => {
    let interval = 200, onChangeInterval = () => {
      interval > 50 && (interval -= 10), onChange2(0), buttonPressTimer.current = window.setTimeout(onChangeInterval, interval);
    };
    buttonPressTimer.current = window.setTimeout(onChangeInterval, interval), document.addEventListener("mouseup", handleSpinnerButtonRelease, {
      once: !0
    });
  }, [handleSpinnerButtonRelease]), spinnerMarkup = isNumericType && step !== 0 && !disabled && !readOnly ? /* @__PURE__ */ React56.createElement(Spinner2, {
    onClick: handleClickChild,
    onChange: handleNumberChange,
    onMouseDown: handleSpinnerButtonPress,
    onMouseUp: handleSpinnerButtonRelease,
    ref: spinnerRef,
    onBlur: handleOnBlur
  }) : null, style = multiline && height2 ? {
    height: height2,
    maxHeight
  } : null, handleExpandingResize = useCallback11((height3) => {
    setHeight(height3);
  }, []), resizer = multiline && isAfterInitial ? /* @__PURE__ */ React56.createElement(Resizer, {
    contents: normalizedValue || placeholder,
    currentHeight: height2,
    minimumLines: typeof multiline == "number" ? multiline : 1,
    onHeightChange: handleExpandingResize
  }) : null, describedBy = [];
  error && describedBy.push(`${id}Error`), helpText && describedBy.push(helpTextID(id)), showCharacterCount && describedBy.push(`${id}-CharacterCounter`);
  let labelledBy = [];
  prefix && labelledBy.push(`${id}-Prefix`), suffix && labelledBy.push(`${id}-Suffix`), verticalContent && labelledBy.push(`${id}-VerticalContent`), labelledBy.unshift(labelID(id));
  let inputClassName = classNames(styles17.Input, align && styles17[variationName("Input-align", align)], suffix && styles17["Input-suffixed"], clearButton && styles17["Input-hasClearButton"], monospaced && styles17.monospaced, suggestion && styles17.suggestion, autoSize && styles17["Input-autoSize"]), handleOnFocus = (event) => {
    setFocus(!0), selectTextOnFocus && !suggestion && getInputRef()?.select(), onFocus && onFocus(event);
  };
  useEventListener("wheel", handleOnWheel, inputRef);
  function handleOnWheel(event) {
    document.activeElement === event.target && isNumericType && event.stopPropagation();
  }
  let input = /* @__PURE__ */ createElement(multiline ? "textarea" : "input", {
    name,
    id,
    disabled,
    readOnly,
    role,
    autoFocus,
    value: normalizedValue,
    placeholder,
    style,
    autoComplete,
    className: inputClassName,
    ref: multiline ? textAreaRef : inputRef,
    min,
    max,
    step,
    minLength,
    maxLength,
    spellCheck,
    pattern,
    inputMode,
    type: inputType,
    rows: getRows(multiline),
    size: autoSize ? 1 : void 0,
    "aria-describedby": describedBy.length ? describedBy.join(" ") : void 0,
    "aria-labelledby": labelledBy.join(" "),
    "aria-invalid": Boolean(error),
    "aria-owns": ariaOwns,
    "aria-activedescendant": ariaActiveDescendant,
    "aria-autocomplete": ariaAutocomplete,
    "aria-controls": ariaControls,
    "aria-expanded": ariaExpanded,
    "aria-required": requiredIndicator,
    ...normalizeAriaMultiline(multiline),
    onFocus: handleOnFocus,
    onBlur: handleOnBlur,
    onClick: handleClickChild,
    onKeyPress: handleKeyPress,
    onKeyDown: handleKeyDown,
    onChange: suggestion ? void 0 : handleChange,
    onInput: suggestion ? handleChange : void 0,
    // 1Password disable data attribute
    "data-1p-ignore": autoComplete === "off" || void 0,
    // LastPass disable data attribute
    "data-lpignore": autoComplete === "off" || void 0,
    // Dashlane disable data attribute
    "data-form-type": autoComplete === "off" ? "other" : void 0
  }), inputWithVerticalContentMarkup = verticalContent ? /* @__PURE__ */ React56.createElement("div", {
    className: styles17.VerticalContent,
    id: `${id}-VerticalContent`,
    ref: verticalContentRef,
    onClick: handleClickChild
  }, verticalContent, input) : null, inputMarkup = verticalContent ? inputWithVerticalContentMarkup : input, backdropMarkup = /* @__PURE__ */ React56.createElement("div", {
    className: classNames(styles17.Backdrop, connectedLeft && styles17["Backdrop-connectedLeft"], connectedRight && styles17["Backdrop-connectedRight"])
  }), inputAndSuffixMarkup = autoSize ? /* @__PURE__ */ React56.createElement("div", {
    className: styles17.InputAndSuffixWrapper
  }, /* @__PURE__ */ React56.createElement("div", {
    className: classNames(styles17.AutoSizeWrapper, suffix && styles17.AutoSizeWrapperWithSuffix),
    "data-auto-size-value": value || placeholder
  }, inputMarkup), suffixMarkup) : /* @__PURE__ */ React56.createElement(React56.Fragment, null, inputMarkup, suffixMarkup);
  return /* @__PURE__ */ React56.createElement(Labelled, {
    label,
    id,
    error,
    action: labelAction,
    labelHidden,
    helpText,
    requiredIndicator,
    disabled,
    readOnly
  }, /* @__PURE__ */ React56.createElement(Connected, {
    left: connectedLeft,
    right: connectedRight
  }, /* @__PURE__ */ React56.createElement("div", {
    className,
    onClick: handleClick,
    ref: textFieldRef
  }, prefixMarkup, inputAndSuffixMarkup, characterCountMarkup, loadingMarkup, clearButtonMarkup, spinnerMarkup, backdropMarkup, resizer)));
  function handleChange(event) {
    onChange && onChange(event.currentTarget.value, id);
  }
  function handleClick(event) {
    let {
      target
    } = event, inputRefRole = inputRef?.current?.getAttribute("role");
    if (target === inputRef.current && inputRefRole === "combobox") {
      inputRef.current?.focus(), handleOnFocus(event);
      return;
    }
    isPrefixOrSuffix(target) || isVerticalContent(target) || isInput(target) || isSpinner(target) || isLoadingSpinner(target) || focus || getInputRef()?.focus();
  }
  function handleClickChild(event) {
    !isSpinner(event.target) && !isInput(event.target) && event.stopPropagation(), !(isPrefixOrSuffix(event.target) || isVerticalContent(event.target) || isInput(event.target) || isLoadingSpinner(event.target) || focus) && (setFocus(!0), getInputRef()?.focus());
  }
  function handleClearButtonPress() {
    onClearButtonClick && onClearButtonClick(id);
  }
  function handleKeyPress(event) {
    let {
      key,
      which
    } = event, numbersSpec = /[\d.,eE+-]$/, integerSpec = /[\deE+-]$/;
    !isNumericType || which === Key.Enter || type === "number" && numbersSpec.test(key) || type === "integer" && integerSpec.test(key) || event.preventDefault();
  }
  function handleKeyDown(event) {
    if (!isNumericType)
      return;
    let {
      key,
      which
    } = event;
    type === "integer" && (key === "ArrowUp" || which === Key.UpArrow) && (handleNumberChange(1), event.preventDefault()), type === "integer" && (key === "ArrowDown" || which === Key.DownArrow) && (handleNumberChange(-1), event.preventDefault()), (which === Key.Home || key === "Home") && min !== void 0 && (onSpinnerChange != null ? onSpinnerChange(String(min), id) : onChange?.(String(min), id)), (which === Key.End || key === "End") && max !== void 0 && (onSpinnerChange != null ? onSpinnerChange(String(max), id) : onChange?.(String(max), id)), (which === Key.PageUp || key === "PageUp") && largeStep !== void 0 && handleNumberChange(1, largeStep), (which === Key.PageDown || key === "PageDown") && largeStep !== void 0 && handleNumberChange(-1, largeStep);
  }
  function handleOnBlur(event) {
    setFocus(!1), !textFieldRef.current?.contains(event?.relatedTarget) && onBlur && onBlur(event);
  }
  function isInput(target) {
    let input2 = getInputRef();
    return target instanceof HTMLElement && input2 && (input2.contains(target) || input2.contains(document.activeElement));
  }
  function isPrefixOrSuffix(target) {
    return target instanceof Element && (prefixRef.current && prefixRef.current.contains(target) || suffixRef.current && suffixRef.current.contains(target));
  }
  function isSpinner(target) {
    return target instanceof Element && spinnerRef.current && spinnerRef.current.contains(target);
  }
  function isLoadingSpinner(target) {
    return target instanceof Element && loadingRef.current && loadingRef.current.contains(target);
  }
  function isVerticalContent(target) {
    return target instanceof Element && verticalContentRef.current && (verticalContentRef.current.contains(target) || verticalContentRef.current.contains(document.activeElement));
  }
}
function getRows(multiline) {
  if (multiline)
    return typeof multiline == "number" ? multiline : 1;
}
function normalizeAriaMultiline(multiline) {
  if (multiline)
    return Boolean(multiline) || typeof multiline == "number" && multiline > 0 ? {
      "aria-multiline": !0
    } : void 0;
}

// node_modules/@shopify/polaris/build/esm/components/ActionList/ActionList.js
var FILTER_ACTIONS_THRESHOLD = 8;
function ActionList({
  items,
  sections = [],
  actionRole,
  allowFiltering,
  onActionAnyItem
}) {
  let i18n = useI18n(), filterActions = useContext8(FilterActionsContext), finalSections = [], actionListRef = useRef12(null), [searchText, setSearchText] = useState11("");
  items ? finalSections = [{
    items
  }, ...sections] : sections && (finalSections = sections);
  let isFilterable = finalSections?.some((section) => section.items.some((item) => typeof item.content == "string")), hasMultipleSections = finalSections.length > 1, elementRole = hasMultipleSections && actionRole === "menuitem" ? "menu" : void 0, elementTabIndex = hasMultipleSections && actionRole === "menuitem" ? -1 : void 0, filteredSections = finalSections?.map((section) => ({
    ...section,
    items: section.items.filter(({
      content
    }) => typeof content == "string" ? content?.toLowerCase().includes(searchText.toLowerCase()) : content)
  })), sectionMarkup = filteredSections.map((section, index) => section.items.length > 0 ? /* @__PURE__ */ React57.createElement(Section, {
    key: typeof section.title == "string" ? section.title : index,
    section,
    hasMultipleSections,
    actionRole,
    onActionAnyItem,
    isFirst: index === 0
  }) : null), handleFocusPreviousItem = (evt) => {
    evt.preventDefault(), actionListRef.current && evt.target && actionListRef.current.contains(evt.target) && wrapFocusPreviousFocusableMenuItem(actionListRef.current, evt.target);
  }, handleFocusNextItem = (evt) => {
    evt.preventDefault(), actionListRef.current && evt.target && actionListRef.current.contains(evt.target) && wrapFocusNextFocusableMenuItem(actionListRef.current, evt.target);
  }, listeners = actionRole === "menuitem" ? /* @__PURE__ */ React57.createElement(React57.Fragment, null, /* @__PURE__ */ React57.createElement(KeypressListener, {
    keyEvent: "keydown",
    keyCode: Key.DownArrow,
    handler: handleFocusNextItem
  }), /* @__PURE__ */ React57.createElement(KeypressListener, {
    keyEvent: "keydown",
    keyCode: Key.UpArrow,
    handler: handleFocusPreviousItem
  })) : null, totalFilteredActions = useMemo5(() => filteredSections?.reduce((acc, section) => acc + section.items.length, 0) || 0, [filteredSections]), hasManyActions = (finalSections?.reduce((acc, section) => acc + section.items.length, 0) || 0) >= FILTER_ACTIONS_THRESHOLD;
  return /* @__PURE__ */ React57.createElement(React57.Fragment, null, (allowFiltering || filterActions) && hasManyActions && isFilterable && /* @__PURE__ */ React57.createElement(Box, {
    padding: "200",
    paddingBlockEnd: totalFilteredActions > 0 ? "0" : "200"
  }, /* @__PURE__ */ React57.createElement(TextField, {
    clearButton: !0,
    labelHidden: !0,
    label: i18n.translate("Polaris.ActionList.SearchField.placeholder"),
    placeholder: i18n.translate("Polaris.ActionList.SearchField.placeholder"),
    autoComplete: "off",
    value: searchText,
    onChange: (value) => setSearchText(value),
    prefix: /* @__PURE__ */ React57.createElement(Icon, {
      source: SvgSearchIcon
    }),
    onClearButtonClick: () => setSearchText("")
  })), /* @__PURE__ */ React57.createElement(Box, {
    as: hasMultipleSections ? "ul" : "div",
    ref: actionListRef,
    role: elementRole,
    tabIndex: elementTabIndex
  }, listeners, sectionMarkup));
}
ActionList.Item = Item;

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/ActionMenu.js
import React68 from "react";

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/ActionMenu.css.js
var styles22 = {
  ActionMenu: "Polaris-ActionMenu"
};

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/RollupActions/RollupActions.js
import React63 from "react";

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/RollupActions/RollupActions.css.js
var styles23 = {
  RollupActivator: "Polaris-ActionMenu-RollupActions__RollupActivator"
};

// node_modules/@shopify/polaris/build/esm/components/Popover/Popover.js
import React62, { forwardRef as forwardRef5, useState as useState12, useRef as useRef13, useId as useId5, useImperativeHandle as useImperativeHandle2, useCallback as useCallback12, useEffect as useEffect12, Children as Children3 } from "react";

// node_modules/@shopify/polaris/build/esm/components/Popover/set-activator-attributes.js
function setActivatorAttributes(activator, {
  id,
  active = !1,
  ariaHaspopup,
  activatorDisabled = !1
}) {
  activatorDisabled || (activator.tabIndex = activator.tabIndex || 0), activator.setAttribute("aria-controls", id), activator.setAttribute("aria-owns", id), activator.setAttribute("aria-expanded", String(active)), activator.setAttribute("data-state", active ? "open" : "closed"), ariaHaspopup != null && activator.setAttribute("aria-haspopup", String(ariaHaspopup));
}

// node_modules/@shopify/polaris/build/esm/components/Popover/components/PopoverOverlay/PopoverOverlay.js
import React61, { PureComponent as PureComponent3, createRef, Children as Children2 } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/components.js
import React58, { isValidElement, Children } from "react";
function wrapWithComponent(element, Component3, props) {
  return element == null ? null : isElementOfType(element, Component3) ? element : /* @__PURE__ */ React58.createElement(Component3, props, element);
}
var isComponent = (AComponent, AnotherComponent) => AComponent === AnotherComponent;
function isElementOfType(element, Component3) {
  if (element == null || !/* @__PURE__ */ isValidElement(element) || typeof element.type == "string")
    return !1;
  let {
    type: defaultType
  } = element, type = element.props?.__type__ || defaultType;
  return (Array.isArray(Component3) ? Component3 : [Component3]).some((AComponent) => typeof type != "string" && isComponent(AComponent, type));
}
function elementChildren(children, predicate = () => !0) {
  return Children.toArray(children).filter((child) => /* @__PURE__ */ isValidElement(child) && predicate(child));
}
function ConditionalWrapper({
  condition,
  wrapper,
  children
}) {
  return condition ? wrapper(children) : children;
}
function ConditionalRender({
  condition,
  children
}) {
  return condition ? children : null;
}

// node_modules/@shopify/polaris/build/esm/components/Popover/Popover.css.js
var styles24 = {
  Popover: "Polaris-Popover",
  PopoverOverlay: "Polaris-Popover__PopoverOverlay",
  "PopoverOverlay-noAnimation": "Polaris-Popover__PopoverOverlay--noAnimation",
  "PopoverOverlay-entering": "Polaris-Popover__PopoverOverlay--entering",
  "PopoverOverlay-open": "Polaris-Popover__PopoverOverlay--open",
  measuring: "Polaris-Popover--measuring",
  "PopoverOverlay-exiting": "Polaris-Popover__PopoverOverlay--exiting",
  fullWidth: "Polaris-Popover--fullWidth",
  Content: "Polaris-Popover__Content",
  positionedAbove: "Polaris-Popover--positionedAbove",
  positionedCover: "Polaris-Popover--positionedCover",
  ContentContainer: "Polaris-Popover__ContentContainer",
  "Content-fullHeight": "Polaris-Popover__Content--fullHeight",
  "Content-fluidContent": "Polaris-Popover__Content--fluidContent",
  Pane: "Polaris-Popover__Pane",
  "Pane-fixed": "Polaris-Popover__Pane--fixed",
  "Pane-subdued": "Polaris-Popover__Pane--subdued",
  "Pane-captureOverscroll": "Polaris-Popover__Pane--captureOverscroll",
  Section: "Polaris-Popover__Section",
  FocusTracker: "Polaris-Popover__FocusTracker",
  "PopoverOverlay-hideOnPrint": "Polaris-Popover__PopoverOverlay--hideOnPrint"
};

// node_modules/@shopify/polaris/build/esm/components/Popover/components/Pane/Pane.js
import React60 from "react";

// node_modules/@shopify/polaris/build/esm/components/Popover/components/Section/Section.js
import React59 from "react";
function Section2({
  children
}) {
  return /* @__PURE__ */ React59.createElement("div", {
    className: styles24.Section
  }, /* @__PURE__ */ React59.createElement(Box, {
    paddingInlineStart: "300",
    paddingInlineEnd: "300",
    paddingBlockStart: "200",
    paddingBlockEnd: "150"
  }, children));
}

// node_modules/@shopify/polaris/build/esm/components/Popover/components/Pane/Pane.js
function Pane({
  captureOverscroll = !1,
  fixed,
  sectioned,
  children,
  height: height2,
  subdued,
  onScrolledToBottom
}) {
  let className = classNames(styles24.Pane, fixed && styles24["Pane-fixed"], subdued && styles24["Pane-subdued"], captureOverscroll && styles24["Pane-captureOverscroll"]), content = sectioned ? wrapWithComponent(children, Section2, {}) : children, style = height2 ? {
    height: height2,
    maxHeight: height2,
    minHeight: height2
  } : void 0;
  return fixed ? /* @__PURE__ */ React60.createElement("div", {
    style,
    className
  }, content) : /* @__PURE__ */ React60.createElement(Scrollable, {
    shadow: !0,
    className,
    style,
    onScrolledToBottom,
    scrollbarWidth: "thin"
  }, content);
}

// node_modules/@shopify/polaris/build/esm/components/Popover/components/PopoverOverlay/PopoverOverlay.js
var PopoverCloseSource;
(function(PopoverCloseSource2) {
  PopoverCloseSource2[PopoverCloseSource2.Click = 0] = "Click", PopoverCloseSource2[PopoverCloseSource2.EscapeKeypress = 1] = "EscapeKeypress", PopoverCloseSource2[PopoverCloseSource2.FocusOut = 2] = "FocusOut", PopoverCloseSource2[PopoverCloseSource2.ScrollOut = 3] = "ScrollOut";
})(PopoverCloseSource || (PopoverCloseSource = {}));
var TransitionStatus;
(function(TransitionStatus2) {
  TransitionStatus2.Entering = "entering", TransitionStatus2.Entered = "entered", TransitionStatus2.Exiting = "exiting", TransitionStatus2.Exited = "exited";
})(TransitionStatus || (TransitionStatus = {}));
var PopoverOverlay = class extends PureComponent3 {
  constructor(props) {
    super(props), this.state = {
      transitionStatus: this.props.active ? TransitionStatus.Entering : TransitionStatus.Exited
    }, this.contentNode = /* @__PURE__ */ createRef(), this.renderPopover = (overlayDetails) => {
      let {
        measuring,
        desiredHeight,
        positioning
      } = overlayDetails, {
        id,
        children,
        sectioned,
        fullWidth,
        fullHeight,
        fluidContent,
        hideOnPrint,
        autofocusTarget,
        captureOverscroll
      } = this.props, isCovering = positioning === "cover", className = classNames(styles24.Popover, measuring && styles24.measuring, (fullWidth || isCovering) && styles24.fullWidth, hideOnPrint && styles24["PopoverOverlay-hideOnPrint"], positioning && styles24[variationName("positioned", positioning)]), contentStyles = measuring ? void 0 : {
        height: desiredHeight
      }, contentClassNames = classNames(styles24.Content, fullHeight && styles24["Content-fullHeight"], fluidContent && styles24["Content-fluidContent"]);
      return /* @__PURE__ */ React61.createElement("div", Object.assign({
        className
      }, overlay.props), /* @__PURE__ */ React61.createElement(EventListener, {
        event: "click",
        handler: this.handleClick
      }), /* @__PURE__ */ React61.createElement(EventListener, {
        event: "touchstart",
        handler: this.handleClick
      }), /* @__PURE__ */ React61.createElement(KeypressListener, {
        keyCode: Key.Escape,
        handler: this.handleEscape
      }), /* @__PURE__ */ React61.createElement("div", {
        className: styles24.FocusTracker,
        tabIndex: 0,
        onFocus: this.handleFocusFirstItem
      }), /* @__PURE__ */ React61.createElement("div", {
        className: styles24.ContentContainer
      }, /* @__PURE__ */ React61.createElement("div", {
        id,
        tabIndex: autofocusTarget === "none" ? void 0 : -1,
        className: contentClassNames,
        style: contentStyles,
        ref: this.contentNode
      }, renderPopoverContent(children, {
        captureOverscroll,
        sectioned
      }))), /* @__PURE__ */ React61.createElement("div", {
        className: styles24.FocusTracker,
        tabIndex: 0,
        onFocus: this.handleFocusLastItem
      }));
    }, this.handleClick = (event) => {
      let target = event.target, {
        contentNode,
        props: {
          activator,
          onClose,
          preventCloseOnChildOverlayClick
        }
      } = this, composedPath = event.composedPath(), wasDescendant = preventCloseOnChildOverlayClick ? wasPolarisPortalDescendant(composedPath, this.context.container) : wasContentNodeDescendant(composedPath, contentNode), isActivatorDescendant = nodeContainsDescendant(activator, target);
      wasDescendant || isActivatorDescendant || this.state.transitionStatus !== TransitionStatus.Entered || onClose(PopoverCloseSource.Click);
    }, this.handleScrollOut = () => {
      this.props.onClose(PopoverCloseSource.ScrollOut);
    }, this.handleEscape = (event) => {
      let target = event.target, {
        contentNode,
        props: {
          activator
        }
      } = this, composedPath = event.composedPath(), wasDescendant = wasContentNodeDescendant(composedPath, contentNode), isActivatorDescendant = nodeContainsDescendant(activator, target);
      (wasDescendant || isActivatorDescendant) && this.props.onClose(PopoverCloseSource.EscapeKeypress);
    }, this.handleFocusFirstItem = () => {
      this.props.onClose(PopoverCloseSource.FocusOut);
    }, this.handleFocusLastItem = () => {
      this.props.onClose(PopoverCloseSource.FocusOut);
    }, this.overlayRef = /* @__PURE__ */ createRef();
  }
  forceUpdatePosition() {
    this.overlayRef.current?.forceUpdatePosition();
  }
  changeTransitionStatus(transitionStatus, cb) {
    this.setState({
      transitionStatus
    }, cb), this.contentNode.current && this.contentNode.current.getBoundingClientRect();
  }
  componentDidMount() {
    this.props.active && (this.focusContent(), this.changeTransitionStatus(TransitionStatus.Entered));
  }
  componentDidUpdate(oldProps) {
    this.props.active && !oldProps.active && (this.focusContent(), this.changeTransitionStatus(TransitionStatus.Entering, () => {
      this.clearTransitionTimeout(), this.enteringTimer = window.setTimeout(() => {
        this.setState({
          transitionStatus: TransitionStatus.Entered
        });
      }, parseInt(themeDefault.motion["motion-duration-100"], 10));
    })), !this.props.active && oldProps.active && (this.clearTransitionTimeout(), this.setState({
      transitionStatus: TransitionStatus.Exited
    }));
  }
  componentWillUnmount() {
    this.clearTransitionTimeout();
  }
  render() {
    let {
      active,
      activator,
      fullWidth,
      preferredPosition = "below",
      preferredAlignment = "center",
      preferInputActivator = !0,
      fixed,
      zIndexOverride
    } = this.props, {
      transitionStatus
    } = this.state;
    if (transitionStatus === TransitionStatus.Exited && !active)
      return null;
    let className = classNames(styles24.PopoverOverlay, transitionStatus === TransitionStatus.Entering && styles24["PopoverOverlay-entering"], transitionStatus === TransitionStatus.Entered && styles24["PopoverOverlay-open"], transitionStatus === TransitionStatus.Exiting && styles24["PopoverOverlay-exiting"], preferredPosition === "cover" && styles24["PopoverOverlay-noAnimation"]);
    return /* @__PURE__ */ React61.createElement(PositionedOverlay, {
      ref: this.overlayRef,
      fullWidth,
      active,
      activator,
      preferInputActivator,
      preferredPosition,
      preferredAlignment,
      render: this.renderPopover.bind(this),
      fixed,
      onScrollOut: this.handleScrollOut,
      classNames: className,
      zIndexOverride
    });
  }
  clearTransitionTimeout() {
    this.enteringTimer && window.clearTimeout(this.enteringTimer);
  }
  focusContent() {
    let {
      autofocusTarget = "container"
    } = this.props;
    autofocusTarget === "none" || this.contentNode == null || requestAnimationFrame(() => {
      if (this.contentNode.current == null)
        return;
      let focusableChild = findFirstKeyboardFocusableNode(this.contentNode.current);
      focusableChild && autofocusTarget === "first-node" ? focusableChild.focus({
        preventScroll: !1
      }) : this.contentNode.current.focus({
        preventScroll: !1
      });
    });
  }
  // eslint-disable-next-line @shopify/react-no-multiple-render-methods
};
PopoverOverlay.contextType = PortalsManagerContext;
function renderPopoverContent(children, props) {
  let childrenArray = Children2.toArray(children);
  return isElementOfType(childrenArray[0], Pane) ? childrenArray : wrapWithComponent(childrenArray, Pane, props);
}
function nodeContainsDescendant(rootNode, descendant) {
  if (rootNode === descendant)
    return !0;
  let parent = descendant.parentNode;
  for (; parent != null; ) {
    if (parent === rootNode)
      return !0;
    parent = parent.parentNode;
  }
  return !1;
}
function wasContentNodeDescendant(composedPath, contentNode) {
  return contentNode.current != null && composedPath.includes(contentNode.current);
}
function wasPolarisPortalDescendant(composedPath, portalsContainerElement) {
  return composedPath.some((eventTarget) => eventTarget instanceof Node && portalsContainerElement?.contains(eventTarget));
}

// node_modules/@shopify/polaris/build/esm/components/Popover/Popover.js
var PopoverComponent = /* @__PURE__ */ forwardRef5(function({
  activatorWrapper = "div",
  children,
  onClose,
  activator,
  preventFocusOnClose,
  active,
  fixed,
  ariaHaspopup,
  preferInputActivator = !0,
  zIndexOverride,
  ...rest
}, ref) {
  let [activatorNode, setActivatorNode] = useState12(), overlayRef = useRef13(null), activatorContainer = useRef13(null), WrapperComponent = activatorWrapper, id = useId5();
  function forceUpdatePosition() {
    overlayRef.current?.forceUpdatePosition();
  }
  useImperativeHandle2(ref, () => ({
    forceUpdatePosition
  }));
  let setAccessibilityAttributes = useCallback12(() => {
    if (activatorContainer.current == null)
      return;
    let focusableActivator = findFirstFocusableNodeIncludingDisabled(activatorContainer.current) || activatorContainer.current, activatorDisabled = "disabled" in focusableActivator && Boolean(focusableActivator.disabled);
    setActivatorAttributes(focusableActivator, {
      id,
      active,
      ariaHaspopup,
      activatorDisabled
    });
  }, [id, active, ariaHaspopup]), handleClose = (source) => {
    if (onClose(source), !(activatorContainer.current == null || preventFocusOnClose)) {
      if (source === PopoverCloseSource.FocusOut && activatorNode) {
        let focusableActivator = findFirstFocusableNodeIncludingDisabled(activatorNode) || findFirstFocusableNodeIncludingDisabled(activatorContainer.current) || activatorContainer.current;
        focusNextFocusableNode(focusableActivator, isInPortal) || focusableActivator.focus();
      } else if (source === PopoverCloseSource.EscapeKeypress && activatorNode) {
        let focusableActivator = findFirstFocusableNodeIncludingDisabled(activatorNode) || findFirstFocusableNodeIncludingDisabled(activatorContainer.current) || activatorContainer.current;
        focusableActivator ? focusableActivator.focus() : focusNextFocusableNode(focusableActivator, isInPortal);
      }
    }
  };
  useEffect12(() => {
    (!activatorNode && activatorContainer.current || activatorNode && activatorContainer.current && !activatorContainer.current.contains(activatorNode)) && setActivatorNode(activatorContainer.current.firstElementChild), setAccessibilityAttributes();
  }, [activatorNode, setAccessibilityAttributes]), useEffect12(() => {
    activatorNode && activatorContainer.current && setActivatorNode(activatorContainer.current.firstElementChild), setAccessibilityAttributes();
  }, [activatorNode, setAccessibilityAttributes]);
  let portal2 = activatorNode ? /* @__PURE__ */ React62.createElement(Portal, {
    idPrefix: "popover"
  }, /* @__PURE__ */ React62.createElement(PopoverOverlay, Object.assign({
    ref: overlayRef,
    id,
    activator: activatorNode,
    preferInputActivator,
    onClose: handleClose,
    active,
    fixed,
    zIndexOverride
  }, rest), children)) : null;
  return /* @__PURE__ */ React62.createElement(WrapperComponent, {
    ref: activatorContainer
  }, Children3.only(activator), portal2);
});
function isInPortal(element) {
  let parentElement = element.parentElement;
  for (; parentElement; ) {
    if (parentElement.matches(portal.selector))
      return !1;
    parentElement = parentElement.parentElement;
  }
  return !0;
}
var Popover2 = Object.assign(PopoverComponent, {
  Pane,
  Section: Section2
});

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/RollupActions/RollupActions.js
function RollupActions({
  accessibilityLabel,
  items = [],
  sections = []
}) {
  let i18n = useI18n(), {
    value: rollupOpen,
    toggle: toggleRollupOpen
  } = useToggle(!1);
  if (items.length === 0 && sections.length === 0)
    return null;
  let activatorMarkup = /* @__PURE__ */ React63.createElement("div", {
    className: styles23.RollupActivator
  }, /* @__PURE__ */ React63.createElement(Button, {
    icon: SvgMenuHorizontalIcon,
    accessibilityLabel: accessibilityLabel || i18n.translate("Polaris.ActionMenu.RollupActions.rollupButton"),
    onClick: toggleRollupOpen
  }));
  return /* @__PURE__ */ React63.createElement(Popover2, {
    active: rollupOpen,
    activator: activatorMarkup,
    preferredAlignment: "right",
    onClose: toggleRollupOpen,
    hideOnPrint: !0
  }, /* @__PURE__ */ React63.createElement(ActionList, {
    items,
    sections,
    onActionAnyItem: toggleRollupOpen
  }));
}

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/Actions/Actions.js
import React67, { useRef as useRef15, useState as useState13, useReducer, useCallback as useCallback15, useEffect as useEffect14, useMemo as useMemo6 } from "react";

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/Actions/Actions.css.js
var styles25 = {
  ActionsLayoutOuter: "Polaris-ActionMenu-Actions__ActionsLayoutOuter",
  ActionsLayout: "Polaris-ActionMenu-Actions__ActionsLayout",
  "ActionsLayout--measuring": "Polaris-ActionMenu-Actions--actionsLayoutMeasuring",
  ActionsLayoutMeasurer: "Polaris-ActionMenu-Actions__ActionsLayoutMeasurer"
};

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/Actions/utilities.js
function getVisibleAndHiddenActionsIndices(actions = [], groups = [], disclosureWidth, actionsWidths, containerWidth) {
  let sumTabWidths = actionsWidths.reduce((sum, width2) => sum + width2, 0), arrayOfActionsIndices = actions.map((_, index) => index), arrayOfGroupsIndices = groups.map((_, index) => index), visibleActions = [], hiddenActions = [], visibleGroups = [], hiddenGroups = [];
  if (containerWidth > sumTabWidths)
    visibleActions.push(...arrayOfActionsIndices), visibleGroups.push(...arrayOfGroupsIndices);
  else {
    let accumulatedWidth = 0;
    arrayOfActionsIndices.forEach((currentActionsIndex) => {
      let currentActionsWidth = actionsWidths[currentActionsIndex];
      if (accumulatedWidth + currentActionsWidth >= containerWidth - disclosureWidth) {
        hiddenActions.push(currentActionsIndex);
        return;
      }
      visibleActions.push(currentActionsIndex), accumulatedWidth += currentActionsWidth;
    }), arrayOfGroupsIndices.forEach((currentGroupsIndex) => {
      let currentActionsWidth = actionsWidths[currentGroupsIndex + actions.length];
      if (accumulatedWidth + currentActionsWidth >= containerWidth - disclosureWidth) {
        hiddenGroups.push(currentGroupsIndex);
        return;
      }
      visibleGroups.push(currentGroupsIndex), accumulatedWidth += currentActionsWidth;
    });
  }
  return {
    visibleActions,
    hiddenActions,
    visibleGroups,
    hiddenGroups
  };
}

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/MenuGroup/MenuGroup.js
import React65, { useCallback as useCallback13 } from "react";

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/MenuGroup/MenuGroup.css.js
var styles26 = {
  Details: "Polaris-ActionMenu-MenuGroup__Details"
};

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/SecondaryAction/SecondaryAction.js
import React64 from "react";

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/SecondaryAction/SecondaryAction.css.js
var styles27 = {
  SecondaryAction: "Polaris-ActionMenu-SecondaryAction",
  critical: "Polaris-ActionMenu-SecondaryAction--critical"
};

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/SecondaryAction/SecondaryAction.js
function SecondaryAction({
  children,
  tone,
  helpText,
  onAction,
  destructive,
  ...rest
}) {
  let buttonMarkup = /* @__PURE__ */ React64.createElement(Button, Object.assign({
    onClick: onAction,
    tone: destructive ? "critical" : void 0
  }, rest), children), actionMarkup = helpText ? /* @__PURE__ */ React64.createElement(Tooltip, {
    preferredPosition: "below",
    content: helpText
  }, buttonMarkup) : buttonMarkup;
  return /* @__PURE__ */ React64.createElement("div", {
    className: classNames(styles27.SecondaryAction, tone === "critical" && styles27.critical)
  }, actionMarkup);
}

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/MenuGroup/MenuGroup.js
function MenuGroup({
  accessibilityLabel,
  active,
  actions,
  details,
  title,
  icon,
  disabled,
  onClick,
  onClose,
  onOpen,
  sections
}) {
  let handleClose = useCallback13(() => {
    onClose(title);
  }, [onClose, title]), handleOpen = useCallback13(() => {
    onOpen(title);
  }, [onOpen, title]), handleClick = useCallback13(() => {
    onClick ? onClick(handleOpen) : handleOpen();
  }, [onClick, handleOpen]), popoverActivator = /* @__PURE__ */ React65.createElement(SecondaryAction, {
    disclosure: !0,
    disabled,
    icon,
    accessibilityLabel,
    onClick: handleClick
  }, title);
  return /* @__PURE__ */ React65.createElement(Popover2, {
    active: Boolean(active),
    activator: popoverActivator,
    preferredAlignment: "left",
    onClose: handleClose,
    hideOnPrint: !0
  }, /* @__PURE__ */ React65.createElement(ActionList, {
    items: actions,
    sections,
    onActionAnyItem: handleClose
  }), details && /* @__PURE__ */ React65.createElement("div", {
    className: styles26.Details
  }, details));
}

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/Actions/components/ActionsMeasurer/ActionsMeasurer.js
import React66, { useRef as useRef14, useCallback as useCallback14, useEffect as useEffect13 } from "react";
var ACTION_SPACING = 8;
function ActionsMeasurer({
  actions = [],
  groups = [],
  handleMeasurement: handleMeasurementProp
}) {
  let i18n = useI18n(), containerNode = useRef14(null), defaultRollupGroup = {
    title: i18n.translate("Polaris.ActionMenu.Actions.moreActions"),
    actions: []
  }, activator = /* @__PURE__ */ React66.createElement(SecondaryAction, {
    disclosure: !0
  }, defaultRollupGroup.title), handleMeasurement = useCallback14(() => {
    if (!containerNode.current)
      return;
    let containerWidth = containerNode.current.offsetWidth, hiddenActionNodes = containerNode.current.children, hiddenActionsWidths = Array.from(hiddenActionNodes).map((node) => Math.ceil(node.getBoundingClientRect().width) + ACTION_SPACING), disclosureWidth = hiddenActionsWidths.pop() || 0;
    handleMeasurementProp({
      containerWidth,
      disclosureWidth,
      hiddenActionsWidths
    });
  }, [handleMeasurementProp]);
  useEffect13(() => {
    handleMeasurement();
  }, [handleMeasurement, actions, groups]);
  let actionsMarkup = actions.map((action6) => {
    let {
      content,
      onAction,
      ...rest
    } = action6;
    return /* @__PURE__ */ React66.createElement(SecondaryAction, Object.assign({
      key: content,
      onClick: onAction
    }, rest), content);
  }), groupsMarkup = groups.map((group) => {
    let {
      title,
      icon
    } = group;
    return /* @__PURE__ */ React66.createElement(SecondaryAction, {
      key: title,
      disclosure: !0,
      icon
    }, title);
  });
  return useEventListener("resize", handleMeasurement), /* @__PURE__ */ React66.createElement("div", {
    className: styles25.ActionsLayoutMeasurer,
    ref: containerNode
  }, actionsMarkup, groupsMarkup, activator);
}

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/Actions/Actions.js
function Actions({
  actions,
  groups,
  onActionRollup
}) {
  let i18n = useI18n(), rollupActiveRef = useRef15(null), [activeMenuGroup, setActiveMenuGroup] = useState13(void 0), [state, setState] = useReducer((data, partialData) => ({
    ...data,
    ...partialData
  }), {
    disclosureWidth: 0,
    containerWidth: 1 / 0,
    actionsWidths: [],
    visibleActions: [],
    hiddenActions: [],
    visibleGroups: [],
    hiddenGroups: [],
    hasMeasured: !1
  }), {
    visibleActions,
    hiddenActions,
    visibleGroups,
    hiddenGroups,
    containerWidth,
    disclosureWidth,
    actionsWidths,
    hasMeasured
  } = state, defaultRollupGroup = {
    title: i18n.translate("Polaris.ActionMenu.Actions.moreActions"),
    actions: []
  }, handleMenuGroupToggle = useCallback15((group) => setActiveMenuGroup(activeMenuGroup ? void 0 : group), [activeMenuGroup]), handleMenuGroupClose = useCallback15(() => setActiveMenuGroup(void 0), []);
  useEffect14(() => {
    if (containerWidth === 0)
      return;
    let {
      visibleActions: visibleActions2,
      visibleGroups: visibleGroups2,
      hiddenActions: hiddenActions2,
      hiddenGroups: hiddenGroups2
    } = getVisibleAndHiddenActionsIndices(actions, groups, disclosureWidth, actionsWidths, containerWidth);
    setState({
      visibleActions: visibleActions2,
      visibleGroups: visibleGroups2,
      hiddenActions: hiddenActions2,
      hiddenGroups: hiddenGroups2,
      hasMeasured: containerWidth !== 1 / 0
    });
  }, [containerWidth, disclosureWidth, actions, groups, actionsWidths, setState]);
  let actionsOrDefault = useMemo6(() => actions ?? [], [actions]), groupsOrDefault = useMemo6(() => groups ?? [], [groups]), actionsMarkup = actionsOrDefault.filter((_, index) => !!visibleActions.includes(index)).map((action6) => {
    let {
      content,
      onAction,
      ...rest
    } = action6;
    return /* @__PURE__ */ React67.createElement(SecondaryAction, Object.assign({
      key: content,
      onClick: onAction
    }, rest), content);
  }), filteredGroups = (hiddenGroups.length > 0 || hiddenActions.length > 0 ? [...groupsOrDefault, defaultRollupGroup] : [...groupsOrDefault]).filter((group, index) => {
    let hasNoGroupsProp = groupsOrDefault.length === 0, isVisibleGroup = visibleGroups.includes(index), isDefaultGroup = group === defaultRollupGroup;
    return hasNoGroupsProp ? hiddenActions.length > 0 : isDefaultGroup ? !0 : isVisibleGroup;
  }), hiddenActionObjects = hiddenActions.map((index) => actionsOrDefault[index]).filter((action6) => action6 != null), hiddenGroupObjects = hiddenGroups.map((index) => groupsOrDefault[index]).filter((group) => group != null), groupsMarkup = filteredGroups.map((group) => {
    let {
      title,
      actions: groupActions,
      ...rest
    } = group, isDefaultGroup = group === defaultRollupGroup, allHiddenItems = [...hiddenActionObjects, ...hiddenGroupObjects], [finalRolledUpActions, finalRolledUpSectionGroups] = allHiddenItems.reduce(([actions2, sections], action6) => (isMenuGroup(action6) ? sections.push({
      title: action6.title,
      items: action6.actions.map((sectionAction) => ({
        ...sectionAction,
        disabled: action6.disabled || sectionAction.disabled
      }))
    }) : actions2.push(action6), [actions2, sections]), [[], []]);
    return isDefaultGroup ? /* @__PURE__ */ React67.createElement(MenuGroup, Object.assign({
      key: title,
      title,
      active: title === activeMenuGroup,
      actions: [...finalRolledUpActions, ...groupActions],
      sections: finalRolledUpSectionGroups
    }, rest, {
      onOpen: handleMenuGroupToggle,
      onClose: handleMenuGroupClose
    })) : /* @__PURE__ */ React67.createElement(MenuGroup, Object.assign({
      key: title,
      title,
      active: title === activeMenuGroup,
      actions: groupActions
    }, rest, {
      onOpen: handleMenuGroupToggle,
      onClose: handleMenuGroupClose
    }));
  }), handleMeasurement = useCallback15((measurements) => {
    let {
      hiddenActionsWidths: actionsWidths2,
      containerWidth: containerWidth2,
      disclosureWidth: disclosureWidth2
    } = measurements, {
      visibleActions: visibleActions2,
      hiddenActions: hiddenActions2,
      visibleGroups: visibleGroups2,
      hiddenGroups: hiddenGroups2
    } = getVisibleAndHiddenActionsIndices(actionsOrDefault, groupsOrDefault, disclosureWidth2, actionsWidths2, containerWidth2);
    if (onActionRollup) {
      let isRollupActive = hiddenActions2.length > 0 || hiddenGroups2.length > 0;
      rollupActiveRef.current !== isRollupActive && (onActionRollup(isRollupActive), rollupActiveRef.current = isRollupActive);
    }
    setState({
      visibleActions: visibleActions2,
      hiddenActions: hiddenActions2,
      visibleGroups: visibleGroups2,
      hiddenGroups: hiddenGroups2,
      actionsWidths: actionsWidths2,
      containerWidth: containerWidth2,
      disclosureWidth: disclosureWidth2,
      hasMeasured: !0
    });
  }, [actionsOrDefault, groupsOrDefault, onActionRollup]), actionsMeasurer = /* @__PURE__ */ React67.createElement(ActionsMeasurer, {
    actions,
    groups,
    handleMeasurement
  });
  return /* @__PURE__ */ React67.createElement("div", {
    className: styles25.ActionsLayoutOuter
  }, actionsMeasurer, /* @__PURE__ */ React67.createElement("div", {
    className: classNames(styles25.ActionsLayout, !hasMeasured && styles25["ActionsLayout--measuring"])
  }, actionsMarkup, groupsMarkup));
}
function isMenuGroup(actionOrMenuGroup) {
  return "title" in actionOrMenuGroup;
}

// node_modules/@shopify/polaris/build/esm/components/ActionMenu/ActionMenu.js
function ActionMenu({
  actions = [],
  groups = [],
  rollup,
  rollupActionsLabel,
  onActionRollup
}) {
  if (actions.length === 0 && groups.length === 0)
    return null;
  let actionMenuClassNames = classNames(styles22.ActionMenu, rollup && styles22.rollup), rollupSections = groups.map((group) => convertGroupToSection(group));
  return /* @__PURE__ */ React68.createElement("div", {
    className: actionMenuClassNames
  }, rollup ? /* @__PURE__ */ React68.createElement(RollupActions, {
    accessibilityLabel: rollupActionsLabel,
    items: actions,
    sections: rollupSections
  }) : /* @__PURE__ */ React68.createElement(Actions, {
    actions,
    groups,
    onActionRollup
  }));
}
function hasGroupsWithActions(groups = []) {
  return groups.length === 0 ? !1 : groups.some((group) => group.actions.length > 0);
}
function convertGroupToSection({
  title,
  actions,
  disabled
}) {
  return {
    title,
    items: actions.map((action6) => ({
      ...action6,
      disabled: disabled || action6.disabled
    }))
  };
}

// node_modules/@shopify/polaris/build/esm/components/Banner/Banner.js
import React71, { forwardRef as forwardRef6, useContext as useContext9, useState as useState15, useRef as useRef17, useCallback as useCallback16, useEffect as useEffect15 } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/banner-context.js
import { createContext as createContext15 } from "react";
var BannerContext = /* @__PURE__ */ createContext15(!1);

// node_modules/@shopify/polaris/build/esm/components/Banner/Banner.css.js
var styles28 = {
  Banner: "Polaris-Banner",
  keyFocused: "Polaris-Banner--keyFocused",
  withinContentContainer: "Polaris-Banner--withinContentContainer",
  withinPage: "Polaris-Banner--withinPage",
  DismissIcon: "Polaris-Banner__DismissIcon",
  "text-success-on-bg-fill": "Polaris-Banner--textSuccessOnBgFill",
  "text-success": "Polaris-Banner__text--success",
  "text-warning-on-bg-fill": "Polaris-Banner--textWarningOnBgFill",
  "text-warning": "Polaris-Banner__text--warning",
  "text-critical-on-bg-fill": "Polaris-Banner--textCriticalOnBgFill",
  "text-critical": "Polaris-Banner__text--critical",
  "text-info-on-bg-fill": "Polaris-Banner--textInfoOnBgFill",
  "text-info": "Polaris-Banner__text--info",
  "icon-secondary": "Polaris-Banner__icon--secondary"
};

// node_modules/@shopify/polaris/build/esm/components/Banner/utilities.js
import { useRef as useRef16, useState as useState14, useImperativeHandle as useImperativeHandle3 } from "react";
var bannerAttributes = {
  success: {
    withinPage: {
      background: "bg-fill-success",
      text: "text-success-on-bg-fill",
      icon: "text-success-on-bg-fill"
    },
    withinContentContainer: {
      background: "bg-surface-success",
      text: "text-success",
      icon: "text-success"
    },
    icon: SvgCheckIcon
  },
  warning: {
    withinPage: {
      background: "bg-fill-warning",
      text: "text-warning-on-bg-fill",
      icon: "text-warning-on-bg-fill"
    },
    withinContentContainer: {
      background: "bg-surface-warning",
      text: "text-warning",
      icon: "text-warning"
    },
    icon: SvgAlertTriangleIcon
  },
  critical: {
    withinPage: {
      background: "bg-fill-critical",
      text: "text-critical-on-bg-fill",
      icon: "text-critical-on-bg-fill"
    },
    withinContentContainer: {
      background: "bg-surface-critical",
      text: "text-critical",
      icon: "text-critical"
    },
    icon: SvgAlertDiamondIcon
  },
  info: {
    withinPage: {
      background: "bg-fill-info",
      text: "text-info-on-bg-fill",
      icon: "text-info-on-bg-fill"
    },
    withinContentContainer: {
      background: "bg-surface-info",
      text: "text-info",
      icon: "text-info"
    },
    icon: SvgInfoIcon
  }
};
function useBannerFocus(bannerRef) {
  let wrapperRef = useRef16(null), [shouldShowFocus, setShouldShowFocus] = useState14(!1);
  return useImperativeHandle3(bannerRef, () => ({
    focus: () => {
      wrapperRef.current?.focus(), setShouldShowFocus(!0);
    }
  }), []), {
    wrapperRef,
    handleKeyUp: (event) => {
      event.target === wrapperRef.current && setShouldShowFocus(!0);
    },
    handleBlur: () => setShouldShowFocus(!1),
    handleMouseUp: (event) => {
      event.currentTarget.blur(), setShouldShowFocus(!1);
    },
    shouldShowFocus
  };
}

// node_modules/@shopify/polaris/build/esm/components/ButtonGroup/ButtonGroup.js
import React70 from "react";

// node_modules/@shopify/polaris/build/esm/components/ButtonGroup/ButtonGroup.css.js
var styles29 = {
  ButtonGroup: "Polaris-ButtonGroup",
  Item: "Polaris-ButtonGroup__Item",
  "Item-plain": "Polaris-ButtonGroup__Item--plain",
  variantSegmented: "Polaris-ButtonGroup--variantSegmented",
  "Item-focused": "Polaris-ButtonGroup__Item--focused",
  fullWidth: "Polaris-ButtonGroup--fullWidth",
  extraTight: "Polaris-ButtonGroup--extraTight",
  tight: "Polaris-ButtonGroup--tight",
  loose: "Polaris-ButtonGroup--loose",
  noWrap: "Polaris-ButtonGroup--noWrap"
};

// node_modules/@shopify/polaris/build/esm/components/ButtonGroup/components/Item/Item.js
import React69 from "react";
function Item3({
  button
}) {
  let {
    value: focused,
    setTrue: forceTrueFocused,
    setFalse: forceFalseFocused
  } = useToggle(!1), className = classNames(styles29.Item, focused && styles29["Item-focused"], button.props.variant === "plain" && styles29["Item-plain"]);
  return /* @__PURE__ */ React69.createElement("div", {
    className,
    onFocus: forceTrueFocused,
    onBlur: forceFalseFocused
  }, button);
}

// node_modules/@shopify/polaris/build/esm/components/ButtonGroup/ButtonGroup.js
function ButtonGroup({
  children,
  gap,
  variant,
  fullWidth,
  connectedTop,
  noWrap
}) {
  let className = classNames(styles29.ButtonGroup, gap && styles29[gap], variant && styles29[variationName("variant", variant)], fullWidth && styles29.fullWidth, noWrap && styles29.noWrap), contents = elementChildren(children).map((child, index) => /* @__PURE__ */ React70.createElement(Item3, {
    button: child,
    key: index
  }));
  return /* @__PURE__ */ React70.createElement("div", {
    className,
    "data-buttongroup-variant": variant,
    "data-buttongroup-connected-top": connectedTop,
    "data-buttongroup-full-width": fullWidth,
    "data-buttongroup-no-wrap": noWrap
  }, contents);
}

// node_modules/@shopify/polaris/build/esm/components/Banner/Banner.js
var Banner = /* @__PURE__ */ forwardRef6(function(props, bannerRef) {
  let {
    tone,
    stopAnnouncements
  } = props, withinContentContainer = useContext9(WithinContentContext), {
    wrapperRef,
    handleKeyUp,
    handleBlur,
    handleMouseUp,
    shouldShowFocus
  } = useBannerFocus(bannerRef), className = classNames(styles28.Banner, shouldShowFocus && styles28.keyFocused, withinContentContainer ? styles28.withinContentContainer : styles28.withinPage);
  return /* @__PURE__ */ React71.createElement(BannerContext.Provider, {
    value: !0
  }, /* @__PURE__ */ React71.createElement("div", {
    className,
    tabIndex: 0,
    ref: wrapperRef,
    role: tone === "warning" || tone === "critical" ? "alert" : "status",
    "aria-live": stopAnnouncements ? "off" : "polite",
    onMouseUp: handleMouseUp,
    onKeyUp: handleKeyUp,
    onBlur: handleBlur
  }, /* @__PURE__ */ React71.createElement(BannerLayout, props)));
});
function BannerLayout({
  tone = "info",
  icon,
  hideIcon,
  onDismiss,
  action: action6,
  secondaryAction,
  title,
  children
}) {
  let i18n = useI18n(), withinContentContainer = useContext9(WithinContentContext), isInlineIconBanner = !title && !withinContentContainer, bannerTone = Object.keys(bannerAttributes).includes(tone) ? tone : "info", bannerColors = bannerAttributes[bannerTone][withinContentContainer ? "withinContentContainer" : "withinPage"], sharedBannerProps = {
    backgroundColor: bannerColors.background,
    textColor: bannerColors.text,
    bannerTitle: title ? /* @__PURE__ */ React71.createElement(Text, {
      as: "h2",
      variant: "headingSm",
      breakWord: !0
    }, title) : null,
    bannerIcon: hideIcon ? null : /* @__PURE__ */ React71.createElement("span", {
      className: styles28[bannerColors.icon]
    }, /* @__PURE__ */ React71.createElement(Icon, {
      source: icon ?? bannerAttributes[bannerTone].icon
    })),
    actionButtons: action6 || secondaryAction ? /* @__PURE__ */ React71.createElement(ButtonGroup, null, action6 && /* @__PURE__ */ React71.createElement(Button, Object.assign({
      onClick: action6.onAction
    }, action6), action6.content), secondaryAction && /* @__PURE__ */ React71.createElement(Button, Object.assign({
      onClick: secondaryAction.onAction
    }, secondaryAction), secondaryAction.content)) : null,
    dismissButton: onDismiss ? /* @__PURE__ */ React71.createElement(Button, {
      variant: "tertiary",
      icon: /* @__PURE__ */ React71.createElement("span", {
        className: styles28[isInlineIconBanner ? "icon-secondary" : bannerColors.icon]
      }, /* @__PURE__ */ React71.createElement(Icon, {
        source: SvgXIcon
      })),
      onClick: onDismiss,
      accessibilityLabel: i18n.translate("Polaris.Banner.dismissButton")
    }) : null
  }, childrenMarkup = children ? /* @__PURE__ */ React71.createElement(Text, {
    as: "span",
    variant: "bodyMd"
  }, children) : null;
  return withinContentContainer ? /* @__PURE__ */ React71.createElement(WithinContentContainerBanner, sharedBannerProps, childrenMarkup) : isInlineIconBanner ? /* @__PURE__ */ React71.createElement(InlineIconBanner, sharedBannerProps, childrenMarkup) : /* @__PURE__ */ React71.createElement(DefaultBanner, sharedBannerProps, childrenMarkup);
}
function DefaultBanner({
  backgroundColor,
  textColor,
  bannerTitle,
  bannerIcon,
  actionButtons,
  dismissButton,
  children
}) {
  let {
    smUp
  } = useBreakpoints(), hasContent = children || actionButtons;
  return /* @__PURE__ */ React71.createElement(Box, {
    width: "100%"
  }, /* @__PURE__ */ React71.createElement(BlockStack, {
    align: "space-between"
  }, /* @__PURE__ */ React71.createElement(Box, {
    background: backgroundColor,
    color: textColor,
    borderStartStartRadius: smUp ? "300" : void 0,
    borderStartEndRadius: smUp ? "300" : void 0,
    borderEndStartRadius: !hasContent && smUp ? "300" : void 0,
    borderEndEndRadius: !hasContent && smUp ? "300" : void 0,
    padding: "300"
  }, /* @__PURE__ */ React71.createElement(InlineStack, {
    align: "space-between",
    blockAlign: "center",
    gap: "200",
    wrap: !1
  }, /* @__PURE__ */ React71.createElement(InlineStack, {
    gap: "100",
    wrap: !1
  }, bannerIcon, bannerTitle), dismissButton)), hasContent && /* @__PURE__ */ React71.createElement(Box, {
    padding: {
      xs: "300",
      md: "400"
    },
    paddingBlockStart: "300"
  }, /* @__PURE__ */ React71.createElement(BlockStack, {
    gap: "200"
  }, /* @__PURE__ */ React71.createElement("div", null, children), actionButtons))));
}
function InlineIconBanner({
  backgroundColor,
  bannerIcon,
  actionButtons,
  dismissButton,
  children
}) {
  let [blockAlign, setBlockAlign] = useState15("center"), contentNode = useRef17(null), iconNode = useRef17(null), dismissIconNode = useRef17(null), handleResize = useCallback16(() => {
    let contentHeight = contentNode.current?.offsetHeight, iconBoxHeight = iconNode.current?.offsetHeight || dismissIconNode.current?.offsetHeight;
    !contentHeight || !iconBoxHeight || (contentHeight > iconBoxHeight ? setBlockAlign("start") : setBlockAlign("center"));
  }, []);
  return useEffect15(() => handleResize(), [handleResize]), useEventListener("resize", handleResize), /* @__PURE__ */ React71.createElement(Box, {
    width: "100%",
    padding: "300",
    borderRadius: "300"
  }, /* @__PURE__ */ React71.createElement(InlineStack, {
    align: "space-between",
    blockAlign,
    wrap: !1
  }, /* @__PURE__ */ React71.createElement(Box, {
    width: "100%"
  }, /* @__PURE__ */ React71.createElement(InlineStack, {
    gap: "200",
    wrap: !1,
    blockAlign
  }, bannerIcon ? /* @__PURE__ */ React71.createElement("div", {
    ref: iconNode
  }, /* @__PURE__ */ React71.createElement(Box, {
    background: backgroundColor,
    borderRadius: "200",
    padding: "100"
  }, bannerIcon)) : null, /* @__PURE__ */ React71.createElement(Box, {
    ref: contentNode,
    width: "100%"
  }, /* @__PURE__ */ React71.createElement(BlockStack, {
    gap: "200"
  }, /* @__PURE__ */ React71.createElement("div", null, children), actionButtons)))), /* @__PURE__ */ React71.createElement("div", {
    ref: dismissIconNode,
    className: styles28.DismissIcon
  }, dismissButton)));
}
function WithinContentContainerBanner({
  backgroundColor,
  textColor,
  bannerTitle,
  bannerIcon,
  actionButtons,
  dismissButton,
  children
}) {
  return /* @__PURE__ */ React71.createElement(Box, {
    width: "100%",
    background: backgroundColor,
    padding: "200",
    borderRadius: "200",
    color: textColor
  }, /* @__PURE__ */ React71.createElement(InlineStack, {
    align: "space-between",
    blockAlign: "start",
    wrap: !1,
    gap: "200"
  }, /* @__PURE__ */ React71.createElement(InlineStack, {
    gap: "150",
    wrap: !1
  }, bannerIcon, /* @__PURE__ */ React71.createElement(Box, {
    width: "100%"
  }, /* @__PURE__ */ React71.createElement(BlockStack, {
    gap: "200"
  }, /* @__PURE__ */ React71.createElement(BlockStack, {
    gap: "050"
  }, bannerTitle, /* @__PURE__ */ React71.createElement("div", null, children)), actionButtons))), dismissButton));
}

// node_modules/@shopify/polaris/build/esm/components/Bleed/Bleed.js
import React72 from "react";

// node_modules/@shopify/polaris/build/esm/components/Bleed/Bleed.css.js
var styles30 = {
  Bleed: "Polaris-Bleed"
};

// node_modules/@shopify/polaris/build/esm/components/Bleed/Bleed.js
var Bleed = ({
  marginInline,
  marginBlock,
  marginBlockStart,
  marginBlockEnd,
  marginInlineStart,
  marginInlineEnd,
  children
}) => {
  let getNegativeMargins = (direction) => {
    let xAxis = ["marginInlineStart", "marginInlineEnd"], yAxis = ["marginBlockStart", "marginBlockEnd"], directionValues = {
      marginBlockStart,
      marginBlockEnd,
      marginInlineStart,
      marginInlineEnd,
      marginInline,
      marginBlock
    };
    if (directionValues[direction])
      return directionValues[direction];
    if (xAxis.includes(direction) && marginInline)
      return directionValues.marginInline;
    if (yAxis.includes(direction) && marginBlock)
      return directionValues.marginBlock;
  }, negativeMarginBlockStart = getNegativeMargins("marginBlockStart"), negativeMarginBlockEnd = getNegativeMargins("marginBlockEnd"), negativeMarginInlineStart = getNegativeMargins("marginInlineStart"), negativeMarginInlineEnd = getNegativeMargins("marginInlineEnd"), style = {
    ...getResponsiveProps("bleed", "margin-block-start", "space", negativeMarginBlockStart),
    ...getResponsiveProps("bleed", "margin-block-end", "space", negativeMarginBlockEnd),
    ...getResponsiveProps("bleed", "margin-inline-start", "space", negativeMarginInlineStart),
    ...getResponsiveProps("bleed", "margin-inline-end", "space", negativeMarginInlineEnd)
  };
  return /* @__PURE__ */ React72.createElement("div", {
    className: styles30.Bleed,
    style: sanitizeCustomProperties(style)
  }, children);
};

// node_modules/@shopify/polaris/build/esm/components/Breadcrumbs/Breadcrumbs.js
import React73 from "react";
function Breadcrumbs({
  backAction
}) {
  let {
    content
  } = backAction;
  return /* @__PURE__ */ React73.createElement(Button, {
    key: content,
    url: "url" in backAction ? backAction.url : void 0,
    onClick: "onAction" in backAction ? backAction.onAction : void 0,
    onPointerDown: handleMouseUpByBlurring,
    icon: SvgArrowLeftIcon,
    accessibilityLabel: backAction.accessibilityLabel ?? content
  });
}

// node_modules/@shopify/polaris/build/esm/components/DataTable/DataTable.js
import React79, { PureComponent as PureComponent4, createRef as createRef3 } from "react";
import isEqual from "react-fast-compare";

// node_modules/@shopify/polaris/build/esm/components/DataTable/utilities.js
function measureColumn(tableData) {
  return function(column, index) {
    let {
      firstVisibleColumnIndex,
      tableLeftVisibleEdge: tableStart,
      tableRightVisibleEdge: tableEnd
    } = tableData, leftEdge = column.offsetLeft, rightEdge = leftEdge + column.offsetWidth, isVisibleLeft = isEdgeVisible(leftEdge, tableStart, tableEnd, "left"), isVisibleRight = isEdgeVisible(rightEdge, tableStart, tableEnd, "right"), isVisible = isVisibleLeft || isVisibleRight, width2 = column.offsetWidth;
    return isVisible && (tableData.firstVisibleColumnIndex = Math.min(firstVisibleColumnIndex, index)), {
      leftEdge,
      rightEdge,
      isVisible,
      width: width2,
      index
    };
  };
}
function isEdgeVisible(position, start, end, edgeType) {
  return position >= start + (edgeType === "left" ? 0 : 30) && position <= end - 30;
}
function getPrevAndCurrentColumns(tableData, columnData) {
  let {
    firstVisibleColumnIndex
  } = tableData, previousColumnIndex = Math.max(firstVisibleColumnIndex - 1, 0), previousColumn = columnData[previousColumnIndex], currentColumn = columnData[firstVisibleColumnIndex];
  return {
    previousColumn,
    currentColumn
  };
}

// node_modules/@shopify/polaris/build/esm/components/DataTable/DataTable.css.js
var styles31 = {
  DataTable: "Polaris-DataTable",
  condensed: "Polaris-DataTable--condensed",
  Navigation: "Polaris-DataTable__Navigation",
  Pip: "Polaris-DataTable__Pip",
  "Pip-visible": "Polaris-DataTable__Pip--visible",
  ScrollContainer: "Polaris-DataTable__ScrollContainer",
  Table: "Polaris-DataTable__Table",
  TableRow: "Polaris-DataTable__TableRow",
  Cell: "Polaris-DataTable__Cell",
  IncreasedTableDensity: "Polaris-DataTable__IncreasedTableDensity",
  ZebraStripingOnData: "Polaris-DataTable__ZebraStripingOnData",
  RowCountIsEven: "Polaris-DataTable__RowCountIsEven",
  ShowTotalsInFooter: "Polaris-DataTable__ShowTotalsInFooter",
  "Cell-separate": "Polaris-DataTable__Cell--separate",
  "Cell-firstColumn": "Polaris-DataTable__Cell--firstColumn",
  "Cell-numeric": "Polaris-DataTable__Cell--numeric",
  "Cell-truncated": "Polaris-DataTable__Cell--truncated",
  "Cell-header": "Polaris-DataTable__Cell--header",
  "Cell-sortable": "Polaris-DataTable__Cell--sortable",
  "Heading-left": "Polaris-DataTable__Heading--left",
  "Cell-verticalAlignTop": "Polaris-DataTable__Cell--verticalAlignTop",
  "Cell-verticalAlignBottom": "Polaris-DataTable__Cell--verticalAlignBottom",
  "Cell-verticalAlignMiddle": "Polaris-DataTable__Cell--verticalAlignMiddle",
  "Cell-verticalAlignBaseline": "Polaris-DataTable__Cell--verticalAlignBaseline",
  hoverable: "Polaris-DataTable--hoverable",
  "Cell-hovered": "Polaris-DataTable__Cell--hovered",
  Icon: "Polaris-DataTable__Icon",
  Heading: "Polaris-DataTable__Heading",
  StickyHeaderEnabled: "Polaris-DataTable__StickyHeaderEnabled",
  StickyHeaderWrapper: "Polaris-DataTable__StickyHeaderWrapper",
  "Cell-sorted": "Polaris-DataTable__Cell--sorted",
  "Cell-total": "Polaris-DataTable__Cell--total",
  ShowTotals: "Polaris-DataTable__ShowTotals",
  "Cell-total-footer": "Polaris-DataTable--cellTotalFooter",
  Footer: "Polaris-DataTable__Footer",
  StickyHeaderInner: "Polaris-DataTable__StickyHeaderInner",
  "StickyHeaderInner-isSticky": "Polaris-DataTable__StickyHeaderInner--isSticky",
  StickyHeaderTable: "Polaris-DataTable__StickyHeaderTable",
  FixedFirstColumn: "Polaris-DataTable__FixedFirstColumn",
  StickyTableHeadingsRow: "Polaris-DataTable__StickyTableHeadingsRow",
  TooltipContent: "Polaris-DataTable__TooltipContent"
};

// node_modules/@shopify/polaris/build/esm/components/DataTable/components/Cell/Cell.js
import React74, { useRef as useRef18 } from "react";
function Cell({
  content,
  contentType,
  nthColumn,
  firstColumn,
  truncate,
  header,
  total,
  totalInFooter,
  sorted,
  sortable,
  sortDirection,
  inFixedNthColumn,
  verticalAlign = "top",
  defaultSortDirection = "ascending",
  onSort,
  colSpan,
  setRef = () => {
  },
  stickyHeadingCell = !1,
  stickyCellWidth,
  hovered = !1,
  handleFocus = () => {
  },
  hasFixedNthColumn = !1,
  fixedCellVisible = !1,
  firstColumnMinWidth,
  style,
  lastFixedFirstColumn
}) {
  let i18n = useI18n(), numeric = contentType === "numeric", className = classNames(styles31.Cell, styles31[`Cell-${variationName("verticalAlign", verticalAlign)}`], firstColumn && styles31["Cell-firstColumn"], truncate && styles31["Cell-truncated"], header && styles31["Cell-header"], total && styles31["Cell-total"], totalInFooter && styles31["Cell-total-footer"], numeric && styles31["Cell-numeric"], sortable && styles31["Cell-sortable"], sorted && styles31["Cell-sorted"], stickyHeadingCell && styles31.StickyHeaderCell, hovered && styles31["Cell-hovered"], lastFixedFirstColumn && inFixedNthColumn && fixedCellVisible && styles31["Cell-separate"], nthColumn && inFixedNthColumn && stickyHeadingCell && styles31.FixedFirstColumn), headerClassName = classNames(header && styles31.Heading, header && contentType === "text" && styles31["Heading-left"]), iconClassName = classNames(sortable && styles31.Icon), direction = sorted && sortDirection ? sortDirection : defaultSortDirection, source = direction === "descending" ? SvgSortDescendingIcon : SvgSortAscendingIcon, oppositeDirection = sortDirection === "ascending" ? "descending" : "ascending", sortAccessibilityLabel = i18n.translate("Polaris.DataTable.sortAccessibilityLabel", {
    direction: sorted ? oppositeDirection : direction
  }), iconMarkup = /* @__PURE__ */ React74.createElement("span", {
    className: iconClassName
  }, /* @__PURE__ */ React74.createElement(Icon, {
    source,
    accessibilityLabel: sortAccessibilityLabel
  })), focusable = !(stickyHeadingCell && hasFixedNthColumn && nthColumn && !inFixedNthColumn), columnHeadingContent = sortable ? /* @__PURE__ */ React74.createElement("button", {
    className: headerClassName,
    onClick: onSort,
    onFocus: handleFocus,
    tabIndex: focusable ? 0 : -1
  }, iconMarkup, content) : content, colSpanProp = colSpan && colSpan > 1 ? {
    colSpan
  } : {}, minWidthStyles = nthColumn && firstColumnMinWidth ? {
    minWidth: firstColumnMinWidth
  } : {
    minWidth: stickyCellWidth
  }, stickyHeading = /* @__PURE__ */ React74.createElement("th", Object.assign({
    ref: setRef
  }, headerCell.props, colSpanProp, {
    className,
    "aria-sort": sortDirection,
    style: {
      ...style,
      ...minWidthStyles
    },
    "data-index-table-sticky-heading": !0
  }), columnHeadingContent), headingMarkup = header ? /* @__PURE__ */ React74.createElement("th", Object.assign({}, headerCell.props, {
    "aria-sort": sortDirection
  }, colSpanProp, {
    ref: setRef,
    className,
    scope: "col",
    style: {
      ...minWidthStyles
    }
  }), columnHeadingContent) : /* @__PURE__ */ React74.createElement("th", Object.assign({}, colSpanProp, {
    ref: setRef,
    className,
    scope: "row",
    style: {
      ...minWidthStyles
    }
  }), truncate ? /* @__PURE__ */ React74.createElement(TruncatedText, {
    className: styles31.TooltipContent
  }, content) : content), cellMarkup = header || firstColumn || nthColumn ? headingMarkup : /* @__PURE__ */ React74.createElement("td", Object.assign({
    className
  }, colSpanProp), content);
  return stickyHeadingCell ? stickyHeading : cellMarkup;
}
var TruncatedText = ({
  children,
  className = ""
}) => {
  let textRef = useRef18(null), {
    current
  } = textRef, text2 = /* @__PURE__ */ React74.createElement("span", {
    ref: textRef,
    className
  }, children);
  return current?.scrollWidth > current?.offsetWidth ? /* @__PURE__ */ React74.createElement(Tooltip, {
    content: textRef.current.innerText
  }, text2) : text2;
};

// node_modules/@shopify/polaris/build/esm/components/Pagination/Pagination.js
import React75, { createRef as createRef2 } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/is-input-focused.js
var EditableTarget;
(function(EditableTarget2) {
  EditableTarget2.Input = "INPUT", EditableTarget2.Textarea = "TEXTAREA", EditableTarget2.Select = "SELECT", EditableTarget2.ContentEditable = "contenteditable";
})(EditableTarget || (EditableTarget = {}));
function isInputFocused() {
  if (document == null || document.activeElement == null)
    return !1;
  let {
    tagName
  } = document.activeElement;
  return tagName === EditableTarget.Input || tagName === EditableTarget.Textarea || tagName === EditableTarget.Select || document.activeElement.hasAttribute(EditableTarget.ContentEditable);
}

// node_modules/@shopify/polaris/build/esm/components/Pagination/Pagination.css.js
var styles32 = {
  Pagination: "Polaris-Pagination",
  table: "Polaris-Pagination--table",
  TablePaginationActions: "Polaris-Pagination__TablePaginationActions"
};

// node_modules/@shopify/polaris/build/esm/components/Pagination/Pagination.js
function Pagination({
  hasNext,
  hasPrevious,
  nextURL,
  previousURL,
  onNext,
  onPrevious,
  nextTooltip,
  previousTooltip,
  nextKeys,
  previousKeys,
  accessibilityLabel,
  accessibilityLabels,
  label,
  type = "page"
}) {
  let i18n = useI18n(), node = /* @__PURE__ */ createRef2(), navLabel = accessibilityLabel || i18n.translate("Polaris.Pagination.pagination"), previousLabel = accessibilityLabels?.previous || i18n.translate("Polaris.Pagination.previous"), nextLabel = accessibilityLabels?.next || i18n.translate("Polaris.Pagination.next"), prev = /* @__PURE__ */ React75.createElement(Button, {
    icon: SvgChevronLeftIcon,
    accessibilityLabel: previousLabel,
    url: previousURL,
    onClick: onPrevious,
    disabled: !hasPrevious,
    id: "previousURL"
  }), constructedPrevious = previousTooltip && hasPrevious ? /* @__PURE__ */ React75.createElement(Tooltip, {
    activatorWrapper: "span",
    content: previousTooltip,
    preferredPosition: "below"
  }, prev) : prev, next = /* @__PURE__ */ React75.createElement(Button, {
    icon: SvgChevronRightIcon,
    accessibilityLabel: nextLabel,
    url: nextURL,
    onClick: onNext,
    disabled: !hasNext,
    id: "nextURL"
  }), constructedNext = nextTooltip && hasNext ? /* @__PURE__ */ React75.createElement(Tooltip, {
    activatorWrapper: "span",
    content: nextTooltip,
    preferredPosition: "below"
  }, next) : next, previousHandler = onPrevious || noop4, previousButtonEvents = previousKeys && (previousURL || onPrevious) && hasPrevious && previousKeys.map((key) => /* @__PURE__ */ React75.createElement(KeypressListener, {
    key,
    keyCode: key,
    handler: handleCallback(previousURL ? clickPaginationLink("previousURL", node) : previousHandler)
  })), nextHandler = onNext || noop4, nextButtonEvents = nextKeys && (nextURL || onNext) && hasNext && nextKeys.map((key) => /* @__PURE__ */ React75.createElement(KeypressListener, {
    key,
    keyCode: key,
    handler: handleCallback(nextURL ? clickPaginationLink("nextURL", node) : nextHandler)
  }));
  if (type === "table") {
    let labelMarkup2 = label ? /* @__PURE__ */ React75.createElement(Box, {
      padding: "300",
      paddingBlockStart: "0",
      paddingBlockEnd: "0"
    }, /* @__PURE__ */ React75.createElement(Text, {
      as: "span",
      variant: "bodySm",
      fontWeight: "medium"
    }, label)) : null;
    return /* @__PURE__ */ React75.createElement("nav", {
      "aria-label": navLabel,
      ref: node,
      className: classNames(styles32.Pagination, styles32.table)
    }, previousButtonEvents, nextButtonEvents, /* @__PURE__ */ React75.createElement(Box, {
      background: "bg-surface-secondary",
      paddingBlockStart: "150",
      paddingBlockEnd: "150",
      paddingInlineStart: "300",
      paddingInlineEnd: "200"
    }, /* @__PURE__ */ React75.createElement(InlineStack, {
      align: "center",
      blockAlign: "center"
    }, /* @__PURE__ */ React75.createElement("div", {
      className: styles32.TablePaginationActions,
      "data-buttongroup-variant": "segmented"
    }, /* @__PURE__ */ React75.createElement("div", null, constructedPrevious), labelMarkup2, /* @__PURE__ */ React75.createElement("div", null, constructedNext)))));
  }
  let labelTextMarkup = hasNext && hasPrevious ? /* @__PURE__ */ React75.createElement("span", null, label) : /* @__PURE__ */ React75.createElement(Text, {
    tone: "subdued",
    as: "span"
  }, label), labelMarkup = label ? /* @__PURE__ */ React75.createElement(Box, {
    padding: "300",
    paddingBlockStart: "0",
    paddingBlockEnd: "0"
  }, /* @__PURE__ */ React75.createElement("div", {
    "aria-live": "polite"
  }, labelTextMarkup)) : null;
  return /* @__PURE__ */ React75.createElement("nav", {
    "aria-label": navLabel,
    ref: node,
    className: styles32.Pagination
  }, previousButtonEvents, nextButtonEvents, /* @__PURE__ */ React75.createElement(ButtonGroup, {
    variant: "segmented"
  }, constructedPrevious, labelMarkup, constructedNext));
}
function clickPaginationLink(id, node) {
  return () => {
    if (node.current == null)
      return;
    let link = node.current.querySelector(`#${id}`);
    link && link.click();
  };
}
function handleCallback(fn) {
  return () => {
    isInputFocused() || fn();
  };
}
function noop4() {
}

// node_modules/@shopify/polaris/build/esm/components/AfterInitialMount/AfterInitialMount.js
import React76, { useEffect as useEffect16 } from "react";
function AfterInitialMount({
  children,
  onMount,
  fallback = null
}) {
  let isMounted = useIsAfterInitialMount(), content = isMounted ? children : fallback;
  return useEffect16(() => {
    isMounted && onMount && onMount();
  }, [isMounted, onMount]), /* @__PURE__ */ React76.createElement(React76.Fragment, null, content);
}

// node_modules/@shopify/polaris/build/esm/components/Sticky/Sticky.js
import React77, { Component as Component2 } from "react";

// node_modules/@shopify/polaris/build/esm/utilities/sticky-manager/hooks.js
import { useContext as useContext10 } from "react";
function useStickyManager() {
  let stickyManager = useContext10(StickyManagerContext);
  if (!stickyManager)
    throw new MissingAppProviderError("No StickyManager was provided.");
  return stickyManager;
}

// node_modules/@shopify/polaris/build/esm/components/Sticky/Sticky.js
var StickyInner = class extends Component2 {
  constructor(...args) {
    super(...args), this.state = {
      isSticky: !1,
      style: {}
    }, this.placeHolderNode = null, this.stickyNode = null, this.setPlaceHolderNode = (node) => {
      this.placeHolderNode = node;
    }, this.setStickyNode = (node) => {
      this.stickyNode = node;
    }, this.handlePositioning = (stick, top = 0, left = 0, width2 = 0) => {
      let {
        isSticky
      } = this.state;
      (stick && !isSticky || !stick && isSticky) && (this.adjustPlaceHolderNode(stick), this.setState({
        isSticky: !isSticky
      }, () => {
        if (this.props.onStickyChange == null || (this.props.onStickyChange(!isSticky), this.props.boundingElement == null))
          return null;
        this.props.boundingElement.toggleAttribute("data-sticky-active");
      }));
      let style = stick ? {
        position: "fixed",
        top,
        left,
        width: width2
      } : {};
      this.setState({
        style
      });
    }, this.adjustPlaceHolderNode = (add) => {
      this.placeHolderNode && this.stickyNode && (this.placeHolderNode.style.paddingBottom = add ? `${getRectForNode(this.stickyNode).height}px` : "0px");
    };
  }
  componentDidMount() {
    let {
      boundingElement,
      offset = !1,
      disableWhenStacked = !1,
      stickyManager
    } = this.props;
    !this.stickyNode || !this.placeHolderNode || stickyManager.registerStickyItem({
      stickyNode: this.stickyNode,
      placeHolderNode: this.placeHolderNode,
      handlePositioning: this.handlePositioning,
      offset,
      boundingElement,
      disableWhenStacked
    });
  }
  componentWillUnmount() {
    let {
      stickyManager
    } = this.props;
    this.stickyNode && stickyManager.unregisterStickyItem(this.stickyNode);
  }
  render() {
    let {
      style,
      isSticky
    } = this.state, {
      children
    } = this.props, childrenContent = isFunction(children) ? children(isSticky) : children;
    return /* @__PURE__ */ React77.createElement("div", null, /* @__PURE__ */ React77.createElement("div", {
      ref: this.setPlaceHolderNode
    }), /* @__PURE__ */ React77.createElement("div", {
      ref: this.setStickyNode,
      style
    }, childrenContent));
  }
};
function isFunction(arg) {
  return typeof arg == "function";
}
function Sticky(props) {
  let stickyManager = useStickyManager();
  return /* @__PURE__ */ React77.createElement(StickyInner, Object.assign({}, props, {
    stickyManager
  }));
}

// node_modules/@shopify/polaris/build/esm/components/DataTable/components/Navigation/Navigation.js
import React78 from "react";
function Navigation({
  columnVisibilityData,
  isScrolledFarthestLeft,
  isScrolledFarthestRight,
  navigateTableLeft,
  navigateTableRight,
  fixedFirstColumns,
  setRef = () => {
  }
}) {
  let i18n = useI18n(), pipMarkup = columnVisibilityData.map((column, index) => {
    if (index < fixedFirstColumns)
      return;
    let className = classNames(styles31.Pip, column.isVisible && styles31["Pip-visible"]);
    return /* @__PURE__ */ React78.createElement("div", {
      className,
      key: `pip-${index}`
    });
  }), leftA11yLabel = i18n.translate("Polaris.DataTable.navAccessibilityLabel", {
    direction: "left"
  }), rightA11yLabel = i18n.translate("Polaris.DataTable.navAccessibilityLabel", {
    direction: "right"
  });
  return /* @__PURE__ */ React78.createElement("div", {
    className: styles31.Navigation,
    ref: setRef
  }, /* @__PURE__ */ React78.createElement(Button, {
    variant: "tertiary",
    icon: SvgChevronLeftIcon,
    disabled: isScrolledFarthestLeft,
    accessibilityLabel: leftA11yLabel,
    onClick: navigateTableLeft
  }), pipMarkup, /* @__PURE__ */ React78.createElement(Button, {
    variant: "tertiary",
    icon: SvgChevronRightIcon,
    disabled: isScrolledFarthestRight,
    accessibilityLabel: rightA11yLabel,
    onClick: navigateTableRight
  }));
}

// node_modules/@shopify/polaris/build/esm/components/DataTable/DataTable.js
var getRowClientHeights = (rows) => {
  let heights = [];
  return rows && rows.forEach((row) => {
    heights.push(row.clientHeight);
  }), heights;
}, DataTableInner = class extends PureComponent4 {
  constructor(...args) {
    super(...args), this.state = {
      condensed: !1,
      columnVisibilityData: [],
      isScrolledFarthestLeft: !0,
      isScrolledFarthestRight: !1,
      rowHovered: void 0
    }, this.dataTable = /* @__PURE__ */ createRef3(), this.scrollContainer = /* @__PURE__ */ createRef3(), this.table = /* @__PURE__ */ createRef3(), this.stickyTable = /* @__PURE__ */ createRef3(), this.stickyNav = null, this.headerNav = null, this.tableHeadings = [], this.stickyHeadings = [], this.tableHeadingWidths = [], this.stickyHeaderActive = !1, this.scrollStopTimer = null, this.handleResize = debounce(() => {
      let {
        table: {
          current: table
        },
        scrollContainer: {
          current: scrollContainer
        }
      } = this, condensed = !1;
      table && scrollContainer && (condensed = table.scrollWidth > scrollContainer.clientWidth + 1), this.setState({
        condensed,
        ...this.calculateColumnVisibilityData(condensed)
      });
    }), this.setCellRef = ({
      ref,
      index,
      inStickyHeader
    }) => {
      if (ref != null)
        if (inStickyHeader) {
          this.stickyHeadings[index] = ref;
          let button = ref.querySelector("button");
          if (button == null)
            return;
          button.addEventListener("focus", this.handleHeaderButtonFocus);
        } else
          this.tableHeadings[index] = ref, this.tableHeadingWidths[index] = ref.clientWidth;
    }, this.changeHeadingFocus = () => {
      let {
        tableHeadings,
        stickyHeadings,
        stickyNav,
        headerNav
      } = this, stickyFocusedItemIndex = stickyHeadings.findIndex((item) => item === document.activeElement?.parentElement), tableFocusedItemIndex = tableHeadings.findIndex((item) => item === document.activeElement?.parentElement), arrowsInStickyNav = stickyNav?.querySelectorAll("button"), arrowsInHeaderNav = headerNav?.querySelectorAll("button"), stickyFocusedNavIndex = -1;
      arrowsInStickyNav?.forEach((item, index) => {
        item === document.activeElement && (stickyFocusedNavIndex = index);
      });
      let headerFocusedNavIndex = -1;
      if (arrowsInHeaderNav?.forEach((item, index) => {
        item === document.activeElement && (headerFocusedNavIndex = index);
      }), stickyFocusedItemIndex < 0 && tableFocusedItemIndex < 0 && stickyFocusedNavIndex < 0 && headerFocusedNavIndex < 0)
        return null;
      let button;
      if (stickyFocusedItemIndex >= 0 ? button = tableHeadings[stickyFocusedItemIndex].querySelector("button") : tableFocusedItemIndex >= 0 && (button = stickyHeadings[tableFocusedItemIndex].querySelector("button")), stickyFocusedNavIndex >= 0 ? button = arrowsInHeaderNav?.[stickyFocusedNavIndex] : headerFocusedNavIndex >= 0 && (button = arrowsInStickyNav?.[headerFocusedNavIndex]), button == null)
        return null;
      button.style.visibility = "visible", button.focus(), button.style.removeProperty("visibility");
    }, this.calculateColumnVisibilityData = (condensed) => {
      let fixedFirstColumns = this.fixedFirstColumns(), {
        table: {
          current: table
        },
        scrollContainer: {
          current: scrollContainer
        },
        dataTable: {
          current: dataTable
        }
      } = this, {
        stickyHeader
      } = this.props;
      if ((stickyHeader || condensed) && table && scrollContainer && dataTable) {
        let headerCells = table.querySelectorAll(headerCell.selector), rightMostHeader = headerCells[fixedFirstColumns - 1], nthColumnWidth = fixedFirstColumns ? rightMostHeader.offsetLeft + rightMostHeader.offsetWidth : 0;
        if (headerCells.length > 0) {
          let firstVisibleColumnIndex = headerCells.length - 1, tableLeftVisibleEdge = scrollContainer.scrollLeft + nthColumnWidth, tableRightVisibleEdge = scrollContainer.scrollLeft + dataTable.offsetWidth, tableData = {
            firstVisibleColumnIndex,
            tableLeftVisibleEdge,
            tableRightVisibleEdge
          }, columnVisibilityData = [...headerCells].map(measureColumn(tableData)), lastColumn = columnVisibilityData[columnVisibilityData.length - 1], isScrolledFarthestLeft = fixedFirstColumns ? tableLeftVisibleEdge === nthColumnWidth : tableLeftVisibleEdge === 0;
          return {
            columnVisibilityData,
            ...getPrevAndCurrentColumns(tableData, columnVisibilityData),
            isScrolledFarthestLeft,
            isScrolledFarthestRight: lastColumn.rightEdge <= tableRightVisibleEdge
          };
        }
      }
      return {
        columnVisibilityData: [],
        previousColumn: void 0,
        currentColumn: void 0
      };
    }, this.handleHeaderButtonFocus = (event) => {
      let fixedFirstColumns = this.fixedFirstColumns();
      if (this.scrollContainer.current == null || event.target == null || this.state.columnVisibilityData.length === 0)
        return;
      let currentCell = event.target.parentNode, tableScrollLeft = this.scrollContainer.current.scrollLeft, tableViewableWidth = this.scrollContainer.current.offsetWidth, tableRightEdge = tableScrollLeft + tableViewableWidth, nthColumnWidth = this.state.columnVisibilityData.length > 0 ? this.state.columnVisibilityData[fixedFirstColumns]?.rightEdge : 0, currentColumnLeftEdge = currentCell.offsetLeft, currentColumnRightEdge = currentCell.offsetLeft + currentCell.offsetWidth;
      tableScrollLeft > currentColumnLeftEdge - nthColumnWidth && (this.scrollContainer.current.scrollLeft = currentColumnLeftEdge - nthColumnWidth), currentColumnRightEdge > tableRightEdge && (this.scrollContainer.current.scrollLeft = currentColumnRightEdge - tableViewableWidth);
    }, this.stickyHeaderScrolling = () => {
      let {
        current: stickyTable
      } = this.stickyTable, {
        current: scrollContainer
      } = this.scrollContainer;
      stickyTable == null || scrollContainer == null || (stickyTable.scrollLeft = scrollContainer.scrollLeft);
    }, this.scrollListener = () => {
      this.scrollStopTimer && clearTimeout(this.scrollStopTimer), this.scrollStopTimer = setTimeout(() => {
        this.setState((prevState) => ({
          ...this.calculateColumnVisibilityData(prevState.condensed)
        }));
      }, 100), this.setState({
        isScrolledFarthestLeft: this.scrollContainer.current?.scrollLeft === 0
      }), this.props.stickyHeader && this.stickyHeaderActive && this.stickyHeaderScrolling();
    }, this.handleHover = (row) => () => {
      this.setState({
        rowHovered: row
      });
    }, this.handleFocus = (event) => {
      let fixedFirstColumns = this.fixedFirstColumns();
      if (this.scrollContainer.current == null || event.target == null)
        return;
      let currentCell = event.target.parentNode, nthColumnWidth = this.props ? this.state.columnVisibilityData[fixedFirstColumns]?.rightEdge : 0, desiredScrollLeft = currentCell.offsetLeft - nthColumnWidth;
      this.scrollContainer.current.scrollLeft > desiredScrollLeft && (this.scrollContainer.current.scrollLeft = desiredScrollLeft);
    }, this.navigateTable = (direction) => {
      let fixedFirstColumns = this.fixedFirstColumns(), {
        currentColumn,
        previousColumn
      } = this.state, nthColumnWidth = this.state.columnVisibilityData[fixedFirstColumns - 1]?.rightEdge;
      if (!currentColumn || !previousColumn)
        return;
      let prevWidths = 0;
      for (let index = 0; index < currentColumn.index; index++)
        prevWidths += this.state.columnVisibilityData[index].width;
      let {
        current: scrollContainer
      } = this.scrollContainer;
      return () => {
        let newScrollLeft = 0;
        fixedFirstColumns ? newScrollLeft = direction === "right" ? prevWidths - nthColumnWidth + currentColumn.width : prevWidths - previousColumn.width - nthColumnWidth : newScrollLeft = direction === "right" ? currentColumn.rightEdge : previousColumn.leftEdge, scrollContainer && (scrollContainer.scrollLeft = newScrollLeft, requestAnimationFrame(() => {
          this.setState((prevState) => ({
            ...this.calculateColumnVisibilityData(prevState.condensed)
          }));
        }));
      };
    }, this.renderHeading = ({
      heading,
      headingIndex,
      inFixedNthColumn,
      inStickyHeader
    }) => {
      let {
        sortable,
        truncate = !1,
        columnContentTypes,
        defaultSortDirection,
        initialSortColumnIndex = 0,
        verticalAlign,
        firstColumnMinWidth
      } = this.props, fixedFirstColumns = this.fixedFirstColumns(), {
        sortDirection = defaultSortDirection,
        sortedColumnIndex = initialSortColumnIndex,
        isScrolledFarthestLeft
      } = this.state, sortableHeadingProps, headingCellId = `heading-cell-${headingIndex}`, stickyHeaderId = `stickyheader-${headingIndex}`, id = inStickyHeader ? stickyHeaderId : headingCellId;
      if (sortable) {
        let isSortable = sortable[headingIndex], isSorted = isSortable && sortedColumnIndex === headingIndex;
        sortableHeadingProps = {
          defaultSortDirection,
          sorted: isSorted,
          sortable: isSortable,
          sortDirection: isSorted ? sortDirection : "none",
          onSort: this.defaultOnSort(headingIndex),
          fixedNthColumn: fixedFirstColumns,
          inFixedNthColumn: fixedFirstColumns
        };
      }
      let stickyCellWidth = inStickyHeader ? this.tableHeadingWidths[headingIndex] : void 0, fixedCellVisible = !isScrolledFarthestLeft, cellProps = {
        header: !0,
        stickyHeadingCell: inStickyHeader,
        content: heading,
        contentType: columnContentTypes[headingIndex],
        nthColumn: headingIndex < fixedFirstColumns,
        fixedFirstColumns,
        truncate,
        headingIndex,
        ...sortableHeadingProps,
        verticalAlign,
        handleFocus: this.handleFocus,
        stickyCellWidth,
        fixedCellVisible,
        firstColumnMinWidth
      };
      return inFixedNthColumn && inStickyHeader ? [/* @__PURE__ */ React79.createElement(Cell, Object.assign({
        key: id
      }, cellProps, {
        setRef: (ref) => {
          this.setCellRef({
            ref,
            index: headingIndex,
            inStickyHeader
          });
        },
        inFixedNthColumn: !1
      })), /* @__PURE__ */ React79.createElement(Cell, Object.assign({
        key: `${id}-sticky`
      }, cellProps, {
        setRef: (ref) => {
          this.setCellRef({
            ref,
            index: headingIndex,
            inStickyHeader
          });
        },
        inFixedNthColumn: Boolean(fixedFirstColumns),
        lastFixedFirstColumn: headingIndex === fixedFirstColumns - 1,
        style: {
          left: this.state.columnVisibilityData[headingIndex]?.leftEdge
        }
      }))] : /* @__PURE__ */ React79.createElement(Cell, Object.assign({
        key: id
      }, cellProps, {
        setRef: (ref) => {
          this.setCellRef({
            ref,
            index: headingIndex,
            inStickyHeader
          });
        },
        lastFixedFirstColumn: headingIndex === fixedFirstColumns - 1,
        inFixedNthColumn
      }));
    }, this.totalsRowHeading = () => {
      let {
        i18n,
        totals,
        totalsName
      } = this.props, totalsLabel = totalsName || {
        singular: i18n.translate("Polaris.DataTable.totalRowHeading"),
        plural: i18n.translate("Polaris.DataTable.totalsRowHeading")
      };
      return totals && totals.filter((total) => total !== "").length > 1 ? totalsLabel.plural : totalsLabel.singular;
    }, this.renderTotals = ({
      total,
      index
    }) => {
      let fixedFirstColumns = this.fixedFirstColumns(), id = `totals-cell-${index}`, {
        truncate = !1,
        verticalAlign,
        columnContentTypes
      } = this.props, content, contentType;
      index === 0 && (content = this.totalsRowHeading()), total !== "" && index > 0 && (contentType = columnContentTypes[index], content = total);
      let totalInFooter = this.props.showTotalsInFooter;
      return /* @__PURE__ */ React79.createElement(Cell, {
        total: !0,
        totalInFooter,
        nthColumn: index <= fixedFirstColumns - 1,
        firstColumn: index === 0,
        key: id,
        content,
        contentType,
        truncate,
        verticalAlign
      });
    }, this.getColSpan = (rowLength, headingsLength, contentTypesLength, cellIndex) => {
      if (this.fixedFirstColumns())
        return 1;
      let rowLen = rowLength || 1, colLen = headingsLength || contentTypesLength, colSpan = Math.floor(colLen / rowLen), remainder = colLen % rowLen;
      return cellIndex === 0 ? colSpan + remainder : colSpan;
    }, this.defaultRenderRow = ({
      row,
      index,
      inFixedNthColumn,
      rowHeights
    }) => {
      let {
        columnContentTypes,
        truncate = !1,
        verticalAlign,
        hoverable = !0,
        headings
      } = this.props, {
        condensed
      } = this.state, fixedFirstColumns = this.fixedFirstColumns(), className = classNames(styles31.TableRow, hoverable && styles31.hoverable);
      return /* @__PURE__ */ React79.createElement("tr", {
        key: `row-${index}`,
        className,
        onMouseEnter: this.handleHover(index),
        onMouseLeave: this.handleHover()
      }, row.map((content, cellIndex) => {
        let hovered = index === this.state.rowHovered, id = `cell-${cellIndex}-row-${index}`, colSpan = this.getColSpan(row.length, headings.length, columnContentTypes.length, cellIndex);
        return /* @__PURE__ */ React79.createElement(Cell, {
          key: id,
          content,
          contentType: columnContentTypes[cellIndex],
          nthColumn: cellIndex <= fixedFirstColumns - 1,
          firstColumn: cellIndex === 0,
          truncate,
          verticalAlign,
          colSpan,
          hovered,
          style: rowHeights ? {
            height: `${rowHeights[index]}px`
          } : {},
          inFixedNthColumn: condensed && inFixedNthColumn
        });
      }));
    }, this.defaultOnSort = (headingIndex) => {
      let {
        onSort,
        defaultSortDirection = "ascending",
        initialSortColumnIndex
      } = this.props, {
        sortDirection = defaultSortDirection,
        sortedColumnIndex = initialSortColumnIndex
      } = this.state, newSortDirection = defaultSortDirection;
      return sortedColumnIndex === headingIndex && (newSortDirection = sortDirection === "ascending" ? "descending" : "ascending"), () => {
        this.setState({
          sortDirection: newSortDirection,
          sortedColumnIndex: headingIndex
        }, () => {
          onSort && onSort(headingIndex, newSortDirection);
        });
      };
    };
  }
  componentDidMount() {
    this.handleResize();
  }
  componentDidUpdate(prevProps) {
    isEqual(prevProps, this.props) || this.handleResize();
  }
  componentWillUnmount() {
    this.handleResize.cancel();
  }
  render() {
    let {
      headings,
      totals,
      showTotalsInFooter,
      rows,
      footerContent,
      hideScrollIndicator = !1,
      increasedTableDensity = !1,
      hasZebraStripingOnData = !1,
      stickyHeader = !1,
      hasFixedFirstColumn: fixedFirstColumn = !1,
      pagination
    } = this.props, {
      condensed,
      columnVisibilityData,
      isScrolledFarthestLeft,
      isScrolledFarthestRight
    } = this.state, fixedFirstColumns = this.fixedFirstColumns(), rowCountIsEven = rows.length % 2 === 0, className = classNames(styles31.DataTable, condensed && styles31.condensed, totals && styles31.ShowTotals, showTotalsInFooter && styles31.ShowTotalsInFooter, hasZebraStripingOnData && styles31.ZebraStripingOnData, hasZebraStripingOnData && rowCountIsEven && styles31.RowCountIsEven), wrapperClassName = classNames(styles31.TableWrapper, condensed && styles31.condensed, increasedTableDensity && styles31.IncreasedTableDensity, stickyHeader && styles31.StickyHeaderEnabled), headingMarkup = /* @__PURE__ */ React79.createElement("tr", null, headings.map((heading, index) => this.renderHeading({
      heading,
      headingIndex: index,
      inFixedNthColumn: !1,
      inStickyHeader: !1
    }))), totalsMarkup = totals ? /* @__PURE__ */ React79.createElement("tr", null, totals.map((total, index) => this.renderTotals({
      total,
      index
    }))) : null, nthColumns = rows.map((row) => row.slice(0, fixedFirstColumns)), nthHeadings = headings.slice(0, fixedFirstColumns), nthTotals = totals?.slice(0, fixedFirstColumns), tableHeaderRows = this.table.current?.children[0].childNodes, tableBodyRows = this.table.current?.children[1].childNodes, headerRowHeights = getRowClientHeights(tableHeaderRows), bodyRowHeights = getRowClientHeights(tableBodyRows), fixedNthColumnMarkup = condensed && fixedFirstColumns !== 0 && /* @__PURE__ */ React79.createElement("table", {
      className: classNames(styles31.FixedFirstColumn, !isScrolledFarthestLeft && styles31.separate),
      style: {
        width: `${columnVisibilityData[fixedFirstColumns - 1]?.rightEdge}px`
      }
    }, /* @__PURE__ */ React79.createElement("thead", null, /* @__PURE__ */ React79.createElement("tr", {
      style: {
        height: `${headerRowHeights[0]}px`
      }
    }, nthHeadings.map((heading, index) => this.renderHeading({
      heading,
      headingIndex: index,
      inFixedNthColumn: !0,
      inStickyHeader: !1
    }))), totals && !showTotalsInFooter && /* @__PURE__ */ React79.createElement("tr", {
      style: {
        height: `${headerRowHeights[1]}px`
      }
    }, nthTotals?.map((total, index) => this.renderTotals({
      total,
      index
    })))), /* @__PURE__ */ React79.createElement("tbody", null, nthColumns.map((row, index) => this.defaultRenderRow({
      row,
      index,
      inFixedNthColumn: !0,
      rowHeights: bodyRowHeights
    }))), totals && showTotalsInFooter && /* @__PURE__ */ React79.createElement("tfoot", null, /* @__PURE__ */ React79.createElement("tr", null, nthTotals?.map((total, index) => this.renderTotals({
      total,
      index
    }))))), bodyMarkup = rows.map((row, index) => this.defaultRenderRow({
      row,
      index,
      inFixedNthColumn: !1
    })), footerMarkup = footerContent ? /* @__PURE__ */ React79.createElement("div", {
      className: styles31.Footer
    }, footerContent) : null, paginationMarkup = pagination ? /* @__PURE__ */ React79.createElement(Pagination, Object.assign({
      type: "table"
    }, pagination)) : null, headerTotalsMarkup = showTotalsInFooter ? null : totalsMarkup, footerTotalsMarkup = showTotalsInFooter ? /* @__PURE__ */ React79.createElement("tfoot", null, totalsMarkup) : null, navigationMarkup = (location) => hideScrollIndicator ? null : /* @__PURE__ */ React79.createElement(Navigation, {
      columnVisibilityData,
      isScrolledFarthestLeft,
      isScrolledFarthestRight,
      navigateTableLeft: this.navigateTable("left"),
      navigateTableRight: this.navigateTable("right"),
      fixedFirstColumns,
      setRef: (ref) => {
        location === "header" ? this.headerNav = ref : location === "sticky" && (this.stickyNav = ref);
      }
    }), stickyHeaderMarkup = stickyHeader ? /* @__PURE__ */ React79.createElement(AfterInitialMount, null, /* @__PURE__ */ React79.createElement("div", {
      className: styles31.StickyHeaderWrapper,
      role: "presentation"
    }, /* @__PURE__ */ React79.createElement(Sticky, {
      boundingElement: this.dataTable.current,
      onStickyChange: (isSticky) => {
        this.changeHeadingFocus(), this.stickyHeaderActive = isSticky;
      }
    }, (isSticky) => {
      let stickyHeaderInnerClassNames = classNames(styles31.StickyHeaderInner, isSticky && styles31["StickyHeaderInner-isSticky"]), stickyHeaderTableClassNames = classNames(styles31.StickyHeaderTable, !isScrolledFarthestLeft && styles31.separate);
      return /* @__PURE__ */ React79.createElement("div", {
        className: stickyHeaderInnerClassNames
      }, /* @__PURE__ */ React79.createElement("div", null, navigationMarkup("sticky")), /* @__PURE__ */ React79.createElement("table", {
        className: stickyHeaderTableClassNames,
        ref: this.stickyTable
      }, /* @__PURE__ */ React79.createElement("thead", null, /* @__PURE__ */ React79.createElement("tr", {
        className: styles31.StickyTableHeadingsRow
      }, headings.map((heading, index) => this.renderHeading({
        heading,
        headingIndex: index,
        inFixedNthColumn: Boolean(index <= fixedFirstColumns - 1 && fixedFirstColumns),
        inStickyHeader: !0
      }))))));
    }))) : null;
    return /* @__PURE__ */ React79.createElement("div", {
      className: wrapperClassName,
      ref: this.dataTable
    }, stickyHeaderMarkup, navigationMarkup("header"), /* @__PURE__ */ React79.createElement("div", {
      className
    }, /* @__PURE__ */ React79.createElement("div", {
      className: styles31.ScrollContainer,
      ref: this.scrollContainer
    }, /* @__PURE__ */ React79.createElement(EventListener, {
      event: "resize",
      handler: this.handleResize
    }), /* @__PURE__ */ React79.createElement(EventListener, {
      capture: !0,
      passive: !0,
      event: "scroll",
      handler: this.scrollListener
    }), fixedNthColumnMarkup, /* @__PURE__ */ React79.createElement("table", {
      className: styles31.Table,
      ref: this.table
    }, /* @__PURE__ */ React79.createElement("thead", null, headingMarkup, headerTotalsMarkup), /* @__PURE__ */ React79.createElement("tbody", null, bodyMarkup), footerTotalsMarkup)), paginationMarkup, footerMarkup));
  }
  fixedFirstColumns() {
    let {
      hasFixedFirstColumn,
      fixedFirstColumns = 0,
      headings
    } = this.props, numberOfFixedFirstColumns = hasFixedFirstColumn && !fixedFirstColumns ? 1 : fixedFirstColumns;
    return numberOfFixedFirstColumns >= headings.length ? 0 : numberOfFixedFirstColumns;
  }
  // eslint-disable-next-line @shopify/react-no-multiple-render-methods
  // eslint-disable-next-line @shopify/react-no-multiple-render-methods
};
function DataTable(props) {
  let i18n = useI18n();
  return /* @__PURE__ */ React79.createElement(DataTableInner, Object.assign({}, props, {
    i18n
  }));
}

// node_modules/@shopify/polaris/build/esm/components/Divider/Divider.js
import React80 from "react";

// node_modules/@shopify/polaris/build/esm/components/Divider/Divider.css.js
var styles33 = {
  Divider: "Polaris-Divider"
};

// node_modules/@shopify/polaris/build/esm/components/Divider/Divider.js
var Divider = ({
  borderColor = "border-secondary",
  borderWidth = "025"
}) => {
  let borderColorValue = borderColor === "transparent" ? borderColor : `var(--p-color-${borderColor})`;
  return /* @__PURE__ */ React80.createElement("hr", {
    className: styles33.Divider,
    style: {
      borderBlockStart: `var(--p-border-width-${borderWidth}) solid ${borderColorValue}`
    }
  });
};

// node_modules/@shopify/polaris/build/esm/components/EmptyState/EmptyState.js
import React81, { useState as useState16, useCallback as useCallback17 } from "react";

// node_modules/@shopify/polaris/build/esm/components/EmptyState/EmptyState.css.js
var styles34 = {
  ImageContainer: "Polaris-EmptyState__ImageContainer",
  Image: "Polaris-EmptyState__Image",
  loaded: "Polaris-EmptyState--loaded",
  imageContained: "Polaris-EmptyState--imageContained",
  SkeletonImageContainer: "Polaris-EmptyState__SkeletonImageContainer",
  SkeletonImage: "Polaris-EmptyState__SkeletonImage"
};

// node_modules/@shopify/polaris/build/esm/components/EmptyState/EmptyState.js
function EmptyState({
  children,
  heading,
  image,
  largeImage,
  imageContained,
  fullWidth = !1,
  action: action6,
  secondaryAction,
  footerContent
}) {
  let [imageLoaded, setImageLoaded] = useState16(!1), handleLoad = useCallback17(() => {
    setImageLoaded(!0);
  }, []), imageClassNames = classNames(styles34.Image, imageLoaded && styles34.loaded, imageContained && styles34.imageContained), loadedImageMarkup = largeImage ? /* @__PURE__ */ React81.createElement(Image, {
    alt: "",
    role: "presentation",
    source: largeImage,
    className: imageClassNames,
    sourceSet: [{
      source: image,
      descriptor: "568w"
    }, {
      source: largeImage,
      descriptor: "1136w"
    }],
    sizes: "(max-width: 568px) 60vw",
    onLoad: handleLoad
  }) : /* @__PURE__ */ React81.createElement(Image, {
    alt: "",
    role: "presentation",
    className: imageClassNames,
    source: image,
    onLoad: handleLoad
  }), skeletonImageClassNames = classNames(styles34.SkeletonImage, imageLoaded && styles34.loaded), imageContainerClassNames = classNames(styles34.ImageContainer, !imageLoaded && styles34.SkeletonImageContainer), imageMarkup = /* @__PURE__ */ React81.createElement("div", {
    className: imageContainerClassNames
  }, loadedImageMarkup, /* @__PURE__ */ React81.createElement("div", {
    className: skeletonImageClassNames
  })), secondaryActionMarkup = secondaryAction ? buttonFrom(secondaryAction, {}) : null, footerContentMarkup = footerContent ? /* @__PURE__ */ React81.createElement(Box, {
    paddingBlockStart: "400"
  }, /* @__PURE__ */ React81.createElement(Text, {
    as: "span",
    alignment: "center",
    variant: "bodySm"
  }, footerContent)) : null, primaryActionMarkup = action6 ? buttonFrom(action6, {
    variant: "primary",
    size: "medium"
  }) : null, headingMarkup = heading ? /* @__PURE__ */ React81.createElement(Box, {
    paddingBlockEnd: "150"
  }, /* @__PURE__ */ React81.createElement(Text, {
    variant: "headingMd",
    as: "p",
    alignment: "center"
  }, heading)) : null, childrenMarkup = children ? /* @__PURE__ */ React81.createElement(Text, {
    as: "span",
    alignment: "center",
    variant: "bodySm"
  }, children) : null, textContentMarkup = headingMarkup || children ? /* @__PURE__ */ React81.createElement(Box, {
    paddingBlockEnd: "400"
  }, headingMarkup, childrenMarkup) : null, actionsMarkup = primaryActionMarkup || secondaryActionMarkup ? /* @__PURE__ */ React81.createElement(InlineStack, {
    align: "center",
    gap: "200"
  }, secondaryActionMarkup, primaryActionMarkup) : null, detailsMarkup = textContentMarkup || actionsMarkup || footerContentMarkup ? /* @__PURE__ */ React81.createElement(Box, {
    maxWidth: fullWidth ? "100%" : "400px"
  }, /* @__PURE__ */ React81.createElement(BlockStack, {
    inlineAlign: "center"
  }, textContentMarkup, actionsMarkup, footerContentMarkup)) : null;
  return /* @__PURE__ */ React81.createElement(Box, {
    paddingInlineStart: "0",
    paddingInlineEnd: "0",
    paddingBlockStart: "500",
    paddingBlockEnd: "1600"
  }, /* @__PURE__ */ React81.createElement(BlockStack, {
    inlineAlign: "center"
  }, imageMarkup, detailsMarkup));
}

// node_modules/@shopify/polaris/build/esm/utilities/media-query/hooks.js
import { useContext as useContext11 } from "react";
function useMediaQuery() {
  let mediaQuery = useContext11(MediaQueryContext);
  if (!mediaQuery)
    throw new Error("No mediaQuery was provided. Your application must be wrapped in an <AppProvider> component. See https://polaris.shopify.com/components/app-provider for implementation instructions.");
  return mediaQuery;
}

// node_modules/@shopify/polaris/build/esm/components/Layout/Layout.js
import React85 from "react";

// node_modules/@shopify/polaris/build/esm/components/Layout/Layout.css.js
var styles35 = {
  Layout: "Polaris-Layout",
  Section: "Polaris-Layout__Section",
  "Section-fullWidth": "Polaris-Layout__Section--fullWidth",
  "Section-oneHalf": "Polaris-Layout__Section--oneHalf",
  "Section-oneThird": "Polaris-Layout__Section--oneThird",
  AnnotatedSection: "Polaris-Layout__AnnotatedSection",
  AnnotationWrapper: "Polaris-Layout__AnnotationWrapper",
  AnnotationContent: "Polaris-Layout__AnnotationContent",
  Annotation: "Polaris-Layout__Annotation"
};

// node_modules/@shopify/polaris/build/esm/components/Layout/components/AnnotatedSection/AnnotatedSection.js
import React83 from "react";

// node_modules/@shopify/polaris/build/esm/components/TextContainer/TextContainer.js
import React82 from "react";

// node_modules/@shopify/polaris/build/esm/components/TextContainer/TextContainer.css.js
var styles36 = {
  TextContainer: "Polaris-TextContainer",
  spacingTight: "Polaris-TextContainer--spacingTight",
  spacingLoose: "Polaris-TextContainer--spacingLoose"
};

// node_modules/@shopify/polaris/build/esm/components/TextContainer/TextContainer.js
function TextContainer({
  spacing,
  children
}) {
  let className = classNames(styles36.TextContainer, spacing && styles36[variationName("spacing", spacing)]);
  return /* @__PURE__ */ React82.createElement("div", {
    className
  }, children);
}

// node_modules/@shopify/polaris/build/esm/components/Layout/components/AnnotatedSection/AnnotatedSection.js
function AnnotatedSection({
  children,
  title,
  description,
  id
}) {
  let descriptionMarkup = typeof description == "string" ? /* @__PURE__ */ React83.createElement(Text, {
    as: "p",
    variant: "bodyMd"
  }, description) : description;
  return /* @__PURE__ */ React83.createElement("div", {
    className: styles35.AnnotatedSection
  }, /* @__PURE__ */ React83.createElement("div", {
    className: styles35.AnnotationWrapper
  }, /* @__PURE__ */ React83.createElement("div", {
    className: styles35.Annotation
  }, /* @__PURE__ */ React83.createElement(TextContainer, {
    spacing: "tight"
  }, /* @__PURE__ */ React83.createElement(Text, {
    id,
    variant: "headingMd",
    as: "h2"
  }, title), descriptionMarkup && /* @__PURE__ */ React83.createElement(Box, {
    color: "text-secondary"
  }, descriptionMarkup))), /* @__PURE__ */ React83.createElement("div", {
    className: styles35.AnnotationContent
  }, children)));
}

// node_modules/@shopify/polaris/build/esm/components/Layout/components/Section/Section.js
import React84 from "react";
function Section3({
  children,
  variant
}) {
  let className = classNames(styles35.Section, styles35[`Section-${variant}`]);
  return /* @__PURE__ */ React84.createElement("div", {
    className
  }, children);
}

// node_modules/@shopify/polaris/build/esm/components/Layout/Layout.js
var Layout = function({
  sectioned,
  children
}) {
  let content = sectioned ? /* @__PURE__ */ React85.createElement(Section3, null, children) : children;
  return /* @__PURE__ */ React85.createElement("div", {
    className: styles35.Layout
  }, content);
};
Layout.AnnotatedSection = AnnotatedSection;
Layout.Section = Section3;

// node_modules/@shopify/polaris/build/esm/components/List/List.js
import React87 from "react";

// node_modules/@shopify/polaris/build/esm/components/List/List.css.js
var styles37 = {
  List: "Polaris-List",
  typeNumber: "Polaris-List--typeNumber",
  Item: "Polaris-List__Item",
  spacingLoose: "Polaris-List--spacingLoose"
};

// node_modules/@shopify/polaris/build/esm/components/List/components/Item/Item.js
import React86 from "react";
function Item4({
  children
}) {
  return /* @__PURE__ */ React86.createElement("li", {
    className: styles37.Item
  }, children);
}

// node_modules/@shopify/polaris/build/esm/components/List/List.js
var List = function({
  children,
  gap = "loose",
  type = "bullet"
}) {
  let className = classNames(styles37.List, gap && styles37[variationName("spacing", gap)], type && styles37[variationName("type", type)]), ListElement = type === "bullet" ? "ul" : "ol";
  return /* @__PURE__ */ React87.createElement(ListElement, {
    className
  }, children);
};
List.Item = Item4;

// node_modules/@shopify/polaris/build/esm/components/Page/Page.js
import React90 from "react";

// node_modules/@shopify/polaris/build/esm/utilities/is-interface.js
import { isValidElement as isValidElement2 } from "react";
function isInterface(x) {
  return !/* @__PURE__ */ isValidElement2(x) && x !== void 0;
}

// node_modules/@shopify/polaris/build/esm/utilities/is-react-element.js
import { isValidElement as isValidElement3 } from "react";
function isReactElement(x) {
  return /* @__PURE__ */ isValidElement3(x) && x !== void 0;
}

// node_modules/@shopify/polaris/build/esm/components/Page/Page.css.js
var styles38 = {
  Page: "Polaris-Page",
  fullWidth: "Polaris-Page--fullWidth",
  narrowWidth: "Polaris-Page--narrowWidth",
  Content: "Polaris-Page__Content"
};

// node_modules/@shopify/polaris/build/esm/components/Page/components/Header/Header.js
import React89 from "react";

// node_modules/@shopify/polaris/build/esm/components/Page/components/Header/Header.css.js
var styles39 = {
  TitleWrapper: "Polaris-Page-Header__TitleWrapper",
  TitleWrapperExpand: "Polaris-Page-Header__TitleWrapperExpand",
  BreadcrumbWrapper: "Polaris-Page-Header__BreadcrumbWrapper",
  PaginationWrapper: "Polaris-Page-Header__PaginationWrapper",
  PrimaryActionWrapper: "Polaris-Page-Header__PrimaryActionWrapper",
  Row: "Polaris-Page-Header__Row",
  mobileView: "Polaris-Page-Header--mobileView",
  RightAlign: "Polaris-Page-Header__RightAlign",
  noBreadcrumbs: "Polaris-Page-Header--noBreadcrumbs",
  AdditionalMetaData: "Polaris-Page-Header__AdditionalMetaData",
  Actions: "Polaris-Page-Header__Actions",
  longTitle: "Polaris-Page-Header--longTitle",
  mediumTitle: "Polaris-Page-Header--mediumTitle",
  isSingleRow: "Polaris-Page-Header--isSingleRow"
};

// node_modules/@shopify/polaris/build/esm/components/Page/components/Header/components/Title/Title.js
import React88 from "react";

// node_modules/@shopify/polaris/build/esm/components/Page/components/Header/components/Title/Title.css.js
var styles40 = {
  Title: "Polaris-Header-Title",
  TitleWithSubtitle: "Polaris-Header-Title__TitleWithSubtitle",
  TitleWrapper: "Polaris-Header-Title__TitleWrapper",
  SubTitle: "Polaris-Header-Title__SubTitle",
  SubtitleCompact: "Polaris-Header-Title__SubtitleCompact",
  SubtitleMaxWidth: "Polaris-Header-Title__SubtitleMaxWidth"
};

// node_modules/@shopify/polaris/build/esm/components/Page/components/Header/components/Title/Title.js
function Title({
  title,
  subtitle,
  titleMetadata,
  compactTitle,
  hasSubtitleMaxWidth
}) {
  let className = classNames(styles40.Title, subtitle && styles40.TitleWithSubtitle), titleMarkup = title ? /* @__PURE__ */ React88.createElement("h1", {
    className
  }, /* @__PURE__ */ React88.createElement(Text, {
    as: "span",
    variant: "headingLg",
    fontWeight: "bold"
  }, title)) : null, titleMetadataMarkup = titleMetadata ? /* @__PURE__ */ React88.createElement(Bleed, {
    marginBlock: "100"
  }, titleMetadata) : null, wrappedTitleMarkup = /* @__PURE__ */ React88.createElement("div", {
    className: styles40.TitleWrapper
  }, titleMarkup, titleMetadataMarkup), subtitleMarkup = subtitle ? /* @__PURE__ */ React88.createElement("div", {
    className: classNames(styles40.SubTitle, compactTitle && styles40.SubtitleCompact, hasSubtitleMaxWidth && styles40.SubtitleMaxWidth)
  }, /* @__PURE__ */ React88.createElement(Text, {
    as: "p",
    variant: "bodySm",
    tone: "subdued"
  }, subtitle)) : null;
  return /* @__PURE__ */ React88.createElement(React88.Fragment, null, wrappedTitleMarkup, subtitleMarkup);
}

// node_modules/@shopify/polaris/build/esm/components/Page/components/Header/Header.js
var SHORT_TITLE = 20, REALLY_SHORT_TITLE = 8, LONG_TITLE = 34;
function Header({
  title,
  subtitle,
  pageReadyAccessibilityLabel,
  titleMetadata,
  additionalMetadata,
  titleHidden = !1,
  primaryAction,
  pagination,
  filterActions,
  backAction,
  secondaryActions = [],
  actionGroups = [],
  compactTitle = !1,
  onActionRollup
}) {
  let i18n = useI18n(), {
    isNavigationCollapsed
  } = useMediaQuery(), isSingleRow = !primaryAction && !pagination && (isInterface(secondaryActions) && !secondaryActions.length || isReactElement(secondaryActions)) && !actionGroups.length, hasActionGroupsOrSecondaryActions = actionGroups.length > 0 || isInterface(secondaryActions) && secondaryActions.length > 0 || isReactElement(secondaryActions), breadcrumbMarkup = backAction ? /* @__PURE__ */ React89.createElement("div", {
    className: styles39.BreadcrumbWrapper
  }, /* @__PURE__ */ React89.createElement(Box, {
    maxWidth: "100%",
    paddingInlineEnd: "100",
    printHidden: !0
  }, /* @__PURE__ */ React89.createElement(Breadcrumbs, {
    backAction
  }))) : null, paginationMarkup = pagination && !isNavigationCollapsed ? /* @__PURE__ */ React89.createElement("div", {
    className: styles39.PaginationWrapper
  }, /* @__PURE__ */ React89.createElement(Box, {
    printHidden: !0
  }, /* @__PURE__ */ React89.createElement(Pagination, Object.assign({}, pagination, {
    hasPrevious: pagination.hasPrevious,
    hasNext: pagination.hasNext
  })))) : null, pageTitleMarkup = /* @__PURE__ */ React89.createElement("div", {
    className: classNames(styles39.TitleWrapper, !hasActionGroupsOrSecondaryActions && styles39.TitleWrapperExpand)
  }, /* @__PURE__ */ React89.createElement(Title, {
    title,
    subtitle,
    titleMetadata,
    compactTitle,
    hasSubtitleMaxWidth: hasActionGroupsOrSecondaryActions
  })), labelForPageReadyAccessibilityLabel = pageReadyAccessibilityLabel || title, pageReadyAccessibilityLabelMarkup = labelForPageReadyAccessibilityLabel ? /* @__PURE__ */ React89.createElement("div", {
    role: "status"
  }, /* @__PURE__ */ React89.createElement(Text, {
    visuallyHidden: !0,
    as: "p"
  }, i18n.translate("Polaris.Page.Header.pageReadyAccessibilityLabel", {
    title: labelForPageReadyAccessibilityLabel
  }))) : void 0, primaryActionMarkup = primaryAction ? /* @__PURE__ */ React89.createElement(PrimaryActionMarkup, {
    primaryAction
  }) : null, actionMenuMarkup = null;
  isInterface(secondaryActions) && (secondaryActions.length > 0 || hasGroupsWithActions(actionGroups)) ? actionMenuMarkup = /* @__PURE__ */ React89.createElement(ActionMenu, {
    actions: secondaryActions,
    groups: actionGroups,
    rollup: isNavigationCollapsed,
    rollupActionsLabel: title ? i18n.translate("Polaris.Page.Header.rollupActionsLabel", {
      title
    }) : void 0,
    onActionRollup
  }) : isReactElement(secondaryActions) && (actionMenuMarkup = /* @__PURE__ */ React89.createElement(React89.Fragment, null, secondaryActions));
  let navigationMarkup = breadcrumbMarkup || paginationMarkup ? /* @__PURE__ */ React89.createElement(Box, {
    printHidden: !0,
    paddingBlockEnd: "100",
    paddingInlineEnd: actionMenuMarkup && isNavigationCollapsed ? "1000" : void 0
  }, /* @__PURE__ */ React89.createElement(InlineStack, {
    gap: "400",
    align: "space-between",
    blockAlign: "center"
  }, breadcrumbMarkup, paginationMarkup)) : null, additionalMetadataMarkup = additionalMetadata ? /* @__PURE__ */ React89.createElement("div", {
    className: styles39.AdditionalMetaData
  }, /* @__PURE__ */ React89.createElement(Text, {
    tone: "subdued",
    as: "span",
    variant: "bodySm"
  }, additionalMetadata)) : null, headerClassNames = classNames(isSingleRow && styles39.isSingleRow, navigationMarkup && styles39.hasNavigation, actionMenuMarkup && styles39.hasActionMenu, isNavigationCollapsed && styles39.mobileView, !backAction && styles39.noBreadcrumbs, title && title.length < LONG_TITLE && styles39.mediumTitle, title && title.length > LONG_TITLE && styles39.longTitle), {
    slot1,
    slot2,
    slot3,
    slot4,
    slot5
  } = determineLayout({
    actionMenuMarkup,
    additionalMetadataMarkup,
    breadcrumbMarkup,
    isNavigationCollapsed,
    pageTitleMarkup,
    paginationMarkup,
    primaryActionMarkup,
    title
  });
  return /* @__PURE__ */ React89.createElement(Box, {
    position: "relative",
    paddingBlockStart: {
      xs: "400",
      md: "600"
    },
    paddingBlockEnd: {
      xs: "400",
      md: "600"
    },
    paddingInlineStart: {
      xs: "400",
      sm: "0"
    },
    paddingInlineEnd: {
      xs: "400",
      sm: "0"
    },
    visuallyHidden: titleHidden
  }, pageReadyAccessibilityLabelMarkup, /* @__PURE__ */ React89.createElement("div", {
    className: headerClassNames
  }, /* @__PURE__ */ React89.createElement(FilterActionsProvider, {
    filterActions: Boolean(filterActions)
  }, /* @__PURE__ */ React89.createElement(ConditionalRender, {
    condition: [slot1, slot2, slot3, slot4].some(notNull)
  }, /* @__PURE__ */ React89.createElement("div", {
    className: styles39.Row
  }, slot1, slot2, /* @__PURE__ */ React89.createElement(ConditionalRender, {
    condition: [slot3, slot4].some(notNull)
  }, /* @__PURE__ */ React89.createElement("div", {
    className: styles39.RightAlign
  }, /* @__PURE__ */ React89.createElement(ConditionalWrapper, {
    condition: [slot3, slot4].every(notNull),
    wrapper: (children) => /* @__PURE__ */ React89.createElement("div", {
      className: styles39.Actions
    }, children)
  }, slot3, slot4))))), /* @__PURE__ */ React89.createElement(ConditionalRender, {
    condition: [slot5].some(notNull)
  }, /* @__PURE__ */ React89.createElement("div", {
    className: styles39.Row
  }, /* @__PURE__ */ React89.createElement(InlineStack, {
    gap: "400"
  }, slot5))))));
}
function PrimaryActionMarkup({
  primaryAction
}) {
  let {
    isNavigationCollapsed
  } = useMediaQuery(), actionMarkup;
  if (isInterface(primaryAction)) {
    let {
      primary: isPrimary,
      helpText
    } = primaryAction, primary = isPrimary === void 0 ? !0 : isPrimary, content = buttonFrom(shouldShowIconOnly(isNavigationCollapsed, primaryAction), {
      variant: primary ? "primary" : void 0
    });
    actionMarkup = helpText ? /* @__PURE__ */ React89.createElement(Tooltip, {
      content: helpText
    }, content) : content;
  } else
    actionMarkup = primaryAction;
  return /* @__PURE__ */ React89.createElement("div", {
    className: styles39.PrimaryActionWrapper
  }, /* @__PURE__ */ React89.createElement(Box, {
    printHidden: !0
  }, actionMarkup));
}
function shouldShowIconOnly(isMobile, action6) {
  let {
    content,
    accessibilityLabel
  } = action6, {
    icon
  } = action6;
  return icon == null ? {
    ...action6,
    icon: void 0
  } : (isMobile && (accessibilityLabel = accessibilityLabel || content, content = void 0), {
    ...action6,
    content,
    accessibilityLabel,
    icon
  });
}
function notNull(value) {
  return value != null;
}
function determineLayout({
  actionMenuMarkup,
  additionalMetadataMarkup,
  breadcrumbMarkup,
  isNavigationCollapsed,
  pageTitleMarkup,
  paginationMarkup,
  primaryActionMarkup,
  title
}) {
  let layouts = {
    mobileCompact: {
      slots: {
        slot1: null,
        slot2: pageTitleMarkup,
        slot3: actionMenuMarkup,
        slot4: primaryActionMarkup,
        slot5: additionalMetadataMarkup
      },
      condition: isNavigationCollapsed && breadcrumbMarkup == null && title != null && title.length <= REALLY_SHORT_TITLE
    },
    mobileDefault: {
      slots: {
        slot1: breadcrumbMarkup,
        slot2: pageTitleMarkup,
        slot3: actionMenuMarkup,
        slot4: primaryActionMarkup,
        slot5: additionalMetadataMarkup
      },
      condition: isNavigationCollapsed
    },
    desktopCompact: {
      slots: {
        slot1: breadcrumbMarkup,
        slot2: pageTitleMarkup,
        slot3: actionMenuMarkup,
        slot4: primaryActionMarkup,
        slot5: additionalMetadataMarkup
      },
      condition: !isNavigationCollapsed && paginationMarkup == null && actionMenuMarkup == null && title != null && title.length <= SHORT_TITLE
    },
    desktopDefault: {
      slots: {
        slot1: breadcrumbMarkup,
        slot2: pageTitleMarkup,
        slot3: /* @__PURE__ */ React89.createElement(React89.Fragment, null, actionMenuMarkup, primaryActionMarkup),
        slot4: paginationMarkup,
        slot5: additionalMetadataMarkup
      },
      condition: !isNavigationCollapsed
    }
  };
  return (Object.values(layouts).find((layout2) => layout2.condition) || layouts.desktopDefault).slots;
}

// node_modules/@shopify/polaris/build/esm/components/Page/Page.js
function Page({
  children,
  fullWidth,
  narrowWidth,
  ...rest
}) {
  let pageClassName = classNames(styles38.Page, fullWidth && styles38.fullWidth, narrowWidth && styles38.narrowWidth), hasHeaderContent = rest.title != null && rest.title !== "" || rest.subtitle != null && rest.subtitle !== "" || rest.primaryAction != null || rest.secondaryActions != null && (isInterface(rest.secondaryActions) && rest.secondaryActions.length > 0 || isReactElement(rest.secondaryActions)) || rest.actionGroups != null && rest.actionGroups.length > 0 || rest.backAction != null, contentClassName = classNames(!hasHeaderContent && styles38.Content), headerMarkup = hasHeaderContent ? /* @__PURE__ */ React90.createElement(Header, Object.assign({
    filterActions: !0
  }, rest)) : null;
  return /* @__PURE__ */ React90.createElement("div", {
    className: pageClassName
  }, headerMarkup, /* @__PURE__ */ React90.createElement("div", {
    className: contentClassName
  }, children));
}

// node_modules/@shopify/polaris/build/esm/components/ProgressBar/ProgressBar.js
import React91, { useRef as useRef19 } from "react";
import { CSSTransition } from "react-transition-group";

// node_modules/@shopify/polaris/build/esm/components/ProgressBar/ProgressBar.css.js
var styles41 = {
  ProgressBar: "Polaris-ProgressBar",
  sizeSmall: "Polaris-ProgressBar--sizeSmall",
  sizeMedium: "Polaris-ProgressBar--sizeMedium",
  sizeLarge: "Polaris-ProgressBar--sizeLarge",
  toneHighlight: "Polaris-ProgressBar--toneHighlight",
  tonePrimary: "Polaris-ProgressBar--tonePrimary",
  toneSuccess: "Polaris-ProgressBar--toneSuccess",
  toneCritical: "Polaris-ProgressBar--toneCritical",
  Indicator: "Polaris-ProgressBar__Indicator",
  IndicatorAppearActive: "Polaris-ProgressBar__IndicatorAppearActive",
  IndicatorAppearDone: "Polaris-ProgressBar__IndicatorAppearDone",
  Progress: "Polaris-ProgressBar__Progress",
  Label: "Polaris-ProgressBar__Label"
};

// node_modules/@shopify/polaris/build/esm/components/ProgressBar/ProgressBar.js
function ProgressBar({
  progress = 0,
  size: size2 = "medium",
  tone = "highlight",
  animated: hasAppearAnimation = !0,
  ariaLabelledBy
}) {
  let theme = useTheme(), i18n = useI18n(), indicatorRef = useRef19(null), className = classNames(styles41.ProgressBar, size2 && styles41[variationName("size", size2)], tone && styles41[variationName("tone", tone)]), warningMessage = i18n.translate(progress < 0 ? "Polaris.ProgressBar.negativeWarningMessage" : "Polaris.ProgressBar.exceedWarningMessage", {
    progress
  }), parsedProgress = parseProgress(progress, warningMessage), progressBarDuration = hasAppearAnimation ? theme.motion["motion-duration-500"] : theme.motion["motion-duration-0"];
  return /* @__PURE__ */ React91.createElement("div", {
    className
  }, /* @__PURE__ */ React91.createElement("progress", {
    "aria-labelledby": ariaLabelledBy,
    className: styles41.Progress,
    value: parsedProgress,
    max: "100"
  }), /* @__PURE__ */ React91.createElement(CSSTransition, {
    in: !0,
    appear: !0,
    timeout: parseInt(progressBarDuration, 10),
    nodeRef: indicatorRef,
    classNames: {
      appearActive: styles41.IndicatorAppearActive,
      appearDone: styles41.IndicatorAppearDone
    }
  }, /* @__PURE__ */ React91.createElement("div", {
    ref: indicatorRef,
    className: styles41.Indicator,
    style: {
      "--pc-progress-bar-duration": progressBarDuration,
      "--pc-progress-bar-percent": parsedProgress / 100
    }
  }, /* @__PURE__ */ React91.createElement("span", {
    className: styles41.Label
  }, parsedProgress, "%"))));
}
function parseProgress(progress, warningMessage) {
  let progressWidth;
  return progress < 0 ? progressWidth = 0 : progress > 100 ? progressWidth = 100 : progressWidth = progress, progressWidth;
}

// node_modules/@shopify/polaris/locales/en.json
var en_default = {
  Polaris: {
    ActionMenu: {
      Actions: {
        moreActions: "More actions"
      },
      RollupActions: {
        rollupButton: "View actions"
      }
    },
    ActionList: {
      SearchField: {
        clearButtonLabel: "Clear",
        search: "Search",
        placeholder: "Search actions"
      }
    },
    Avatar: {
      label: "Avatar",
      labelWithInitials: "Avatar with initials {initials}"
    },
    Autocomplete: {
      spinnerAccessibilityLabel: "Loading",
      ellipsis: "{content}\u2026"
    },
    Badge: {
      PROGRESS_LABELS: {
        incomplete: "Incomplete",
        partiallyComplete: "Partially complete",
        complete: "Complete"
      },
      TONE_LABELS: {
        info: "Info",
        success: "Success",
        warning: "Warning",
        critical: "Critical",
        attention: "Attention",
        new: "New",
        readOnly: "Read-only",
        enabled: "Enabled"
      },
      progressAndTone: "{toneLabel} {progressLabel}"
    },
    Banner: {
      dismissButton: "Dismiss notification"
    },
    Button: {
      spinnerAccessibilityLabel: "Loading"
    },
    Common: {
      checkbox: "checkbox",
      undo: "Undo",
      cancel: "Cancel",
      clear: "Clear",
      close: "Close",
      submit: "Submit",
      more: "More"
    },
    ContextualSaveBar: {
      save: "Save",
      discard: "Discard"
    },
    DataTable: {
      sortAccessibilityLabel: "sort {direction} by",
      navAccessibilityLabel: "Scroll table {direction} one column",
      totalsRowHeading: "Totals",
      totalRowHeading: "Total"
    },
    DatePicker: {
      previousMonth: "Show previous month, {previousMonthName} {showPreviousYear}",
      nextMonth: "Show next month, {nextMonth} {nextYear}",
      today: "Today ",
      start: "Start of range",
      end: "End of range",
      months: {
        january: "January",
        february: "February",
        march: "March",
        april: "April",
        may: "May",
        june: "June",
        july: "July",
        august: "August",
        september: "September",
        october: "October",
        november: "November",
        december: "December"
      },
      days: {
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday"
      },
      daysAbbreviated: {
        monday: "Mo",
        tuesday: "Tu",
        wednesday: "We",
        thursday: "Th",
        friday: "Fr",
        saturday: "Sa",
        sunday: "Su"
      }
    },
    DiscardConfirmationModal: {
      title: "Discard all unsaved changes",
      message: "If you discard changes, you\u2019ll delete any edits you made since you last saved.",
      primaryAction: "Discard changes",
      secondaryAction: "Continue editing"
    },
    DropZone: {
      single: {
        overlayTextFile: "Drop file to upload",
        overlayTextImage: "Drop image to upload",
        overlayTextVideo: "Drop video to upload",
        actionTitleFile: "Add file",
        actionTitleImage: "Add image",
        actionTitleVideo: "Add video",
        actionHintFile: "or drop file to upload",
        actionHintImage: "or drop image to upload",
        actionHintVideo: "or drop video to upload",
        labelFile: "Upload file",
        labelImage: "Upload image",
        labelVideo: "Upload video"
      },
      allowMultiple: {
        overlayTextFile: "Drop files to upload",
        overlayTextImage: "Drop images to upload",
        overlayTextVideo: "Drop videos to upload",
        actionTitleFile: "Add files",
        actionTitleImage: "Add images",
        actionTitleVideo: "Add videos",
        actionHintFile: "or drop files to upload",
        actionHintImage: "or drop images to upload",
        actionHintVideo: "or drop videos to upload",
        labelFile: "Upload files",
        labelImage: "Upload images",
        labelVideo: "Upload videos"
      },
      errorOverlayTextFile: "File type is not valid",
      errorOverlayTextImage: "Image type is not valid",
      errorOverlayTextVideo: "Video type is not valid"
    },
    EmptySearchResult: {
      altText: "Empty search results"
    },
    Frame: {
      skipToContent: "Skip to content",
      navigationLabel: "Navigation",
      Navigation: {
        closeMobileNavigationLabel: "Close navigation"
      }
    },
    FullscreenBar: {
      back: "Back",
      accessibilityLabel: "Exit fullscreen mode"
    },
    Filters: {
      moreFilters: "More filters",
      moreFiltersWithCount: "More filters ({count})",
      filter: "Filter {resourceName}",
      noFiltersApplied: "No filters applied",
      cancel: "Cancel",
      done: "Done",
      clearAllFilters: "Clear all filters",
      clear: "Clear",
      clearLabel: "Clear {filterName}",
      addFilter: "Add filter",
      clearFilters: "Clear all",
      searchInView: "in:{viewName}"
    },
    FilterPill: {
      clear: "Clear",
      unsavedChanges: "Unsaved changes - {label}"
    },
    IndexFilters: {
      searchFilterTooltip: "Search and filter",
      searchFilterTooltipWithShortcut: "Search and filter (F)",
      searchFilterAccessibilityLabel: "Search and filter results",
      sort: "Sort your results",
      addView: "Add a new view",
      newView: "Custom search",
      SortButton: {
        ariaLabel: "Sort the results",
        tooltip: "Sort",
        title: "Sort by",
        sorting: {
          asc: "Ascending",
          desc: "Descending",
          az: "A-Z",
          za: "Z-A"
        }
      },
      EditColumnsButton: {
        tooltip: "Edit columns",
        accessibilityLabel: "Customize table column order and visibility"
      },
      UpdateButtons: {
        cancel: "Cancel",
        update: "Update",
        save: "Save",
        saveAs: "Save as",
        modal: {
          title: "Save view as",
          label: "Name",
          sameName: "A view with this name already exists. Please choose a different name.",
          save: "Save",
          cancel: "Cancel"
        }
      }
    },
    IndexProvider: {
      defaultItemSingular: "Item",
      defaultItemPlural: "Items",
      allItemsSelected: "All {itemsLength}+ {resourceNamePlural} are selected",
      selected: "{selectedItemsCount} selected",
      a11yCheckboxDeselectAllSingle: "Deselect {resourceNameSingular}",
      a11yCheckboxSelectAllSingle: "Select {resourceNameSingular}",
      a11yCheckboxDeselectAllMultiple: "Deselect all {itemsLength} {resourceNamePlural}",
      a11yCheckboxSelectAllMultiple: "Select all {itemsLength} {resourceNamePlural}"
    },
    IndexTable: {
      emptySearchTitle: "No {resourceNamePlural} found",
      emptySearchDescription: "Try changing the filters or search term",
      onboardingBadgeText: "New",
      resourceLoadingAccessibilityLabel: "Loading {resourceNamePlural}\u2026",
      selectAllLabel: "Select all {resourceNamePlural}",
      selected: "{selectedItemsCount} selected",
      undo: "Undo",
      selectAllItems: "Select all {itemsLength}+ {resourceNamePlural}",
      selectItem: "Select {resourceName}",
      selectButtonText: "Select",
      sortAccessibilityLabel: "sort {direction} by"
    },
    Loading: {
      label: "Page loading bar"
    },
    Modal: {
      iFrameTitle: "body markup",
      modalWarning: "These required properties are missing from Modal: {missingProps}"
    },
    Page: {
      Header: {
        rollupActionsLabel: "View actions for {title}",
        pageReadyAccessibilityLabel: "{title}. This page is ready"
      }
    },
    Pagination: {
      previous: "Previous",
      next: "Next",
      pagination: "Pagination"
    },
    ProgressBar: {
      negativeWarningMessage: "Values passed to the progress prop shouldn\u2019t be negative. Resetting {progress} to 0.",
      exceedWarningMessage: "Values passed to the progress prop shouldn\u2019t exceed 100. Setting {progress} to 100."
    },
    ResourceList: {
      sortingLabel: "Sort by",
      defaultItemSingular: "item",
      defaultItemPlural: "items",
      showing: "Showing {itemsCount} {resource}",
      showingTotalCount: "Showing {itemsCount} of {totalItemsCount} {resource}",
      loading: "Loading {resource}",
      selected: "{selectedItemsCount} selected",
      allItemsSelected: "All {itemsLength}+ {resourceNamePlural} in your store are selected",
      allFilteredItemsSelected: "All {itemsLength}+ {resourceNamePlural} in this filter are selected",
      selectAllItems: "Select all {itemsLength}+ {resourceNamePlural} in your store",
      selectAllFilteredItems: "Select all {itemsLength}+ {resourceNamePlural} in this filter",
      emptySearchResultTitle: "No {resourceNamePlural} found",
      emptySearchResultDescription: "Try changing the filters or search term",
      selectButtonText: "Select",
      a11yCheckboxDeselectAllSingle: "Deselect {resourceNameSingular}",
      a11yCheckboxSelectAllSingle: "Select {resourceNameSingular}",
      a11yCheckboxDeselectAllMultiple: "Deselect all {itemsLength} {resourceNamePlural}",
      a11yCheckboxSelectAllMultiple: "Select all {itemsLength} {resourceNamePlural}",
      Item: {
        actionsDropdownLabel: "Actions for {accessibilityLabel}",
        actionsDropdown: "Actions dropdown",
        viewItem: "View details for {itemName}"
      },
      BulkActions: {
        actionsActivatorLabel: "Actions",
        moreActionsActivatorLabel: "More actions"
      }
    },
    SkeletonPage: {
      loadingLabel: "Page loading"
    },
    Tabs: {
      newViewAccessibilityLabel: "Create new view",
      newViewTooltip: "Create view",
      toggleTabsLabel: "More views",
      Tab: {
        rename: "Rename view",
        duplicate: "Duplicate view",
        edit: "Edit view",
        editColumns: "Edit columns",
        delete: "Delete view",
        copy: "Copy of {name}",
        deleteModal: {
          title: "Delete view?",
          description: "This can\u2019t be undone. {viewName} view will no longer be available in your admin.",
          cancel: "Cancel",
          delete: "Delete view"
        }
      },
      RenameModal: {
        title: "Rename view",
        label: "Name",
        cancel: "Cancel",
        create: "Save",
        errors: {
          sameName: "A view with this name already exists. Please choose a different name."
        }
      },
      DuplicateModal: {
        title: "Duplicate view",
        label: "Name",
        cancel: "Cancel",
        create: "Create view",
        errors: {
          sameName: "A view with this name already exists. Please choose a different name."
        }
      },
      CreateViewModal: {
        title: "Create new view",
        label: "Name",
        cancel: "Cancel",
        create: "Create view",
        errors: {
          sameName: "A view with this name already exists. Please choose a different name."
        }
      }
    },
    Tag: {
      ariaLabel: "Remove {children}"
    },
    TextField: {
      characterCount: "{count} characters",
      characterCountWithMaxLength: "{count} of {limit} characters used"
    },
    TooltipOverlay: {
      accessibilityLabel: "Tooltip: {label}"
    },
    TopBar: {
      toggleMenuLabel: "Toggle menu",
      SearchField: {
        clearButtonLabel: "Clear",
        search: "Search"
      }
    },
    MediaCard: {
      dismissButton: "Dismiss",
      popoverButton: "Actions"
    },
    VideoThumbnail: {
      playButtonA11yLabel: {
        default: "Play video",
        defaultWithDuration: "Play video of length {duration}",
        duration: {
          hours: {
            other: {
              only: "{hourCount} hours",
              andMinutes: "{hourCount} hours and {minuteCount} minutes",
              andMinute: "{hourCount} hours and {minuteCount} minute",
              minutesAndSeconds: "{hourCount} hours, {minuteCount} minutes, and {secondCount} seconds",
              minutesAndSecond: "{hourCount} hours, {minuteCount} minutes, and {secondCount} second",
              minuteAndSeconds: "{hourCount} hours, {minuteCount} minute, and {secondCount} seconds",
              minuteAndSecond: "{hourCount} hours, {minuteCount} minute, and {secondCount} second",
              andSeconds: "{hourCount} hours and {secondCount} seconds",
              andSecond: "{hourCount} hours and {secondCount} second"
            },
            one: {
              only: "{hourCount} hour",
              andMinutes: "{hourCount} hour and {minuteCount} minutes",
              andMinute: "{hourCount} hour and {minuteCount} minute",
              minutesAndSeconds: "{hourCount} hour, {minuteCount} minutes, and {secondCount} seconds",
              minutesAndSecond: "{hourCount} hour, {minuteCount} minutes, and {secondCount} second",
              minuteAndSeconds: "{hourCount} hour, {minuteCount} minute, and {secondCount} seconds",
              minuteAndSecond: "{hourCount} hour, {minuteCount} minute, and {secondCount} second",
              andSeconds: "{hourCount} hour and {secondCount} seconds",
              andSecond: "{hourCount} hour and {secondCount} second"
            }
          },
          minutes: {
            other: {
              only: "{minuteCount} minutes",
              andSeconds: "{minuteCount} minutes and {secondCount} seconds",
              andSecond: "{minuteCount} minutes and {secondCount} second"
            },
            one: {
              only: "{minuteCount} minute",
              andSeconds: "{minuteCount} minute and {secondCount} seconds",
              andSecond: "{minuteCount} minute and {secondCount} second"
            }
          },
          seconds: {
            other: "{secondCount} seconds",
            one: "{secondCount} second"
          }
        }
      }
    }
  }
};

// node_modules/@shopify/polaris/build/esm/styles.css
var styles_default = "/build/_assets/styles-62I325MT.css";

// app/root.jsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var links = () => [
  { rel: "stylesheet", href: styles_default }
];
function App() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx2("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx2("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      /* @__PURE__ */ jsx2(Meta, {}),
      /* @__PURE__ */ jsx2(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx2(AppProvider, { i18n: en_default, children: /* @__PURE__ */ jsx2(Outlet, {}) }),
      /* @__PURE__ */ jsx2(ScrollRestoration, {}),
      /* @__PURE__ */ jsx2(Scripts, {})
    ] })
  ] });
}

// app/routes/webhooks.app-uninstalled.jsx
var webhooks_app_uninstalled_exports = {};
__export(webhooks_app_uninstalled_exports, {
  action: () => action
});
import { json } from "@remix-run/node";
async function action({ request }) {
  if (request.headers.get("X-Shopify-Topic") !== "app/uninstalled")
    return json({ ok: !1, error: "wrong topic" }, 400);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: !1, error: "invalid body" }, 400);
  }
  let shop = body.domain || body.myshopify_domain;
  return console.log(`[webhook] app/uninstalled for shop: ${shop}`), json({ ok: !0 });
}

// app/routes/webhooks.products-update.jsx
var webhooks_products_update_exports = {};
__export(webhooks_products_update_exports, {
  action: () => action2
});
import { json as json2 } from "@remix-run/node";
async function action2({ request }) {
  let topic = request.headers.get("X-Shopify-Topic"), shop = request.headers.get("X-Shopify-Shop-Domain");
  return ["products/create", "products/update"].includes(topic) ? (console.log(`[webhook] ${topic} for shop: ${shop} \u2014 invalidating scan cache`), json2({ ok: !0 })) : json2({ ok: !1, error: "wrong topic" }, 400);
}

// app/routes/app.descriptions.jsx
var app_descriptions_exports = {};
__export(app_descriptions_exports, {
  action: () => action3,
  default: () => DescriptionsPage,
  loader: () => loader
});
import { json as json3 } from "@remix-run/node";
import { useLoaderData, useNavigation, useFetcher } from "@remix-run/react";

// app/shopify.server.js
var MOCK_SESSION = {
  id: "mock-session-id",
  shop: "mock-store.myshopify.com",
  accessToken: "MOCK_ACCESS_TOKEN",
  scope: "read_products,read_content,read_themes,write_themes,read_online_store_pages",
  isOnline: !1
}, IS_MOCK = (process.env.AUTH_MODE ?? "mock") === "mock" || !process.env.SHOPIFY_API_KEY || process.env.SHOPIFY_API_KEY === "REPLACE_WITH_CLIENT_ID";
async function authenticateAdmin(request) {
  if (IS_MOCK)
    return { session: MOCK_SESSION, admin: {
      graphql: async (_query, _variables) => {
        throw console.warn("[MOCK] Admin GraphQL called but AUTH_MODE=mock \u2014 returning stub error."), new Error(
          "MOCK_ADMIN_GRAPHQL: set AUTH_MODE=shopify and real credentials to use the authenticated engine."
        );
      }
    } };
  let { authenticate: authenticate2 } = await Promise.resolve().then(() => (init_shopify_real_server(), shopify_real_server_exports));
  return authenticate2.admin(request);
}
function getShopFromRequest(request) {
  return IS_MOCK ? MOCK_SESSION.shop : new URL(request.url).searchParams.get("shop") || MOCK_SESSION.shop;
}
async function requestBilling(request, planId) {
  if (IS_MOCK)
    return new Response(JSON.stringify({ error: "Billing unavailable in MOCK mode" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  let { authenticate: authenticate2, BILLING_PLANS: BILLING_PLANS2 } = await Promise.resolve().then(() => (init_shopify_real_server(), shopify_real_server_exports)), { billing } = await authenticate2.admin(request), planName = BILLING_PLANS2[planId];
  return planName ? (await billing.request({
    plan: planName,
    isTest: !1,
    returnUrl: `${process.env.SHOPIFY_APP_URL}/app`
  }), null) : new Response(JSON.stringify({ error: `Unknown plan: ${planId}` }), {
    status: 400,
    headers: { "Content-Type": "application/json" }
  });
}

// app/engine/aeo.server.js
import { createRequire } from "module";
var require2 = createRequire(import.meta.url), ENGINE_PATH = "../../../../build/aeo_engine.js", ENGINE_AUTHED_PATH = "../../../../build/aeo_engine_authed.js", _engine = null, _engineAuthed = null;
function getEngine() {
  return _engine || (_engine = require2(ENGINE_PATH)), _engine;
}
function getEngineAuthed() {
  return _engineAuthed || (_engineAuthed = require2(ENGINE_AUTHED_PATH)), _engineAuthed;
}
var PRIVATE_PATTERNS = [
  /^https?:\/\/(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i,
  /^https?:\/\/\[::1\]/i
];
function assertPublicHost(url) {
  for (let p of PRIVATE_PATTERNS)
    if (p.test(url))
      throw new Error(`SSRF guard: blocked private/loopback URL: ${url}`);
}
var BYTE_CAP = 512 * 1024, FETCH_TIMEOUT_MS = 1e4;
async function safeFetch(url) {
  assertPublicHost(url);
  let ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    let res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "HatchloopAEO/1.0 (+https://hatchloop.com/aeo)" },
      redirect: "follow"
    }), reader = res.body ? res.body.getReader() : null, chunks = [], total = 0;
    if (reader)
      for (; ; ) {
        let { done, value } = await reader.read();
        if (done || (total += value.length, total > BYTE_CAP))
          break;
        chunks.push(value);
      }
    let html = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf8");
    return { status: res.status, html, finalUrl: res.url, contentType: res.headers.get("content-type") || "" };
  } finally {
    clearTimeout(timer);
  }
}
async function runPublicScan(storeUrl) {
  let { analyzeStore } = getEngine();
  return analyzeStore(storeUrl, {
    fetchFn: safeFetch,
    assertPublicHost
  });
}
async function runAuthenticatedScan({ adminGraphqlFn, publicReport = null, sample = 100 }) {
  let { analyzeStoreAuthed } = getEngineAuthed();
  return analyzeStoreAuthed({
    adminQuery: adminGraphqlFn,
    publicReport,
    sample
  });
}
async function getTier(shop) {
  let forced = process.env.FORCE_TIER;
  return forced && ["free", "starter", "pro"].includes(forced) ? forced : "free";
}
function gateFixes(allFixes, tier) {
  return tier === "free" ? { visible: allFixes.slice(0, 3), locked: Math.max(0, allFixes.length - 3) } : { visible: allFixes, locked: 0 };
}

// app/routes/app.descriptions.jsx
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var THIN_THRESHOLD = 50, FREE_TIER_LIMIT = 3, MAX_PRODUCTS_FETCHED = 50, MOCK_PRODUCTS = [
  { id: "gid://shopify/Product/1", title: "Running Shoes Pro", descriptionHtml: "" },
  { id: "gid://shopify/Product/2", title: "Trail Backpack 40L", descriptionHtml: "Good bag." },
  { id: "gid://shopify/Product/3", title: "Merino Wool Socks", descriptionHtml: "" },
  { id: "gid://shopify/Product/4", title: "Hydration Vest", descriptionHtml: "Nice vest." },
  { id: "gid://shopify/Product/5", title: "Trekking Poles", descriptionHtml: "" }
], PRODUCTS_QUERY = `
  query GetThinProducts($first: Int!) {
    products(first: $first, query: "status:ACTIVE") {
      edges {
        node {
          id
          title
          descriptionHtml
          handle
          images(first: 1) {
            edges { node { url altText } }
          }
          productType
          vendor
          tags
        }
      }
    }
  }
`, PRODUCT_UPDATE_MUTATION = `
  mutation ProductUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product { id title descriptionHtml }
      userErrors { field message }
    }
  }
`;
async function generateDescription(product) {
  let apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey)
    throw new Error("DEEPSEEK_API_KEY is not set in environment");
  let productContext = [
    `Product: ${product.title}`,
    product.productType ? `Type: ${product.productType}` : null,
    product.vendor ? `Brand: ${product.vendor}` : null,
    product.tags?.length ? `Tags: ${product.tags.join(", ")}` : null
  ].filter(Boolean).join(`
`), res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: `You are an expert Shopify store copywriter specializing in SEO-optimized product descriptions.
Write compelling, accurate product descriptions that:
- Are 80-150 words
- Lead with the key benefit for the customer
- Include 2-3 natural long-tail keywords relevant to the product
- Use active voice and sensory language
- End with a subtle call-to-action
- Avoid filler phrases like "introducing" or "featuring"
Return ONLY the description text, no preamble, no HTML tags.`
        },
        { role: "user", content: `Write a product description for:
${productContext}` }
      ]
    })
  });
  if (!res.ok)
    throw new Error(`DeepSeek API error: ${res.status} ${res.statusText}`);
  let text2 = (await res.json()).choices?.[0]?.message?.content;
  if (!text2)
    throw new Error("No text content in AI response");
  return text2.trim();
}
async function loader({ request }) {
  let shop = getShopFromRequest(request), tier = await getTier(shop), products = [], fetchError = null;
  if (IS_MOCK)
    products = MOCK_PRODUCTS;
  else
    try {
      let { admin } = await authenticateAdmin(request), data = await (await admin.graphql(PRODUCTS_QUERY, {
        variables: { first: MAX_PRODUCTS_FETCHED }
      })).json();
      if (data.errors)
        throw new Error(data.errors.map((e) => e.message).join("; "));
      products = (data.data?.products?.edges ?? []).map((e) => e.node);
    } catch (e) {
      fetchError = e.message;
    }
  let thinProducts = products.filter(
    (p) => (p.descriptionHtml || "").replace(/<[^>]*>/g, "").trim().length < THIN_THRESHOLD
  ), isFree = tier === "free", visible = isFree ? thinProducts.slice(0, FREE_TIER_LIMIT) : thinProducts, lockedCount = isFree ? Math.max(0, thinProducts.length - FREE_TIER_LIMIT) : 0;
  return json3({
    shop,
    tier,
    isMock: IS_MOCK,
    products: visible,
    lockedCount,
    totalThin: thinProducts.length,
    fetchError
  });
}
async function action3({ request }) {
  let shop = getShopFromRequest(request), tier = await getTier(shop), formData = await request.formData(), intent = formData.get("intent"), productId = formData.get("productId"), productTitle = formData.get("productTitle"), productType = formData.get("productType") || "", vendor = formData.get("vendor") || "", tags = (formData.get("tags") || "").split(",").filter(Boolean);
  if (intent === "generate")
    try {
      let description = await generateDescription({
        title: productTitle,
        productType,
        vendor,
        tags
      });
      return json3({ ok: !0, intent: "generate", productId, description });
    } catch (e) {
      return json3({ ok: !1, intent: "generate", productId, error: e.message }, { status: 500 });
    }
  if (intent === "write") {
    let description = formData.get("description");
    if (!description)
      return json3({ ok: !1, intent: "write", productId, error: "No description provided" }, { status: 400 });
    if (IS_MOCK)
      return json3({ ok: !0, intent: "write", productId });
    try {
      let { admin } = await authenticateAdmin(request), userErrors = (await (await admin.graphql(PRODUCT_UPDATE_MUTATION, {
        variables: {
          input: {
            id: productId,
            descriptionHtml: `<p>${description.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br />")}</p>`
          }
        }
      })).json()).data?.productUpdate?.userErrors ?? [];
      if (userErrors.length)
        throw new Error(userErrors.map((e) => e.message).join("; "));
      return json3({ ok: !0, intent: "write", productId });
    } catch (e) {
      return json3({ ok: !1, intent: "write", productId, error: e.message }, { status: 500 });
    }
  }
  return json3({ ok: !1, error: "Unknown intent" }, { status: 400 });
}
function stripHtml(html) {
  return (html || "").replace(/<[^>]*>/g, "").trim();
}
function ProductRow({ product, isMock }) {
  let fetcher = useFetcher(), isGenerating = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "generate", isWriting = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "write", generated = fetcher.data?.intent === "generate" && fetcher.data?.ok ? fetcher.data.description : null, written = fetcher.data?.intent === "write" && fetcher.data?.ok, genError = fetcher.data?.intent === "generate" && !fetcher.data?.ok ? fetcher.data.error : null, writeError = fetcher.data?.intent === "write" && !fetcher.data?.ok ? fetcher.data.error : null, currentDesc = stripHtml(product.descriptionHtml), descLength = currentDesc.length, statusBadge;
  return written ? statusBadge = /* @__PURE__ */ jsx3(Badge, { tone: "success", children: "Written" }) : generated ? statusBadge = /* @__PURE__ */ jsx3(Badge, { tone: "attention", children: "Preview ready" }) : descLength === 0 ? statusBadge = /* @__PURE__ */ jsx3(Badge, { tone: "critical", children: "Blank" }) : statusBadge = /* @__PURE__ */ jsxs2(Badge, { tone: "warning", children: [
    "Thin (",
    descLength,
    " chars)"
  ] }), /* @__PURE__ */ jsxs2(BlockStack, { gap: "200", children: [
    /* @__PURE__ */ jsxs2(InlineStack, { align: "space-between", blockAlign: "center", children: [
      /* @__PURE__ */ jsxs2(BlockStack, { gap: "100", children: [
        /* @__PURE__ */ jsx3(Text, { as: "p", variant: "bodyMd", fontWeight: "medium", children: product.title }),
        currentDesc && !written && /* @__PURE__ */ jsxs2(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
          "Current: \u201C",
          currentDesc.slice(0, 80),
          currentDesc.length > 80 ? "\u2026" : "",
          "\u201D"
        ] }),
        statusBadge
      ] }),
      /* @__PURE__ */ jsxs2(InlineStack, { gap: "200", children: [
        !written && /* @__PURE__ */ jsxs2(fetcher.Form, { method: "post", children: [
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "intent", value: "generate" }),
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "productId", value: product.id }),
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "productTitle", value: product.title }),
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "productType", value: product.productType || "" }),
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "vendor", value: product.vendor || "" }),
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "tags", value: (product.tags || []).join(",") }),
          /* @__PURE__ */ jsx3(Button, { submit: !0, loading: isGenerating, size: "slim", children: isGenerating ? "Generating\u2026" : generated ? "Re-generate" : "Generate" })
        ] }),
        generated && !written && /* @__PURE__ */ jsxs2(fetcher.Form, { method: "post", children: [
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "intent", value: "write" }),
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "productId", value: product.id }),
          /* @__PURE__ */ jsx3("input", { type: "hidden", name: "description", value: generated }),
          /* @__PURE__ */ jsx3(Button, { submit: !0, loading: isWriting, tone: "success", size: "slim", children: isWriting ? "Saving\u2026" : isMock ? "Accept (mock)" : "Accept & Save" })
        ] })
      ] })
    ] }),
    generated && !written && /* @__PURE__ */ jsx3(
      Box,
      {
        background: "bg-surface-secondary",
        borderRadius: "100",
        padding: "300",
        children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "100", children: [
          /* @__PURE__ */ jsxs2(Text, { as: "p", variant: "bodySm", fontWeight: "medium", tone: "subdued", children: [
            "AI-generated preview (",
            generated.length,
            " chars):"
          ] }),
          /* @__PURE__ */ jsx3(Text, { as: "p", variant: "bodySm", children: generated })
        ] })
      }
    ),
    genError && /* @__PURE__ */ jsx3(Banner, { tone: "critical", title: "Generation failed", children: /* @__PURE__ */ jsx3("p", { children: genError }) }),
    writeError && /* @__PURE__ */ jsx3(Banner, { tone: "critical", title: "Save failed", children: /* @__PURE__ */ jsx3("p", { children: writeError }) })
  ] });
}
function DescriptionsPage() {
  let { products, lockedCount, totalThin, tier, isMock, fetchError } = useLoaderData(), isLoading = useNavigation().state !== "idle";
  return /* @__PURE__ */ jsx3(
    Page,
    {
      title: "AI Product Descriptions",
      subtitle: "Auto-generate SEO-optimized descriptions for products with thin or blank copy",
      backAction: { content: "Dashboard", url: "/app" },
      children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "400", children: [
        isMock && /* @__PURE__ */ jsx3(Banner, { tone: "warning", title: "Scaffold / MOCK mode", children: /* @__PURE__ */ jsxs2("p", { children: [
          "Auth is mocked. Product list is stub data. Generate calls the real DeepSeek API (needs ",
          /* @__PURE__ */ jsx3("code", { children: "DEEPSEEK_API_KEY" }),
          " in root\xA0",
          /* @__PURE__ */ jsx3("code", { children: ".env" }),
          "). \u201CAccept & Save\u201D echoes success without writing to Shopify."
        ] }) }),
        fetchError && /* @__PURE__ */ jsx3(Banner, { tone: "critical", title: "Could not load products", children: /* @__PURE__ */ jsx3("p", { children: fetchError }) }),
        /* @__PURE__ */ jsxs2(Layout, { children: [
          /* @__PURE__ */ jsx3(Layout.Section, { variant: "oneThird", children: /* @__PURE__ */ jsx3(Card, { children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "200", align: "center", children: [
            /* @__PURE__ */ jsx3(Text, { as: "p", variant: "headingLg", alignment: "center", tone: "critical", children: totalThin }),
            /* @__PURE__ */ jsx3(Text, { as: "p", variant: "bodySm", tone: "subdued", alignment: "center", children: "Products with thin or blank descriptions" }),
            /* @__PURE__ */ jsx3(Badge, { tone: tier === "free" ? "attention" : "success", children: tier === "free" ? "Free \u2014 first 3 shown" : tier === "starter" ? "Starter" : "Pro" })
          ] }) }) }),
          /* @__PURE__ */ jsx3(Layout.Section, { children: /* @__PURE__ */ jsx3(Card, { children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "200", children: [
            /* @__PURE__ */ jsx3(Text, { as: "h2", variant: "headingMd", children: "How it works" }),
            /* @__PURE__ */ jsxs2(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
              "1. Click ",
              /* @__PURE__ */ jsx3("strong", { children: "Generate" }),
              " \u2014 Hatchloop AEO uses AI to write an 80-150 word, keyword-rich description tailored to each product."
            ] }),
            /* @__PURE__ */ jsx3(Text, { as: "p", variant: "bodySm", tone: "subdued", children: "2. Review the preview below the product row." }),
            /* @__PURE__ */ jsxs2(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
              "3. Click ",
              /* @__PURE__ */ jsx3("strong", { children: "Accept & Save" }),
              " to push the description live to your Shopify store via the Admin API."
            ] }),
            /* @__PURE__ */ jsx3(Text, { as: "p", variant: "bodySm", tone: "subdued", children: "Cost: ~$0.0002 per description (max $0.003 cap per generation)." })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsx3(Card, { children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "400", children: [
          /* @__PURE__ */ jsxs2(InlineStack, { align: "space-between", children: [
            /* @__PURE__ */ jsx3(Text, { as: "h2", variant: "headingMd", children: "Products needing descriptions" }),
            isLoading && /* @__PURE__ */ jsx3(Spinner, { size: "small" })
          ] }),
          products.length === 0 && !fetchError && /* @__PURE__ */ jsx3(Banner, { tone: "success", title: "All descriptions look good", children: /* @__PURE__ */ jsxs2("p", { children: [
            "No products found with thin or blank descriptions (under ",
            THIN_THRESHOLD,
            " characters). Check back after adding new products."
          ] }) }),
          products.map((product, i) => /* @__PURE__ */ jsxs2(BlockStack, { gap: "0", children: [
            i > 0 && /* @__PURE__ */ jsx3(Divider, {}),
            /* @__PURE__ */ jsx3(Box, { padding: "300", children: /* @__PURE__ */ jsx3(ProductRow, { product, isMock }) })
          ] }, product.id)),
          lockedCount > 0 && tier === "free" && /* @__PURE__ */ jsxs2(Fragment, { children: [
            /* @__PURE__ */ jsx3(Divider, {}),
            /* @__PURE__ */ jsx3(
              Banner,
              {
                tone: "attention",
                title: `${lockedCount} more product${lockedCount > 1 ? "s" : ""} available on Starter ($12/mo)`,
                action: { content: "Upgrade to Starter", url: "/app/billing?plan=starter" },
                children: /* @__PURE__ */ jsxs2("p", { children: [
                  "Unlock AI description generation for all ",
                  totalThin,
                  " thin products \u2014 and every new product added to your store. No risk, cancel any time."
                ] })
              }
            )
          ] })
        ] }) }),
        tier !== "free" && products.length > 1 && /* @__PURE__ */ jsx3(Card, { children: /* @__PURE__ */ jsxs2(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsx3(Text, { as: "h2", variant: "headingMd", children: "Bulk generation" }),
          /* @__PURE__ */ jsxs2(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
            "Generate descriptions for all ",
            products.length,
            " thin products at once. Each description is previewed before being saved \u2014 you stay in control."
          ] }),
          /* @__PURE__ */ jsxs2(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
            "Estimated cost: ~$",
            (products.length * 2e-4).toFixed(4),
            " for ",
            products.length,
            " descriptions."
          ] }),
          /* @__PURE__ */ jsx3(Banner, { tone: "info", title: "Coming soon", children: /* @__PURE__ */ jsx3("p", { children: "Bulk generation with a single click is on the roadmap. For now, generate each product individually using the buttons above." }) })
        ] }) })
      ] })
    }
  );
}

// app/routes/app.citations.jsx
var app_citations_exports = {};
__export(app_citations_exports, {
  default: () => CitationsPage,
  loader: () => loader2
});
import { json as json4 } from "@remix-run/node";
import { useLoaderData as useLoaderData2 } from "@remix-run/react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
async function loader2({ request }) {
  let shop = getShopFromRequest(request), tier = await getTier(shop);
  return tier !== "pro" ? json4({ authorized: !1, tier }) : json4({
    authorized: !0,
    tier,
    prompts: [],
    // populated from DB in production
    isMock: (process.env.AUTH_MODE ?? "mock") === "mock"
  });
}
var ENGINE_LABELS = ["ChatGPT", "Perplexity", "Gemini", "Copilot"];
function CitationsPage() {
  let data = useLoaderData2();
  return data.authorized ? /* @__PURE__ */ jsx4(
    Page,
    {
      title: "AI Citation Tracking",
      backAction: { content: "Dashboard", url: "/app" },
      primaryAction: /* @__PURE__ */ jsx4(Button, { variant: "primary", children: "Add prompt" }),
      children: /* @__PURE__ */ jsxs3(BlockStack, { gap: "400", children: [
        data.isMock && /* @__PURE__ */ jsx4(Banner, { tone: "warning", title: "SCAFFOLD \u2014 citation worker not yet wired", children: /* @__PURE__ */ jsx4("p", { children: "This page will show weekly citation results once the scheduled worker and DB connection are live. The Pro billing gate, DB schema (PromptResult), and UI shell are all in place." }) }),
        /* @__PURE__ */ jsx4(Card, { children: /* @__PURE__ */ jsxs3(BlockStack, { gap: "300", children: [
          /* @__PURE__ */ jsx4(Text, { as: "h2", variant: "headingMd", children: "Tracked Prompts" }),
          /* @__PURE__ */ jsxs3(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
            "Up to 50 buyer-intent prompts checked weekly across ",
            ENGINE_LABELS.join(", "),
            ". Results show whether your store was cited, with week-over-week trend."
          ] }),
          data.prompts.length === 0 ? /* @__PURE__ */ jsx4(Banner, { tone: "info", title: "No prompts tracked yet", children: /* @__PURE__ */ jsx4("p", { children: 'Add buyer-intent prompts like "best running shoes under $150" or "sustainable sneakers" to start tracking your AI share-of-voice.' }) }) : /* @__PURE__ */ jsx4(
            DataTable,
            {
              columnContentTypes: ["text", "text", "text", "text", "text", "text"],
              headings: ["Prompt", "ChatGPT", "Perplexity", "Gemini", "Copilot", "Last checked"],
              rows: data.prompts.map((p) => [
                p.prompt,
                ...ENGINE_LABELS.map((e) => p.results?.[e] ? "\u2713 cited" : "\u2014 not cited"),
                p.lastChecked ? new Date(p.lastChecked).toLocaleDateString() : "pending"
              ])
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx4(Card, { children: /* @__PURE__ */ jsxs3(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsx4(Text, { as: "h2", variant: "headingMd", children: "Engine Coverage" }),
          /* @__PURE__ */ jsx4(BlockStack, { gap: "100", children: ENGINE_LABELS.map((e) => /* @__PURE__ */ jsxs3(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
            /* @__PURE__ */ jsx4(Badge, { tone: "info", children: e }),
            " ",
            "Weekly prompt-based citation check \u2014 checks whether your brand/store is named or linked in the AI response."
          ] }, e)) })
        ] }) })
      ] })
    }
  ) : /* @__PURE__ */ jsx4(Page, { title: "AI Citation Tracking", backAction: { content: "Dashboard", url: "/app" }, children: /* @__PURE__ */ jsx4(
    Banner,
    {
      tone: "warning",
      title: "Pro plan required",
      action: { content: "Upgrade to Pro ($79/mo)", url: "/app/billing?plan=pro" },
      children: /* @__PURE__ */ jsx4("p", { children: "Citation tracking \u2014 weekly checks across ChatGPT, Perplexity, Gemini, and Copilot \u2014 is a Pro feature. Upgrade to unlock share-of-voice tracking." })
    }
  ) });
}

// app/routes/app.billing.jsx
var app_billing_exports = {};
__export(app_billing_exports, {
  action: () => action4,
  default: () => BillingPage,
  loader: () => loader3
});
import { json as json5 } from "@remix-run/node";
import { useLoaderData as useLoaderData3, useSearchParams, Form } from "@remix-run/react";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
async function loader3({ request }) {
  return json5({ isMock: IS_MOCK });
}
async function action4({ request }) {
  let planId = (await request.formData()).get("plan");
  return requestBilling(request, planId);
}
var PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    badge: null,
    features: [
      "AI-Visibility Score (0\u2013100)",
      "Five sub-scores",
      "Top 3 ranked fixes",
      "llms.txt presence check",
      "Weekly rescore"
    ],
    cta: "Current plan",
    disabled: !0
  },
  {
    id: "starter",
    name: "Starter",
    price: "$19",
    period: "per month",
    badge: "Most popular",
    features: [
      "Everything in Free",
      "All ranked fixes unlocked",
      "One-click schema injection",
      "Full product feed scorer",
      "llms.txt enrichment + auto-resync",
      "Authenticated deep analysis",
      "10 tracked citation prompts / week"
    ],
    cta: "Upgrade to Starter",
    disabled: !1
  },
  {
    id: "pro",
    name: "Pro",
    price: "$79",
    period: "per month",
    badge: "Full AEO platform",
    features: [
      "Everything in Starter",
      "FAQPage schema generation",
      "Multi-market llms.txt (all Shopify Markets locales)",
      "50 tracked prompts weekly",
      "Competitor share-of-voice",
      "AI-drafted description improvements (merchant-reviewed)",
      "Priority resync on catalog changes"
    ],
    cta: "Upgrade to Pro",
    disabled: !1
  }
];
function BillingPage() {
  let { isMock } = useLoaderData3(), [params] = useSearchParams(), highlighted = params.get("plan") || null;
  return /* @__PURE__ */ jsx5(Page, { title: "Plans & Billing", backAction: { content: "Dashboard", url: "/app" }, children: /* @__PURE__ */ jsxs4(BlockStack, { gap: "400", children: [
    isMock && /* @__PURE__ */ jsx5(Banner, { tone: "warning", title: "MOCK / scaffold mode", children: /* @__PURE__ */ jsx5("p", { children: "Billing is wired but inactive \u2014 buttons are disabled until the app is installed on a real Shopify store (AUTH_MODE=shopify). In production, clicking Upgrade redirects the merchant to Shopify\u2019s billing confirmation page." }) }),
    /* @__PURE__ */ jsx5(Layout, { children: PLANS.map((plan) => /* @__PURE__ */ jsx5(Layout.Section, { variant: "oneThird", children: /* @__PURE__ */ jsx5(Card, { background: plan.id === highlighted ? "bg-surface-selected" : void 0, children: /* @__PURE__ */ jsxs4(BlockStack, { gap: "400", children: [
      /* @__PURE__ */ jsxs4(InlineStack, { align: "space-between", children: [
        /* @__PURE__ */ jsx5(Text, { as: "h2", variant: "headingMd", children: plan.name }),
        plan.badge && /* @__PURE__ */ jsx5(Badge, { tone: "success", children: plan.badge })
      ] }),
      /* @__PURE__ */ jsxs4(InlineStack, { align: "baseline", gap: "100", children: [
        /* @__PURE__ */ jsx5(Text, { as: "p", variant: "heading2xl", fontWeight: "bold", children: plan.price }),
        /* @__PURE__ */ jsxs4(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
          "/",
          plan.period
        ] })
      ] }),
      /* @__PURE__ */ jsx5(List, { children: plan.features.map((f) => /* @__PURE__ */ jsx5(List.Item, { children: f }, f)) }),
      plan.disabled ? /* @__PURE__ */ jsx5(Button, { disabled: !0, children: plan.cta }) : /* @__PURE__ */ jsxs4(Form, { method: "post", children: [
        /* @__PURE__ */ jsx5("input", { type: "hidden", name: "plan", value: plan.id }),
        /* @__PURE__ */ jsx5(
          Button,
          {
            submit: !0,
            disabled: isMock,
            tone: plan.id === "pro" ? "success" : void 0,
            variant: plan.id === "starter" ? "primary" : void 0,
            children: isMock ? `${plan.cta} (install on a real store to activate)` : plan.cta
          }
        )
      ] })
    ] }) }) }, plan.id)) })
  ] }) });
}

// app/routes/app._index.jsx
var app_index_exports = {};
__export(app_index_exports, {
  action: () => action5,
  default: () => Dashboard,
  loader: () => loader4
});
import { json as json6 } from "@remix-run/node";
import { useLoaderData as useLoaderData4, useNavigation as useNavigation2, Form as Form2 } from "@remix-run/react";
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
async function loader4({ request }) {
  let shop = getShopFromRequest(request), tier = await getTier(shop), publicReport = null, publicError = null, deepReport = null, deepError = null, targetUrl = IS_MOCK ? process.env.MOCK_SCAN_URL || "https://allbirds.com" : `https://${shop}`;
  try {
    publicReport = await runPublicScan(targetUrl);
  } catch (e) {
    publicError = e.message;
  }
  if (tier !== "free" && !IS_MOCK)
    try {
      let { admin } = await authenticateAdmin(request);
      deepReport = await runAuthenticatedScan({ adminGraphqlFn: async (query, variables) => {
        let json8 = await (await admin.graphql(query, { variables })).json();
        if (json8.errors)
          throw new Error(json8.errors.map((e) => e.message).join("; "));
        return json8.data;
      }, publicReport, sample: 100 });
    } catch (e) {
      deepError = e.message;
    }
  else
    tier !== "free" && IS_MOCK && (deepError = "Authenticated scan unavailable in MOCK mode \u2014 install on a real store to enable.");
  let activeReport = deepReport || publicReport, allFixes = activeReport ? activeReport.allFixes || [] : [], { visible: fixes, locked: lockedCount } = gateFixes(allFixes, tier);
  return json6({
    shop,
    tier,
    isMock: IS_MOCK,
    targetUrl,
    report: activeReport,
    publicError,
    deepError,
    fixes,
    lockedCount,
    isDeep: !!deepReport,
    analyzedAt: activeReport ? activeReport.analyzedAt : null
  });
}
async function action5({ request }) {
  return json6({ ok: !0 });
}
var SCORE_COLOR = (s) => s >= 80 ? "success" : s >= 65 ? "info" : s >= 50 ? "warning" : "critical", GRADE_COLOR = { A: "success", B: "info", C: "attention", D: "warning", F: "critical" }, SUB_SCORE_LABELS = {
  discoverability: { label: "Discoverability", desc: "llms.txt, agents.md, agentic sitemap, robots.txt" },
  feedCompleteness: { label: "Product Feed", desc: "Descriptions, alt text, GTIN, variants, categories" },
  schemaCoverage: { label: "Schema Coverage", desc: "Product, Offer, FAQPage, Organization JSON-LD" },
  answerReadiness: { label: "Answer Readiness", desc: "FAQ schema, question headings, buying-guide content" },
  multiMarketHygiene: { label: "Multi-Market Hygiene", desc: "Per-locale llms.txt, hreflang, currency coverage" }
}, CATEGORY_LABELS = {
  discoverability: "Discoverability",
  feed: "Product Feed",
  schema: "Schema",
  answer: "Answer Readiness",
  multiMarket: "Multi-Market",
  catalogHygiene: "Catalog Hygiene"
};
function Dashboard() {
  let {
    report,
    publicError,
    deepError,
    fixes,
    lockedCount,
    tier,
    isMock,
    targetUrl,
    isDeep,
    analyzedAt
  } = useLoaderData4(), isScanning = useNavigation2().state !== "idle";
  if (publicError && !report)
    return /* @__PURE__ */ jsx6(Page, { title: "Hatchloop AEO", children: /* @__PURE__ */ jsxs5(Banner, { tone: "critical", title: "Scan failed", children: [
      /* @__PURE__ */ jsx6("p", { children: publicError }),
      /* @__PURE__ */ jsx6("p", { children: "Check that the store URL is reachable and not password-protected." })
    ] }) });
  if (!report)
    return /* @__PURE__ */ jsx6(Page, { title: "Hatchloop AEO", children: /* @__PURE__ */ jsx6(EmptyState, { heading: "Running your first AEO scan\u2026", image: "", children: /* @__PURE__ */ jsx6(Spinner, {}) }) });
  let score = report.score, grade = report.grade, subScores = report.subScores || {}, fixRows = fixes.map((f, i) => [
    `#${i + 1}`,
    CATEGORY_LABELS[f.category] || f.category,
    `+${f.gain} pts`,
    f.fix,
    f.needsApp ? tier === "free" ? "\u2014 upgrade" : "Available" : "No code needed"
  ]);
  return /* @__PURE__ */ jsx6(
    Page,
    {
      title: "Hatchloop AEO \u2014 AI-Visibility Score",
      subtitle: `${isDeep ? "Deep (authenticated)" : "Public"} scan \xB7 ${targetUrl}${isMock ? " (MOCK demo store)" : ""}`,
      primaryAction: /* @__PURE__ */ jsx6(Form2, { method: "post", children: /* @__PURE__ */ jsx6(Button, { submit: !0, loading: isScanning, tone: "success", children: isScanning ? "Scanning\u2026" : "Re-scan now" }) }),
      children: /* @__PURE__ */ jsxs5(BlockStack, { gap: "400", children: [
        isMock && /* @__PURE__ */ jsx6(Banner, { tone: "warning", title: "Scaffold / MOCK mode", children: /* @__PURE__ */ jsxs5("p", { children: [
          "Auth is mocked. The public scan is real (fetching ",
          /* @__PURE__ */ jsx6("strong", { children: targetUrl }),
          "), but the authenticated deep report requires a real Shopify install. See ",
          /* @__PURE__ */ jsx6("code", { children: "apps/aeo-app/README.md" }),
          " to wire the Partner app."
        ] }) }),
        deepError && !isDeep && tier !== "free" && /* @__PURE__ */ jsx6(Banner, { tone: "attention", title: "Authenticated scan unavailable", children: /* @__PURE__ */ jsxs5("p", { children: [
          deepError,
          " \u2014 showing public scan results."
        ] }) }),
        /* @__PURE__ */ jsxs5(Layout, { children: [
          /* @__PURE__ */ jsx6(Layout.Section, { variant: "oneThird", children: /* @__PURE__ */ jsx6(Card, { children: /* @__PURE__ */ jsxs5(BlockStack, { gap: "300", align: "center", children: [
            /* @__PURE__ */ jsx6(Text, { as: "h2", variant: "headingLg", alignment: "center", children: "AI-Visibility Score" }),
            /* @__PURE__ */ jsx6(Box, { padding: "400", background: "bg-surface-secondary", borderRadius: "200", children: /* @__PURE__ */ jsxs5(BlockStack, { gap: "200", align: "center", children: [
              /* @__PURE__ */ jsxs5(
                Text,
                {
                  as: "p",
                  variant: "heading2xl",
                  fontWeight: "bold",
                  alignment: "center",
                  tone: SCORE_COLOR(score),
                  children: [
                    score,
                    /* @__PURE__ */ jsx6(Text, { as: "span", variant: "headingLg", tone: "subdued", children: " / 100" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs5(Badge, { tone: GRADE_COLOR[grade] || "attention", size: "large", children: [
                "Grade ",
                grade
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs5(Text, { as: "p", variant: "bodySm", tone: "subdued", alignment: "center", children: [
              "Weighted from 5 live signals.",
              " ",
              analyzedAt ? `Last scanned ${new Date(analyzedAt).toLocaleTimeString()}.` : ""
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsx6(Layout.Section, { children: /* @__PURE__ */ jsx6(Card, { children: /* @__PURE__ */ jsxs5(BlockStack, { gap: "400", children: [
            /* @__PURE__ */ jsx6(Text, { as: "h2", variant: "headingMd", children: "Sub-scores" }),
            Object.entries(SUB_SCORE_LABELS).map(([key, meta]) => {
              let sub = subScores[key], val = sub ? sub.score : null, source = sub ? sub.source || (isDeep ? "admin" : "storefront") : null;
              return /* @__PURE__ */ jsxs5(BlockStack, { gap: "100", children: [
                /* @__PURE__ */ jsxs5(InlineStack, { align: "space-between", children: [
                  /* @__PURE__ */ jsxs5(InlineStack, { gap: "200", align: "start", children: [
                    /* @__PURE__ */ jsx6(Text, { as: "span", variant: "bodyMd", fontWeight: "medium", children: meta.label }),
                    source && /* @__PURE__ */ jsx6(Badge, { tone: "info", size: "small", children: source })
                  ] }),
                  /* @__PURE__ */ jsx6(Text, { as: "span", variant: "bodyMd", tone: val !== null ? SCORE_COLOR(val) : "subdued", children: val !== null ? `${val}/100` : "n/a" })
                ] }),
                /* @__PURE__ */ jsx6(
                  ProgressBar,
                  {
                    progress: val !== null ? val : 0,
                    tone: val !== null ? SCORE_COLOR(val) : "highlight",
                    size: "small"
                  }
                ),
                /* @__PURE__ */ jsx6(Text, { as: "p", variant: "bodySm", tone: "subdued", children: meta.desc })
              ] }, key);
            })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsx6(Card, { children: /* @__PURE__ */ jsxs5(BlockStack, { gap: "400", children: [
          /* @__PURE__ */ jsxs5(InlineStack, { align: "space-between", children: [
            /* @__PURE__ */ jsx6(Text, { as: "h2", variant: "headingMd", children: "Ranked Fix List" }),
            /* @__PURE__ */ jsx6(Badge, { tone: tier === "free" ? "attention" : "success", children: tier === "free" ? "Free \u2014 top 3 shown" : tier === "starter" ? "Starter" : "Pro" })
          ] }),
          fixRows.length > 0 ? /* @__PURE__ */ jsx6(
            DataTable,
            {
              columnContentTypes: ["text", "text", "text", "text", "text"],
              headings: ["#", "Category", "Gain", "What to fix", "In-app"],
              rows: fixRows,
              truncate: !0
            }
          ) : /* @__PURE__ */ jsx6(Banner, { tone: "success", title: "No gaps found", children: /* @__PURE__ */ jsx6("p", { children: "Your store scores well across all five AEO dimensions." }) }),
          lockedCount > 0 && tier === "free" && /* @__PURE__ */ jsxs5(Fragment2, { children: [
            /* @__PURE__ */ jsx6(Divider, {}),
            /* @__PURE__ */ jsx6(
              Banner,
              {
                tone: "attention",
                title: `${lockedCount} more fix${lockedCount > 1 ? "es" : ""} available on Starter ($19/mo)`,
                action: { content: "Upgrade to Starter", url: "/app/billing?plan=starter" },
                children: /* @__PURE__ */ jsx6("p", { children: "Unlock every ranked fix, one-click schema injection, and the full product feed completeness scorer. No risk \u2014 cancel any time." })
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsx6(Card, { children: /* @__PURE__ */ jsxs5(BlockStack, { gap: "300", children: [
          /* @__PURE__ */ jsxs5(InlineStack, { align: "space-between", children: [
            /* @__PURE__ */ jsx6(Text, { as: "h2", variant: "headingMd", children: "AI Citation Tracking" }),
            /* @__PURE__ */ jsx6(Badge, { tone: tier === "pro" ? "success" : "critical", children: tier === "pro" ? "Pro" : "Pro plan only" })
          ] }),
          tier === "pro" ? /* @__PURE__ */ jsxs5(Banner, { tone: "info", title: "Citation tracking is live", children: [
            /* @__PURE__ */ jsx6("p", { children: "Weekly checks across ChatGPT, Perplexity, Gemini & Copilot. View your tracked prompts and share-of-voice trends." }),
            /* @__PURE__ */ jsx6(Button, { url: "/app/citations", children: "View citation dashboard" })
          ] }) : /* @__PURE__ */ jsx6(
            Banner,
            {
              tone: "warning",
              title: "Track which AI engines mention your store",
              action: { content: "Upgrade to Pro ($79/mo)", url: "/app/billing?plan=pro" },
              children: /* @__PURE__ */ jsx6("p", { children: 'Set up buyer-intent prompts ("best running shoes under $150") and Hatchloop AEO checks them weekly across 4 AI engines \u2014 reporting your share-of-voice and week-over-week trend.' })
            }
          )
        ] }) }),
        report.evidence && /* @__PURE__ */ jsx6(Card, { children: /* @__PURE__ */ jsxs5(BlockStack, { gap: "200", children: [
          /* @__PURE__ */ jsx6(Text, { as: "h2", variant: "headingMd", children: "Raw Evidence" }),
          /* @__PURE__ */ jsxs5(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
            "Schema types found: ",
            (report.evidence.schemaTypesFound || []).join(", ") || "none"
          ] }),
          /* @__PURE__ */ jsxs5(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
            "llms.txt: ",
            report.evidence.llmsTxt && report.evidence.llmsTxt.present ? `present (${report.evidence.llmsTxt.bytes} bytes)` : "not found"
          ] }),
          /* @__PURE__ */ jsxs5(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
            "agents.md: ",
            String(report.evidence.agentsMd),
            " | ",
            "robots allows AI: ",
            String(report.evidence.robotsAllowsAi)
          ] }),
          report.evidence.productFeed && /* @__PURE__ */ jsxs5(Text, { as: "p", variant: "bodySm", tone: "subdued", children: [
            "Product feed: ",
            report.evidence.productFeed.sampled,
            " products sampled,",
            " ",
            report.evidence.productFeed.goodDescPct,
            "% with good descriptions,",
            " ",
            report.evidence.productFeed.altTextPct,
            "% with alt text"
          ] })
        ] }) }),
        /* @__PURE__ */ jsx6(Text, { as: "p", variant: "bodySm", tone: "subdued", alignment: "center", children: report.disclaimer })
      ] })
    }
  );
}

// app/routes/auth.$.jsx
var auth_exports = {};
__export(auth_exports, {
  loader: () => loader5
});
import { redirect } from "@remix-run/node";
async function loader5({ request }) {
  return IS_MOCK ? redirect("/app") : (await authenticateAdmin(request), redirect("/app"));
}

// app/routes/app.jsx
var app_exports = {};
__export(app_exports, {
  default: () => AppLayout,
  loader: () => loader6
});
import { json as json7 } from "@remix-run/node";
import { Outlet as Outlet2, useLoaderData as useLoaderData5, NavLink } from "@remix-run/react";
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
async function loader6({ request }) {
  return json7({
    apiKey: process.env.SHOPIFY_API_KEY || "MOCK_API_KEY",
    isMock: IS_MOCK
  });
}
function AppLayout() {
  let { apiKey, isMock } = useLoaderData5();
  return /* @__PURE__ */ jsxs6(AppProvider, { i18n: en_default, children: [
    isMock && /* @__PURE__ */ jsx7("div", { style: {
      background: "#fffbe6",
      borderBottom: "2px solid #f59e0b",
      padding: "8px 16px",
      fontSize: "13px",
      color: "#92400e",
      fontFamily: "monospace"
    }, children: "SCAFFOLD MODE \u2014 AUTH_MODE=mock. Real Shopify OAuth not wired yet. See apps/aeo-app/README.md to connect a Partner app." }),
    /* @__PURE__ */ jsxs6("nav", { style: { display: "flex", gap: "12px", padding: "8px 16px", borderBottom: "1px solid #e1e3e5", fontSize: "14px" }, children: [
      /* @__PURE__ */ jsx7(NavLink, { to: "/app", end: !0, style: ({ isActive }) => ({ fontWeight: isActive ? 700 : 400, color: "#202223", textDecoration: "none" }), children: "AEO Score" }),
      /* @__PURE__ */ jsx7(NavLink, { to: "/app/descriptions", style: ({ isActive }) => ({ fontWeight: isActive ? 700 : 400, color: "#202223", textDecoration: "none" }), children: "AI Descriptions" }),
      /* @__PURE__ */ jsx7(NavLink, { to: "/app/billing", style: ({ isActive }) => ({ fontWeight: isActive ? 700 : 400, color: "#202223", textDecoration: "none" }), children: "Plans" })
    ] }),
    /* @__PURE__ */ jsx7(Outlet2, {})
  ] });
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-YVTZQHLV.js", imports: ["/build/_shared/chunk-3IKC2CFJ.js", "/build/_shared/chunk-Q3IECNXJ.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-3OTIBELW.js", imports: ["/build/_shared/chunk-T7YRQAM3.js", "/build/_shared/chunk-U75JZBYS.js"], hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/app": { id: "routes/app", parentId: "root", path: "app", index: void 0, caseSensitive: void 0, module: "/build/routes/app-WQJNUYWI.js", imports: ["/build/_shared/chunk-YFWTCXRW.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/app._index": { id: "routes/app._index", parentId: "routes/app", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/app._index-UWTZGEZH.js", imports: ["/build/_shared/chunk-SXJSCQMP.js", "/build/_shared/chunk-U75JZBYS.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/app.billing": { id: "routes/app.billing", parentId: "routes/app", path: "billing", index: void 0, caseSensitive: void 0, module: "/build/routes/app.billing-ODBQJUDJ.js", imports: ["/build/_shared/chunk-U75JZBYS.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/app.citations": { id: "routes/app.citations", parentId: "routes/app", path: "citations", index: void 0, caseSensitive: void 0, module: "/build/routes/app.citations-V3INI2LN.js", imports: ["/build/_shared/chunk-SXJSCQMP.js", "/build/_shared/chunk-U75JZBYS.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/app.descriptions": { id: "routes/app.descriptions", parentId: "routes/app", path: "descriptions", index: void 0, caseSensitive: void 0, module: "/build/routes/app.descriptions-XC4KVYI4.js", imports: ["/build/_shared/chunk-SXJSCQMP.js", "/build/_shared/chunk-U75JZBYS.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth.$": { id: "routes/auth.$", parentId: "root", path: "auth/*", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.$-JID2MVQG.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/webhooks.app-uninstalled": { id: "routes/webhooks.app-uninstalled", parentId: "root", path: "webhooks/app-uninstalled", index: void 0, caseSensitive: void 0, module: "/build/routes/webhooks.app-uninstalled-G7XRXHQZ.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/webhooks.products-update": { id: "routes/webhooks.products-update", parentId: "root", path: "webhooks/products-update", index: void 0, caseSensitive: void 0, module: "/build/routes/webhooks.products-update-AFRRJ72C.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "79cdb8eb", hmr: void 0, url: "/build/manifest-79CDB8EB.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public/build", future = { v3_fetcherPersist: !0, v3_relativeSplatPath: !0, v3_throwAbortReason: !0, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_node_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/webhooks.app-uninstalled": {
    id: "routes/webhooks.app-uninstalled",
    parentId: "root",
    path: "webhooks/app-uninstalled",
    index: void 0,
    caseSensitive: void 0,
    module: webhooks_app_uninstalled_exports
  },
  "routes/webhooks.products-update": {
    id: "routes/webhooks.products-update",
    parentId: "root",
    path: "webhooks/products-update",
    index: void 0,
    caseSensitive: void 0,
    module: webhooks_products_update_exports
  },
  "routes/app.descriptions": {
    id: "routes/app.descriptions",
    parentId: "routes/app",
    path: "descriptions",
    index: void 0,
    caseSensitive: void 0,
    module: app_descriptions_exports
  },
  "routes/app.citations": {
    id: "routes/app.citations",
    parentId: "routes/app",
    path: "citations",
    index: void 0,
    caseSensitive: void 0,
    module: app_citations_exports
  },
  "routes/app.billing": {
    id: "routes/app.billing",
    parentId: "routes/app",
    path: "billing",
    index: void 0,
    caseSensitive: void 0,
    module: app_billing_exports
  },
  "routes/app._index": {
    id: "routes/app._index",
    parentId: "routes/app",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: app_index_exports
  },
  "routes/auth.$": {
    id: "routes/auth.$",
    parentId: "root",
    path: "auth/*",
    index: void 0,
    caseSensitive: void 0,
    module: auth_exports
  },
  "routes/app": {
    id: "routes/app",
    parentId: "root",
    path: "app",
    index: void 0,
    caseSensitive: void 0,
    module: app_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
