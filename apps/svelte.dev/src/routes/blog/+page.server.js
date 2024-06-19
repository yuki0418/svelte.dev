import { index } from '$lib/server/content';

export const prerender = true;

export async function load() {
	const posts = index.blog.children
		.map((document) => {
			return {
				slug: document.slug,
				title: document.metadata.title,
				date: document.metadata.date,
				description: document.metadata.description,
				draft: document.metadata.draft
			};
		})
		.sort((a, b) => (a.date < b.date ? 1 : -1));

	return {
		posts
	};
}
