import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main
        role="main"
        id="contenu"
        className="fr-background-alt--grey"
        style={{ flex: 1 }}
      >
        <div className="fr-container fr-py-6w">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
