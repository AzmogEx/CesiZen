import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="fr-container--fluid fr-py-4w">
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-md-3 fr-col-lg-2">
            <Sidebar />
          </div>
          <main className="fr-col-12 fr-col-md-9 fr-col-lg-10" id="contenu">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
