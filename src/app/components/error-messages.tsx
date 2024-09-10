interface ErrorMessagesProps {
  errors: string[]
}

export default function ErrorMessages ({ errors }: ErrorMessagesProps) {
  if (errors.length === 0) {
    return null
  }

  return (
    <div className="my-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="text-lg font-bold">Erro:</strong>
      <ul className="mt-2 list-disc pl-5">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  )
}


