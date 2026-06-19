import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="fr-container fr-py-8w">
          <div className="fr-grid-row fr-grid-row--center">
            <div className="fr-col-12 fr-col-md-8 fr-col-lg-6">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
