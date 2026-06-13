import Link from 'next/link';

export default function Header({ name, tagline, categories }) {
  return (
    <header className="site-header">
      <div className="container header-top">
        <Link href="/" className="brand" aria-label={`${name} — pagina inicial`}>
          <span className="name">{name}</span>
          {tagline ? <span className="tagline">{tagline}</span> : null}
        </Link>
      </div>
      <nav className="main-nav" aria-label="Categorias">
        <div className="container">
          <ul>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categoria/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
