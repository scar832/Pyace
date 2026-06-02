import React from 'react';
import { renderToString } from 'react-dom/server';
import { ClerkProvider, useClerk } from '@clerk/react';

function TestComponent() {
  const obj = useClerk();
  console.log("useClerk keys:", Object.keys(obj));
  return React.createElement('div', null, "hi");
}

const html = renderToString(
  React.createElement(ClerkProvider, { publishableKey: "pk_test_Y2xlcmsuZXhhbXBsZS5jb20k" }, React.createElement(TestComponent))
);
