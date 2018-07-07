import React from 'react'
import { map } from 'lodash'
import {FORM_CONTROLS} from '../../../modules/form-templates/config'

const FieldSelector = (props) => (
  <div className="panel">
    <div className="field-selector">
      <div className="drag-container row no-gutters" id="newControls">
      {
        map(FORM_CONTROLS, (field) => {
          return (
            <div className="col-6 draggable" key={field.controlType} id={field.controlType}>
              <div className="controlTile">
                <img width="80" src={field.image} />
                <label>{field.labels.fr}</label>
              </div>
            </div>
          )
        })
      }
      </div>
    </div>
  </div>
)

export default FieldSelector
