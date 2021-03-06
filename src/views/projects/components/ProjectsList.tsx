import React from 'react';
import { Row, Button, Col, Card, CardBody, CardFooter, CardText } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';

import { BreadcrumbsItemBuilder } from '../../shared';
import { CreatedProject } from '../../../_helpers/_url-providers';
import { projectServices as ps } from '../_services/_projects.services';
import { projectsActions as pa } from '../_reducers/_projects.actions';
import { Dates } from '../../shared/index';
import { useAsyncEffect } from 'use-async-effect';


export default () => {


    /**
	 * @description Create a read-only hook for cookies.
	 */
    const [cookie] = useCookies();
    
    
    /**
     * @description Set a dispatcher for state management.
     */
    const dispatch = useDispatch();


    /**
     * @description Set a listener for the projectsListReducer state.
     * 
     * @see `CreatedProject`
     */
    const projects: Array<CreatedProject> = useSelector((state: RootStateOrAny) => (
        state.projectsListReducer.results
    ));


    /**
     * @description Start the get project details flow on click in a single
     * record at the record list.
     * 
     * @see `CreatedProject`
     * @param record A CreatedProject object.
     */
    const dispatchRecordDetails = (record: CreatedProject) => {
        Promise.resolve()
            .then(() => dispatch(pa.projectsDetailsPending(true)))
            .then(() => dispatch(pa.projectsDetailsSuccess(record)))
            .then(() => dispatch(pa.projectsDetailsPending(false)))
            .catch(err => dispatch(pa.projectsDetailsFail(err)));
    };


    /**
     * @description Start the projects-request flow on start component.
     */
    useAsyncEffect(() => {
        ps.list(cookie.pas_auth.access_token, dispatch);
    }, []);


    return projects.length > 0 && (
        <>
            <BreadcrumbsItemBuilder />
            <Row>
                {projects.map((item, index) => (
                    <Col md={4} key={index}>
                        <Card>
                            <CardBody>
                                <NavLink
                                    to={`${window.location.pathname}/${item.uuid}`}
                                    activeClassName="active"
                                    onClick={() => dispatchRecordDetails(item)}
                                >
                                    <h3>
                                        {item.title}
                                    </h3>
                                </NavLink>
                                <CardText>
                                    {item.description}
                                </CardText>
                                <Dates
                                    created={item.created}
                                    updated={item.updated}
                                />
                            </CardBody>
                            <CardFooter>
                                <Button color="success">
                                    Edit
                                </Button>
                            </CardFooter>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
};
