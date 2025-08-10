// Classe principal para gerenciamento de limites de uso
class LimitManager {
    constructor() {
        this.storageKey = 'contentgen_usage';
        this.premiumKey = 'contentgen_premium';
        this.dailyLimit = 3;
    }

    checkDailyLimit() {
        const usage = this.getUsageData();
        const today = new Date().toDateString();
        
        if (usage.date !== today) {
            this.resetDailyLimits();
            return true;
        }
        
        return usage.count < this.dailyLimit || this.isPremium();
    }

    incrementUsage() {
        const usage = this.getUsageData();
        const today = new Date().toDateString();
        
        if (usage.date !== today) {
            usage.date = today;
            usage.count = 0;
        }
        
        usage.count++;
        localStorage.setItem(this.storageKey, JSON.stringify(usage));
        this.updateUsageDisplay();
    }

    getUsageData() {
        const stored = localStorage.getItem(this.storageKey);
        if (!stored) {
            return { date: new Date().toDateString(), count: 0 };
        }
        return JSON.parse(stored);
    }

    resetDailyLimits() {
        const today = new Date().toDateString();
        const usage = { date: today, count: 0 };
        localStorage.setItem(this.storageKey, JSON.stringify(usage));
        this.updateUsageDisplay();
    }

    isPremium() {
        return localStorage.getItem(this.premiumKey) === 'true';
    }

    updateUsageDisplay() {
        const usage = this.getUsageData();
        const counter = document.getElementById('daily-count');
        const badge = document.getElementById('usage-counter');
        
        if (counter) {
            counter.textContent = usage.count;
        }
        
        if (badge) {
            badge.setAttribute('data-usage', usage.count.toString());
            if (usage.count >= this.dailyLimit && !this.isPremium()) {
                badge.classList.add('badge-error');
                badge.classList.remove('badge-secondary');
            } else {
                badge.classList.add('badge-secondary');
                badge.classList.remove('badge-error');
            }
        }
    }
}

// Classe para análise de SERP simulada
class SERPAnalyzer {
    constructor() {
        this.competitorData = {
            'marketing digital': {
                difficulty: 75,
                volume: 12000,
                competition: 'Alta',
                competitors: [
                    'O que é Marketing Digital: Guia Completo 2024',
                    'Marketing Digital para Iniciantes: Passo a Passo',
                    'Estratégias de Marketing Digital que Funcionam'
                ]
            },
            'como fazer seo': {
                difficulty: 65,
                volume: 8500,
                competition: 'Média',
                competitors: [
                    'SEO para Iniciantes: Guia Completo',
                    'Como Fazer SEO: 10 Estratégias Essenciais',
                    'Otimização para Mecanismos de Busca'
                ]
            },
            'receitas saudáveis': {
                difficulty: 45,
                volume: 15000,
                competition: 'Baixa',
                competitors: [
                    'Receitas Saudáveis e Fáceis para o Dia a Dia',
                    '50 Receitas Saudáveis para Emagrecer',
                    'Alimentação Saudável: Receitas Práticas'
                ]
            }
        };
    }

    async analyzeSERP(keyword) {
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const normalizedKeyword = keyword.toLowerCase();
        let data = this.competitorData[normalizedKeyword];
        
        if (!data) {
            // Gera dados simulados para palavras-chave não cadastradas
            data = {
                difficulty: Math.floor(Math.random() * 100),
                volume: Math.floor(Math.random() * 20000) + 1000,
                competition: ['Baixa', 'Média', 'Alta'][Math.floor(Math.random() * 3)],
                competitors: [
                    `Guia Completo sobre ${keyword}`,
                    `Como ${keyword}: Passo a Passo`,
                    `${keyword}: Dicas e Estratégias`
                ]
            };
        }
        
        return data;
    }

    identifySearchIntent(keyword) {
        const informationalWords = ['como', 'o que', 'por que', 'quando', 'onde', 'guia', 'tutorial'];
        const commercialWords = ['melhor', 'comparar', 'vs', 'review', 'avaliação', 'preço'];
        const transactionalWords = ['comprar', 'preço', 'desconto', 'oferta', 'promoção'];
        
        const lowerKeyword = keyword.toLowerCase();
        
        if (informationalWords.some(word => lowerKeyword.includes(word))) {
            return 'informational';
        }
        if (transactionalWords.some(word => lowerKeyword.includes(word))) {
            return 'transactional';
        }
        if (commercialWords.some(word => lowerKeyword.includes(word))) {
            return 'commercial';
        }
        
        return 'informational'; // Default
    }
}

// Classe principal para geração de conteúdo
class ContentGenerator {
    constructor() {
        this.serpAnalyzer = new SERPAnalyzer();
        this.templates = {
            informational: {
                h1: ['Como {keyword}: Guia Completo 2024', 'Tudo sobre {keyword}: Guia Definitivo', '{keyword}: O que Você Precisa Saber'],
                h2: [
                    'O que é {keyword}?',
                    'Por que {keyword} é importante?',
                    'Como fazer {keyword} passo a passo',
                    'Benefícios de {keyword}',
                    'Erros comuns em {keyword}',
                    'Ferramentas para {keyword}',
                    'Exemplos práticos de {keyword}',
                    'Conclusão'
                ]
            },
            commercial: {
                h1: ['Melhor {keyword} 2024: Comparação Completa', '{keyword}: Qual Escolher? Guia de Compra', 'Top 10 {keyword} Mais Recomendados'],
                h2: [
                    'O que considerar ao escolher {keyword}',
                    'Melhores opções de {keyword}',
                    'Comparação de preços',
                    'Prós e contras',
                    'Onde comprar {keyword}',
                    'Avaliações de usuários',
                    'Nossa recomendação'
                ]
            },
            transactional: {
                h1: ['Comprar {keyword}: Melhores Ofertas 2024', '{keyword} com Desconto: Onde Encontrar', 'Promoções de {keyword}: Guia de Compras'],
                h2: [
                    'Melhores ofertas de {keyword}',
                    'Como economizar na compra',
                    'Onde comprar com segurança',
                    'Formas de pagamento',
                    'Garantia e suporte',
                    'Entrega e frete'
                ]
            }
        };
    }

    async generateH1(keyword, intent) {
        const templates = this.templates[intent]?.h1 || this.templates.informational.h1;
        const template = templates[Math.floor(Math.random() * templates.length)];
        return template.replace('{keyword}', keyword);
    }

    async generateH2Structure(keyword, intent) {
        const templates = this.templates[intent]?.h2 || this.templates.informational.h2;
        
        return templates.map((template, index) => ({
            title: template.replace('{keyword}', keyword),
            h3Subsections: this.generateH3Subsections(template.replace('{keyword}', keyword), keyword),
            wordCount: Math.floor(Math.random() * 300) + 200
        }));
    }

    generateH3Subsections(h2Title, keyword) {
        const subsectionTemplates = [
            'Definição e conceitos básicos',
            'Principais características',
            'Vantagens e benefícios',
            'Como implementar',
            'Exemplos práticos',
            'Dicas importantes',
            'Erros a evitar',
            'Ferramentas recomendadas'
        ];
        
        const numSubsections = Math.floor(Math.random() * 3) + 2; // 2-4 subsections
        const shuffled = subsectionTemplates.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numSubsections);
    }

    async generateFAQ(keyword, intent) {
        const faqTemplates = {
            informational: [
                { q: 'O que é {keyword}?', a: 'Explicação detalhada sobre {keyword} e sua importância.' },
                { q: 'Como começar com {keyword}?', a: 'Passos iniciais para implementar {keyword} com sucesso.' },
                { q: 'Quais são os benefícios de {keyword}?', a: 'Principais vantagens e benefícios de utilizar {keyword}.' },
                { q: 'Quanto tempo leva para ver resultados com {keyword}?', a: 'Cronograma típico para obter resultados com {keyword}.' },
                { q: 'Quais ferramentas são necessárias para {keyword}?', a: 'Lista das principais ferramentas recomendadas para {keyword}.' }
            ],
            commercial: [
                { q: 'Qual é o melhor {keyword}?', a: 'Análise das melhores opções de {keyword} disponíveis no mercado.' },
                { q: 'Quanto custa {keyword}?', a: 'Faixa de preços e fatores que influenciam o custo de {keyword}.' },
                { q: 'Vale a pena investir em {keyword}?', a: 'Análise do retorno sobre investimento em {keyword}.' },
                { q: 'Como escolher o {keyword} ideal?', a: 'Critérios importantes para selecionar o melhor {keyword}.' }
            ],
            transactional: [
                { q: 'Onde comprar {keyword}?', a: 'Melhores locais e plataformas para adquirir {keyword}.' },
                { q: 'Como pagar por {keyword}?', a: 'Opções de pagamento disponíveis para {keyword}.' },
                { q: 'Há garantia para {keyword}?', a: 'Informações sobre garantia e suporte para {keyword}.' },
                { q: 'Qual o prazo de entrega de {keyword}?', a: 'Tempo médio de entrega e opções de frete para {keyword}.' }
            ]
        };
        
        const templates = faqTemplates[intent] || faqTemplates.informational;
        const selectedFAQs = templates.slice(0, 5).map((faq, index) => ({
            question: faq.q.replace('{keyword}', keyword),
            answer: faq.a.replace('{keyword}', keyword),
            priority: index + 1
        }));
        
        return selectedFAQs;
    }

    async generateMediaSuggestions(keyword, intent) {
        const suggestions = [
            {
                type: 'image',
                description: `Infográfico explicativo sobre ${keyword}`,
                placement: 'Após a introdução',
                alt: `Infográfico sobre ${keyword}`
            },
            {
                type: 'video',
                description: `Vídeo tutorial demonstrando ${keyword}`,
                placement: 'Seção de como fazer',
                alt: `Vídeo tutorial de ${keyword}`
            },
            {
                type: 'image',
                description: `Gráfico com estatísticas de ${keyword}`,
                placement: 'Seção de benefícios',
                alt: `Estatísticas sobre ${keyword}`
            },
            {
                type: 'infographic',
                description: `Checklist visual para ${keyword}`,
                placement: 'Antes da conclusão',
                alt: `Checklist de ${keyword}`
            }
        ];
        
        return suggestions.slice(0, 3); // Retorna 3 sugestões
    }
}

// Classe para controle da interface
class UIController {
    constructor() {
        this.limitManager = new LimitManager();
        this.contentGenerator = new ContentGenerator();
        this.currentStructure = null;
        this.initializeEventListeners();
        this.limitManager.updateUsageDisplay();
    }

    initializeEventListeners() {
        const generateBtn = document.getElementById('generate-btn');
        const keywordInput = document.getElementById('keyword-input');
        const premiumBtn = document.getElementById('premium-btn');
        const exportJsonBtn = document.getElementById('export-json');
        const exportMarkdownBtn = document.getElementById('export-markdown');

        generateBtn?.addEventListener('click', () => this.handleKeywordSubmit());
        keywordInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleKeywordSubmit();
        });
        premiumBtn?.addEventListener('click', () => this.showPremiumUpgrade());
        exportJsonBtn?.addEventListener('click', () => this.exportStructure('json'));
        exportMarkdownBtn?.addEventListener('click', () => this.exportStructure('markdown'));
    }

    async handleKeywordSubmit() {
        const keywordInput = document.getElementById('keyword-input');
        const intentSelect = document.getElementById('intent-select');
        const keyword = keywordInput?.value.trim();
        
        if (!keyword) {
            this.showError('Por favor, insira uma palavra-chave');
            return;
        }

        if (!this.limitManager.checkDailyLimit()) {
            document.getElementById('limit-modal').showModal();
            return;
        }

        const intent = intentSelect?.value || 'informational';
        
        try {
            this.showLoading(true);
            await this.generateContentStructure(keyword, intent);
            this.limitManager.incrementUsage();
        } catch (error) {
            this.showError('Erro ao gerar estrutura. Tente novamente.');
            console.error('Error generating content:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async generateContentStructure(keyword, intent) {
        // Análise SERP
        const serpData = await this.contentGenerator.serpAnalyzer.analyzeSERP(keyword);
        this.displayKeywordAnalysis(serpData);

        // Geração de estrutura
        const h1 = await this.contentGenerator.generateH1(keyword, intent);
        const h2Structure = await this.contentGenerator.generateH2Structure(keyword, intent);
        const faq = await this.contentGenerator.generateFAQ(keyword, intent);
        const mediaSuggestions = await this.contentGenerator.generateMediaSuggestions(keyword, intent);

        this.currentStructure = {
            keyword,
            intent,
            h1,
            h2Sections: h2Structure,
            faq,
            mediaSuggestions,
            serpData
        };

        this.displayContentStructure(this.currentStructure);
        this.showResults();
    }

    displayKeywordAnalysis(data) {
        document.getElementById('difficulty-score').textContent = data.difficulty;
        document.getElementById('search-volume').textContent = data.volume.toLocaleString();
        document.getElementById('competition-level').textContent = data.competition;
    }

    displayContentStructure(structure) {
        // H1
        document.getElementById('generated-h1').textContent = structure.h1;

        // H2/H3 Structure
        const h2Container = document.getElementById('h2-structure');
        h2Container.innerHTML = '';

        structure.h2Sections.forEach((section, index) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'h2-section fade-in-up';
            sectionDiv.style.animationDelay = `${index * 0.1}s`;
            
            sectionDiv.innerHTML = `
                <div class="mb-2">
                    <div class="badge badge-secondary mb-1">H2</div>
                    <h2 class="text-xl font-semibold">${section.title}</h2>
                    <div class="text-sm text-base-content/70">~${section.wordCount} palavras</div>
                </div>
                <div class="ml-4 space-y-1">
                    ${section.h3Subsections.map(h3 => `
                        <div class="h3-subsection">
                            <div class="badge badge-accent badge-sm mr-2">H3</div>
                            <span class="text-base">${h3}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            
            h2Container.appendChild(sectionDiv);
        });

        // FAQ
        this.displayFAQ(structure.faq);

        // Media Suggestions
        this.displayMediaSuggestions(structure.mediaSuggestions);
    }

    displayFAQ(faqItems) {
        const faqContainer = document.getElementById('faq-container');
        faqContainer.innerHTML = '';

        faqItems.forEach((item, index) => {
            const faqDiv = document.createElement('div');
            faqDiv.className = 'collapse collapse-arrow bg-base-200 faq-item';
            faqDiv.style.animationDelay = `${index * 0.1}s`;
            
            faqDiv.innerHTML = `
                <input type="radio" name="faq-accordion" />
                <div class="collapse-title text-lg font-medium">
                    ${item.question}
                </div>
                <div class="collapse-content">
                    <p>${item.answer}</p>
                </div>
            `;
            
            faqContainer.appendChild(faqDiv);
        });
    }

    displayMediaSuggestions(suggestions) {
        const mediaContainer = document.getElementById('media-suggestions');
        mediaContainer.innerHTML = '';

        suggestions.forEach((suggestion, index) => {
            const mediaDiv = document.createElement('div');
            mediaDiv.className = 'card bg-base-200 shadow-sm media-card';
            mediaDiv.style.animationDelay = `${index * 0.1}s`;
            
            const iconMap = {
                'image': '🖼️',
                'video': '🎥',
                'infographic': '📊'
            };
            
            mediaDiv.innerHTML = `
                <div class="card-body">
                    <div class="text-3xl mb-2">${iconMap[suggestion.type]}</div>
                    <h3 class="card-title text-sm">${suggestion.type.toUpperCase()}</h3>
                    <p class="text-sm">${suggestion.description}</p>
                    <div class="badge badge-outline badge-sm">${suggestion.placement}</div>
                </div>
            `;
            
            mediaContainer.appendChild(mediaDiv);
        });
    }

    showResults() {
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.classList.remove('hidden');
        resultsContainer.classList.add('fade-in-up');
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const generateBtn = document.getElementById('generate-btn');
        
        if (show) {
            loading?.classList.remove('hidden');
            generateBtn?.setAttribute('disabled', 'true');
        } else {
            loading?.classList.add('hidden');
            generateBtn?.removeAttribute('disabled');
        }
    }

    showError(message) {
        // Criar toast de erro
        const toast = document.createElement('div');
        toast.className = 'toast toast-top toast-end';
        toast.innerHTML = `
            <div class="alert alert-error">
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    showPremiumUpgrade() {
        document.getElementById('premium-modal').showModal();
    }

    exportStructure(format) {
        if (!this.currentStructure) {
            this.showError('Nenhuma estrutura para exportar');
            return;
        }

        let content = '';
        const structure = this.currentStructure;

        if (format === 'json') {
            content = JSON.stringify(structure, null, 2);
            this.downloadFile(content, `estrutura-${structure.keyword}.json`, 'application/json');
        } else if (format === 'markdown') {
            content = this.generateMarkdown(structure);
            this.downloadFile(content, `estrutura-${structure.keyword}.md`, 'text/markdown');
        }
    }

    generateMarkdown(structure) {
        let markdown = `# ${structure.h1}\n\n`;
        
        markdown += `## Análise da Palavra-chave: ${structure.keyword}\n\n`;
        markdown += `- **Dificuldade**: ${structure.serpData.difficulty}/100\n`;
        markdown += `- **Volume de Busca**: ${structure.serpData.volume.toLocaleString()}\n`;
        markdown += `- **Competição**: ${structure.serpData.competition}\n`;
        markdown += `- **Intenção**: ${structure.intent}\n\n`;
        
        markdown += `## Estrutura de Conteúdo\n\n`;
        
        structure.h2Sections.forEach(section => {
            markdown += `## ${section.title}\n`;
            markdown += `*Aproximadamente ${section.wordCount} palavras*\n\n`;
            
            section.h3Subsections.forEach(h3 => {
                markdown += `### ${h3}\n\n`;
            });
        });
        
        markdown += `## FAQ\n\n`;
        structure.faq.forEach(item => {
            markdown += `**${item.question}**\n\n`;
            markdown += `${item.answer}\n\n`;
        });
        
        markdown += `## Sugestões de Mídia\n\n`;
        structure.mediaSuggestions.forEach(media => {
            markdown += `- **${media.type.toUpperCase()}**: ${media.description}\n`;
            markdown += `  - Posicionamento: ${media.placement}\n\n`;
        });
        
        return markdown;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    new UIController();
});

// Exportar classes para uso em módulos
export { ContentGenerator, LimitManager, SERPAnalyzer, UIController };