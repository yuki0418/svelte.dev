import { error } from '@sveltejs/kit';
import { markedTransform } from '@sveltejs/site-kit/markdown';
import { index } from '$lib/server/content';

export const prerender = false; // TODO

export async function load({ params }) {
	const post = index[`blog/${params.slug}`];

	if (!post) error(404);

	// forgive me — terrible hack necessary to get diffs looking sensible
	// on the `runes` blog post
	post.body = post.body.replace(/(    )+/gm, (match) => '  '.repeat(match.length / 4));

	const author = post.metadata.author
		? { name: post.metadata.author, url: post.metadata.authorURL }
		: null;

	const basename = /** @type {string} */ (post.file.split('/').pop());
	const date = basename.slice(0, 10);

	return {
		title: post.metadata.title,
		description: post.metadata.description,
		path: `/${post.slug}`,
		date,
		date_formatted: format_date(date),
		body: await markedTransform(post.body),
		authors: author ? [author] : [],
		sections: post.sections
	};
}

/** @param {string} date */
function format_date(date) {
	const [y, m, d] = date.split('-');
	return `${months[+m - 1]} ${+d} ${y}`;
}

const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
