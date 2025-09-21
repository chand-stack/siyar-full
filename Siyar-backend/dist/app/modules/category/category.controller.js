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
exports.CategoryController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const category_service_1 = require("./category.service");
const create = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const created = yield category_service_1.CategoryService.create(req.body);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: http_status_codes_1.default.CREATED, message: "category created", data: created });
}));
const list = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield category_service_1.CategoryService.list(req.query || {});
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: http_status_codes_1.default.OK, message: "categories fetched", data });
}));
const update = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield category_service_1.CategoryService.update(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: http_status_codes_1.default.OK, message: "category updated", data: updated });
}));
const remove = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield category_service_1.CategoryService.remove(req.params.id);
    (0, sendResponse_1.sendResponse)(res, { success: true, statusCode: http_status_codes_1.default.OK, message: "category removed", data: null });
}));
exports.CategoryController = { create, list, update, remove };
