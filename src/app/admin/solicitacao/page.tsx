import Solicitations from "./_solicitations"

export default function Solicitation () {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <h1 className="text-3xl font-bold mb-2">Solicitações</h1>
      <div className="border shadow-sm rounded-lg">
        <Solicitations /> 
      </div>
    </main>
  )
}