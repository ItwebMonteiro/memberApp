#!/bin/bash
# Script de deployment para produção

echo "🚀 Iniciando deployment da aplicação Member Management..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Construir e iniciar os serviços
echo "🔨 Construindo e iniciando os serviços..."
docker-compose up -d --build

# Aguardar a base de dados estar pronta
echo "⏳ Aguardando a base de dados estar pronta..."
sleep 30

# Executar scripts da base de dados
echo "📊 Executando scripts da base de dados..."
docker exec member-management-db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "MemberManagement@2024" -d master -i /scripts/001_CreateDatabase.sql
docker exec member-management-db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "MemberManagement@2024" -d MemberManagementDB -i /scripts/002_CreateTables.sql
docker exec member-management-db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "MemberManagement@2024" -d MemberManagementDB -i /scripts/003_CreateIndexes.sql
docker exec member-management-db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "MemberManagement@2024" -d MemberManagementDB -i /scripts/004_SeedData.sql
docker exec member-management-db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "MemberManagement@2024" -d MemberManagementDB -i /scripts/005_StoredProcedures.sql
docker exec member-management-db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "MemberManagement@2024" -d MemberManagementDB -i /scripts/006_Views.sql

echo "✅ Deployment concluído com sucesso!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 API: http://localhost:5000"
echo "📊 Swagger: http://localhost:5000"

echo ""
echo "👤 Contas de teste:"
echo "   Admin: admin@sistema.ao / 123456"
echo "   Gerente: gerente@norte.ao / 123456"
