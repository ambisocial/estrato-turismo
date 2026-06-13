import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getConfig, getTopCategories } from '../lib/queries';

const FALLBACK = {
  name: 'Estrato Turismo',
  tagline: 'Viaje informado. Viaje melhor.',
  domain: 'estratoturismo.com.br',
};

async function loadShell() {
  try {
    const [config, categories] = await Promise.all([
      getConfig(),
      getTopCategories(),
    ]);
    return {
      name: config.portal_name || FALLBACK.name,
      tagline: config.tagline || FALLBACK.tagline,
      domain: config.portal_domain || FALLBACK.domain,
      categories: categories || [],
    };
  } catch {
    // Keep the shell renderable even if the DB is briefly unreachable
    // (e.g. during build-time static generation of the 404 page).
    return { ...FALLBACK, categories: [] };
  }
}

export async function generateMetadata() {
  const { name, tagline, domain } = await loadShell();
  return {
    metadataBase: new URL(`https://${domain}`),
    title: {
      default: `${name} — ${tagline}`,
      template: `%s | ${name}`,
    },
    description: `${name}: noticias, promocoes e guias de viagem. ${tagline}`,
    openGraph: { siteName: name, locale: 'pt_BR', type: 'website' },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }) {
  const { name, tagline, categories } = await loadShell();

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Pular para o conteudo
        </a>
        <Header name={name} tagline={tagline} categories={categories} />
        <main id="main">{children}</main>
        <Footer name={name} tagline={tagline} categories={categories} />
      </body>
    </html>
  );
}
