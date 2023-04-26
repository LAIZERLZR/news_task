import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface NewsItem {
  id: number;
  title: string;
  score: number;
  by: string;
  time: number;
}

const NewsList: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [news, setNews] = React.useState<NewsItem[]>([]);

  const fetchNews = async () => {
    setIsLoading(true);

    const response = await axios.get<number[]>(
      'https://hacker-news.firebaseio.com/v0/newstories.json',
    );
    const data = response.data;

    const news = await Promise.all(
      data.slice(0, 100).map(async (id: number) => {
        const newsResponse = await axios.get<NewsItem>(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
        );
        return newsResponse.data;
      }),
    );

    setNews(news);
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchNews();
    const intervalId = setInterval(fetchNews, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="news-list">
      {isLoading ? (
        <div className="news-list__loading">Loading...</div>
      ) : (
        <>
          <button className="news-list__refresh-button" onClick={() => window.location.reload()}>
            Обновить
          </button>
          <ul className="news-list__list">
            {news.map((newsItem: NewsItem) => (
              <li key={newsItem.id} className="news-list__item">
                <div className="news-list__block">
                  <Link to={`/news/${newsItem.id}`} className="news-list__link">
                    <h2 className="news-list__title">{newsItem.title}</h2>
                  </Link>
                  <div className="news-list__meta">
                    <span className="news-list__score">{newsItem.score} points</span> by{' '}
                    <span className="news-list__user">{newsItem.by}</span> |{' '}
                    <span className="news-list__time">
                      {new Date(newsItem.time * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default NewsList;
