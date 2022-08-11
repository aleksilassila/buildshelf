export const Anchor = (props) => (
  <a {...props} className={`hover:underline text-green-500 ${props.className}`}>
    {props.children}
  </a>
);

export const Heading = (props) => (
  <h1 {...props} className={`text-2xl font-bold mb-2 mt-4 ${props.className}`}>
    {props.children}
  </h1>
);

export const Heading2 = (props) => (
  <h2 {...props} className={`text-xl font-bold mb-2 mt-4 ${props.className}`}>
    {props.children}
  </h2>
);

export const Paragraph = (props) => (
  <p {...props} className={`mb-2 ${props.className}`}>
    {props.children}
  </p>
);

export const List = (props) => (
  <ul {...props} className={`list-disc list-inside ${props.className}`}>
    {props.children}
  </ul>
);

export const ListItem = (props) => (
  <li {...props} className={`pl-2 ${props.className}`}>
    {props.children}
  </li>
);
