import Footer from "../components/footer";
import Header from "../components/header";

export default function AcompanharSolicitacao() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main style={{ flex: "1 1 0" }} className="container py-4">
        <h1 className="text-4xl font-bold mb-3">Acompanhar solicitação</h1>
      </main>
      <Footer />
    </div>
  )
}