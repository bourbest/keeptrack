import React from 'react'

export const doctype = '<!doctype html>';

export default class Albums extends React.Component {
    static propTypes = {
        state: React.PropTypes.object.isRequired,
        html: React.PropTypes.string.isRequired
    }

    render() {
        return (
            <html>
                <head>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />

                    <title>Keep Track</title>

                    <link rel="stylesheet" href="/public/bootstrap.min.css" />
                    <link rel="stylesheet" href="/public/entitylist.css" />
                    <link rel="stylesheet" href="/public/form-builder.css" />
                    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />

                </head>
                <body>
                  <div className="container-fluid">
                    <div id="mount" dangerouslySetInnerHTML={{__html: this.props.html}} />
                    <script dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__ = ${JSON.stringify(this.props.state)};`}} />

                    <script src="/public/bundle.js"></script>
                  </div>
                </body>
            </html>
        );
    }
}
