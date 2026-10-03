/* Local SVG icons: independent of fonts, text direction and emoji rendering. */
function siteIcon(name){
 const paths={
 html:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
 css:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 9v12"/>',
 js:'<path d="M8 3H6v6l-3 3 3 3v6h2m8-18h2v6l3 3-3 3v6h-2"/>',
 react:'<ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',
 moon:'<path d="M20.6 13.3A9 9 0 0 1 10.7 3.4a9 9 0 1 0 9.9 9.9Z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
 book:'<path d="M12 5v15m0-15C8 2 3 3 3 3v16s5-1 9 1c4-2 9-1 9-1V3s-5-1-9 2Z"/>',
 pencil:'<path d="m15 4 5 5M4 20l5-1L21 7a2.1 2.1 0 0 0-4-4L5 15l-1 5Z"/>'
 };
 return `<svg class="ui-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]||paths.book}</svg>`;
}
