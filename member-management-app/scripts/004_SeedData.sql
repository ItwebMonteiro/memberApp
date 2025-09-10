-- Script para inserir dados iniciais
USE MemberManagementDB;
GO

-- Inserir centros iniciais
IF NOT EXISTS (SELECT 1 FROM Centers)
BEGIN
    INSERT INTO Centers (Nome, Descricao, Endereco, Telefone, Email, Responsavel, ValorMensalidade) VALUES
    ('Centro Norte', 'Centro principal da região norte', 'Rua da Liberdade, 123, Luanda', '+244 923 456 789', 'norte@centros.ao', 'João Silva', 15000.00),
    ('Centro Sul', 'Centro da região sul', 'Avenida 4 de Fevereiro, 456, Benguela', '+244 924 567 890', 'sul@centros.ao', 'Maria Santos', 12000.00),
    ('Centro Leste', 'Centro da região leste', 'Rua dos Combatentes, 789, Malanje', '+244 925 678 901', 'leste@centros.ao', 'António Costa', 10000.00);
    
    PRINT 'Centros iniciais inseridos.';
END

-- Inserir utilizadores iniciais
IF NOT EXISTS (SELECT 1 FROM Users)
BEGIN
    -- Senha para todos: 123456 (hash BCrypt)
    INSERT INTO Users (Nome, Email, PasswordHash, Role, CentroId) VALUES
    ('Administrador Sistema', 'admin@sistema.ao', '$2a$11$8K1p/a0dL2LkzMZjdHWOa.hsRcT9SMQyY5H2LhRdvjSMaQiirm.lG', 'Admin', NULL),
    ('Gerente Norte', 'gerente@norte.ao', '$2a$11$8K1p/a0dL2LkzMZjdHWOa.hsRcT9SMQyY5H2LhRdvjSMaQiirm.lG', 'Gerente', 1),
    ('Gerente Sul', 'gerente@sul.ao', '$2a$11$8K1p/a0dL2LkzMZjdHWOa.hsRcT9SMQyY5H2LhRdvjSMaQiirm.lG', 'Gerente', 2),
    ('Utilizador Norte', 'utilizador@norte.ao', '$2a$11$8K1p/a0dL2LkzMZjdHWOa.hsRcT9SMQyY5H2LhRdvjSMaQiirm.lG', 'Utilizador', 1);
    
    PRINT 'Utilizadores iniciais inseridos.';
END

-- Inserir membros de exemplo
IF NOT EXISTS (SELECT 1 FROM Members)
BEGIN
    INSERT INTO Members (Nome, Email, Telefone, Endereco, DataNascimento, NumeroIdentificacao, CentroId, ContactoEmergenciaNome, ContactoEmergenciaTelefone, ContactoEmergenciaRelacao, RegistadoPorId) VALUES
    ('Carlos Manuel', 'carlos.manuel@email.ao', '+244 923 111 222', 'Rua A, Casa 10, Luanda', '1990-05-15', '123456789LA041', 1, 'Ana Manuel', '+244 924 111 222', 'Esposa', 2),
    ('Fernanda Costa', 'fernanda.costa@email.ao', '+244 924 333 444', 'Avenida B, Prédio 5, Benguela', '1985-08-22', '987654321BE041', 2, 'Pedro Costa', '+244 925 333 444', 'Marido', 3),
    ('Miguel Santos', 'miguel.santos@email.ao', '+244 925 555 666', 'Rua C, Lote 15, Malanje', '1992-12-10', '456789123ML041', 3, 'Isabel Santos', '+244 926 555 666', 'Mãe', 2),
    ('Luisa Pereira', 'luisa.pereira@email.ao', '+244 926 777 888', 'Travessa D, Casa 8, Luanda', '1988-03-18', '789123456LA042', 1, 'João Pereira', '+244 927 777 888', 'Pai', 2),
    ('Ricardo Nunes', 'ricardo.nunes@email.ao', '+244 927 999 000', 'Rua E, Apartamento 12, Benguela', '1995-07-25', '321654987BE042', 2, 'Sofia Nunes', '+244 928 999 000', 'Irmã', 3);
    
    PRINT 'Membros de exemplo inseridos.';
END

-- Inserir alguns pagamentos de exemplo
IF NOT EXISTS (SELECT 1 FROM Payments)
BEGIN
    DECLARE @CurrentYear int = YEAR(GETDATE());
    DECLARE @CurrentMonth int = MONTH(GETDATE());
    
    INSERT INTO Payments (MembroId, Valor, DataPagamento, DataVencimento, MetodoPagamento, Status, MesReferencia, AnoReferencia, RegistadoPorId) VALUES
    (1, 15000.00, GETDATE(), DATEADD(day, -5, GETDATE()), 'PIX', 'Pago', @CurrentMonth, @CurrentYear, 2),
    (2, 12000.00, GETDATE(), DATEADD(day, -3, GETDATE()), 'Cartão', 'Pago', @CurrentMonth, @CurrentYear, 3),
    (3, 10000.00, DATEADD(day, 5, GETDATE()), DATEADD(day, 5, GETDATE()), 'Dinheiro', 'Pendente', @CurrentMonth, @CurrentYear, 2),
    (4, 15000.00, DATEADD(day, -10, GETDATE()), DATEADD(day, -15, GETDATE()), 'Transferência', 'Atrasado', @CurrentMonth-1, @CurrentYear, 2),
    (5, 12000.00, GETDATE(), GETDATE(), 'PIX', 'Pago', @CurrentMonth, @CurrentYear, 3);
    
    PRINT 'Pagamentos de exemplo inseridos.';
END
GO
