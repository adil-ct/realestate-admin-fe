import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

const Breadcrumb = props => (
  <Row>
    <Col className="col-12">
      <div className="page-title-box d-flex align-items-center">
        <h4 className="mb-0 ml-1">{props.name} </h4>
        {props.items &&
          props.items.map((item, index) => (
            <React.Fragment key={item.name}>
              {props.items.length !== index + 1 ? (
                <Link to={item.link}>
                  <h4 className="mb-0 mx-3">{item.name || 'Admin'}</h4>
                </Link>
              ) : (
                <h4 className="mb-0 mx-3">{item.name || 'Admin'}</h4>
              )}
              {props.items.length === index + 1 ? null : <h4 className="mt-2"> {'>'} </h4>}
            </React.Fragment>
          ))}
      </div>
    </Col>
  </Row>
);

export default Breadcrumb;
