#!/bin/bash
# Script para configurar ambiente de desenvolvimento

echo "🛠️ Configurando ambiente de desenvolvimento..."

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
npm install

# Configurar variáveis de ambiente
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local..."
    cp .env.example .env.local
fi

# Configurar API
cd MemberManagementAPI
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env para a API..."
    cp .env.example .env
fi

# Restaurar pacotes NuGet
echo "📦 Restaurando pacotes NuGet..."
dotnet restore

cd ..

echo "✅ Ambiente de desenvolvimento configurado!"
echo ""
echo "Para iniciar o desenvolvimento:"
echo "1. Inicie a base de dados: docker-compose up sqlserver -d"
echo "2. Execute os scripts da base de dados"
echo "3. Inicie a API: cd MemberManagementAPI && dotnet run"
echo "4. Inicie o frontend: npm run dev"
