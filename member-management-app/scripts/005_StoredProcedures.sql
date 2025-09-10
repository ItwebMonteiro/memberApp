-- Stored Procedures para relatórios e operações complexas
USE MemberManagementDB;
GO

-- Procedure para relatório de membros por centro
CREATE OR ALTER PROCEDURE sp_RelatorioMembrosPorCentro
    @CentroId INT = NULL,
    @Activo BIT = NULL
AS
BEGIN
    SELECT 
        c.Nome AS Centro,
        COUNT(m.Id) AS TotalMembros,
        COUNT(CASE WHEN m.Activo = 1 THEN 1 END) AS MembrosActivos,
        COUNT(CASE WHEN m.Activo = 0 THEN 1 END) AS MembrosInactivos,
        AVG(DATEDIFF(YEAR, m.DataNascimento, GETDATE())) AS IdadeMedia,
        MIN(m.DataRegisto) AS PrimeiroRegisto,
        MAX(m.DataRegisto) AS UltimoRegisto
    FROM Centers c
    LEFT JOIN Members m ON c.Id = m.CentroId
    WHERE (@CentroId IS NULL OR c.Id = @CentroId)
        AND (@Activo IS NULL OR m.Activo = @Activo OR m.Id IS NULL)
    GROUP BY c.Id, c.Nome
    ORDER BY c.Nome;
END
GO

-- Procedure para relatório financeiro
CREATE OR ALTER PROCEDURE sp_RelatorioFinanceiro
    @CentroId INT = NULL,
    @AnoReferencia INT = NULL,
    @MesReferencia INT = NULL
AS
BEGIN
    DECLARE @Ano INT = ISNULL(@AnoReferencia, YEAR(GETDATE()));
    DECLARE @Mes INT = ISNULL(@MesReferencia, MONTH(GETDATE()));
    
    SELECT 
        c.Nome AS Centro,
        COUNT(p.Id) AS TotalPagamentos,
        SUM(CASE WHEN p.Status = 'Pago' THEN p.Valor ELSE 0 END) AS ValorRecebido,
        SUM(CASE WHEN p.Status = 'Pendente' THEN p.Valor ELSE 0 END) AS ValorPendente,
        SUM(CASE WHEN p.Status = 'Atrasado' THEN p.Valor ELSE 0 END) AS ValorAtrasado,
        COUNT(CASE WHEN p.Status = 'Pago' THEN 1 END) AS PagamentosPagos,
        COUNT(CASE WHEN p.Status = 'Pendente' THEN 1 END) AS PagamentosPendentes,
        COUNT(CASE WHEN p.Status = 'Atrasado' THEN 1 END) AS PagamentosAtrasados
    FROM Centers c
    LEFT JOIN Members m ON c.Id = m.CentroId
    LEFT JOIN Payments p ON m.Id = p.MembroId 
        AND p.AnoReferencia = @Ano 
        AND (@Mes IS NULL OR p.MesReferencia = @Mes)
    WHERE (@CentroId IS NULL OR c.Id = @CentroId)
    GROUP BY c.Id, c.Nome
    ORDER BY c.Nome;
END
GO

-- Procedure para gerar mensalidades automáticas
CREATE OR ALTER PROCEDURE sp_GerarMensalidadesAutomaticas
    @MesReferencia INT,
    @AnoReferencia INT,
    @RegistadoPorId INT
AS
BEGIN
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Inserir mensalidades para membros activos que ainda não têm pagamento no mês
        INSERT INTO Payments (MembroId, Valor, DataPagamento, DataVencimento, MetodoPagamento, Status, TipoPagamento, MesReferencia, AnoReferencia, RegistadoPorId)
        SELECT 
            m.Id,
            c.ValorMensalidade,
            DATEFROMPARTS(@AnoReferencia, @MesReferencia, 5), -- Data de vencimento no dia 5
            DATEFROMPARTS(@AnoReferencia, @MesReferencia, 5),
            'Pendente',
            'Pendente',
            'Mensalidade',
            @MesReferencia,
            @AnoReferencia,
            @RegistadoPorId
        FROM Members m
        INNER JOIN Centers c ON m.CentroId = c.Id
        WHERE m.Activo = 1
            AND c.Activo = 1
            AND NOT EXISTS (
                SELECT 1 FROM Payments p 
                WHERE p.MembroId = m.Id 
                    AND p.MesReferencia = @MesReferencia 
                    AND p.AnoReferencia = @AnoReferencia
            );
        
        SELECT @@ROWCOUNT AS MensalidadesGeradas;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- Procedure para estatísticas do dashboard
CREATE OR ALTER PROCEDURE sp_EstatisticasDashboard
    @CentroId INT = NULL
AS
BEGIN
    -- Estatísticas gerais
    SELECT 
        'Resumo' AS Categoria,
        COUNT(DISTINCT c.Id) AS TotalCentros,
        COUNT(DISTINCT m.Id) AS TotalMembros,
        COUNT(DISTINCT CASE WHEN m.Activo = 1 THEN m.Id END) AS MembrosActivos,
        COUNT(DISTINCT p.Id) AS TotalPagamentos,
        ISNULL(SUM(CASE WHEN p.Status = 'Pago' THEN p.Valor END), 0) AS ValorRecebido,
        ISNULL(SUM(CASE WHEN p.Status IN ('Pendente', 'Atrasado') THEN p.Valor END), 0) AS ValorPendente
    FROM Centers c
    LEFT JOIN Members m ON c.Id = m.CentroId
    LEFT JOIN Payments p ON m.Id = p.MembroId
    WHERE (@CentroId IS NULL OR c.Id = @CentroId);
    
    -- Pagamentos por mês (últimos 6 meses)
    SELECT 
        'PagamentosMensais' AS Categoria,
        p.AnoReferencia,
        p.MesReferencia,
        COUNT(p.Id) AS TotalPagamentos,
        SUM(CASE WHEN p.Status = 'Pago' THEN p.Valor ELSE 0 END) AS ValorRecebido
    FROM Payments p
    INNER JOIN Members m ON p.MembroId = m.Id
    INNER JOIN Centers c ON m.CentroId = c.Id
    WHERE (@CentroId IS NULL OR c.Id = @CentroId)
        AND p.DataPagamento >= DATEADD(MONTH, -6, GETDATE())
    GROUP BY p.AnoReferencia, p.MesReferencia
    ORDER BY p.AnoReferencia DESC, p.MesReferencia DESC;
END
GO

PRINT 'Stored procedures criadas com sucesso.';
