'use client';

type BoardErrorProps = {
  error: Error;
  reset: () => void;
}

export default async function BoardError({ error, reset } : BoardErrorProps) {
  return <div>새</div>;
}
