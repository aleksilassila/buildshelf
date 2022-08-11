import ReactMarkdown, { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => <h1 className="text-xl font-extrabold">{children}</h1>,
  h2: ({ children }) => <h2 className="text-lg font-bold">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-bold">{children}</h3>,
  h4: ({ children }) => <h4 className="text-base font-medium">{children}</h4>,
  h5: ({ children }) => <h5 className="text-sm font-medium">{children}</h5>,
  h6: ({ children }) => <h6 className="text-xs font-medium">{children}</h6>,
  p: ({ children }) => <p className="my-2 leading-5">{children}</p>,
  ul: ({ children }) => <li className="list-disc">{children}</li>,
  pre: ({ children }) => (
    <pre className="bg-gray-100 p-4 whitespace-pre-wrap">{children}</pre>
  ),
  code: ({ children }) => (
    <code className="font-body bg-stone-200 rounded px-1 py-0.5 font-monospace">
      {children}
    </code>
  ),
  a: ({ children, href, ...rest }) => (
    <a
      {...rest}
      href={
        !href.startsWith("https://") && !href.startsWith("http://")
          ? "http://" + href
          : href
      }
      className="underline text-green-600"
    >
      {children}
    </a>
  ),
};

const Markdown = ({ children, ...rest }) => (
  <ReactMarkdown components={components} {...rest}>
    {children}
  </ReactMarkdown>
);

export default Markdown;
