import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleCard from '../../../components/ArticleCard';
import { getCategoryBySlug, getArticlesByCategory } from '../../../lib/queries';

// Categoria = ISR 60s (Secao 12.3).
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: 'Categoria nao encontrada' };
  return {
    title: category.name,
    description: `Ultimas noticias e promocoes de viagem em ${category.name}.`,
    alternates: { canonical: `/categoria/${category.slug}` },
  };
}

export default async function CategoryPage({ params }) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const articles = await getArticlesByCategory(category, 30);

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Trilha de navegacao">
        <Link href="/">Inicio</Link> / <span>{category.name}</span>
      </nav>

      <header className="page-header">
        <span className="kicker">Categoria</span>
        <h1>{category.name}</h1>
        <p>
          {articles.length} {articles.length === 1 ? 'artigo' : 'artigos'} nesta
          categoria.
        </p>
      </header>

      {articles.length ? (
        <div className="grid">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          Ainda nao ha artigos publicados em <strong>{category.name}</strong>.
          Novos conteudos chegam em breve.
        </div>
      )}
    </div>
  );
}
