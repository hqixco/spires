export async function loadIncludes(root = document) {
  const includes = [...root.querySelectorAll('[data-include]')];
  if (!includes.length) return;

  await Promise.all(
    includes.map(async (node) => {
      const url = node.getAttribute('data-include');
      if (!url) return;
      const includeClass = node.getAttribute('data-include-class');

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load include: ${url}`);
      }

      let html = await response.text();

      if (includeClass) {
        html = html.replace('<section class="', `<section class="${includeClass} `);
      }

      node.outerHTML = html;
    }),
  );

  if (document.querySelector('[data-include]')) {
    await loadIncludes(document);
  }
}
