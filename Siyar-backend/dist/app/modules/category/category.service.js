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
exports.CategoryService = void 0;
const category_model_1 = require("./category.model");
const create = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure required fields are present and not null
    if (!payload.slug || !payload.language) {
        throw new Error("Slug and language are required fields");
    }
    // Set default language if not provided
    if (!payload.language) {
        payload.language = 'en';
    }
    return category_model_1.Category.create(payload);
});
const list = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}) { return category_model_1.Category.find(filter).sort({ title: 1 }); });
const update = (id, payload) => __awaiter(void 0, void 0, void 0, function* () { return category_model_1.Category.findByIdAndUpdate(id, payload, { new: true }); });
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () { return category_model_1.Category.findByIdAndDelete(id); });
exports.CategoryService = { create, list, update, remove };
