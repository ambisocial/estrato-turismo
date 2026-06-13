import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getConfig } from '../../../lib/queries';
import { formatDatePtBR, isoDate, initials, sanitizeHtml } from '../../../lib/format';

// Artigo = ISR 60s (Secao 12.3).
export const revalidate = 60;

async function categorySlugFor(name) {
  // articles.category stores the NAME; find its slug for breadcrumb links.
  try {
    const sb = (await import('../../../lib/supabase')).getSupabase();
    const { data } = await sb
      .from('categories')
      .select('slug')
      .eq('name', name)
      .maybeSingle();
    return data ? data.slug : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: 'Artigo nao encontrado' };
  const description =
    article.excerpt || (article.content_text || '').slice(0, 155);
  return {
    title: article.title,
    description,
    alternates: {
      // Spec PROMPT 4: injetar canonical_url (fonte original) como rel=canonical.
      canonical: article.canonical_url || `/artigo/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description,
      type: 'article',
      publishedTime: isoDate(article.published_at),
      modifiedTime: isoDate(article.updated_at),
      authors: article.primary_author ? [article.primary_author.name] : undefined,
    },
  };
}

export default async function ArticlePage({ params }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const [config, catSlug] = await Promise.all([
    getConfig(),
    categorySlugFor(article.category),
  ]);
  const portalName = config.portal_name || 'Estrato Turismo';
  const author = article.primary_author;
  const reviewer = article.reviewer;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt || undefined,
    datePublished: isoDate(article.published_at),
    dateModified: isoDate(article.updated_at) || isoDate(article.published_at),
    articleSection: article.category || undefined,
    inLanguage: 'pt-BR',
    author: author
      ? { '@type': 'Person', name: author.name, jobTitle: author.role }
      : undefined,
    publisher: { '@type': 'Organization', name: portalName },
    mainEntityOfPage: article.canonical_url || undefined,
  };

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Trilha de navegacao">
        <Link href="/">Inicio</Link>
        {article.category ? (
          <>
            {' / '}
            {catSlug ? (
              <Link href={`/categoria/${catSlug}`}>{article.category}</Link>
            ) : (
              <span>{article.category}</span>
            )}
          </>
        ) : null}
      </nav>

      <article className="article">
        <header className="article-head">
          {article.category ? (
            <span className="kicker">{article.subcategory || article.category}</span>
          ) : null}
          <h1>{article.title}</h1>
          {article.excerpt ? <p className="lede">{article.excerpt}</p> : null}

          <div className="byline">
            {author ? (
              <span className="avatar" aria-hidden="true">
                {initials(author.name)}
              </span>
            ) : null}
            <span className="who">
              {author ? (
                <strong>
                  Por{' '}
                  <Link href={`/autor/${author.slug}`}>{author.name}</Link>
                </strong>
              ) : null}
              <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                {author ? `${author.role} · ` : ''}
                <time dateTime={article.published_at}>
                  {formatDatePtBR(article.published_at)}
                </time>
              </span>
            </span>
          </div>
        </header>

        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content_html) }}
        />

        {reviewer ? (
          <p className="authorship-note">
            Texto produzido por {author ? author.name : 'nossa equipe'} e revisado
            editorialmente por <strong>{reviewer.name}</strong>, {reviewer.role}.
          </p>
        ) : null}

        {article.canonical_url ? (
          <p className="source-link">
            Fonte original:{' '}
            <a href={article.canonical_url} rel="nofollow noopener" target="_blank">
              {new URL(article.canonical_url).hostname}
            </a>
          </p>
        ) : null}

        {author && author.bio ? (
          <section className="author-box" aria-label="Sobre o autor">
            <span className="avatar lg" aria-hidden="true">
              {initials(author.name)}
            </span>
            <div>
              <h4>
                <Link href={`/autor/${author.slug}`}>{author.name}</Link>
              </h4>
              <div className="role">{author.role}</div>
              <p className="bio">{author.bio}</p>
            </div>
          </section>
        ) : null}
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
