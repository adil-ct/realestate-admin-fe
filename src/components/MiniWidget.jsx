import { Col, Card, CardBody } from 'reactstrap';
import CountUp from 'react-countup';

import { GRAPH_UP_SVG, GRAPH_DOWN_SVG } from 'assets/images';
import { GRAPH_STRAIGHT_SVG } from 'assets/images';

const MiniWidget = props => (
  <>
    {props?.reports?.map(report => (
      <Col md={6} xl={props?.xl ? props?.xl : 3} key={report?.id}>
        <Card onClick={report?.handleClick} className={report?.handleClick ? 'cursor-pointer' : ''}>
          <CardBody id="data_card">
            <p className="text-muted mb-2">{report?.title}</p>
            <div className="float-end me-4">
              {report?.graph && (
                <img
                  src={
                    report?.graph === 'up'
                      ? GRAPH_UP_SVG
                      : report?.graph === 'down'
                      ? GRAPH_DOWN_SVG
                      : GRAPH_STRAIGHT_SVG
                  }
                  alt="graph"
                  className="pr-3 graph_img"
                />
              )}
            </div>
            <div id="data_card_val">
              <h4 className="mb-1 mt-1">
                <span>
                  <CountUp
                    end={report?.value}
                    separator=","
                    prefix={report?.prefix}
                    suffix={report?.suffix}
                    decimals={report?.decimal}
                    start={0.0}
                    duration={1}
                  />
                </span>
              </h4>
            </div>

            <p className="text-muted mt-3 mb-0">
              <span className={`text-${report?.color ?? 'danger'} me-1`}>
                <i className={`${report?.icon ?? 'mdi mdi-arrow-down-bold'} me-1`} />
                {report?.badgeValue}
              </span>{' '}
              {report?.desc}
            </p>
          </CardBody>
        </Card>
      </Col>
    ))}
  </>
);

export default MiniWidget;
