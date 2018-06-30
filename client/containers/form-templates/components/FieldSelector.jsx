import React from 'react'
import { map } from 'lodash'
import {Grid, Column} from '../../components/controls/SemanticControls'
import {FORM_CONTROLS} from '../../../modules/form-templates/config'

const FieldSelector = (props) => (
  <div className="panel">
    <Grid className="field-selector" columns={2}>
      <div className="drag-container" id="newControls">
      {
        map(FORM_CONTROLS, (field) => {
          return (
            <Column className="draggable" key={field.controlType} id={field.controlType}>
              <div className="controlTile">
                <div className="thumbnail">
                  <img centered verticalAlign="middle" size="tiny" width="100" src={field.image} />
                </div>
                <label>{field.labels.fr}</label>
              </div>
            </Column>
          )
        })
      }
      </div>
    </Grid>
  </div>
)

export default FieldSelector
