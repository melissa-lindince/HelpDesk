-- USERS
INSERT INTO users (id, name, created_at) VALUES (1, 'Vanessa Forin', '2025-10-10 14:30:00')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO users (id, name, created_at) VALUES (2, 'Lucas Andrade', '2025-10-11 09:45:00')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO users (id, name, created_at) VALUES (3, 'Marina Souza', '2025-10-12 16:10:00')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO users (id, name, created_at) VALUES (4, 'João Pereira', '2025-10-13 08:00:00')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO users (id, name, created_at) VALUES (5, 'Carla Menezes', '2025-10-13 10:25:00')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO users (id, name, created_at) VALUES (6, 'Fernanda Tisco', '2025-10-26 10:35:00')
ON DUPLICATE KEY UPDATE name = VALUES(name);


-- TICKETS (somente se não existir nenhum)
INSERT INTO tickets (title, description, created_on, due_date, end_date, category, priority, status, author_id, responsable_id)
SELECT 'Erro na tela de login', 'Usuário não consegue acessar o sistema com credenciais válidas.',
       '2025-10-10 09:15:00', '2025-10-17 09:15:00', NULL, 'BUG', 'ALTA', 'EM_ANDAMENTO', 1, 2
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Erro na tela de login');

INSERT INTO tickets (title, description, created_on, due_date, end_date, category, priority, status, author_id, responsable_id)
SELECT 'Nova funcionalidade de relatórios', 'Solicitação para implementar exportação de relatórios em PDF.',
       '2025-10-09 14:30:00', '2025-10-16 14:30:00', NULL, 'FEATURE', 'MEDIA', 'PENDENTE', 2, 3
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Nova funcionalidade de relatórios');

INSERT INTO tickets (title, description, created_on, due_date, end_date, category, priority, status, author_id, responsable_id)
SELECT 'Ajuste no layout do dashboard', 'Alinhar os gráficos e corrigir cores fora do padrão.',
       '2025-10-11 11:00:00', '2025-10-18 11:00:00', NULL, 'SUPORTE', 'BAIXA', 'PENDENTE', 3, 4
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Ajuste no layout do dashboard');

INSERT INTO tickets (title, description, created_on, due_date, end_date, category, priority, status, author_id, responsable_id)
SELECT 'Erro ao gerar nota fiscal', 'Sistema lança exceção ao tentar emitir nota para cliente PJ.',
       '2025-10-12 10:45:00', '2025-10-19 10:45:00', '2025-10-13 17:00:00', 'BUG', 'ALTA', 'FINALIZADO', 4, 5
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Erro ao gerar nota fiscal');

INSERT INTO tickets (title, description, created_on, due_date, end_date, category, priority, status, author_id, responsable_id)
SELECT 'Solicitação de treinamento', 'Usuário pediu agendamento de treinamento sobre uso do sistema.',
       '2025-10-08 08:00:00', '2025-10-15 08:00:00', NULL, 'SUPORTE', 'MEDIA', 'EM_ANDAMENTO', 5, 1
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE title = 'Solicitação de treinamento');

