# BIP Teste Integrado — Gestão de Benefícios

Solução fullstack completa em camadas para gestão de benefícios, com CRUD e transferência de valores entre benefícios.

## 📐 Arquitetura

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐     ┌────────────┐
│  Frontend   │────▶│  Backend (REST)  │────▶│  EJB Module  │────▶│ PostgreSQL │
│  Angular 21 │     │  Spring Boot 3.2 │     │  Jakarta EE  │     │    16      │
└─────────────┘     └──────────────────┘     └──────────────┘     └────────────┘
    :4200               :8085                   (embutido)          :5432
```

| Camada | Tecnologia | Descrição |
|--------|-----------|-----------|
| **Database** | PostgreSQL 16 | Banco de dados relacional com schema e dados iniciais |
| **EJB Module** | Jakarta Persistence | Lógica de negócio de transferência com locking pessimista |
| **Backend** | Spring Boot 3.2 + JPA | API REST com CRUD, validações e integração com EJB |
| **Frontend** | Angular 21 | Interface de usuário SPA |

## 🚀 Como Executar

### Pré-requisitos

- **Java 17+**
- **Maven 3.8+**
- **Node.js 18+** e **npm**
- **Docker** e **Docker Compose**
- **Angular CLI** (`npm install -g @angular/cli`)

### 1. Banco de Dados

```bash
docker compose up -d db

psql -h localhost -U admin -d backend_db -f backend-module/src/main/resources/db/schema.sql
psql -h localhost -U admin -d backend_db -f backend-module/src/main/resources/db/seed.sql
```

Para subir **PostgreSQL + backend** via Docker (backend exposto em `http://localhost:8085`):

```bash
cp .env.example .env
docker compose up -d
```

> Observação: o backend está configurado para **rodar por padrão com H2 (arquivo local)**,
> então você consegue subir a aplicação mesmo sem Postgres.
> Se você quiser usar o Postgres do `docker compose`, defina as variáveis de ambiente antes de rodar o backend:
>
> - `SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/backend_db`
> - `SPRING_DATASOURCE_USERNAME=admin`
> - `POSTGRES_PASSWORD=<defina-no-ambiente>`
> - `SPRING_DATASOURCE_DRIVER=org.postgresql.Driver` (opcional)

> Para um desafio ou ambiente local, `ddl-auto=update` é um atalho conveniente para manter o schema atualizado automaticamente.
> Em produção, prefira migrations versionadas e uma estratégia de DDL controlada, como `validate`.
> Além disso, o backend agora executa `backend-module/src/main/resources/db/schema.sql` e `backend-module/src/main/resources/db/seed.sql` automaticamente no startup.
> **Importante:** no Docker, scripts em `/docker-entrypoint-initdb.d` só rodam na **primeira** inicialização do volume.
> Se o volume já existe, os scripts de inicialização não são executados novamente.
> Não use `docker compose down -v` para trocar a senha, pois isso apaga os dados.

### 2. Backend (Spring Boot)

```bash
mvn clean package

cd backend-module
mvn spring-boot:run
```

O backend estará disponível em: `http://localhost:8085`

> A mesma porta `8085` é usada localmente e no Docker Compose.

### 3. Frontend (Angular)

```bash
cd frontend

npm install

ng build shared

ng serve
```

O frontend estará disponível em: `http://localhost:4200`

Para o micro-frontend de benefícios:

```bash
ng serve mfe-beneficios --port 4201
```

## 📚 Documentação da API (Swagger)

Com o backend em execução, acesse:

| Recurso | URL |
|---------|-----|
| **Swagger UI** | [http://localhost:8085/swagger-ui.html](http://localhost:8085/swagger-ui.html) |
| **OpenAPI JSON** | [http://localhost:8085/v3/api-docs](http://localhost:8085/v3/api-docs) |

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/v1/beneficios` | Listar todos os benefícios ativos |
| `GET` | `/api/v1/beneficios/{id}` | Buscar benefício por ID |
| `POST` | `/api/v1/beneficios` | Criar novo benefício |
| `PUT` | `/api/v1/beneficios/{id}` | Atualizar benefício existente |
| `DELETE` | `/api/v1/beneficios/{id}` | Deletar (soft delete) benefício |
| `POST` | `/api/v1/beneficios/transferir` | Transferir valor entre benefícios |

### Exemplos de Requisição

**Criar benefício:**
```json
POST /api/v1/beneficios
{
  "nome": "Vale Alimentação",
  "descricao": "Benefício de vale alimentação mensal",
  "valor": 1500.00,
  "ativo": true
}
```

**Transferir valor:**
```json
POST /api/v1/beneficios/transferir
{
  "fromId": 1,
  "toId": 2,
  "valor": 250.00
}
```

## 🐞 Correção do Bug EJB

O `BeneficioEjbService` original possuía as seguintes vulnerabilidades:

1. **Sem verificação de saldo** — permitia transferências com saldo insuficiente
2. **Sem locking** — possível race condition em acessos concorrentes
3. **Sem rollback** — inconsistência de dados em caso de falha

### Correções aplicadas:

- ✅ Validação de valor informado e positivo (`amount != null` e `amount > 0`)
- ✅ Validação de IDs informados e diferentes
- ✅ Lock pessimista (`LockModeType.PESSIMISTIC_WRITE`) para evitar race conditions
- ✅ Verificação de saldo antes da transferência
- ✅ Rollback automático via `@Transactional` no serviço Spring que integra o EJB
- ✅ Validação de existência dos benefícios origem e destino
- ✅ Ordenação dos locks por ID para evitar deadlocks em transferências concorrentes e opostas
- ✅ Atualização das entidades gerenciadas por dirty checking, sem `merge()` desnecessário

No backend Spring Boot, o serviço integra o `BeneficioEjbService` dentro de uma transação
`@Transactional`, garantindo rollback automático quando uma validação ou operação falha.

## 🧪 Testes

### Backend

```bash
cd backend-module
mvn test
```

Os testes incluem:
- Testes unitários do controller (`BeneficioControllerTest`)
- Testes de integração usando H2 em memória
- Validação de cenários de erro (saldo insuficiente, IDs inválidos, etc.)

### Frontend

```bash
cd frontend
ng test
ng test mfe-beneficios
```

## 🗂️ Estrutura do Projeto

```
bip-teste-integrado/
├── backend-module/src/main/resources/db/  # Scripts SQL
│   ├── schema.sql              # Criação da tabela BENEFICIO
│   └── seed.sql                 # Dados iniciais
├── ejb-module/                  # Módulo EJB (lógica de transferência)
│   └── src/main/java/.../BeneficioEjbService.java
├── backend-module/              # Backend Spring Boot
│   ├── src/main/java/.../
│   │   ├── config/              # Swagger, CORS
│   │   ├── controller/          # REST controllers
│   │   ├── dto/                 # DTOs com validação
│   │   ├── model/               # Entidades JPA
│   │   ├── repository/          # Repositórios Spring Data
│   │   └── service/             # Lógica de negócio
│   └── src/test/                # Testes
├── frontend/                    # Frontend Angular
│   ├── src/app/                 # App shell principal
│   └── projects/
│       ├── mfe-beneficios/      # Micro-frontend de benefícios
│       └── shared/              # Biblioteca compartilhada
├── docs/                        # Documentação do desafio
├── docker-compose.yml           # PostgreSQL e backend via Docker Compose
└── README.md                    # Este arquivo
```

## ⚙️ Configuração

### Variáveis de Ambiente / Propriedades

| Propriedade | Valor Padrão | Descrição |
|-------------|-------------|-----------|
| `server.port` | `8085` | Porta única do backend, local e Docker |
| `spring.datasource.url` | `jdbc:postgresql://localhost:5432/backend_db` | URL do banco (configurável via `SPRING_DATASOURCE_URL`) |
| `spring.datasource.username` | `admin` | Usuário do banco (configurável via `SPRING_DATASOURCE_USERNAME`) |
| `spring.datasource.password` | Variável de ambiente | Senha do banco via `POSTGRES_PASSWORD`; não manter credenciais no README |
| `spring.jpa.hibernate.ddl-auto` | `update` | Atalho para desafio/desenvolvimento; em produção, usar migrations e DDL controlado |

### Docker Compose

O `docker-compose.yml` sobe o PostgreSQL e o backend:

```bash
docker compose up -d     # Iniciar
docker compose down       # Parar
docker compose down -v    # Parar e remover volumes
```

Para trocar a senha sem apagar o volume `postgres_data`, altere a senha do
usuário existente, atualize `POSTGRES_PASSWORD` no `.env` com o mesmo valor e
recrie apenas o backend:

```bash
docker compose exec -it db psql -U admin -d backend_db -c '\password admin'
# Atualize POSTGRES_PASSWORD no .env com o mesmo valor informado no prompt.
docker compose up -d --no-deps --force-recreate backend
```

Alterar somente o `.env` não altera a senha de um banco já inicializado:
`POSTGRES_PASSWORD` da imagem oficial é aplicado apenas na primeira criação do
volume. Use `docker compose down -v` somente para uma recriação intencional do
banco, pois esse comando remove os dados persistidos.
