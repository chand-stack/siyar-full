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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const series_service_1 = require("./series.service");
const create = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const created = yield series_service_1.SeriesService.create(req.body);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: http_status_codes_1.default.CREATED, message: "series created", data: created });
}));
const list = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield series_service_1.SeriesService.list(req.query || {});
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: http_status_codes_1.default.OK, message: "series fetched", data });
}));
const update = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield series_service_1.SeriesService.update(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: http_status_codes_1.default.OK, message: "series updated", data: updated });
}));
const remove = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield series_service_1.SeriesService.remove(req.params.id);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: http_status_codes_1.default.OK, message: "series removed", data: null });
}));
exports.SeriesController = { create, list, update, remove };
