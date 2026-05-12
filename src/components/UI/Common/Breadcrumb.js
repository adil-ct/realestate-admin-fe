import React from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types'
import { Row, Col } from 'reactstrap';

const Breadcrumb = ({ name, items, nopadding = false }) => (
  <Row>
    <Col className="col-12">
      <div className={`page-title-box d-flex align-items-center ${nopadding ? 'pb-0' : ''}`}>
        <h4 className="mb-0">{name}</h4>
        {items &&
          items.map((item, index) => (
            <React.Fragment key={item.name}>
              {items.length !== index + 1 ? (
                <Link
                  to={item.state ? { pathname: item.link, state: item.state } : item.link}
                  color="#1A2B4A"
                >
                  <h4 className="mb-0 mx-3">{item.name || 'Admin'}</h4>
                </Link>
              ) : (
                <h4 className="mb-0 mx-3">{item.name || 'Admin'}</h4>
              )}
              {items.length === index + 1 ? null : <h4 className="mt-2"> {'>'} </h4>}
            </React.Fragment>
          ))}
      </div>
    </Col>
  </Row>
);

// Breadcrumb.propTypes = {
//   breadcrumbItem: PropTypes.string,
//   title: PropTypes.string
// }

export default Breadcrumb;
