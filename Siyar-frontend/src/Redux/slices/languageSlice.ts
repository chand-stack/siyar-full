import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AppLanguage = "en" | "ar" | "id" | "tr";

export interface LanguageState {
	current: AppLanguage;
	dir: "ltr" | "rtl";
}

const initialState: LanguageState = {
	current: "en",
	dir: "ltr",
};

const languageSlice = createSlice({
	name: "language",
	initialState,
	reducers: {
		setLanguage: (state, action: PayloadAction<AppLanguage>) => {
			state.current = action.payload;
			state.dir = action.payload === "ar" ? "rtl" : "ltr";
		},
	},
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;


