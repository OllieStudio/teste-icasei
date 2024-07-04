const baseURL = 'http://localhost:3000';

document.getElementById('search-button').addEventListener('click', async () => {
    await loadVideos();

  });

document.getElementById('search-term').addEventListener('keyup', async (event) => {
  if (event.key === 'Enter') {
    await loadVideos();
  }
});

async function loadVideos() {
  const searchTerm = document.getElementById('search-term').value;
  const response = await fetch(`${baseURL}/api/search?term=${searchTerm}`, {
    credentials: "include"
  }
  );
  const data = await response.json();
  const videoList = document.getElementById('video-list');
  videoList.innerHTML = '';

  data.forEach(video => {
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
          <a class="favorite-button ${video.favorite ? 'delFavorite' : 'addFavorite'}" data-video='${JSON.stringify(video)}'>
              <i class="material-symbols-outlined" >favorite</i>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4B77D1"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/></svg>
          </a>
          </div>
        </div>
      </div>
      `;
    videoList.appendChild(videoDiv);
  });

  document.querySelectorAll('.favorite-button').forEach(button => {
    button.addEventListener('click', async () => {
      if (button.classList.contains('addFavorite')) {
        button.classList.remove('addFavorite');
        button.classList.add('delFavorite');
        await addFavorite(button);
      }else{
        if (button.classList.contains('delFavorite')) {
          await delFavorite(button);
        }
      }
    });
  });
}

async function addFavorite(button) {
  const video = button.getAttribute('data-video');
  const data = video.replace(/[#']/g, "");

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
    const response = await fetch(`${baseURL}/api/addfavorite?video=${data}`, {
      credentials: "include"
    });
  }
}

async function delFavorite(button) {
  button.classList.remove('delFavorite');
  button.classList.add('addFavorite');
  const video = JSON.parse(button.getAttribute('data-video'));
  await fetch(`${baseURL}/api/favorites/${video.id.videoId}`, {
    credentials: "include",
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
  