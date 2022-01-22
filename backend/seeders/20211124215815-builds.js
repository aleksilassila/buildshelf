"use strict";

const description = `
# A demo of \`react-markdown\`

\`react-markdown\` is a markdown component for React.

👉 Changes are re-rendered as you type.

👈 Try writing some markdown on the left.

## Overview

* Follows [CommonMark](https://commonmark.org)
* Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)
* Renders actual React elements instead of using \`dangerouslySetInnerHTML\`
* Lets you define your own components (to render \`MyHeading\` instead of \`h1\`)
* Has a lot of plugins

## Table of contents

Here is an example of a plugin in action
([\`remark-toc\`](https://github.com/remarkjs/remark-toc)).
This section is replaced by an actual table of contents.

## Syntax highlighting

Here is an example of a plugin to highlight code:
[\`rehype-highlight\`](https://github.com/rehypejs/rehype-highlight).

\`\`\`js
import React from 'react'
import ReactDOM from 'react-dom'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

ReactDOM.render(
  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{'# Your markdown here'}</ReactMarkdown>,
  document.querySelector('#content')
)
\`\`\`

Pretty neat, eh?

## GitHub flavored markdown (GFM)

For GFM, you can *also* use a plugin:
[\`remark-gfm\`](https://github.com/remarkjs/react-markdown#use).
It adds support for GitHub-specific extensions to the language:
tables, strikethrough, tasklists, and literal URLs.

These features **do not work by default**.
👆 Use the toggle above to add the plugin.

| Feature    | Support              |
| ---------: | :------------------- |
| CommonMark | 100%                 |
| GFM        | 100% w/ \`remark-gfm\` |

~~strikethrough~~

* [ ] task list
* [x] checked item

https://example.com

## HTML in markdown

⚠️ HTML in markdown is quite unsafe, but if you want to support it, you can
use [\`rehype-raw\`](https://github.com/rehypejs/rehype-raw).
You should probably combine it with
[\`rehype-sanitize\`](https://github.com/rehypejs/rehype-sanitize).

<blockquote>
  👆 Use the toggle above to add the plugin.
</blockquote>

## Components

You can pass components to change things:

\`\`\`js
import React from 'react'
import ReactDOM from 'react-dom'
import ReactMarkdown from 'react-markdown'
import MyFancyRule from './components/my-fancy-rule.js'

ReactDOM.render(
  <ReactMarkdown
    components={{
      // Use h2s instead of h1s
      h1: 'h2',
      // Use a component instead of hrs
      hr: ({node, ...props}) => <MyFancyRule {...props} />
    }}
  >
    # Your markdown here
  </ReactMarkdown>,
  document.querySelector('#content')
)
\`\`\`

## More info?

Much more info is available in the
[readme on GitHub](https://github.com/remarkjs/react-markdown)!

***

A component by [Espen Hovlandsdal](https://espen.codes/)
`;

const buildFile = JSON.stringify({
  filename: "1.litematic",
  md5: "02b80e13d8c4437bf6b9d20d5b978459",
  version: 5,
  blockCount: 1128,
  enclosingSize: { x: 22, y: 8, z: 17 },
  minecraftDataVersion: 2578,
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const metadata = JSON.stringify({
      version: 5,
      minecraftDataVersion: 2578,
      enclosingSize: {
        x: 10,
        y: 15,
        z: 20,
      },
      blockCount: 300,
    });

    await queryInterface.bulkInsert(
      "builds",
      [
        {
          id: 99991,
          title: "Starter house",
          description,
          buildFile,
          images: ["1.jpg", "2.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
        },
        {
          id: 99992,
          title: "Skyscraper",
          description,
          buildFile,
          images: ["2.jpg", "3.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9999,
          categoryName: "houses",
        },
        {
          id: 99993,
          title: "Cartwheel",
          description,
          buildFile,
          images: ["3.jpg", "4.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
        },
        {
          id: 99994,
          title: "Scarecrow",
          description,
          buildFile,
          images: ["4.jpg", "5.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
        },
        {
          id: 99995,
          title: "Starter house",
          description,
          buildFile,
          images: ["5.jpg", "6.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
        },
        {
          id: 99996,
          title: "Skyscraper",
          description,
          buildFile,
          images: ["6.jpg", "7.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9999,
          categoryName: "houses",
        },
        {
          id: 99997,
          title: "Cartwheel",
          description,
          buildFile,
          images: ["7.jpg", "8.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
        },
        {
          id: 99998,
          title: "Scarecrow",
          description,
          buildFile,
          images: ["8.jpg", "9.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
        },
        {
          id: 99999,
          title: "Starter house",
          description,
          buildFile,
          images: ["9.jpg", "1.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
        },
        {
          id: 99910,
          title: "Skyscraper",
          description,
          buildFile,
          images: ["2.jpg", "3.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9999,
          categoryName: "houses",
        },
        {
          id: 99911,
          title: "Cartwheel",
          description,
          buildFile,
          images: ["3.jpg", "4.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
        },
        {
          id: 99912,
          title: "Scarecrow",
          description,
          buildFile,
          images: ["4.jpg", "5.jpg"],
          totalDownloads: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
          collectionId: 9998,
          categoryName: "houses",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete(
      "builds",
      {
        creatorUuid: "f2cc1eadd681243467e4e11476c27df2",
      },
      {}
    );
  },
};
