import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

function errorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`
  } else if (error instanceof Error) {
    return error.message
  } else if (typeof error === 'string') {
    return error
  } else {
    console.error(error)
    return 'Unknown error'
  }
}

const ErrorPage: React.FC = () => {
  const error = useRouteError()
  console.error(error)

  return (
    <div className="page-interior">
      <h1>¯\_(ツ)_/¯</h1>
      <p>Guess I've got brain problems!</p>
      <p>
        <i>{errorMessage(error)}</i>
      </p>
    </div>
  )
}

export default ErrorPage
