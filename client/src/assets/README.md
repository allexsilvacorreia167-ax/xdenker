# Assets do XDENKER

Coloque aqui as duas imagens oficiais do projeto:

## Arquivos obrigatórios

| Arquivo        | Uso                                      | Recomendação          |
|----------------|------------------------------------------|-----------------------|
| `logo.png`     | Logo no header (todas as páginas)        | PNG transparente, ~200x60px |
| `banner.png`   | Banner principal da Home                 | PNG, ~1200x400px      |

## Como usar no código

```jsx
// Logo
import logo from '../assets/logo.png';
<img src={logo} alt="XDENKER" className="h-8" />

// Banner (ou via public/)
<img src="/banner.png" alt="Sua Opinião Importa" />
```

> Também pode colocar os arquivos em `client/public/` para acessar diretamente por `/logo.png` e `/banner.png`.
