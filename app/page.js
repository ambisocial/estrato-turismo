import Link from 'next/link';
import ArticleCard from '../components/ArticleCard';
import { getLatestArticles } from '../lib/queries';
import { formatDatePtBR, initials } from '../lib/format';

// Home = SSR (Secao 12.3): Googlebot precisa ver artigos recentes.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const articles = await getLatestArticles(13);

  if (!articles.length) {
    return (
      <div className="container">
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          Nenhum artigo publicado ainda. Volte em breve.
        </div>
      </div>
    );
  }

  const [lead, ...rest] = articles;
  const leadAuthor = lead.primary_author;

  return (
    <div className="container">
      <section className="hero" aria-label="Destaque">
        <article className="hero-lead">
          <span className="kicker">{lead.subcategory || lead.category}</span>
          <h2>
            <Link href={`/artigo/${lead.slug}`} style={{ color: 'inherit' }}>
              {lead.title}
            </Link>
          </h2>
          {lead.excerpt ? <p>{lead.excerpt}</p> : null}
          <div className="meta">
            {leadAuthor ? (
              <span className="avatar" aria-hidden="true">
                {initials(leadAuthor.name)}
              </span>
            ) : null}
            <span className="who">
              {leadAuthor ? <strong>{leadAuthor.name}</strong> : null}
              <time dateTime={lead.published_at}>
                {formatDatePtBR(lead.published_at)}
              </time>
            </span>
          </div>
        </article>

        <aside aria-label="Mais recentes">
          <div className="section-head" style={{ marginTop: 0 }}>
            <h2>Mais recentes</h2>
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {rest.slice(0, 4).map((a) => (
              <li
                key={a.id}
                style={{
                  borderBottom: '1px solid var(--border)',
                  padding: '0.75rem 0',
                }}
              >
                <Link
                  href={`/artigo/${a.slug}`}
                  style={{ color: 'var(--foreground)', fontWeight: 600 }}
                >
                  {a.title}
                </Link>
                <div
                  className="meta"
                  style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}
                >
                  {formatDatePtBR(a.published_at)}
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <div className="section-head">
        <h2>Ultimas noticias</h2>
      </div>
      <div className="grid">
        {rest.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}
