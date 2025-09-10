-- Script para criar todas as tabelas da aplicação
USE MemberManagementDB;
GO

-- Tabela Centers (Centros)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Centers' AND xtype='U')
BEGIN
    CREATE TABLE Centers (
        Id int IDENTITY(1,1) PRIMARY KEY,
        Nome nvarchar(200) NOT NULL,
        Descricao nvarchar(500) NULL,
        Endereco nvarchar(300) NOT NULL,
        Telefone nvarchar(20) NULL,
        Email nvarchar(255) NULL,
        Activo bit NOT NULL DEFAULT 1,
        DataCriacao datetime2 NOT NULL DEFAULT GETDATE(),
        Responsavel nvarchar(100) NULL,
        ValorMensalidade decimal(10,2) NOT NULL DEFAULT 0
    );
    PRINT 'Tabela Centers criada.';
END
GO

-- Tabela Users (Utilizadores)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        Id int IDENTITY(1,1) PRIMARY KEY,
        Nome nvarchar(100) NOT NULL,
        Email nvarchar(255) NOT NULL UNIQUE,
        PasswordHash nvarchar(255) NOT NULL,
        Role nvarchar(50) NOT NULL DEFAULT 'Utilizador',
        CentroId int NULL,
        Activo bit NOT NULL DEFAULT 1,
        DataCriacao datetime2 NOT NULL DEFAULT GETDATE(),
        UltimoLogin datetime2 NULL,
        FOREIGN KEY (CentroId) REFERENCES Centers(Id) ON DELETE SET NULL
    );
    PRINT 'Tabela Users criada.';
END
GO

-- Tabela Members (Membros)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Members' AND xtype='U')
BEGIN
    CREATE TABLE Members (
        Id int IDENTITY(1,1) PRIMARY KEY,
        Nome nvarchar(100) NOT NULL,
        Email nvarchar(255) NOT NULL UNIQUE,
        Telefone nvarchar(20) NULL,
        Endereco nvarchar(300) NOT NULL,
        DataNascimento datetime2 NOT NULL,
        NumeroIdentificacao nvarchar(20) NULL UNIQUE,
        CentroId int NOT NULL,
        Activo bit NOT NULL DEFAULT 1,
        DataRegisto datetime2 NOT NULL DEFAULT GETDATE(),
        DataUltimoPagamento datetime2 NULL,
        ContactoEmergenciaNome nvarchar(100) NULL,
        ContactoEmergenciaTelefone nvarchar(20) NULL,
        ContactoEmergenciaRelacao nvarchar(100) NULL,
        Observacoes nvarchar(500) NULL,
        RegistadoPorId int NULL,
        FOREIGN KEY (CentroId) REFERENCES Centers(Id) ON DELETE NO ACTION,
        FOREIGN KEY (RegistadoPorId) REFERENCES Users(Id) ON DELETE SET NULL
    );
    PRINT 'Tabela Members criada.';
END
GO

-- Tabela Payments (Pagamentos)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Payments' AND xtype='U')
BEGIN
    CREATE TABLE Payments (
        Id int IDENTITY(1,1) PRIMARY KEY,
        MembroId int NOT NULL,
        Valor decimal(10,2) NOT NULL,
        DataPagamento datetime2 NOT NULL,
        DataVencimento datetime2 NOT NULL,
        MetodoPagamento nvarchar(50) NOT NULL,
        Status nvarchar(50) NOT NULL DEFAULT 'Pendente',
        TipoPagamento nvarchar(50) NOT NULL DEFAULT 'Mensalidade',
        Observacoes nvarchar(500) NULL,
        NumeroTransacao nvarchar(100) NULL,
        RegistadoPorId int NULL,
        DataRegisto datetime2 NOT NULL DEFAULT GETDATE(),
        MesReferencia int NOT NULL,
        AnoReferencia int NOT NULL,
        FOREIGN KEY (MembroId) REFERENCES Members(Id) ON DELETE CASCADE,
        FOREIGN KEY (RegistadoPorId) REFERENCES Users(Id) ON DELETE SET NULL
    );
    PRINT 'Tabela Payments criada.';
END
GO

-- Tabela Notifications (Notificações)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Notifications' AND xtype='U')
BEGIN
    CREATE TABLE Notifications (
        Id int IDENTITY(1,1) PRIMARY KEY,
        Titulo nvarchar(200) NOT NULL,
        Mensagem nvarchar(max) NOT NULL,
        Tipo nvarchar(50) NOT NULL,
        Status nvarchar(50) NOT NULL DEFAULT 'Pendente',
        DataEnvio datetime2 NOT NULL DEFAULT GETDATE(),
        DataEntrega datetime2 NULL,
        Destinatarios nvarchar(500) NULL,
        MembroId int NULL,
        CentroId int NULL,
        EnviadoPorId int NULL,
        ErroMensagem nvarchar(1000) NULL,
        TentativasEnvio int NOT NULL DEFAULT 0,
        FOREIGN KEY (MembroId) REFERENCES Members(Id) ON DELETE SET NULL,
        FOREIGN KEY (CentroId) REFERENCES Centers(Id) ON DELETE SET NULL,
        FOREIGN KEY (EnviadoPorId) REFERENCES Users(Id) ON DELETE SET NULL
    );
    PRINT 'Tabela Notifications criada.';
END
GO

-- Tabela Reports (Relatórios)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Reports' AND xtype='U')
BEGIN
    CREATE TABLE Reports (
        Id int IDENTITY(1,1) PRIMARY KEY,
        Nome nvarchar(200) NOT NULL,
        Tipo nvarchar(100) NOT NULL,
        Descricao nvarchar(500) NULL,
        Parametros nvarchar(max) NOT NULL,
        DataGeracao datetime2 NOT NULL DEFAULT GETDATE(),
        CentroId int NULL,
        GeradoPorId int NOT NULL,
        Formato nvarchar(50) NOT NULL DEFAULT 'PDF',
        CaminhoArquivo nvarchar(500) NULL,
        TamanhoArquivo bigint NULL,
        Status nvarchar(50) NOT NULL DEFAULT 'Gerado',
        FOREIGN KEY (CentroId) REFERENCES Centers(Id) ON DELETE SET NULL,
        FOREIGN KEY (GeradoPorId) REFERENCES Users(Id) ON DELETE NO ACTION
    );
    PRINT 'Tabela Reports criada.';
END
GO
