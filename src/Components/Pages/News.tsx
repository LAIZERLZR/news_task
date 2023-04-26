import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../News/News.css';

interface NewsItem {
  id: number;
  title: string;
  by: string;
  time: number;
  descendants: number;
  url: string;
  text: string;
  kids: number[];
}

interface CommentItem {
  id: number;
  user: string;
  content: string;
}

const News = () => {
  const { id } = useParams<{ id: string }>();
  const [newsDetail, setNewsDetail] = useState<NewsItem | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);

  const fetchNewsDetail = async () => {
    const response = await axios.get<NewsItem>(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
    );
    const data = response.data;
    setNewsDetail(data);
  };

  const fetchComments = async () => {
    if (newsDetail && newsDetail.kids) {
      const res = await Promise.all(
        newsDetail.kids.map(async (kid: number) => {
          const commentResponse = await fetch(`https://api.hnpwa.com/v0/item/${kid}.json`);
          return commentResponse.json();
        }),
      );
      setComments(res);
    }
  };

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [newsDetail]);

  if (!newsDetail) {
    return <div>Loading...</div>;
  }

  const parseHtmlToString = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <div className="news-detail">
      <div className="news-detail__header">
        <h1 className="news-detail__title">{newsDetail.title}</h1>
        <p className="news-detail__meta">
          by {newsDetail.by} | {new Date(newsDetail.time * 1000).toLocaleString()} |{' '}
          {newsDetail.descendants} Комментариев
        </p>
        {newsDetail.url && (
          <p className="news-detail__url">
            URL: <a href={newsDetail.url}>{newsDetail.url}</a>
          </p>
        )}
      </div>
      {newsDetail.text && (
        <div className="news-detail__text">
          <h2>Text:</h2>
          <p>{newsDetail.text}</p>
        </div>
      )}
      {comments.length !== 0 ? (
        <div>
          <h5>Комментарии:</h5>
          <ul>
            {comments.map((comment: CommentItem) => (
              <li key={comment.id}>
                <p>
                  {comment.user}: {parseHtmlToString(comment.content)}
                  <br />
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Комментарии отсутствуют</p>
      )}
      <button className="news-detail__back-link">
        <Link to="/">На главную</Link>
      </button>
    </div>
  );
};

export default News;
