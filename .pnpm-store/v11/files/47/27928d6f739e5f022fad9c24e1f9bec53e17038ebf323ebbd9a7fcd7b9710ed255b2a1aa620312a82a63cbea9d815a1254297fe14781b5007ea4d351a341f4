import { i as lowlightLanguageMappings, t as rehypeHighlight } from "./rehype-highlight.js";
import { n as rehypeStringify, s as rehypeParse, t as unified } from "./lib.js";
import { t as visit } from "./lib2.js";
//#region src/code/line-numbers.ts
function isText(element) {
	return element?.type === "text";
}
function isElement(node) {
	return node?.type === "element";
}
function textElement(value) {
	return {
		type: "text",
		value
	};
}
function lineBreak() {
	return {
		type: "text",
		value: "\n"
	};
}
/**
* Adds lines to code blocks
*/
function codeBlockLinesPlugin() {
	return (tree) => {
		visit(tree, "element", (node, _i, parent) => {
			if (parent?.type === "element" && parent.tagName === "pre" && node.tagName === "code") {
				let numLines = 0;
				node.children = addLines(node);
				node.children.forEach((child) => {
					if (child.type === "element" && child.tagName === "span") {
						const lastChild = child.children[child.children.length - 1];
						if (lastChild && (!isText(lastChild) || isText(lastChild) && !hasLineBreak(lastChild))) {
							child.children.push(lineBreak());
							numLines++;
						}
					}
				});
				node.properties.style = [`--line-count: ${numLines};`, `--line-digits: ${numLines.toString().length};`];
			}
		});
	};
}
/**
* Adds lines to a node recursively and returns them
*
* @param node - The node to add lines to
* @param lines - The current lines
* @param copyParent - Whether to copy the parent node to save the original node styles
*/
function addLines(node, lines = [], copyParent) {
	const line = () => lines[lines.length - 1] ?? (lines.push(createLine()) && lines[lines.length - 1] || void 0);
	node.children.forEach((child) => {
		if (isText(child) && hasLineBreak(child)) {
			const split = child.value.split(/\n/);
			split.forEach((content, i) => {
				if (copyParent) line()?.children.push({
					...node,
					children: [textElement(content)]
				});
				else line()?.children.push(textElement(content));
				i !== split.length - 1 && lines.push(createLine());
			});
		} else if (isElement(child) && child.children.some(hasLineBreak)) addLines(child, lines, true);
		else line()?.children.push(child);
	});
	return lines;
}
/**
* Creates a new line element
*
* @param children - The children the line should have initially
*/
function createLine(...children) {
	return {
		type: "element",
		tagName: "span",
		properties: { class: ["line"] },
		children
	};
}
/**
* Checks if a node has a line break
*
* @param node - The node to check
*/
function hasLineBreak(node) {
	return isText(node) && /\r?\n/.test(node.value) || isElement(node) && node.children.some(hasLineBreak);
}
//#endregion
//#region src/code/highlight.ts
/**
* Syntax highlights a code string using the `rehype-highlight` library.
*/
function syntaxHighlight(codeString, options) {
	const credentials = (typeof options?.maskCredentials === "string" ? [options.maskCredentials] : options?.maskCredentials ?? []).filter((c) => {
		if (c.length < 3) return false;
		return true;
	});
	const className = `language-${lowlightLanguageMappings[options.lang] ?? options.lang}`;
	const nullPlugin = (() => {});
	const htmlString = unified().use(rehypeParse, { fragment: true }).use(injectRawCodeStringPlugin(codeString)).use(rehypeHighlight, { languages: options.languages }).use(options?.lineNumbers ? codeBlockLinesPlugin : nullPlugin).use(rehypeStringify).processSync(`<pre><code class="${className}"></code></pre>`).toString();
	return credentials.length ? credentials.reduce((acc, credential) => acc.split(credential).join(`<span class="credential"><span class="credential-value">${credential}</span></span>`), htmlString) : htmlString;
}
/**
* To prevent unified from parsing any content of the code string we inject
* it as a raw text node into the AST tree as a child of the code element
*/
function injectRawCodeStringPlugin(rawCodeString) {
	return () => (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName === "code") node.children.push({
				type: "text",
				value: rawCodeString
			});
		});
	};
}
//#endregion
export { syntaxHighlight as t };

//# sourceMappingURL=code.js.map