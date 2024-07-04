const baseURL = 'http://localhost:3000';

// Evento acionado quando o conteúdo da página HTML é completamente carregado
document.addEventListener('DOMContentLoaded', async () => {
  // Faz uma requisição para obter a lista de favoritos do servidor
  const response = await fetch(`${baseURL}/api/favorites`, {
    credentials: "include"
  });
  const favorites = await response.json();
  const favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = '';

  // Itera sobre cada favorito retornado pela API
  favorites.forEach(data => {
    const video = JSON.parse(data);
    video.favorite = true;

    const videoDiv = document.createElement('div');
    videoDiv.innerHTML = `
      <div class="video-item">
        <div class="video-thumbnail">
          <img src="${video.snippet.thumbnails.default.url}" alt="${video.snippet.title}">
          <button class="play-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </div>
        <div class="video-info">
          <h3 class="video-title">${video.snippet.title}</h3>
          <p class="video-description">${video.snippet.description}</p>
          <div class="video-actions">
            <a class="favorite-button ${video.favorite ? 'delFavorite' : 'addFavorite' }" data-video='${JSON.stringify(video)}'>
              <i class="material-symbols-outlined">favorite</i>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4B77D1"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/></svg>
            </a>
          </div>
        </div>
      </div>
    `;
    favoritesList.appendChild(videoDiv);
  });

  // Adiciona um evento de clique para cada botão de favorito na lista
  document.querySelectorAll('.favorite-button').forEach(button => {
    button.addEventListener('click', async () => {
      if (button.classList.contains('addFavorite')) {
        // Remove a classe 'addFavorite' e adiciona 'delFavorite' para indicar que o vídeo está sendo adicionado aos favoritos
        button.classList.remove('addFavorite');
        button.classList.add('delFavorite');
        await addFavorite(button); 
      } else {
        // Se o botão contém a classe 'delFavorite', chama a função para remover o vídeo dos favoritos
        if (button.classList.contains('delFavorite')) {
          await delFavorite(button);
        }
      }
    });
  });
});

// Função assíncrona para adicionar um vídeo aos favoritos
async function addFavorite(button) {
  const video = button.getAttribute('data-video'); // Obtém os dados do vídeo do atributo 'data-video'
  const data = video.replace(/[#']/g, ""); // Remove caracteres especiais do JSON

  try {
    await fetch(`${baseURL}/api/favorites`, {
      credentials: "include",
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data 
    });
  } catch (error) {
    // Se ocorrer um erro, faz outra tentativa de adicionar o vídeo aos favoritos
    const response = await fetch(`${baseURL}/api/addfavorite?video=${data}`, {
      credentials: "include"
    });
  }
}

// Função assíncrona para remover um vídeo dos favoritos
async function delFavorite(button) {
  button.classList.remove('delFavorite');
  button.classList.add('addFavorite');
  const video = JSON.parse(button.getAttribute('data-video'));

  try {
    // Faz uma requisição DELETE para remover o vídeo dos favoritos
    await fetch(`${baseURL}/api/favorites/${video.id.videoId}`, {
      credentials: "include",
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // Se ocorrer um erro, faz outra tentativa de remover o vídeo dos favoritos
    const response = await fetch(`${baseURL}/api/delfavorite?id=${video.id.videoId}`, {
      credentials: "include"
    });
  }
}
