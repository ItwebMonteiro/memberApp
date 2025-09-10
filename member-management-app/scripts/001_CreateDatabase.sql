-- Script para criar a base de dados Member Management
-- Execute este script primeiro

USE master;
GO

-- Criar a base de dados se não existir
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'MemberManagementDB')
BEGIN
    CREATE DATABASE MemberManagementDB;
    PRINT 'Base de dados MemberManagementDB criada com sucesso.';
END
ELSE
BEGIN
    PRINT 'Base de dados MemberManagementDB já existe.';
END
GO

USE MemberManagementDB;
GO
