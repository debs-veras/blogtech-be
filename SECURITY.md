# Melhorias de Segurança e Controle de Acesso

## 🔐 Melhorias Implementadas

### 1. **Sistema de Permissões Granulares**

- Substituído sistema básico de roles por permissões específicas
- Cada ação tem uma permissão definida (ex: `post:update:own` vs `post:update:any`)
- ADMIN tem todas as permissões
- AUTHOR pode gerenciar seus próprios posts
- READER tem acesso apenas de leitura

**Arquivo:** `src/middleware/permissions.middleware.ts`

```typescript
// Exemplo de uso
permissionMiddleware([Permission.POST_UPDATE_OWN]);
```

### 2. **Verificação de Propriedade (Ownership)**

- Garante que usuários só podem modificar seus próprios recursos
- ADMINs podem modificar qualquer recurso
- Previne que autores modifiquem posts de outros autores

**Arquivo:** `src/middleware/ownership.middleware.ts`

```typescript
// Exemplo de uso
ownershipMiddleware("post"); // Verifica se o post pertence ao usuário
```

### 3. **Auditoria de Acessos**

- Registra todas as tentativas de acesso (autorizadas e negadas)
- Logs incluem: timestamp, usuário, IP, ação, resultado
- Útil para compliance e investigação de incidentes

**Arquivo:** `src/middleware/audit.middleware.ts`

```typescript
// Exemplo de uso
auditMiddleware("post:create");
```

### 4. **Rate Limiting**

- Previne ataques de força bruta e abuso de API
- Configurável por rota
- Limites padrão: 100 requisições por 15 minutos
- Rotas sensíveis têm limites mais rigorosos

**Arquivo:** `src/middleware/rate-limit.middleware.ts`

```typescript
// Exemplo de uso
rateLimitMiddleware(20, 60 * 60 * 1000); // 20 requisições por hora
```

### 5. **Refresh Tokens**

- Access tokens expiram em 15 minutos
- Refresh tokens expiram em 7 dias
- Melhor segurança sem comprometer UX

**Arquivo:** `src/middleware/refresh-token.middleware.ts`

## 📋 Regras de Acesso por Role

### ADMIN

- ✅ Todas as permissões
- ✅ Gerenciar qualquer usuário
- ✅ Gerenciar qualquer post
- ✅ Criar/deletar usuários

### AUTHOR

- ✅ Criar posts
- ✅ Editar/deletar próprios posts
- ✅ Publicar próprios posts
- ✅ Ver próprio perfil
- ✅ Editar próprio perfil
- ❌ Editar posts de outros
- ❌ Gerenciar usuários

### READER

- ✅ Ler posts
- ✅ Ver próprio perfil
- ❌ Criar/editar posts
- ❌ Gerenciar usuários

## 🛡️ Próximas Melhorias Recomendadas

### Curto Prazo

1. **Implementar Redis para Rate Limiting**
   - Atualmente usa memória local (não funciona em cluster)
   - Considere usar `express-rate-limit` com Redis

2. **Adicionar Blacklist de Tokens**
   - Armazenar tokens revogados no Redis
   - Implementar logout que invalida tokens

3. **Logs Estruturados**
   - Substituir `console.log` por Winston ou Pino
   - Enviar logs para serviço centralizado (CloudWatch, DataDog)

### Médio Prazo

4. **2FA (Autenticação de Dois Fatores)**
   - TOTP (Google Authenticator)
   - SMS ou email como fallback

5. **RBAC Dinâmico**
   - Armazenar permissões no banco de dados
   - Permitir criação de roles customizadas

6. **IP Whitelist/Blacklist**
   - Bloquear IPs maliciosos
   - Permitir apenas IPs específicos para rotas sensíveis

### Longo Prazo

7. **OAuth 2.0 / OpenID Connect**
   - Login social (Google, GitHub)
   - SSO para empresas

8. **CORS Configurado**
   - Restringir origens permitidas
   - Configurar cabeçalhos de segurança

9. **Content Security Policy**
   - Prevenir XSS
   - Validação de inputs

## 🔧 Exemplo de Uso Completo

```typescript
// Rota protegida com todos os middlewares
router.put(
  "/posts/:id",
  authMiddleware, // 1. Verifica autenticação
  rateLimitMiddleware(10, 60000), // 2. Rate limit: 10/min
  permissionMiddleware([Permission.POST_UPDATE_OWN]), // 3. Verifica permissão
  ownershipMiddleware("post"), // 4. Verifica propriedade
  auditMiddleware("post:update"), // 5. Registra acesso
  PostController.update, // 6. Executa ação
);
```

## 📊 Monitoramento

### Logs de Auditoria

Os logs são escritos no formato JSON:

```json
{
  "timestamp": "2026-01-22T10:30:00.000Z",
  "action": "post:update",
  "userId": "uuid",
  "ip": "192.168.1.1",
  "method": "PUT",
  "path": "/api/posts/123",
  "statusCode": 200,
  "success": true
}
```

### Métricas Importantes

- Taxa de tentativas de acesso negadas
- Usuários bloqueados por rate limiting
- Tempo médio de resposta por endpoint
- Distribuição de acessos por role

## 🚨 Tratamento de Incidentes

1. **Acesso Não Autorizado Detectado**
   - Verificar logs de auditoria
   - Identificar padrão de ataque
   - Bloquear IP se necessário
   - Revogar tokens comprometidos

2. **Rate Limit Excedido**
   - Verificar se é ataque ou uso legítimo
   - Ajustar limites se necessário
   - Contatar usuário se for legítimo

3. **Token Comprometido**
   - Adicionar à blacklist
   - Forçar logout do usuário
   - Notificar usuário
   - Investigar origem do vazamento
