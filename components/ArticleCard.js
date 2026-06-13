import Link from 'next/link';
import { formatDatePtBR, initials } from '../lib/format';

export default function ArticleCard({ article }) {
  const author = article.primary_author;
  return (
    <article className="card">
      {article.category ? (
        <span className="kicker">{article.subcategory || article.category}</span>
      ) : null}
      <h3>
        <Link href={`/artigo/${article.slug}`}>{article.title}</Link>
      </h3>
      {article.excerpt ? <p className="excerpt">{article.excerpt}</p> : null}
      <div className="meta">
        {author ? (
          <span className="avatar" aria-hidden="true">
            {initials(author.name)}
          </span>
        ) : null}
        <span className="who">
          {author ? <strong>{author.name}</strong> : null}
          <span>
            <time dateTime={article.published_at}>
              {formatDatePtBR(article.published_at)}
            </time>
          </span>
        </span>
      </div>
    </article>
  );
}
