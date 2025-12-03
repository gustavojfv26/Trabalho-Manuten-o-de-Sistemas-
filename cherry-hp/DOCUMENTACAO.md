# CherryHP - Sistema de Gestão Médica

## 📋 Sumário

O CherryHP é um sistema completo de gestão para clínicas médicas desenvolvido para otimizar processos administrativos, clínicos e financeiros. Esta documentação serve como referência para validação do sistema implementado, descrevendo funcionalidades, requisitos e pontos de atenção críticos.

---

## 🎯 1. Objetivo do Sistema

Automatizar e integrar todos os processos de uma clínica médica, incluindo:
- Gestão de pacientes e prontuários eletrônicos
- Agendamento e controle de consultas
- Cadastro e gerenciamento de profissionais de saúde
- Controle financeiro e faturamento
- Configurações e personalização do sistema

---

## 🔐 2. Módulo de Autenticação e Segurança

### 2.1 Funcionalidades Implementadas
- Sistema de login com usuário e senha
- Proteção contra tentativas excessivas (bloqueio temporário)
- Opção "Lembrar-me" para persistência de sessão
- Redirecionamento seguro entre páginas
- Logout com encerramento de sessão

### 2.2 Requisitos de Segurança
- Senhas devem ter no mínimo 6 caracteres
- Bloqueio após 3 tentativas malsucedidas
- Tempo de expiração de sessão configurável
- Campos de senha com opção de mostrar/ocultar

---

## 🏠 3. Dashboard Principal

### 3.1 Funcionalidades Implementadas
- Visão geral com métricas da clínica
- Estatísticas de consultas, pacientes e faturamento
- Acesso rápido às funcionalidades principais
- Próximas consultas agendadas
- Menu lateral de navegação

### 3.2 Métricas e Indicadores
- Total de consultas do dia
- Número de pacientes cadastrados
- Quantidade de médicos ativos
- Faturamento mensal e comparativo

---

## 👨‍👩‍👧‍👦 4. Gestão de Pacientes

### 4.1 Funcionalidades Implementadas
- Cadastro completo de pacientes
- Listagem com filtros e busca
- Categorização por programa de fidelidade
- Histórico de consultas e tratamentos
- Exportação de dados

### 4.2 Programa de Fidelidade
- Sistema de categorias (Bronze, Prata, Ouro, Platina)
- Benefícios diferenciados por categoria
- Regras de elegibilidade e progressão
- Relatórios de participação

### 4.3 Campos Obrigatórios no Cadastro
- Nome completo
- CPF (com validação)
- Data de nascimento
- Telefone para contato
- Tipo sanguíneo
- Histórico de alergias

---

## 📅 5. Gestão de Consultas

### 5.1 Funcionalidades Implementadas
- Agendamento de consultas
- Múltiplas visualizações (dia, semana, mês)
- Controle de status (confirmada, pendente, cancelada)
- Filtros por médico, especialidade e status
- Reagendamento e cancelamento

### 5.2 Pontos Críticos de Validação
- Não podem existir duas consultas agendadas para o mesmo médico no mesmo horário
- O sistema deve respeitar o horário de funcionamento da clínica
- Consultas canceladas devem liberar o horário para novos agendamentos
- Deve ser possível visualizar conflitos de agenda

### 5.3 Fluxo de Agendamento
1. Seleção de médico e especialidade
2. Verificação de disponibilidade
3. Seleção de data e horário
4. Escolha do paciente
5. Confirmação e notificação

---

## 👨‍⚕️ 6. Gestão de Médicos e Equipe

### 6.1 Funcionalidades Implementadas
- Cadastro completo de profissionais
- Controle de CRM e especialidades
- Gestão de horários de trabalho
- Status de ativação/inativação
- Vinculação com especialidades

### 6.2 Campos Obrigatórios
- Nome completo
- Número do CRM (com validação de formato)
- CPF
- Especialidade principal
- Telefone e e-mail de contato

---

## 📋 7. Prontuários Eletrônicos

### 7.1 Funcionalidades Implementadas
- Registro completo de atendimentos
- Histórico médico do paciente
- Anamnese, exame físico e diagnóstico
- Prescrição de medicamentos e condutas
- Acesso controlado por permissões

### 7.2 Estrutura do Prontuário
- Dados da consulta (data, médico, paciente)
- Queixa principal e anamnese
- Exame físico e achados
- Diagnóstico e CID quando aplicável
- Conduta e prescrições
- Evoluções e retornos

---

## 💰 8. Módulo Financeiro

### 8.1 Funcionalidades Implementadas
- Controle de receitas e despesas
- Gestão de contas a receber
- Relatórios financeiros
- Faturamento por médico e especialidade
- Controle de formas de pagamento

### 8.2 Relatórios Disponíveis
- Fluxo de caixa mensal
- Faturamento por profissional
- Contas a receber (em aberto, vencidas, quitadas)
- Despesas detalhadas por categoria
- Performance financeira por especialidade

### 8.3 Pontos Críticos de Validação
- Os valores financeiros devem ser calculados corretamente
- Descontos do programa de fidelidade devem ser aplicados adequadamente
- O sistema deve evitar duplicidade de lançamentos
- Relatórios devem refletir corretamente o período selecionado

---

## ⚙️ 9. Configurações do Sistema

### 9.1 Funcionalidades Implementadas
- Dados cadastrais da clínica
- Horários de funcionamento
- Gestão de usuários e perfis
- Políticas de backup
- Integrações com sistemas externos

### 9.2 Perfis de Acesso
- Administrador: acesso completo ao sistema
- Médico: acesso a prontuários e agenda
- Recepcionista: agendamento e cadastro
- Enfermeiro: acesso a prontuários e evoluções

### 9.3 Backup e Restauração
- Agendamento de backups automáticos
- Opção de backup manual
- Restauração a partir de backup
- Histórico de backups realizados

---

## ⚠️ 10. Pontos Críticos e Regras de Negócio

### 10.1 Agenda e Consultas
- Um médico não pode ter duas consultas no mesmo horário
- O sistema deve respeitar o tempo mínimo entre consultas
- Consultas de retorno devem ser vinculadas à consulta original
- Cancelamentos devem registrar motivo e usuário responsável

### 10.2 Dados Cadastrais
- CPF deve ser validado por dígito verificador
- CRM deve seguir o padrão UF-Número
- Telefones devem seguir formato nacional
- E-mails devem ter formato válido

### 10.3 Financeiro
- Valores devem ser calculados com precisão de centavos
- Descontos não podem resultar em valores negativos
- Pagamentos devem ser corretamente aplicados às faturas
- Relatórios devem considerar apenas o período selecionado

### 10.4 Segurança e Acesso
- Senhas devem ser armazenadas de forma segura
- Usuários só podem acessar funcionalidades according to seu perfil
- Sessões devem expirar após período de inatividade
- Tentativas de acesso não autorizado devem ser registradas

---

## 📱 11. Manual do Usuário

### 11.1 Primeiro Acesso
1. Acessar o sistema através da URL fornecida
2. Utilizar as credenciais iniciais: usuário "admin", senha "admin123"
3. Alterar a senha no primeiro acesso
4. Configurar os dados da clínica em Configurações > Dados da Clínica

### 11.2 Fluxo de Agendamento
1. Acessar o módulo de Consultas
2. Selecionar a visualização desejada (dia, semana, mês)
3. Clicar em horário disponível ou no botão "Nova Consulta"
4. Preencher os dados do agendamento
5. Confirmar e verificar se o agendamento aparece na agenda

### 11.3 Cadastro de Paciente
1. Acessar Pacientes > Novo Paciente
2. Preencher todos os campos obrigatórios
3. Salvar e verificar se o paciente aparece na listagem
4. Testar a busca pelo paciente recém-cadastrado

### 11.4 Emissão de Relatório Financeiro
1. Acessar Financeiro > Relatórios
2. Selecionar o tipo de relatório desejado
3. Definir o período de análise
4. Gerar o relatório e verificar se os dados estão consistentes

---

## 🛠️ 12. Suporte e Manutenção

### 12.1 Canais de Suporte
- E-mail: suporte@cherryhp.com.br
- Telefone: (47) 4002-8922
- Horário de atendimento: Segunda a sexta, 8h às 18h

### 12.2 Procedimentos de Manutenção
- Backups devem ser realizados diariamente
- Logs do sistema devem ser revisados periodicamente
- Atualizações de segurança devem ser aplicadas regularmente
- Testes de restauração devem ser realizados mensalmente

---


*Documentação atualizada em: 08 de Setembro de 2025*

*Versão do Sistema: 2.0.0*

*Última Revisão: 08 de Setembro de 2025*
