# Micro-Frontend Application

## Estrutura do Projeto

- `mf_drawer`: Micro-frontend responsável pela navegação
- `mf_videos`: Micro-frontend responsável pela busca e listagem de vídeos
- `mf_favorites`: Micro-frontend responsável pela listagem de vídeos favoritos
- `bff`: Backend for Frontend que conecta com a API do YouTube e gerencia favoritos

## Requisitos

- Docker
- Docker Compose

## Como Rodar o Projeto

### Passo 1: Clone o repositório

git clone <url-do-repositorio>
cd project-root

### Passo 2: Configure a chave da API do YouTube
Edite o arquivo <bff/src/index.js> e substitua 'YOUTUBE_API_KEY' pela sua chave da API do YouTube.

const YOUTUBE_API_KEY = 'YOUTUBE_KEY';

### Passo 3: Execute os serviços com Docker Compose
docker-compose up --build

### Passo 4: Acesse a aplicação
Abra o navegador e vá para http://localhost:9010.

