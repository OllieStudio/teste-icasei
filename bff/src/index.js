const express = require('express');
const axios = require('axios');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const port = 3000;
const YOUTUBE_API_KEY = 'YOUTUBE_API_KEY';

let favorites = [];
let lastSearch = "iCasei";

app.use(cors());
app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*'); 
   res.header('Access-Control-Allow-Credentials', true);
   res.header('Access-Control-Allow-Headers', '*');
   res.header('Access-Control-Allow-Methods', '*'); 
  next();
});
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Rota para buscar vídeos no YouTube com base no termo de busca
app.get('/api/search', async (req, res) => {
  let { term } = req.query;
  
  try {
    //se o termo de busca for vazio, utiliza o último termo de busca
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${(term === "''")? lastSearch : term}&key=${YOUTUBE_API_KEY}`
    ); 
    
    lastSearch = term; // Atualiza o último termo de busca
    const videos = response.data.items.map(video => {
      const videoId = video.id.videoId;
      return {
          ...video,
          favorite: favorites.includes(videoId) // Verifica se o vídeo está nos favoritos
      };
  });
    
  res.json(videos);

  } catch (error) {
    res.status(500).send(error.message); 
  }
});

// Rota para adicionar um vídeo aos favoritos via método POST
app.post('/api/favorites', (req, res) => {
  const { video } = req.body;
  favorites.push(video); // Adiciona o vídeo aos favoritos
  broadcast(favorites); // Transmite atualização para clientes WebSocket
  res.status(200).send(favorites); 
});

// Rota para adicionar um vídeo aos favoritos via método GET (compatibilidade)
app.get('/api/addfavorite', async (req, res) => {
  const { video } = req.query;
  favorites.push(video); // Adiciona o vídeo aos favoritos
  broadcast(favorites); // Transmite atualização para clientes WebSocket
  res.status(200).send(favorites); 
});

// Rota para remover um vídeo dos favoritos via método GET
app.get('/api/delfavorite', async (req, res) => {
  const { id } = req.query;
  favorites = favorites.filter(video => JSON.parse(video).id.videoId !== id); // Filtra e remove o vídeo dos favoritos
  broadcast(favorites); // Transmite atualização para clientes WebSocket
  res.status(200).send(favorites); 
});

// Rota para remover um vídeo dos favoritos via método DELETE
app.delete('/api/favorites/:id', (req, res) => {
  const { id } = req.params;
  favorites = favorites.filter(video => video.id.videoId !== id); // Filtra e remove o vídeo dos favoritos
  broadcast(favorites); // Transmite atualização para clientes WebSocket
  res.status(200).send(favorites); 
});

// Rota para obter a lista de favoritos
app.get('/api/favorites', (req, res) => {
  res.json(favorites); 
});

// Evento de conexão WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  ws.on('message', (message) => {
    console.log('Mensagem recebida:', message);
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Função para transmitir dados para todos os clientes WebSocket conectados
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Inicia o servidor na porta especificada
server.listen(port, () => {
  console.log(`Servidor BFF rodando em http://localhost:${port}`);
});
