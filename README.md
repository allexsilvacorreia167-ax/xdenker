# XDENKER — Plataforma de Pesquisa Eleitoral

Projeto completo (front + back) para pesquisa eleitoral 2026, com painel administrativo, questionário em 3 etapas, gráficos dinâmicos e integração com fontes oficiais do TSE.

## Como rodar (local)

### 1. Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
API: http://localhost:3001

### 2. Frontend (outro terminal)
```bash
cd client
npm install
npm run dev
```
App: http://localhost:5173

O Vite faz proxy de `/api` → `http://localhost:3001`.

## Rotas

### Usuário
| Rota | Descrição |
|------|-----------|
| `/` | Home + intenção de voto + iniciar questionário |
| `/pesquisas` | Dashboard de resultados |
| `/questionario` | 3 etapas (competência, percepção, escolha) |
| `/metodologia` | Metodologia |
| `/blog` | Blog |
| `/contato` | Contato |

### Admin
| Rota | Descrição |
|------|-----------|
| `/html/adm` | Dashboard |
| `/html/adm/candidatos` | Candidatos (Presidente/Governador) + importar TSE |
| `/html/adm/perguntas` | Perguntas de competência institucional |
| `/html/adm/espectro` | Espectro ideológico de todos os partidos |
| `/html/adm/usuarios` | Usuários (estrutura) |

### API útil
| Endpoint | Descrição |
|----------|-----------|
| `GET /api/` | Dados da home (gráficos vivos) |
| `GET /api/pesquisas` | Resultados agregados |
| `POST /api/auth/request-token` | Solicita token |
| `POST /api/auth/verify-token` | Login |
| `POST /api/research/start` | Inicia questionário |
| `POST /api/research/calculate` | Finaliza + coerência + atualiza gráficos |
| `GET /api/tse/candidatos` | Candidatos TSE |
| `GET /api/tse/buscar` | Autocomplete legislativo TSE |

## O que já está pronto

- Layouts separados: usuário mobile, usuário desktop, admin desktop
- Login Nome + E-mail + Token
- Questionário completo (3 etapas) com resultado de coerência
- Gráficos atualizados em tempo real após cada voto
- ADM controla candidatos, perguntas e espectro (reflete no usuário)
- Integração TSE (resultados.tse.jus.br + fallback)
- Autocomplete de deputados/senadores no questionário

## Dados em memória

No estado atual, votos e configurações do ADM ficam **em memória** (reiniciar o server zera votos novos).  
Persistência em PostgreSQL/Supabase fica para alteração manual futura.

## Assets

Substitua os placeholders em `client/public/`:
- `logo.png`
- `banner.png`

## Stack

- Front: React 18 + Vite + Tailwind + React Router + Lucide
- Back: Node.js + Express
- TSE: resultados.tse.jus.br (JSON oficial)

---

**XDENKER** — Sua Opinião Importa | Eleições 2026
