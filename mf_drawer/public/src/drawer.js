const baseURL = 'http://localhost:3000';

// Evento acionado quando o conteúdo da página HTML foi completamente carregado
window.addEventListener('DOMContentLoaded', async () => {
  const links = document.querySelectorAll('nav ul li a');
  const iframe = document.getElementById('content-frame');

  // Faz uma requisição para obter a lista de favoritos
  const response = await fetch(`${baseURL}/api/favorites`, {
    credentials: "include"
  });

  const favorites = await response.json();
  // Atualiza o contador de favoritos
  await setCounter(favorites);

  // Define as rotas para navegação
  const routes = {
    '/videos': 'http://localhost:9011',
    '/favoritos': 'http://localhost:9012'
  };

  // Função para navegar para a URL especificada
  const navigate = (url) => {
    iframe.src = routes[url] || routes['/videos'];
  };

  // Adiciona um evento de clique para cada link no menu de navegação
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const path = link.getAttribute('href');
      window.history.pushState({}, path, window.location.origin + path);
      navigate(path);
    });
  });

  // Evento acionado quando o usuário navega pelo histórico do navegador
  window.addEventListener('popstate', () => {
    navigate(window.location.pathname);
  });

  // Navega para a rota atual quando a página é carregada
  navigate(window.location.pathname);
});

// Cria uma conexão WebSocket com o servidor
const socket = new WebSocket('ws://localhost:3000');

// Evento acionado quando a conexão com o WebSocket é aberta
socket.addEventListener('open', (event) => {
  console.log('Connected to WebSocket server');
});

// Evento acionado quando uma mensagem é recebida do WebSocket
socket.addEventListener('message', (event) => {
  const updatedData = JSON.parse(event.data);
  setCounter(updatedData);
});

// Evento acionado quando a conexão com o WebSocket é fechada
socket.addEventListener('close', (event) => {
  console.log('WebSocket connection closed');
});

// Evento acionado quando ocorre um erro na conexão WebSocket
socket.addEventListener('error', (event) => {
  console.error('WebSocket error:', event);
});

// Função para atualizar o contador de favoritos na interface do usuário
async function setCounter(favorites) {
  const count = document.getElementById('favoritescount');
  count.textContent = favorites.length;
}
