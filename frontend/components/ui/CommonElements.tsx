export const Anchor = (props) => (
  <a {...props} className={`hover:underline text-green-500 ${props.className}`}>
    {props.children}
  </a>
);

export const Heading = (props) => (
  <h1 {...props} className={`text-2xl font-bold mb-2 ${props.className}`}>
    {props.children}
  </h1>
);

export const Paragraph = (props) => (
  <span {...props} className={`mb-2 ${props.className}`}>
    {props.children}
  </span>
);
