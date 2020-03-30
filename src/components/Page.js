import React from 'react';
import PropTypes from 'prop-types';
import {Container, Row, Col} from "react-bootstrap";
import {backgroundColor, color} from "../config";

function Page({
                  children,
                  color,
                  background,
              }) {
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

export default Page