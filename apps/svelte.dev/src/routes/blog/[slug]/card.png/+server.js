import { render } from 'svelte/server';
import { Resvg } from '@resvg/resvg-js';
import { error } from '@sveltejs/kit';
import { read } from '$app/server';
import satori from 'satori';
import { html as toReactNode } from 'satori-html';
import Card from './Card.svelte';
import OverpassRegular from './Overpass-Regular.ttf?url';
import { index } from '$lib/server/content';

const height = 630;
const width = 1200;

export const prerender = false; // TODO

const data = await read(OverpassRegular).arrayBuffer();

export async function GET({ params }) {
	const post = index[`blog/${params.slug}`];

	if (!post) error(404);

	const result = render(Card, { props: { post } });

	console.log(result.body);

	// @ts-expect-error TODO we need to get the CSS in here somehow...
	const element = toReactNode(`${result.body}<style>${result.css?.code ?? ''}</style>`);

	const svg = await satori(element, {
		fonts: [
			{
				name: 'Overpass',
				data,
				style: 'normal',
				weight: 400
			}
		],
		height,
		width
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: width
		}
	});

	const image = resvg.render();

	return new Response(image.asPng(), {
		headers: {
			'content-type': 'image/png',
			'cache-control': 'public, max-age=600' // cache for 10 minutes
		}
	});
}
