# Sistema de Gestão de Membros

Uma aplicação completa para gestão de membros, centros, pagamentos e relatórios, desenvolvida com React (Next.js) no frontend e C# .NET Core Web API no backend, utilizando SQL Server como base de dados.

## 🚀 Funcionalidades

### 👥 Gestão de Membros
- Cadastro completo de membros com dados pessoais e contacto de emergência
- Controlo de status (Activo/Inactivo)
- Histórico de pagamentos e extratos individuais
- Filtros avançados por centro, status e período

### 🏢 Gestão de Centros
- CRUD completo de centros
- Controlo de responsáveis e valores de mensalidade
- Estatísticas de membros por centro
- Gestão de utilizadores por centro

### 💰 Sistema de Pagamentos
- Registo de pagamentos com diferentes métodos (PIX, Cartão, Dinheiro, Transferência)
- Controlo de mensalidades e inadimplência
- Geração automática de mensalidades
- Extratos de conta corrente por membro

### 📊 Relatórios e Estatísticas
- Relatórios de membros por centro
- Relatórios financeiros detalhados
- Estatísticas do dashboard em tempo real
- Exportação em PDF e Excel

### 📱 Notificações
- Envio de SMS e e-mails para membros
- Templates personalizáveis
- Histórico de notificações enviadas
- Notificações em massa por centro

### 🔐 Sistema de Autenticação
- Login seguro com JWT
- Controlo de acesso por roles (Admin, Gerente, Utilizador)
- Gestão de sessões e refresh tokens

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes UI
- **React Hook Form** - Gestão de formulários

### Backend
- **C# .NET 8** - Web API
- **Entity Framework Core** - ORM
- **SQL Server** - Base de dados
- **JWT** - Autenticação
- **Swagger** - Documentação da API

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de serviços

## 📋 Pré-requisitos

- **Node.js** 18+ 
- **.NET 8 SDK**
- **SQL Server** (ou Docker)
- **Docker** e **Docker Compose** (opcional, para deployment)

## 🚀 Instalação e Configuração

### Opção 1: Deployment com Docker (Recomendado)

1. **Clone o repositório:**
   \`\`\`bash
   git clone <url-do-repositorio>
   cd member-management-app
   \`\`\`

2. **Execute o script de deployment:**
   \`\`\`bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   \`\`\`

3. **Acesse a aplicação:**
   - Frontend: http://localhost:3000
   - API: http://localhost:5000
   - Swagger: http://localhost:5000

### Opção 2: Desenvolvimento Local

1. **Configure o ambiente:**
   \`\`\`bash
   chmod +x scripts/dev-setup.sh
   ./scripts/dev-setup.sh
   \`\`\`

2. **Inicie a base de dados:**
   \`\`\`bash
   docker-compose up sqlserver -d
   \`\`\`

3. **Execute os scripts da base de dados:**
   - Execute os scripts na pasta `scripts/` na ordem numérica

4. **Inicie a API:**
   \`\`\`bash
   cd MemberManagementAPI
   dotnet run
   \`\`\`

5. **Inicie o frontend:**
   \`\`\`bash
   npm run dev
   \`\`\`

## 👤 Contas de Teste

Após executar os scripts da base de dados, estarão disponíveis as seguintes contas:

| Email | Palavra-passe | Role | Centro |
|-------|---------------|------|--------|
| admin@sistema.ao | 123456 | Admin | - |
| gerente@norte.ao | 123456 | Gerente | Centro Norte |
| gerente@sul.ao | 123456 | Gerente | Centro Sul |
| utilizador@norte.ao | 123456 | Utilizador | Centro Norte |

## 🔧 Configuração

### Variáveis de Ambiente

#### Frontend (.env.local)
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

#### Backend (MemberManagementAPI/.env)
\`\`\`env
ConnectionStrings__DefaultConnection=Server=localhost;Database=MemberManagementDB;Trusted_Connection=true;TrustServerCertificate=true;
Jwt__Key=sua-chave-secreta-muito-segura-aqui
Jwt__Issuer=MemberManagementAPI
Jwt__Audience=MemberManagementApp
\`\`\`

## 📚 Documentação da API

Após iniciar a API, acesse a documentação Swagger em:
- **Desenvolvimento:** http://localhost:5000
- **Produção:** https://sua-api.dominio.com

## 🏗️ Estrutura do Projeto

\`\`\`
member-management-app/
├── components/              # Componentes React
├── contexts/               # Contextos React
├── services/               # Serviços HTTP
├── types/                  # Tipos TypeScript
├── lib/                    # Utilitários
├── scripts/                # Scripts da base de dados
├── MemberManagementAPI/    # Web API C#
│   ├── Controllers/        # Controllers da API
│   ├── Models/            # Modelos/Entidades
│   ├── Services/          # Serviços de negócio
│   ├── Data/              # Contexto Entity Framework
│   └── DTOs/              # Data Transfer Objects
└── docker-compose.yml     # Configuração Docker
\`\`\`

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema, entre em contacto através de:
- Email: suporte@sistema.ao
- Telefone: +244 900 000 000

---

Desenvolvido com ❤️ para gestão eficiente de membros e centros.
\`\`\`

```json file="" isHidden
