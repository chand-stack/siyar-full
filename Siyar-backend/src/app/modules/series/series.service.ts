import { FilterQuery } from "mongoose";
import { ISeries } from "./series.interface";
import { Series } from "./series.model";

const create = async (payload: Partial<ISeries>) => {
    // Ensure required fields are present and not null
    if (!payload.slug) {
        throw new Error("Slug is a required field");
    }
    
    // Always set a default language if not provided
    if (!payload.language || payload.language.trim() === '') {
        payload.language = 'en';
    }
    
    return Series.create(payload);
};

const list = async (filter: FilterQuery<ISeries> = {}) => Series.find(filter).sort({ title: 1 });
const update = async (id: string, payload: Partial<ISeries>) => Series.findByIdAndUpdate(id, payload, { new: true });
const remove = async (id: string) => Series.findByIdAndDelete(id);

export const SeriesService = { create, list, update, remove };


