import React from 'react'
import PropTypes from 'prop-types'
import serialize from 'serialize-javascript'
export const doctype = '<!doctype html>'

const HTMLDocument = (props) => (
  <html lang="fr">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#000000" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      <link rel="stylesheet" type="text/css" href="/public/stylesheets/semantic.css" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/react-redux-toastr.min.css" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/react-datepicker.min.css" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/react-select.min.css" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/lib-fix.css" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/main.css" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/dragula.min.css" />
      <link rel="stylesheet" type="text/css" href="/public/stylesheets/quill.snow.css" />

      <link rel="shortcut icon" href="/public/favicon.ico" />
      <title>Keep Track - Maison l'Éclaircie</title>
    </head>
    <body>
      <div id="mount" dangerouslySetInnerHTML={{__html: props.html}} />
    </body>
    <script dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__ = ${serialize(props.state, {isJSON: true})}`}} />
    <script src="/public/javascript/dragula.js" async />
    <script dangerouslySetInnerHTML={{__html: props.runtime}} />
    {props.scripts.map(scriptPath => (
      <script key={scriptPath} type="module" src={scriptPath} />
    ))}
  </html>
)

HTMLDocument.propTypes = {
  html: PropTypes.string.isRequired,
  state: PropTypes.object.isRequired,
  scripts: PropTypes.array.isRequired,
  runtime: PropTypes.string.isRequired
}

export default HTMLDocument
