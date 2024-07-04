// __tests__/frontend.test.js
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const mf_drawer = fs.readFileSync(path.resolve(__dirname, '../../mf_drawer/public/index.html'), 'utf8');
const mf_videos = fs.readFileSync(path.resolve(__dirname, '../../mf_videos/public/index.html'), 'utf8');
const mf_favorites = fs.readFileSync(path.resolve(__dirname, '../../mf_favorites/public/index.html'), 'utf8');

let dom;
let container;

describe('MF_DRAWER Application', () => {
    beforeEach(() => {
        dom = new JSDOM(mf_drawer, { runScripts: 'dangerously' });
        container = dom.window.document.body;
    });

    test('should have a link to VÍDEOS', () => {
        const link = container.querySelector('a[href="/videos"]');
        expect(link).not.toBeNull();
        expect(link.textContent).toContain('buscar videos');
    });

    test('should have a link to FAVORITOS', () => {
        const link = container.querySelector('a[href="/favoritos"]');
        expect(link).not.toBeNull();
        expect(link.textContent).toContain('favoritos');
    });

});

describe('Responsive CSS', () => {
    test('should contain media query', () => {
        
        const cssPath = 'mf_drawer/public/css/style.css'; 
        const cssContent = fs.readFileSync(cssPath, 'utf8');

        const mediaQuery = '@media screen and (max-width: 768px)';

        expect(cssContent).toContain(mediaQuery);
    });
});

describe('MF_VIDEOS Application', () => {
    beforeEach(() => {
        dom = new JSDOM(mf_videos, { runScripts: 'dangerously' });
        container = dom.window.document.body;
    });

    test('should have a search input', () => {
        const searchInput = container.querySelector('input[type="text"][name="search"]');
        expect(searchInput).not.toBeNull();
    });

    test('should have a search button', () => {
        const searchButton = container.querySelector('a[id="search-button"]');
        expect(searchButton).not.toBeNull();
        expect(searchButton.textContent).toContain('search');
    });

    test('should list search videos', () => {
        const favoriteList = container.querySelector('#video-list');
        expect(favoriteList).not.toBeNull();
    });

});

describe('MF_FAVORITES Application', () => {
    beforeEach(() => {
        dom = new JSDOM(mf_favorites, { runScripts: 'dangerously' });
        container = dom.window.document.body;
    });

    test('should list favorite videos', () => {
        const favoriteList = container.querySelector('#favorites-list');
        expect(favoriteList).not.toBeNull();
    });

});
