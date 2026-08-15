export type TipTapNode = {
	type: string;
	content?: TipTapNode[];
	text?: string;
	marks?: { type: string }[];
};

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const renderMarks = (text: string, marks: { type: string }[] = []) =>
	marks.reduce((html, mark) => {
		switch (mark.type) {
			case 'bold':
				return `<strong>${html}</strong>`;
			case 'italic':
				return `<em>${html}</em>`;
			case 'strike':
				return `<s>${html}</s>`;
			default:
				return html;
		}
	}, escapeHtml(text));

const renderChildren = (node: TipTapNode): string => (node.content ?? []).map(renderNode).join('');

const renderNode = (node: TipTapNode): string => {
	switch (node.type) {
		case 'text':
			return renderMarks(node.text ?? '', node.marks);
		case 'paragraph':
			return `<p>${renderChildren(node)}</p>`;
		case 'hardBreak':
			return '<br />';
		case 'bulletList':
			return `<ul>${renderChildren(node)}</ul>`;
		case 'orderedList':
			return `<ol>${renderChildren(node)}</ol>`;
		case 'listItem':
			return `<li>${renderChildren(node)}</li>`;
		case 'blockquote':
			return '';
		default:
			return renderChildren(node);
	}
};

export const renderTipTapHtml = (doc: TipTapNode): string => renderChildren(doc);

const plainText = (node: TipTapNode): string => {
	if (node.type === 'text') return node.text ?? '';
	return (node.content ?? []).map(plainText).join('\n');
};

export type ShowMetadata = {
	showtime?: string;
	hosts?: string;
};

export const extractShowMetadata = (doc: TipTapNode): ShowMetadata | null => {
	const blockquote = doc.content?.find((node) => node.type === 'blockquote');
	if (!blockquote) return null;

	const metadata: ShowMetadata = {};

	for (const line of plainText(blockquote).split('\n')) {
		const [key, ...rest] = line.split(':');
		const value = rest.join(':').trim();
		if (!value) continue;

		if (key.trim() === 'showtime') metadata.showtime = value;
		if (key.trim() === 'hosts') metadata.hosts = value;
	}

	return Object.keys(metadata).length ? metadata : null;
};
