# Guia de Otimização Mobile - LuxClinic

Este documento detalha todas as otimizações implementadas para garantir uma experiência mobile perfeita.

## 📱 Otimizações de Layout

### Header Mobile
- **Altura fixa**: 64px (4rem)
- **Posição**: Fixed top com backdrop blur
- **Conteúdo**: Logo + Toggle de tema + Menu hamburger
- **Z-index**: 50 para ficar sempre visível

### Sidebar Desktop
- **Largura**: 256px (16rem)
- **Posição**: Fixed left
- **Visibilidade**: Oculta em telas < 1024px
- **Conteúdo**: Logo, navegação, perfil do usuário

### Menu Mobile
- **Tipo**: Sheet (slide-out) do lado direito
- **Largura**: 280px
- **Animação**: Suave com overlay
- **Fechamento**: Automático ao navegar

### Content Area
- **Mobile**: Padding top de 64px para compensar header fixo
- **Desktop**: Margin left de 256px para compensar sidebar
- **Padding**: Responsivo (16px mobile, 24px tablet, 32px desktop)

## 🎨 Breakpoints Personalizados

```css
/* Mobile First */
Base: < 640px (sm)
Tablet: 640px - 1024px (md)
Desktop: > 1024px (lg)
Large Desktop: > 1280px (xl)
```

## ✨ Otimizações de Performance

### Touch Interactions
```css
-webkit-tap-highlight-color: transparent;
touch-action: manipulation;
```

### Smooth Scrolling
- Habilitado apenas quando `prefers-reduced-motion: no-preference`
- Desabilitado automaticamente para usuários com preferências de acessibilidade

### Hover States
- Implementados com `@media (hover: hover)`
- Evita problemas de "sticky hover" em dispositivos touch
- Active states para feedback visual em toque

### Safe Areas
- Support para devices com notch (iPhone X+)
- Classes utilitárias: `mobile-safe`, `mobile-safe-top`, `mobile-safe-bottom`
- Uso de `env(safe-area-inset-*)`

## 📐 Sistema de Espaçamento Responsivo

### Paddings
```tsx
// Páginas
p-4 md:p-6 lg:p-8
// 16px mobile, 24px tablet, 32px desktop

// Cards
p-4 md:p-5 lg:p-6
// 16px mobile, 20px tablet, 24px desktop

// Elementos pequenos
p-3 md:p-4
// 12px mobile, 16px tablet
```

### Gaps
```tsx
// Grids principais
gap-4 sm:gap-5 md:gap-6
// 16px mobile, 20px small, 24px medium

// Elementos internos
gap-3 md:gap-4
// 12px mobile, 16px medium
```

## 🔤 Tipografia Responsiva

### Títulos
```tsx
// H1
text-2xl md:text-3xl lg:text-4xl
// 24px mobile, 30px tablet, 36px desktop

// H2
text-xl md:text-2xl
// 20px mobile, 24px tablet

// H3
text-lg md:text-xl
// 18px mobile, 20px tablet
```

### Corpo de Texto
```tsx
// Base
text-sm md:text-base
// 14px mobile, 16px tablet

// Caption
text-xs md:text-sm
// 12px mobile, 14px tablet

// Muito pequeno
text-[10px] md:text-xs
// 10px mobile, 12px tablet
```

## 🎯 Áreas de Toque

### Tamanhos Mínimos
- Botões: 44px x 44px (mínimo recomendado Apple/Android)
- Ícones clicáveis: 40px x 40px
- Links de texto: Padding mínimo de 12px

### Implementação
```tsx
// Botões
className="h-11 md:h-12"
// 44px mobile, 48px desktop

// Ícones
className="h-9 w-9"
// 36px (aceitável para ícones em grupos)
```

## 📊 Grid Responsivo

### Dashboard KPIs
```tsx
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
// 1 coluna mobile
// 2 colunas tablet
// 3 colunas desktop
```

### CRM Cards
```tsx
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
// Layout similar aos KPIs
```

### Subscription Plans
```tsx
grid-cols-1 lg:grid-cols-3
// Stack vertical em mobile/tablet
// 3 colunas em desktop
```

## 🔧 Componentes Específicos

### KPICard
- Padding adaptivo
- Ícones responsivos (20px mobile, 24px desktop)
- Texto truncado com `min-w-0` para overflow
- Flex-wrap para mudanças longas

### Cards de Agenda
- Layout `flex-col` em mobile
- Layout `flex-row` em tablet+
- Timestamps e badges com `whitespace-nowrap`

### Patient Cards (CRM)
- Avatar reduzido em mobile (40px vs 48px)
- Email truncado com `truncate`
- Layout de footer stack em mobile

### Integration Cards
- Flex-wrap para badges
- Ícones proporcionais
- Switch sempre visível

## 🎨 Tema Escuro/Claro

### Implementação
- Context API para gerenciamento de estado
- LocalStorage para persistência
- Classe CSS no elemento `<html>`
- Transições suaves entre temas

### Toggle
- Disponível no header mobile
- Disponível na sidebar desktop
- Ícone muda de Sol/Lua
- Feedback visual imediato

## ✅ Checklist de Teste Mobile

### Visual
- [ ] Todos os textos são legíveis sem zoom
- [ ] Nenhum elemento causa scroll horizontal
- [ ] Espaçamentos consistentes
- [ ] Imagens/ícones com tamanho apropriado

### Interação
- [ ] Todos os botões são facilmente clicáveis
- [ ] Menu hamburger abre/fecha suavemente
- [ ] Links funcionam no primeiro toque
- [ ] Formulários são preenchíveis sem zoom

### Performance
- [ ] Animações suaves (60fps)
- [ ] Sem lag ao abrir menu
- [ ] Scroll fluído
- [ ] Tema muda instantaneamente

### Cross-Browser
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet
- [ ] Firefox Mobile

### Orientação
- [ ] Portrait funciona perfeitamente
- [ ] Landscape se adapta bem
- [ ] Não há elementos cortados

## 🐛 Problemas Comuns e Soluções

### Problema: Scroll horizontal inesperado
**Solução**: `overflow-x: hidden` no body

### Problema: Hover "colado" em mobile
**Solução**: Usar `@media (hover: hover)` para hover states

### Problema: Zoom indesejado em inputs
**Solução**: Font-size mínimo de 16px em inputs

### Problema: Área clicável muito pequena
**Solução**: Padding mínimo de 12px, altura mínima 44px

### Problema: Elementos sobrepostos
**Solução**: Z-index apropriado (header: 50, menu: 40, overlay: 30)

## 📚 Recursos Adicionais

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design Touch Targets](https://material.io/design/usability/accessibility.html#layout-typography)
- [Web.dev Responsive Design](https://web.dev/responsive-web-design-basics/)

---

**Última atualização**: Implementação completa de otimização mobile e tema



