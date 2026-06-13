import Link from 'next/link';

export default function Footer({ name, tagline, categories }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="name">{name}</div>
        {tagline ? <div className="tagline">{tagline}</div> : null}
        <ul className="footer-cats">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/categoria/${c.slug}`}>{c.name}</Link>
            </li>
          ))}
        </ul>
        <div className="footer-legal">
          <p>
            {name} e um portal de noticias de turismo com curadoria editorial.
            Conteudo produzido por pipeline editorial deterministico, com
            atribuicao e revisao humana da equipe.
          </p>
          <p>© {year} {name}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
