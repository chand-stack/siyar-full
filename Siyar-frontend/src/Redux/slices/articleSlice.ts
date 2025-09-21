import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { translateHtml } from "../../services/translator";

export interface ArticlePayload {
	id: string;
	lang: string;
	html: string;
}

export const translateArticle = createAsyncThunk<ArticlePayload, { id: string; from: string; to: string; html: string }>(
	"articles/translate",
	async ({ id, from, to, html }) => {
		const translated = await translateHtml({ html, from, to });
		return { id, lang: to, html: translated };
	}
);

type ArticleState = {
	byId: Record<string, Record<string, { html: string }>>; // id -> lang -> content
};

const initialState: ArticleState = {
	byId: {},
};

const articleSlice = createSlice({
	name: "articles",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(translateArticle.fulfilled, (state, { payload }) => {
			state.byId[payload.id] ??= {};
			state.byId[payload.id][payload.lang] = { html: payload.html };
		});
	},
});

export const selectArticleHtml = (state: RootState, id: string, lang: string) =>
	state.articles.byId[id]?.[lang]?.html;

export default articleSlice.reducer;


