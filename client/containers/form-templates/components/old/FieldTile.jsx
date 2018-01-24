import React from 'react'
import DynamicField from '../../components/forms/DynamicField'

const { func, object, string } = React.PropTypes

const fakeCb = (event) => {
  console.warn('fakeCb called in FieldTile')
}

class FieldTile extends React.Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick (event) {
    this.props.onClick(this.props.field.name)
  }

  render () {
    return (
      <div className={`field-tile-container ${this.props.className}`}>
        <DynamicField field={this.props.field} value={this.props.field.value} onChange={fakeCb} />
        <div className="field-tile-overlay" onClick={this.onClick} name={this.props.field.name} />
      </div>
    )
  }
}

FieldTile.propTypes = {
  onClick: func.isRequired,
  field: object.isRequired,
  className: string
}

export default FieldTile
