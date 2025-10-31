/**
 * @file helpers/handlebars.js
 * @description Define e exporta todos os helpers customizados para o Express-Handlebars.
 * Estes helpers adicionam lógica complexa (matemática, formatação de data, paginação)
 * que não está disponível no Handlebars por padrão.
 */

// --- Type Definitions for JSDoc (para autocomplete do VS Code) ---

/**
 * @typedef {object} PaginationPage
 * @property {number | string} page - O número da página (ou '...').
 * @property {string} [url] - A URL completa para esta página.
 * @property {boolean} isCurrent - Verdadeiro se esta for a página atual.
 * @property {boolean} isEllipsis - Verdadeiro se este item for um '...'.
 */

/**
 * @typedef {object} PaginationContext
 * @property {string} [prevUrl] - A URL para a página anterior, se existir.
 * @property {string} [nextUrl] - A URL para a página seguinte, se existir.
 * @property {Array<PaginationPage>} pages - A lista de objetos de página para renderizar.
 */

// --- Funções Privadas ---

/**
 * Função utilitária (privada) para construir a URL de paginação.
 * @param {number} page - O número da página alvo.
 * @param {string} [search] - O termo de busca atual (opcional).
 * @param {string} [order] - A ordem atual (opcional, 'new' ou 'old').
 * @returns {string} A URL de query string completa (ex: "?page=3&search=node").
 */
function buildPaginationUrl(page, search, order) {
    let url = `?page=${page}`;
    
    // encodeURIComponent garante que buscas com espaços (ex: "node js")
    // sejam convertidas corretamente na URL (ex: "node%20js")
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    if (order) {
        url += `&order=${order}`;
    }
    return url;
}

// --- Exportação dos Helpers ---

/**
 * Exporta um objeto contendo todos os helpers que o Handlebars irá usar.
 */
module.exports = {
    /**
     * Helpers de comparação e matemática simples
     */
    gt: function (a, b) { return a > b; },
    lt: function (a, b) { return a < b; },
    add: function (a, b) { return a + b; },
    subtract: function (a, b) { return a - b; },

    /**
     * Formata uma data do Sequelize (Date object ou string) para o formato DD/MM/AAAA.
     * @param {Date | string} date - O objeto de data (ex: createdAt).
     * @returns {string} A data formatada (ex: "31/10/2025").
     */
    formatDate: function(date) {
        if (!date) return ''; // Garante que não quebra se a data for nula
        
        const d = new Date(date);
        
        // getDate() retorna o dia (1-31)
        let day = d.getDate();
        
        // getMonth() retorna o mês (0-11), por isso somamos 1
        let month = d.getMonth() + 1; 
        
        // getFullYear() retorna AAAA
        const year = d.getFullYear();

        // Adiciona um zero à esquerda se for menor que 10
        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;

        return `${day}/${month}/${year}`;
    },

    /**
     * Helper de bloco para renderizar a paginação completa.
     * @param {object} options - O objeto de opções do Handlebars.
     * @param {object} options.hash - Os parâmetros passados (totalPages, currentPage, search, currentOrder).
     * @returns {string} O HTML renderizado pelo bloco (options.fn), populado com o PaginationContext.
     */
    pagination: function(options) {
        // 1. Obter os dados passados do template
        const { search, currentOrder } = options.hash;

        // ⚠️ FIX: Converter 'string' para 'number'
        // Handlebars passa todos os atributos como string.
        // Sem parseInt, (currentPage + 1) torna-se "1" + 1 = "11".
        const currentPage = parseInt(options.hash.currentPage, 10) || 1;
        const totalPages = parseInt(options.hash.totalPages, 10) || 1;

        // 2. Definir o "contexto" - os dados que vamos devolver ao template
        /** @type {PaginationContext} */
        const context = {};
        const pages = [];
        
        // 3. Lógica do link "Anterior"
        if (currentPage > 1) {
            context.prevUrl = buildPaginationUrl(currentPage - 1, search, currentOrder);
        }

        // 4. Lógica do link "Próximo"
        if (currentPage < totalPages) {
            context.nextUrl = buildPaginationUrl(currentPage + 1, search, currentOrder);
        }

        // 5. Lógica para gerar a lista de números [1, 2, '...', 10]
        const window = 2; // Define quantas páginas mostrar antes/depois da atual
        
        for (let i = 1; i <= totalPages; i++) {
            // Condição para mostrar a página:
            // 1. É a primeira página (i === 1)
            // 2. É a última página (i === totalPages)
            // 3. Está "dentro da janela" da página atual
            if (i === 1 || i === totalPages || (i >= currentPage - window && i <= currentPage + window)) {
                pages.push({
                    page: i,
                    url: buildPaginationUrl(i, search, currentOrder),
                    isCurrent: i === currentPage,
                    isEllipsis: false
                });
            } 
            // Se estiver fora da janela, adiciona "..." (apenas uma vez)
            else if (pages.length > 0 && pages[pages.length - 1].isEllipsis === false) {
                pages.push({ page: '...', isEllipsis: true });
            }
        }
        
        // 6. Passar a lista de páginas para o template
        context.pages = pages;

        // 7. Renderizar o bloco de HTML (options.fn) usando o novo contexto
        return options.fn(context);
    }
};