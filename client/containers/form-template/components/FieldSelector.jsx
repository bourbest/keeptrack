import React from 'react'
import { map } from 'lodash'

import FieldTile from './FieldTile'
const { func, array } = React.PropTypes

const FieldSelector = (props) => (
  <div className="field-selection-list">
    <ul className="list-unstyled">
    {
      map(props.fields, (field) => {
        return (
          <li key={field.name}>
            <FieldTile field={field} onClick={props.onAddField} className="insertable-field-tile" />
          </li>
        )
      })
    }
    </ul>
  </div>
)

FieldSelector.propTypes = {
  onAddField: func.isRequired,
  fields: array.isRequired
}

export default FieldSelector
