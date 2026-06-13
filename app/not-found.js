import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container">
      <div className="empty-state" style={{ marginTop: '3rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Pagina nao encontrada</h1>
        <p>O conteudo que voce procura nao existe ou foi movido.</p>
        <p>
          <Link href="/">Voltar para a pagina inicial</Link>
        </p>
      </div>
    </div>
  );
}
