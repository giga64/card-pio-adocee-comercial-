# 🍰 Cardápio Digital - Adocee Doceria

Um cardápio digital elegante e interativo para a Adocee Doceria, desenvolvido com um design system moderno, cores vibrantes e integração com backend para uma experiência de usuário fluida e agradável.

## ✨ Características

### 🎨 Design Moderno e "Doce"
- **Design System Profissional** com base na identidade visual da doceria.
- **Paleta de Cores:** Combinação harmoniosa de `#08adb4` (azul-petróleo) e `#e4f8f8` (ciano claro).
- **Tipografia Elegante:** Uso de fontes que combinam sofisticação e legibilidade.
- **Layout Responsivo:** Experiência perfeita em celulares, tablets e desktops.

### 🚀 Funcionalidades
- **Cardápio Dinâmico:** Categorias e produtos carregados diretamente de um backend (Supabase).
- **Filtro e Busca em Tempo Real:** Encontre seus doces favoritos facilmente.
- **Design Interativo:** Efeitos de hover e animações suaves que tornam a navegação mais agradável.
- **Estrutura Otimizada:** Seções de categorias e subcategorias para uma organização clara do menu.

## 🏗️ Estrutura do Projeto

CARD-PIO-ADOCE-COMERCIAL/
├── components/         # Componentes React (se aplicável)
├── lib/                # Funções utilitárias
├── styles/             # Estilos globais e variáveis
├── index.html          # Estrutura principal da página
├── style.css           # Folha de estilos principal (Design System)
├── script.js           # Lógica de interatividade e conexão com API
├── tailwind.config.js  # Configurações do Tailwind CSS
├── logo.png            # Logo da Adocee Doceria
└── README.md           # Documentação do projeto


## 🚀 Como Configurar e Usar

Para rodar este projeto localmente e conectá-lo ao seu backend, siga os passos:

### 1. Backend (Supabase)
   - Crie um novo projeto no **Supabase**.
   - No **SQL Editor**, execute o script SQL fornecido para criar as tabelas `categories` e `products`.
   - Adicione as categorias (ex: "Bolos", "Tortas", "Doces Finos") e os produtos nas respectivas tabelas.
   - Em **Project Settings > API**, copie a `URL` e a chave `anon public`.

### 2. Frontend
   - Abra o arquivo `script.js`.
   - Substitua os placeholders `SUPABASE_URL` e `SUPABASE_ANON_KEY` pelas chaves que você copiou do Supabase:
     ```javascript
     const SUPABASE_URL = 'SUA_URL_AQUI';
     const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANON_PUBLIC_AQUI';
     ```
   - Abra o arquivo `index.html` em um navegador de sua preferência.

## 🎨 Design System

### Cores
- **Primária**: `#08adb4` (Azul-petróleo Adocee)
- **Fundo**: `#e4f8f8` (Ciano Suave)
- **Texto**: `#1a1a1a` (Grafite Escuro)
- **Cartões**: `#ffffff` (Branco)

### Tipografia
- **Títulos**: Playfair Display (serifada, elegante)
- **Corpo**: Roboto (sans-serif, legível)

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e moderna.
- **CSS3**: Estilização avançada com CSS Variables para um Design System flexível.
- **JavaScript (ES6+)**: Interatividade, manipulação do DOM e comunicação com a API.
- **Supabase**: Backend-as-a-Service (BaaS) para o banco de dados PostgreSQL e APIs automáticas.
- **Google Fonts**: Para o gerenciamento da tipografia.

---

**Desenvolvido com ❤️ para a Adocee Doceria**