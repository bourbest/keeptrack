import React from 'react'
import PropTypes from 'prop-types'
export const doctype = '<!doctype html>'

const HTMLDocument = (props) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/semantic.css" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/react-virtualized-styles.css" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/react-redux-toastr.min.css" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/react-datepicker.min.css" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/react-select.min.css" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/lib-fix.css" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/main.css" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/dragula.min.css" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/quill.snow.css" />
      <title>Keep Track - Maison l'Éclaircie</title>
    </head>
    <body>
      <div id="mount" dangerouslySetInnerHTML={{__html: props.html}} />

      <script src="/public/javascript/dragula.js" async />
      <script dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__ = ${JSON.stringify(props.state)};`}} />
      <div dangerouslySetInnerHTML={{__html: props.scripts}} />
    </body>
  </html>
)

HTMLDocument.propTypes = {
  html: PropTypes.string,
  state: PropTypes.object,
  scripts: PropTypes.string
}

export default HTMLDocument
