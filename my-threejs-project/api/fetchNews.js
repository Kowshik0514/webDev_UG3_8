// api/fetchNews.js

import fetch from 'node-fetch';

export default async (req, res) => {
    const rssUrl = 'https://news.google.com/rss/search?q=natural+disaster';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch news');
        
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to load news' });
    }
};
