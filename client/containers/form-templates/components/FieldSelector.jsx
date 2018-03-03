import React from 'react'
import { map } from 'lodash'
import {Image, Grid} from 'semantic-ui-react'
import {FORM_CONTROLS} from '../../../modules/form-templates/config'
const Row = Grid.Row
const Col = Grid.Column

const FieldSelector = (props) => (
  <div className="panel">
    <Grid className="field-selector" columns={2}>
      <Row className="drag-container" id="newControls">
      {
        map(FORM_CONTROLS, (field) => {
          return (
            <Col className="draggable" key={field.controlType} id={field.controlType}>
              <div className="controlTile">
                <div className="thumbnail">
                  <Image centered verticalAlign="middle" size="tiny" src={field.image} />
                </div>
                <label>{field.labels.fr}</label>
              </div>
            </Col>
          )
        })
      }
      </Row>
    </Grid>
  </div>
)

export default FieldSelector
