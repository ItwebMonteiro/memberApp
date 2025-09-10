-- Script para criar índices para melhor performance
USE MemberManagementDB;
GO

-- Índices para tabela Users
CREATE NONCLUSTERED INDEX IX_Users_Email ON Users(Email);
CREATE NONCLUSTERED INDEX IX_Users_CentroId ON Users(CentroId);
CREATE NONCLUSTERED INDEX IX_Users_Role ON Users(Role);
PRINT 'Índices da tabela Users criados.';

-- Índices para tabela Members
CREATE NONCLUSTERED INDEX IX_Members_Email ON Members(Email);
CREATE NONCLUSTERED INDEX IX_Members_CentroId ON Members(CentroId);
CREATE NONCLUSTERED INDEX IX_Members_Activo ON Members(Activo);
CREATE NONCLUSTERED INDEX IX_Members_DataRegisto ON Members(DataRegisto);
CREATE NONCLUSTERED INDEX IX_Members_NumeroIdentificacao ON Members(NumeroIdentificacao);
PRINT 'Índices da tabela Members criados.';

-- Índices para tabela Payments
CREATE NONCLUSTERED INDEX IX_Payments_MembroId ON Payments(MembroId);
CREATE NONCLUSTERED INDEX IX_Payments_Status ON Payments(Status);
CREATE NONCLUSTERED INDEX IX_Payments_DataPagamento ON Payments(DataPagamento);
CREATE NONCLUSTERED INDEX IX_Payments_DataVencimento ON Payments(DataVencimento);
CREATE NONCLUSTERED INDEX IX_Payments_MesAno ON Payments(AnoReferencia, MesReferencia);
PRINT 'Índices da tabela Payments criados.';

-- Índices para tabela Centers
CREATE NONCLUSTERED INDEX IX_Centers_Activo ON Centers(Activo);
CREATE NONCLUSTERED INDEX IX_Centers_Nome ON Centers(Nome);
PRINT 'Índices da tabela Centers criados.';

-- Índices para tabela Notifications
CREATE NONCLUSTERED INDEX IX_Notifications_Status ON Notifications(Status);
CREATE NONCLUSTERED INDEX IX_Notifications_DataEnvio ON Notifications(DataEnvio);
CREATE NONCLUSTERED INDEX IX_Notifications_MembroId ON Notifications(MembroId);
CREATE NONCLUSTERED INDEX IX_Notifications_CentroId ON Notifications(CentroId);
PRINT 'Índices da tabela Notifications criados.';

-- Índices para tabela Reports
CREATE NONCLUSTERED INDEX IX_Reports_DataGeracao ON Reports(DataGeracao);
CREATE NONCLUSTERED INDEX IX_Reports_CentroId ON Reports(CentroId);
CREATE NONCLUSTERED INDEX IX_Reports_Tipo ON Reports(Tipo);
PRINT 'Índices da tabela Reports criados.';
GO
