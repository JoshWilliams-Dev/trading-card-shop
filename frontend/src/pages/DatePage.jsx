import React from 'react';

const DatePage = () => {
  const now = new Date();

  const localDate = now.toLocaleString();
  const utcDate = now.toUTCString();

  return (
    <>
      <h1>Today's Date</h1>
      <p>Local Time: {localDate}</p>
      <p>UTC Time: {utcDate}</p>
    </>
  );
};

export default DatePage;