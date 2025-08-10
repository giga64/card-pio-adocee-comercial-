document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. CONFIGURAÇÃO DO SUPABASE ---
    const SUPABASE_URL = 'https://buhifbezqiafnzwosaqh.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1aGlmYmV6cWlhZm56d29zYXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3ODA4NTgsImV4cCI6MjA3MDM1Njg1OH0.ckZLSvQJRXYh231XurasFBn5KN59jBzEPzoFDmf4Dtc';

    const { createClient } = supabase;
    const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- 2. ESTADO DA APLICAÇÃO ---
    let allProducts = [];
    let allCategories = [];
    
    // --- 3. FUNÇÃO PRINCIPAL ---
    async function initializeApp() {
        await fetchData();
        renderCategories();
        renderMenu(); // Renderiza o menu inicial com "Todos"
        setupEventListeners();
    }

    // --- 4. FUNÇÕES DE BUSCA E RENDERIZAÇÃO ---
    async function fetchData() {
        const menuContainer = document.getElementById('menuContent');
        if(menuContainer) menuContainer.innerHTML = '<div class="loading-placeholder"><p>Carregando cardápio...</p></div>';

        const { data: categoriesData, error: catError } = await _supabase
            .from('categories')
            .select('*')
            .order('order_index');

        const { data: productsData, error: prodError } = await _supabase
            .from('products')
            .select('*');

        if (catError || prodError) {
            console.error('Erro ao buscar dados:', catError || prodError);
            if(menuContainer) menuContainer.innerHTML = '<div class="loading-placeholder"><p>Erro ao carregar o cardápio. Tente recarregar a página.</p></div>';
            return;
        }
        allCategories = categoriesData;
        allProducts = productsData;
    }

    function renderCategories() {
        const desktopContainer = document.getElementById('filterContainerDesktop');
        if (!desktopContainer) return;

        desktopContainer.innerHTML = ''; 

        const happyHourCategory = allCategories.find(c => c.name.toLowerCase() === 'happy hour' && c.parent_id === null);
        if (happyHourCategory) {
            const button = document.createElement('button');
            button.className = 'filter-btn happy-hour-special';
            button.textContent = happyHourCategory.name;
            button.dataset.categoryId = happyHourCategory.id;
            desktopContainer.appendChild(button);
        }

        const allButton = document.createElement('button');
        allButton.className = 'filter-btn active';
        allButton.textContent = 'Todos';
        allButton.dataset.categoryId = 'all';
        desktopContainer.appendChild(allButton);

        allCategories.forEach(category => {
            if (category.parent_id === null && category.name.toLowerCase() !== 'happy hour') {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                button.textContent = category.name;
                button.dataset.categoryId = category.id;
                desktopContainer.appendChild(button);
            }
        });
    }
    
    function renderMenu(searchTerm = '', categoryId = 'all') {
        const container = document.getElementById('menuContent');
        if (!container) return;
        container.innerHTML = '';

        const filteredProducts = allProducts.filter(product => {
            const productCategory = allCategories.find(c => c.id === product.category_id);
            if (!productCategory) return false;
            const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());
            if (categoryId === 'all') return matchesSearch;
            const matchesCategory = product.category_id == categoryId || productCategory.parent_id == categoryId;
            return matchesCategory && matchesSearch;
        });

        let categoriesToRender;
        if (categoryId === 'all') {
            let parentCategories = allCategories.filter(c => c.parent_id === null);
            const happyHourCat = parentCategories.find(c => c.name.toLowerCase() === 'happy hour');
            if (happyHourCat) {
                parentCategories = parentCategories.filter(c => c.id !== happyHourCat.id);
                parentCategories.push(happyHourCat);
            }
            categoriesToRender = parentCategories;
        } else {
            categoriesToRender = allCategories.filter(c => c.id == categoryId);
        }

        categoriesToRender.forEach(category => {
            const subCategories = allCategories.filter(sc => sc.parent_id === category.id);
            const productsInCategory = filteredProducts.filter(p => {
                const pCat = allCategories.find(c => c.id === p.category_id);
                return p.category_id === category.id || (pCat && pCat.parent_id === category.id);
            });

            if (productsInCategory.length > 0) {
                const section = document.createElement('div');
                section.className = 'menu-section';
                let itemsHTML = '';

                if (category.name.toLowerCase() === 'happy hour') {
                    section.classList.add('happy-hour-section-special');
                    section.innerHTML = `
                        <div class="happy-hour-info">
                            <div class="happy-hour-header">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                <h3>Horários do Happy Hour</h3>
                            </div>
                            <div class="happy-hour-schedule">
                                <div class="schedule-item"><span class="day">Quartas e Quintas:</span><span class="time">17h às 21h</span></div>
                                <div class="schedule-item"><span class="day">Sextas:</span><span class="time">17h às 19h</span></div>
                                <div class="schedule-item"><span class="day">Sábados:</span><span class="time">15h às 19h</span></div>
                            </div>
                            <p class="disclaimer">*Exceto vésperas de feriados e feriados. Não aceitamos vale alimentação no Happy Hour.</p>
                        </div>
                    `;
                }
                
                section.innerHTML += `<h2>${category.name}</h2>`;

                if (subCategories.length > 0) {
                    subCategories.forEach(sc => {
                        const productsInSubCategory = filteredProducts.filter(p => p.category_id === sc.id);
                        if (productsInSubCategory.length > 0) {
                            itemsHTML += `<h3 class="submenu-section-title">${sc.name}</h3>`;
                            productsInSubCategory.forEach(product => {
                                itemsHTML += generateProductHTML(product);
                            });
                        }
                    });
                } else {
                    productsInCategory.forEach(product => {
                        itemsHTML += generateProductHTML(product);
                    });
                }

                const itemsGrid = document.createElement('div');
                itemsGrid.className = 'items-grid';
                itemsGrid.innerHTML = itemsHTML;
                section.appendChild(itemsGrid);

                container.appendChild(section);
            }
        });
    }

    // NOVA FUNÇÃO PARA GERAR O HTML DO ITEM
    function generateProductHTML(product) {
        const priceText = product.price_details || `R$ ${product.price.toFixed(2).replace('.', ',')}`;
        const descriptionHTML = product.description ? `<p class="item-description">${product.description}</p>` : '';
        const imageHTML = product.image_url 
            ? `<img src="${product.image_url}" alt="${product.name}" class="item-image-list">` 
            : `<div class="image-placeholder-list"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79a9 9 0 1 1-8.51-10.63"/><path d="M14.31 2.16 21 8.84l-6.69 6.69a2.82 2.82 0 0 1-4 0L2.16 9.31a2.82 2.82 0 0 1 0-4l6.69-6.69a2.82 2.82 0 0 1 4 0Z"/><path d="m11.31 5.84.39-.39"/><path d="m5.84 11.31.39-.39"/><path d_ignored="m16.16 8 .39-.39"/><path d_ignored="m8 16.16.39-.39"/></svg></div>`;

        return `
            <div class="menu-item">
                <div class="item-image-wrapper">${imageHTML}</div>
                <div class="item-details">
                    <h4 class="item-name">${product.name}</h4>
                    ${descriptionHTML}
                    <div class="price">${priceText}</div>
                </div>
            </div>
        `;
    }
    
    // --- 5. FUNÇÕES DE EVENTOS ---
    function setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const desktopContainer = document.getElementById('filterContainerDesktop');
        let currentCategoryId = 'all';

        if(searchInput) {
            searchInput.addEventListener('input', (e) => {
                renderMenu(e.target.value, currentCategoryId);
            });
        }

        if(desktopContainer) {
            desktopContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    currentCategoryId = e.target.dataset.categoryId; 
                    const currentActive = desktopContainer.querySelector('.active');
                    if (currentActive) currentActive.classList.remove('active');
                    e.target.classList.add('active');
                    renderMenu(searchInput.value, currentCategoryId);
                }
            });
        }
    }

    initializeApp();
});