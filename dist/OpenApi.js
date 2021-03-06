"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApi = void 0;
var crypto = require("crypto");
var https = require("https");
var OpenApi = /** @class */ (function () {
    function OpenApi(vendor_sn, appSecret) {
        this.vendor_sn = vendor_sn;
        this.appSecret = appSecret;
        this.$gateway = 'https://shq-api.51fubei.com/gateway/agent';
        this.$appSecret = '';
        this.vendorSn = '';
        this.vendorSn = vendor_sn;
        this.$appSecret = appSecret;
    }
    /**
     * ????????????????????????
     * @param $commonData ????????????
     * @param array $bizContent ????????????
     * @return bool|string
     * @throws Exception
     */
    OpenApi.prototype.actionApi = function ($commonData, $bizContent) {
        if ($bizContent === void 0) { $bizContent = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var $result, $e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        $commonData = Object.assign({
                            'vendor_sn': this.vendorSn,
                            'nonce': String(Date.now() + Math.floor(Math.random() * 1000000)),
                            "format": "json",
                            "sign_method": "md5",
                            "version": "1.0"
                        }, $commonData);
                        $commonData['biz_content'] = JSON.stringify($bizContent);
                        $commonData['sign'] = this.getSign($commonData);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.curlPostContents(this.$gateway, $commonData)];
                    case 2:
                        $result = _a.sent();
                        console.log('$result', $result);
                        return [2 /*return*/, $result];
                    case 3:
                        $e_1 = _a.sent();
                        throw new Error($e_1);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ????????????
     * @param $data
     * @return string
     */
    OpenApi.prototype.getSign = function ($data, appSecret) {
        if (appSecret === void 0) { appSecret = this.$appSecret; }
        var kvArr = Object.keys($data).map(function (key) { return key.toLowerCase(); })
            .sort()
            .map(function (key) { return key + '=' + $data[key]; });
        console.log('kvArr', kvArr);
        //???????????????????????????
        var $str = kvArr.join('&') + appSecret;
        console.log('$str', $str);
        //????????????????????????
        return this.md5($str).toUpperCase();
    };
    OpenApi.prototype.md5 = function (txt) {
        return crypto.createHash('md5').update(txt).digest('hex');
    };
    /**
     * ??????????????????
     * @param $url ????????????
     * @param array $data ????????????
     * @param int $timeout ????????????
     * @return bool|string
     * @throws Exception
     */
    OpenApi.prototype.curlPostContents = function ($url, $data, $timeout) {
        if ($data === void 0) { $data = {}; }
        if ($timeout === void 0) { $timeout = 10; }
        var data = JSON.stringify($data).replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, function (matched) {
            return '\\u' + matched.charCodeAt(0).toString(16);
        });
        console.log('data', data);
        var url = new URL($url);
        var options = {
            protoco: url.protocol,
            hostname: url.host,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: $timeout * 1000
        };
        return new Promise(function (resolve, reject) {
            var req = https.request(options, function (res) {
                console.log("\u72B6\u6001\u7801: " + res.statusCode);
                var _data = '';
                res.on('data', function (chunk) {
                    _data += chunk;
                });
                res.on('end', function () {
                    resolve(JSON.parse(_data));
                });
            });
            req.on('error', function (error) {
                reject(error);
            });
            req.write(data);
            req.end();
        });
    };
    return OpenApi;
}());
exports.OpenApi = OpenApi;
