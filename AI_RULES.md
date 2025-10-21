# Regras de Desenvolvimento para Clínica AI

Este documento descreve a stack tecnológica e as diretrizes para o desenvolvimento de novas funcionalidades e manutenção do aplicativo Clínica AI.

## Stack Tecnológica

*   **Frontend Framework**: React (versão 19.2.0) para a construção da interface do usuário.
*   **Linguagem**: TypeScript (versão 5.8.2) para tipagem estática e melhor manutenibilidade do código.
*   **Build Tool**: Vite (versão 6.2.0) para um ambiente de desenvolvimento rápido e otimização de build.
*   **Estilização**: Tailwind CSS para um desenvolvimento de UI rápido e responsivo, utilizando classes utilitárias.
*   **Integração AI**: Google Gemini API através do pacote `@google/genai` para funcionalidades de agendamento inteligente e conversacional.
*   **Gerenciamento de Estado**: `useState` e `useEffect` do React para o gerenciamento de estado local e efeitos colaterais.
*   **Roteamento**: Atualmente, o roteamento é feito por renderização condicional. Para futuras expansões, o React Router é o padrão preferencial.
*   **Componentes UI**: Shadcn/ui e Radix UI estão disponíveis para componentes de UI pré-construídos e acessíveis, embora não estejam em uso atualmente.
*   **Ícones**: O pacote `lucide-react` está disponível para ícones, mas atualmente são utilizados ícones SVG personalizados.

## Regras de Uso de Bibliotecas e Ferramentas

*   **Componentes de UI**:
    *   Priorize o uso de componentes Shadcn/ui para elementos de UI comuns (botões, inputs, modais, etc.).
    *   Para componentes que não existem no Shadcn/ui ou que exigem personalização profunda, crie componentes React personalizados utilizando Tailwind CSS para estilização.
*   **Estilização**:
    *   **Obrigatório**: Utilize exclusivamente Tailwind CSS para toda a estilização. Evite CSS inline ou arquivos CSS/SCSS personalizados, a menos que seja estritamente necessário para overrides globais (como `index.css`).
    *   Garanta que os designs sejam responsivos, utilizando as classes responsivas do Tailwind.
*   **Ícones**:
    *   Utilize ícones do pacote `lucide-react` sempre que possível.
    *   Se um ícone específico não estiver disponível no `lucide-react`, crie um componente SVG personalizado em `components/Icons.tsx`.
*   **Gerenciamento de Estado**:
    *   Para estado local de componentes, use `useState`.
    *   Para estado compartilhado entre componentes, considere `useContext` ou, se a complexidade aumentar, uma solução de gerenciamento de estado mais robusta (a ser discutida).
*   **Roteamento**:
    *   Para navegação entre diferentes "páginas" ou "vistas" do aplicativo, utilize o React Router. As rotas devem ser mantidas em `src/App.tsx`.
*   **Interação com AI**:
    *   Todas as interações com a API Gemini devem ser realizadas através do serviço `services/geminiService.ts` e o pacote `@google/genai`.
*   **Estrutura de Arquivos**:
    *   Componentes devem ser colocados em `src/components/`.
    *   Páginas (vistas principais) devem ser colocadas em `src/pages/`.
    *   Utilitários devem ser colocados em `src/utils/`.
    *   Serviços de API devem ser colocados em `src/services/`.
    *   Tipos TypeScript devem ser definidos em `types.ts` ou em arquivos `.d.ts` específicos, se necessário.
*   **Boas Práticas**:
    *   Mantenha os componentes pequenos e focados em uma única responsabilidade.
    *   Escreva código limpo, legível e bem comentado.
    *   Sempre use TypeScript para garantir a segurança de tipo.
    *   Evite mutações diretas de estado; use as funções de atualização de estado do React.