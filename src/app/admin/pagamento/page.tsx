import { getPayments } from "../actions"
import PaymentsTable from './payments-table'

export default async function Solicitation () {
  const payments = await getPayments()

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <h1 className="text-3xl font-bold mb-2">Pagamentos</h1>
      <div className="border shadow-sm rounded-lg">
        <PaymentsTable payments={payments} />
      </div>
    </main>
  )
}