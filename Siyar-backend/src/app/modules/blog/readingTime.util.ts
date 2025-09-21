export function estimateReadingTimeInMinutes(plainText: string): number {
	const words = plainText?.trim().split(/\s+/).filter(Boolean).length || 0;
	const wordsPerMinute = 200;
	return Math.max(1, Math.ceil(words / wordsPerMinute));
}


