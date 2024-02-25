import React from 'react';

const ErrorPage: React.FC = () => {
  return (
    <div className="container h-full w-full text-center">
      <h1>Oops! Something went wrong.</h1>
      <p>We apologize for the inconvenience. Please try again later.</p>
      <a href="/" className="button">
        Go back to homepage
      </a>
    </div>
  );
};

export default ErrorPage;
