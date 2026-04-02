# Conversor de Moedas

Aplicação full stack para conversão de moedas em tempo real usando a ExchangeRate API. O projeto foi desenvolvido como desafio da formação da Turma 6 da [Oracle Next Education](https://www.oracle.com/br/education/oracle-next-education/) em parceria com a [Alura](https://www.alura.com.br/).

## Visão geral do projeto

Este repositório possui duas aplicações:

- API (`/api`): backend em Java 21 com Spring Boot.
- Front-end (`/front-end`): interface em React + TypeScript + Vite.

Fluxo da aplicação:

1. O front-end consulta a API para listar moedas disponíveis.
2. O usuário escolhe moeda de origem/destino e solicita a conversão.
3. A API consulta a ExchangeRate API e retorna a taxa para o front-end.

## Stack utilizada

- Java 21 + Spring Boot (API)
- Gradle (build e testes do backend)
- React 18 + TypeScript + Vite (front-end)
- Docker e Docker Compose (execução em contêineres)

## Estrutura de pastas

```text
.
|- api/         # API Spring Boot
|- front-end/   # Aplicação React
|- docker-compose.yml
|- README.md
```

## Pre-requisitos

Para execução local (sem Docker):

- JDK 21
- Node.js 20+ e npm

Para execução com contêineres:

- Docker
- Docker Compose

## Configuração de ambiente

### 1) Chave da ExchangeRate API (backend)

Crie uma conta e gere uma chave em [ExchangeRate API](https://app.exchangerate-api.com/).

No backend, configure o arquivo `api/src/main/resources/application.properties` com:

```properties
api.key=SUA_CHAVE_DA_API
```

Se preferir, copie o exemplo:

```bash
cp api/src/main/resources/application.example.properties api/src/main/resources/application.properties
```

### 2) URL da API no front-end

No front-end, configure o arquivo `front-end/.env` com:

```env
VITE_API_URL=http://localhost:8080
```

Se preferir, copie o exemplo:

```bash
cp front-end/.env.example front-end/.env
```

## Como executar localmente

### 1) Subir a API

```bash
cd api
./gradlew bootRun
```

API disponível em `http://localhost:8080`.

Endpoints principais:

- `GET /health`
- `GET /currencies`
- `POST /convert`

### 2) Subir o front-end

Em outro terminal:

```bash
cd front-end
npm install
npm run dev
```

Aplicação disponível em `http://localhost:5173`.

## Como executar com Docker Compose

Na raiz do projeto:

```bash
docker compose up --build
```

Serviços:

- Front-end: `http://localhost:5173`
- API: `http://localhost:8080`

Para encerrar:

```bash
docker compose down
```

## Testes

### Backend

```bash
cd api
./gradlew test
```

### Front-end (unitários)

```bash
cd front-end
npm test
```

## Solução de problemas

- Erro de CORS/conexão no front-end:
  verifique se a API está ativa em `http://localhost:8080` e se `VITE_API_URL` aponta para essa URL.
- Erro de autenticação na API externa:
  valide a chave em `api.key` no arquivo `application.properties`.
- Porta em uso:
  altere a porta da aplicação em execução ou finalize o processo que está usando `5173` ou `8080`.

## Screenshot

https://github.com/user-attachments/assets/265d774f-41c1-4d79-93e7-77f6f5ab52ea

<a href="https://www.flaticon.com/free-icons/exchange-rate" title="exchange rate icons">Exchange rate icons created by Freepik - Flaticon</a>

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE).
