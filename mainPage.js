import qs from 'querystring'

const examplesMeta = [];

export function addToMainPage(example) {
  examplesMeta.push(example);
}

function renderExamplesLinks() {
  const examplesHtml = examplesMeta.map(meta => {
    const titleHtml = `<h4>
      ${meta.title}
      ${ meta.github
        ? `<small><a href="${meta.github}" target="_blank">GitHub <span class="glyphicon glyphicon-new-window"></span></a></small>`
        : ''
      }
    </h4>`;

    let descriptionHtml = '';
    if (meta.description) {
      descriptionHtml = `<p>${meta.description}</p>`
    }

    const queries = meta.queries.map(queryData => {
      return `<b><a href="${meta.uri}/?query=${qs.escape(queryData.query)}">${queryData.title}</a></b>`;
    });
    const queriesHtml = `<ul><li>${queries.join('</li><li>')}</li></ul>`

    return `${titleHtml}${descriptionHtml}${queriesHtml}`;
  });

  return `<ol><li>${examplesHtml.join('</li><li>')}</li></ol>`;
}

export function mainPage() {
  return `
    <html>
      <head>
        <title>GraphQL-Compose examples</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
      </head>
      <body>
        <div class="container">
          <h1>GraphQL-Compose examples</h1>
          ${renderExamplesLinks()}

          <br /><br /><br /><br />
          <h3>Source code:</h3>
          <a href="https://github.com/nodkz/graphql-compose-examples" target="_blank">https://github.com/nodkz/graphql-compose-examples</a>

          <h3>Used packages:</h3>
          <a href="https://github.com/nodkz/graphql-compose" target="_blank">https://github.com/nodkz/graphql-compose</a>
          <br/>
          <a href="https://github.com/nodkz/graphql-compose-mongoose" target="_blank">https://github.com/nodkz/graphql-compose-mongoose</a>
          <br/>
          <a href="https://github.com/nodkz/graphql-compose-relay" target="_blank">https://github.com/nodkz/graphql-compose-relay</a>
          <br/>
          <a href="https://github.com/nodkz/graphql-compose-connection" target="_blank">https://github.com/nodkz/graphql-compose-connection</a>
        </div>

        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-83022112-1', 'auto');
          ga('send', 'pageview');

        </script>
      </body>
    </html>
  `;
}
