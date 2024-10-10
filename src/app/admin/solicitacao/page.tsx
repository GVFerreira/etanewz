import { getVisas } from "../actions"
import SolicitationsTable from './solicitations-table'

export default async function Solicitation () {
  const visas = await getVisas()

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <h1 className="text-3xl font-bold mb-2">Solicitações</h1>
      <div className="border shadow-sm rounded-lg">
        <SolicitationsTable visas={visas} />
      </div>
    </main>
  )
}