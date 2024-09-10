import { Progress } from "@/components/ui/progress";

export default function Confirm () {
  return (
    <>
      <div className="container mx-auto my-16">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold">Solicitação de Autorização Eletrônica de Viagem (eTA)</h1>
          <hr />
          <h2 className="text-2xl font-bold">Progresso da sua aplicação</h2>
          <Progress value={75}/>
        </div>
        <div className="flex flex-col items-center space-y-8"></div>
      </div>
    </>
  )
}