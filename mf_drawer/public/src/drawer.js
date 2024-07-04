const baseURL = 'http://localhost:3000';

window.addEventListener('DOMContentLoaded', async () => {
  const links = document.querySelectorAll('nav ul li a');
  const iframe = document.getElementById('content-frame');

  const response = await fetch(`${baseURL}/api/favorites`,{
    credentials:"include"
  });

  const favorites = await response.json();  
  const count = document.getElementById('favoritescount');
  count.textContent = favorites.length;

  const routes = {
    '/videos': 'http://localhost:9011',
    '/favoritos': 'http://localhost:9012'
  };

  const navigate = (url) => {
    iframe.src = routes[url] || routes['/videos'];
  };

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.getAttribute('href');
      window.history.pushState({}, path, window.location.origin + path);
      navigate(path);
    });
  });

  window.addEventListener('popstate', () => {
    navigate(window.location.pathname);
  });

  navigate(window.location.pathname);
});
