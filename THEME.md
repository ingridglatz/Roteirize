# Sistema de Temas - Roteirize

## Como usar o tema em seus componentes

### Hook useColors

Use o hook `useColors()` para obter as cores do tema atual:

```tsx
import { useColors } from '../context/ThemeContext';

export default function MeuComponente() {
  const colors = useColors();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Olá!</Text>
    </View>
  );
}
```

### Hook useTheme

Para acessar o tema atual e funções de toggle:

```tsx
import { useTheme } from '../context/ThemeContext';

export default function MeuComponente() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onPress={toggleTheme}>
      Mudar para tema {theme === 'light' ? 'escuro' : 'claro'}
    </Button>
  );
}
```

### Cores disponíveis

**Tema Claro:**
- `primary`: #2CBFAE (verde/teal principal)
- `background`: #FFFFFF (branco)
- `text`: #1E293B (texto escuro)
- `muted`: #64748B (texto secundário)
- `border`: #E5E7EB (bordas)
- `disabled`: #CBD5E1 (desabilitado)
- `error`: #EF4444 (vermelho de erro)
- `success`: #10B981 (verde de sucesso)

**Tema Escuro:**
- `primary`: #2CBFAE (verde/teal principal - mesmo)
- `background`: #0F172A (azul escuro)
- `text`: #F1F5F9 (texto claro)
- `muted`: #94A3B8 (texto secundário claro)
- `border`: #334155 (bordas escuras)
- `disabled`: #475569 (desabilitado escuro)
- `error`: #EF4444 (vermelho de erro - mesmo)
- `success`: #10B981 (verde de sucesso - mesmo)

### Componentes já atualizados

Os seguintes componentes já suportam tema dinâmico:
- ✅ Button
- ✅ Input
- ✅ Perfil (app/(tabs)/perfil.tsx)
- ✅ Settings (app/settings.tsx)

### Como atualizar outros componentes

1. Substitua importações de `colors`:
   ```tsx
   // Antes
   import { colors } from '../theme/colors';

   // Depois
   import { useColors } from '../context/ThemeContext';
   ```

2. Use o hook dentro do componente:
   ```tsx
   export default function MeuComponente() {
     const colors = useColors();
     // ... resto do código
   }
   ```

3. Para estilos dinâmicos, crie dentro do componente:
   ```tsx
   const colors = useColors();

   const dynamicStyles = {
     container: {
       backgroundColor: colors.background,
       borderColor: colors.border,
     }
   };
   ```

## Trocar tema

O usuário pode trocar o tema em:
- **App > Perfil > Menu (☰) > Configurações > Tema escuro**

A preferência é salva automaticamente usando AsyncStorage.
