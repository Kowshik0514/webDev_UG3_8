// src/homepage/news.js

const newsContainer = document.getElementById('news-container');
let currentPage = 0;
const pageSize = 4;

async function fetchNews() {
    try {
        const rssUrl = 'https://news.google.com/rss/search?q=natural+disaster';
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        
        if (!response.ok) throw new Error('Failed to fetch news');
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            // Display a slice of the data, corresponding to the current page
            displayNews(data.items.slice(currentPage * pageSize, (currentPage + 1) * pageSize));
            currentPage++;
        } else {
            // If there are no articles or we reach the end
            const loadMoreButton = document.querySelector('.load-more');
            if (loadMoreButton) {
                loadMoreButton.disabled = true;
                loadMoreButton.textContent = 'No more news';
            }
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = '<p>Failed to load news.</p>';
    }
}

function displayNews(articles) {
    articles.forEach(article => {
        const newsCard = document.createElement('div');
        newsCard.classList.add('news-card');
        
        let imageUrl = '';
        if (article.enclosure) {
            imageUrl = article.enclosure.link;
        } else if (article['media:content']) {
            imageUrl = article['media:content'].url;
        } else if (article.description) {
            const match = article.description.match(/<img[^>]+src="([^">]+)"/);
            if (match && match[1]) {
                imageUrl = match[1];
            }
        }

        newsCard.innerHTML = `
            <div class="news-card-content">
                ${imageUrl ? `<img src="${imageUrl}" alt="News Image" class="news-image" />` : ''}
                <div class="text-content">
                    <h3>${article.title}</h3>
                    <hr>
                    <p>${article.description || 'No description available.'}</p>
                    <a href="${article.link}" target="_blank">Read more</a>
                </div>
            </div>
        `;
        
        newsContainer.appendChild(newsCard);
    });
}

// Add infinite scroll behavior (user scrolls to the bottom)
const newsContainerElement = document.getElementById('news-container');
newsContainerElement.addEventListener('scroll', () => {
    const scrollTop = newsContainerElement.scrollTop;
    const scrollHeight = newsContainerElement.scrollHeight;
    const clientHeight = newsContainerElement.clientHeight;

    // If user reaches near the bottom, load more news
    if (scrollTop + clientHeight >= scrollHeight - 10) {
        fetchNews();
    }
});

// Initialize first set of articles
fetchNews();
