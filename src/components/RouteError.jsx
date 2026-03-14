import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router';

export function RouteError() {
  const navigate = useNavigate();
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong';

  const description = isRouteErrorResponse(error)
    ? 'The route could not be loaded.'
    : 'An unexpected error happened while rendering this page.';

  return (
    <div className="rounds-page">
      <div className="scores-shell">
        <section className="scores-card">
          <h1 className="scores-title">{title}</h1>
          <p className="scores-subtitle">{description}</p>
          <button
            type="button"
            className="save-round-btn"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </section>
      </div>
    </div>
  );
}
