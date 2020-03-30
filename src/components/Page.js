import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import {Container, Row, Col} from "react-bootstrap";
import {backgroundColor, color} from "../config";

function Page({
                  children,
                  color,
                  background,
                  // location: {
                  //     state,
                  // },
              }) {
    // const cx = classNames({
    //     page: true,
    //     'page--prev': state && state.prev,
    // });
    return (
        <section
            className={"page"}
            style={{
                color,
                background,
            }}
        >
            <Container>
                <Row>
                    <Col sm={12} className={"text-center"}>
                        <h1>Take Aim</h1>
                    </Col>
                </Row>
                {children}
            </Container>
        </section>
    );
}

Page.propTypes = {
    children: PropTypes.node.isRequired,
    color: PropTypes.string,
    background: PropTypes.string,
};

Page.defaultProps = {
    color: color,
    background: backgroundColor,
};

//export default withRouter(Page);
export default Page