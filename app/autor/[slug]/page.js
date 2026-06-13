import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleCard from '../../../components/ArticleCard';
import {
  getAuthorBySlug,
  getArticlesByAuthorId,
} from '../../../lib/queries';
import { initials } from '../../../lib/format';

// Autor = ISR (dados de persona mudam pouco).
export const revalidate = 300;

export async function generateMetadata({ params }) {
  const author = await getAuthorBySlug(params.slug);
  if (!author) return { title: 'Autor nao encontrado' };
  return {
    title: `${author.name} — ${author.role}`,
    description: author.bio ? author.bio.slice(0, 155) : author.role,
    alternates: { canonical: `/autor/${author.slug}` },
  };
}

export default async function AuthorPage({ params }) {
  const author = await getAuthorBySlug(params.slug);
  if (!author) notFound();

  const articles = await getArticlesByAuthorId(author.id, 20);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.role,
    description: author.bio || undefined,
  };

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Trilha de navegacao">
        <Link href="/">Inicio</Link> / <span>{author.name}</span>
      </nav>

      <header className="page-header">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span className="avatar lg" aria-hidden="true">
            {initials(author.name)}
          </span>
          <div>
            <h1 style={{ marginBottom: '0.2rem' }}>{author.name}</h1>
            <p style={{ color: 'var(--primary)', fontWeight: 600 }}>
              {author.role}
            </p>
          </div>
        </div>
        {author.bio ? (
          <p style={{ marginTop: '1rem', maxWidth: '70ch' }}>{author.bio}</p>
        ) : null}
      </header>

      <div className="section-head" style={{ marginTop: '1rem' }}>
        <h2>Artigos de {author.name.split(' ')[0]}</h2>
      </div>

      {articles.length ? (
        <div className="grid">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      ) : (
        <div className="empty-state">Nenhum artigo publicado ainda.</div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
