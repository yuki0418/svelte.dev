import { error } from '@sveltejs/kit';
import { index } from '$lib/server/content';

export const prerender = false; // TODO

export async function load({ params }) {
	const post = index[`blog/${params.slug}`];

	if (!post) error(404);

	// forgive me — terrible hack necessary to get diffs looking sensible
	// on the `runes` blog post
	post.body = post.body.replace(/(    )+/gm, (match) => '  '.repeat(match.length / 4));

	return {
		post: {
			...post,
			authors: []
		}
	};
}
