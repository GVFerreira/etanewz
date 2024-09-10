export default function LoadingSpinner () {
  return (
    <>
      <div className="m-2 flex justify-center items-center h-full">
        <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-solid border-white border-t-transparent rounded-full" role="status">
          <span className="visually-hidden"></span>
        </div>
      </div>
    </>
  )
}


