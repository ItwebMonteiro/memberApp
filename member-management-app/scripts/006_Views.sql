-- Views úteis para relatórios e consultas
USE MemberManagementDB;
GO

-- View para membros com informações completas
CREATE OR ALTER VIEW vw_MembrosCompletos AS
SELECT 
    m.Id,
    m.Nome,
    m.Email,
    m.Telefone,
    m.Endereco,
    m.DataNascimento,
    DATEDIFF(YEAR, m.DataNascimento, GETDATE()) AS Idade,
    m.NumeroIdentificacao,
    m.Activo,
    m.DataRegisto,
    m.DataUltimoPagamento,
    c.Nome AS CentroNome,
    c.ValorMensalidade,
    u.Nome AS RegistadoPorNome,
    -- Estatísticas de pagamento
    ISNULL(SUM(CASE WHEN p.Status = 'Pago' THEN p.Valor ELSE 0 END), 0) AS TotalPago,
    ISNULL(SUM(CASE WHEN p.Status IN ('Pendente', 'Atrasado') THEN p.Valor ELSE 0 END), 0) AS TotalDevido,
    COUNT(p.Id) AS TotalPagamentos,
    MAX(CASE WHEN p.Status = 'Pago' THEN p.DataPagamento END) AS UltimoPagamento
FROM Members m
INNER JOIN Centers c ON m.CentroId = c.Id
LEFT JOIN Users u ON m.RegistadoPorId = u.Id
LEFT JOIN Payments p ON m.Id = p.MembroId
GROUP BY m.Id, m.Nome, m.Email, m.Telefone, m.Endereco, m.DataNascimento, 
         m.NumeroIdentificacao, m.Activo, m.DataRegisto, m.DataUltimoPagamento,
         c.Nome, c.ValorMensalidade, u.Nome;
GO

-- View para resumo de centros
CREATE OR ALTER VIEW vw_ResumosCentros AS
SELECT 
    c.Id,
    c.Nome,
    c.Endereco,
    c.Telefone,
    c.Email,
    c.Activo,
    c.ValorMensalidade,
    c.Responsavel,
    COUNT(m.Id) AS TotalMembros,
    COUNT(CASE WHEN m.Activo = 1 THEN 1 END) AS MembrosActivos,
    ISNULL(SUM(CASE WHEN p.Status = 'Pago' THEN p.Valor ELSE 0 END), 0) AS ReceitaTotal,
    ISNULL(SUM(CASE WHEN p.Status IN ('Pendente', 'Atrasado') THEN p.Valor ELSE 0 END), 0) AS ValorPendente
FROM Centers c
LEFT JOIN Members m ON c.Id = m.CentroId
LEFT JOIN Payments p ON m.Id = p.MembroId
GROUP BY c.Id, c.Nome, c.Endereco, c.Telefone, c.Email, c.Activo, c.ValorMensalidade, c.Responsavel;
GO

PRINT 'Views criadas com sucesso.';
