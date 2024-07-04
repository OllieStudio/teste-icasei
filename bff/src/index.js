const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;
const YOUTUBE_API_KEY = 'AIzaSyAHFGsH1frNK5D17SPiE9yrgUfAHQABUUM';

let favorites = [];

app.use(cors());
app.use(express.json());

app.get('/api/search', async (req, res) => {
  const { term } = req.query;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${term}&key=${YOUTUBE_API_KEY}`
    ); 
    
    const videos = response.data.items.map(video => {
      const videoId = video.id.videoId;
      return {
          ...video,
          favorite: favorites.includes(videoId)
      };
  });
    
  res.json(videos);

  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/favorites', (req, res) => {
  const { video } = req.body;
  favorites.push(video);
  res.status(200).send(favorites);
});

app.delete('/api/favorites/:id', (req, res) => {
  const { id } = req.params;
  favorites = favorites.filter(video => video.id.videoId !== id);
  res.status(200).send(favorites);
});

app.get('/api/favorites', (req, res) => {
  res.json(favorites);
});

app.listen(port, () => {
  console.log(`BFF server running at http://localhost:${port}`);
});
