Estrutura de Custeio para Sustentação de Workflows

Este modelo de precificação é desenhado para calcular o custo de sustentação de cada tipo de workflow de forma individualizada, partindo de um "Valor Base" e aplicando uma série de "Adicionais" que refletem as exigências específicas de cada processo.

1. Valor Base (Custo Inicial)

O ponto de partida é o custo fixo e individual para cada tipo de workflow:

Produto: R$ 85,00

Plataforma: R$ 60,00

Modelos AA: R$ 100,00


2. Adicionais (Ajustes ao Valor Base)

Os adicionais são calculados sobre o "Valor Base com SLA", que é o primeiro ajuste aplicado ao valor inicial.

2.1. Valor Base com SLA (Service Level Agreement)

Este é o valor de referência para o cálculo de todos os outros adicionais. O ajuste é feito com base no tempo de resposta exigido:

8 Horas: Multiplicador x 1 (sem custo adicional)

6 Horas: Multiplicador x 1,5

4 Horas: Multiplicador x 2,5

2 Horas: Multiplicador x 6

2.2. Cálculo dos Adicionais

Os seguintes adicionais são calculados sobre o "Valor Base com SLA" e somados ao final:

Adicional de Plantão:

Com plantão: Adiciona 100% do "Valor Base com SLA".

Sem plantão: Sem custo adicional.

Adicional de Frequência:

Reflete o risco associado à frequência de execuções diárias.

Baixa (ex: 1x/dia): Sem custo adicional.

Média (ex: 24x/dia): Adiciona aproximadamente 50% do "Valor Base com SLA".

Alta (48x/dia ou mais): Adiciona 100% do "Valor Base com SLA".

Adicional de Complexidade do Processo:

Baixa: Sem custo adicional.

Média: Adiciona 25% do "Valor Base com SLA".

Alta: Adiciona 60% do "Valor Base com SLA".

Adicional de Complexidade da Validação de Qualidade:

Sem validação: Sem custo adicional.

Baixa: Adiciona 25% do "Valor Base com SLA".

Média: Adiciona 50% do "Valor Base com SLA".

Alta: Adiciona 100% do "Valor Base com SLA".

Adicional de Cobertura Desejada:

5x8 (Horário Comercial): Sem custo adicional.

12x5 (Horário Estendido Seg à Sex): Adiciona 25% do "Valor Base com SLA".

8x7 (Horário Estendido Seg à Dom): Adiciona 50% do "Valor Base com SLA".

24x7 (Cobertura Total): Adiciona 100% do "Valor Base com SLA".

3. Valor Final por Workflow

O custo final para cada workflow é determinado pela seguinte fórmula:

ValorporWorkflow=ValorBasecomSLA+AdicionalPlant 
a
~
 o+AdicionalFrequ 
e
^
 ncia+AdicionalComp.Processo+AdicionalComp.Qualidade+AdicionalCobertura

O custo total da sustentação é a soma dos valores finais de todos os workflows.

4. Métrica de Performance: Assertividade

A qualidade do serviço, medida pela assertividade na resolução dos trabalhos, pode impactar o valor final a ser faturado. A meta padrão de assertividade é de 95%. Este percentual pode ser ajustado, funcionando como um possível bônus ou redutor sobre o valor total calculado, dependendo da performance alcançada.
