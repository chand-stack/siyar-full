import { FilterQuery } from "mongoose";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";

const create = async (payload: Partial<ICategory>) => {
    // Ensure required fields are present and not null
    if (!payload.slug || !payload.language) {
        throw new Error("Slug and language are required fields");
    }
    
    // Set default language if not provided
    if (!payload.language) {
        payload.language = 'en';
    }
    
    return Category.create(payload);
};

const list = async (filter: FilterQuery<ICategory> = {}) => Category.find(filter).sort({ title: 1 });
const update = async (id: string, payload: Partial<ICategory>) => Category.findByIdAndUpdate(id, payload, { new: true });
const remove = async (id: string) => Category.findByIdAndDelete(id);

export const CategoryService = { create, list, update, remove };


