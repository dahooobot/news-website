// ========================================
// 韋恩報報 - 新聞載入腳本
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    loadNews();
});

async function loadNews() {
    const newsGrid = document.getElementById('newsGrid');
    const updateTime = document.getElementById('updateTime');
    
    try {
        const response = await fetch('data/news.json');
        
        if (!response.ok) {
            throw new Error('無法載入新聞');
        }
        
        const data = await response.json();
        
        // 更新時間
        if (data.lastUpdated) {
            const date = new Date(data.lastUpdated);
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            updateTime.textContent = `更新時間：${date.toLocaleDateString('zh-TW', options)}`;
        }
        
        // 清空舊內容
        newsGrid.innerHTML = '';
        
        // 渲染新聞
        if (data.articles && data.articles.length > 0) {
            data.articles.forEach((article, index) => {
                const card = createNewsCard(article, index + 1);
                newsGrid.appendChild(card);
            });
        } else {
            newsGrid.innerHTML = '<p class="loading">目前沒有新聞</p>';
        }
        
    } catch (error) {
        console.error('Error loading news:', error);
        newsGrid.innerHTML = `<p class="error">載入新聞時發生錯誤，請稍後再試</p>`;
    }
}

function createNewsCard(article, number) {
    const card = document.createElement('article');
    card.className = 'news-card';
    
    const formattedDate = article.date || '';
    const title = article.title || '';
    const summary = article.summary || '';
    const source = article.source || '';
    const sourceUrl = article.sourceUrl || '#';
    
    card.innerHTML = `
        <div class="news-meta">
            <span class="news-date">${formattedDate}</span>
        </div>
        <h3 class="news-title">${title}</h3>
        <div class="news-summary">
            ${summary.split('\n').map(line => `<p style="margin-bottom: 12px;">${line}</p>`).join('')}
        </div>
        <div class="news-source">
            <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">新聞來源</a>
        </div>
    `;
    
    return card;
}
