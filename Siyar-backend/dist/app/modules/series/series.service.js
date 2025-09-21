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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesService = void 0;
const series_model_1 = require("./series.model");
const create = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure required fields are present and not null
    if (!payload.slug) {
        throw new Error("Slug is a required field");
    }
    // Always set a default language if not provided
    if (!payload.language || payload.language.trim() === '') {
        payload.language = 'en';
    }
    return series_model_1.Series.create(payload);
});
const list = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}) { return series_model_1.Series.find(filter).sort({ title: 1 }); });
const update = (id, payload) => __awaiter(void 0, void 0, void 0, function* () { return series_model_1.Series.findByIdAndUpdate(id, payload, { new: true }); });
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () { return series_model_1.Series.findByIdAndDelete(id); });
exports.SeriesService = { create, list, update, remove };
