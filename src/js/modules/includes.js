export async function loadIncludes(root = document) {
  const includes = [...root.querySelectorAll('[data-include]')];
  if (!includes.length) return;

  await Promise.all(
    includes.map(async (node) => {
      const url = node.getAttribute('data-include');
      if (!url) return;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load include: ${url}`);
      }

      node.outerHTML = await response.text();
    }),
  );

  if (document.querySelector('[data-include]')) {
    await loadIncludes(document);
  }
}
