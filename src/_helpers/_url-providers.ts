import { AxiosRequestConfig, Method } from 'axios';
import { v4 as uuid } from 'uuid/interfaces';


// *******************
// Shared utilities.
// *******************


/**
 * Base url to perform request to backend API.
 */
const backendUrl: string = 'http://localhost:8080';
const baseUrl: string = `${backendUrl}/api/v1`;
const frontendBaseUrl: string = "http://localhost:3000"


/**
 * Constants of Oauth2 flows.
 */
export const oAuthRedirectUrl = `${frontendBaseUrl}/auth/`;

const authUrl: string = "http://34.123.139.115" as const;
//const authUrl: string = "https://lepista.net" as const;
//const authUrl: string = "http://0.0.0.0:8001" as const;
const oAuthAuthorizeUrl: string = `${authUrl}/api/v1/o/authorize/`;
const oAuthTokenUrl: string = `${authUrl}/api/v1/o/token/`;
const oAuth_client_id = 'ZhZ189bwNEjiza3xLhVGrZs2G3TnT5Isi4y7uZyU' as const;
const oAuth_client_secret = 'l99sDJCq5tjWcOtzR6a5OZp1MGs3MQMJqSe55quKuJhIWRBSq6zyPhkzTWVy614rdBNjQ0HCCPsspMjvlsgNe8o5s0WXdOZeJ3uxNXVXCizvnt0i2UxaRuKJdhW7YRyi' as const;
const oAuth_grant_type = 'authorization_code' as const;
const oAuth_response_type = 'code' as const;


/**
 * Gene connector base url.
 */
const geneConnectorBaseUrl: string = 'https://lepiota.herokuapp.com/api';


/**
 * @description A custom request interface to abstract AxiosRequestConfig.
 * 
 * @see `AxiosRequestConfig` of axios package.
 */
export interface CustomRequestConfig extends AxiosRequestConfig { }


/**
 * @description This is a common interface for list requests. Keys denotes:
 * count: the total number of records;
 * previous and next: navigation links;
 * tp: total records at the current page;
 * p: the page to be shown;
 * ps: the expected size of the page to show.
 */
export interface ListResponseInterface {
    count?: number,
    previous?: any,
    next?: any,
    tp?: number,
    p?: number,
    ps?: number,
    q?: string,
}


/**
 * @description Define the basic interface for http requests.
 */
export interface HttpQueryParams {
    id?: uuid | string,
    query_params?: ListResponseInterface,
    data?: Object | any
}


/**
 * @description Interface for also created records.
 */
export interface CreatedRecords {
    readonly uuid?: uuid,
    readonly created?: | Date | undefined,
    readonly updated?: Date | undefined,
    [key: string]: any;
}


/**
 * @description Return authorization header with jwt token.
 */
const authHeader = (): Object => {
    // @ts-ignore
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        return { 'Authorization': `JWT ${user.token}` };
    } else {
        return {};
    }
}


const oAuthHeader = (access_token: string) => {
    return { 'Authorization': `Bearer ${access_token}` };
}


/**
 * @description Return general purpose headers for http requests.
 * 
 * @param add_headers Additional headers to include on final header object.
 * @param is_authenticated If true the authentication token is also provided.
 */
const getCommonHeadersResourceServer = (
    is_authenticated: boolean = false, add_headers?: Object
): Object => {
    let headers = {
        'Access-Control-Allow-Origin': `${frontendBaseUrl}`,
        'Content-Type': 'application/json'
    }

    if (add_headers) headers = { ...headers, ...add_headers };
    if (is_authenticated) headers = { ...headers, ...authHeader() }

    return headers;
}


/**
 * @description Return a http header for the single sign-on authorization flow.
 * 
 * @param add_headers Additional headers to include on final header object.
 * @param is_authenticated If true the authentication token is also provided.
 */
const getCommonHeadersAuthServer = (
    is_authenticated: boolean = false, add_headers?: Object
): Object => {
    let headers = {
        'Access-Control-Allow-Origin': `${frontendBaseUrl}`,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    if (add_headers) headers = { ...headers, ...add_headers };
    if (is_authenticated) headers = { ...headers, ...authHeader() }

    return headers;
}


/**
 * @description Return a http header including access_token.
 * 
 * @param add_headers Additional headers to include on final header object.
 * @param is_authenticated If true the authentication token is also provided.
 * @param access_token A string returned at the final of the single sign-on
 * authorization flow.
 */
const getRestrictHeadersAuthServer = (
    is_authenticated: boolean = false, access_token: string, 
    add_headers?: Object
): Object => {
    let headers = {
        //'Access-Control-Allow-Origin': `${backendUrl}/*`,
        'Content-Type': 'application/json',
    }

    if (add_headers) headers = { ...headers, ...add_headers };
    if (is_authenticated) headers = { ...headers, ...oAuthHeader(access_token) }

    return headers;
}


/**
 * @description Validate query parameters for queries performed with a list as a
 * response.
 * 
 * @param qpars The query parameter object.
 */
const buildParamsForLists = (qpars: any = {}) => {
    let params: any = {}

    /* Page Size */
    if (!qpars.ps) qpars.ps = 10;
    params.ps = qpars.ps;

    /* Filter term */
    if (qpars.q)
        params.q = qpars.q;

    /* Current page */
    if (qpars.p)
        params.p = qpars.p;

    return params;
}


// *******************
// Auth utilities.
// *******************


/**
 * @description Interface for minimal credentials object.
 */
export interface AuthCredentials {
    username: string | undefined,
    password: string | undefined,
    submitted?: boolean,
}


/**
 * @description Interface for payload variables (variables decoded from auth
 * token).
 */
export interface Payload {
    email: string,
    exp: number,
    orig_iat: number,
    user_id: number,
    username: string,
}


/**
 * @description Interface for Oauth2 credentials.
 */
export interface OAuthCredentials {
    readonly grant_type: string
    readonly client_id: string
    readonly client_secret: string
    readonly code: string
    readonly redirect_uri: string
}


/**
 * @description Provide a configured URL for create requests.
 * 
 * @see `AuthCredentials`
 * @see `Method` from axios package.
 * @param method An http method.
 * @param data Data to be submited as a new record.
 */
export const provideAuthLoginUrl = (
    data: AuthCredentials
): CustomRequestConfig => {
    return {
        method: "POST",
        url: `${baseUrl}/auth/get-token/`,
        headers: getCommonHeadersResourceServer(),
        data: data,
    }
}


/**
 * @description Build and return the single sigh-up authorization url as a
 * string.
 */
export const getOAuthAuthorizationUrl = () => {
    const url = new URL(oAuthAuthorizeUrl);

    url.search = new URLSearchParams({
        response_type: oAuth_response_type,
        client_id: oAuth_client_id,
        redirect_uri: oAuthRedirectUrl,
    }).toString();

    return url.toString();
}


/**
 * @description Provide the axios configuration to request the authorization
 * token during single sign-on process. This function is called during the final
 * step of the authorization flow.
 * 
 * @param code A string returned during the first step of the single sign-on
 * authorization process
 */
export const provideAuthGetTokenUrl = (code: string): CustomRequestConfig => {

    const data: OAuthCredentials = {
        grant_type: oAuth_grant_type,
        client_id: oAuth_client_id,
        client_secret: oAuth_client_secret,
        code: code,
        redirect_uri: oAuthRedirectUrl,
    }

    console.log(data)

    return {
        method: "POST",
        url: `${oAuthTokenUrl}`,
        headers: getCommonHeadersAuthServer(),
        data: data,
    };
}


// *******************
// User utilities.
// *******************


/**
 * @deprecated The authentication process will be replaced by an single sign-on
 * authorization process. This function and all related to authorization are
 * deprecated and will be further removed.
 * 
 * @description Basic user interface.
 */
export interface User {
    readonly id: number,
    readonly email: string,
    readonly username: string,
    readonly first_name: string,
    readonly last_name: string,
}


/**
 * @description Describe the User object stored on resource server.
 */
export interface SSOUser {
    readonly username: string | null,
    readonly email: string,
    readonly first_name: string | null,
    readonly last_name: string | null,
    readonly groups: {
        name: string | null
    }
}


/**
 * @description Request the user credentials from resource server.
 * 
 * @param access_token The access token provided during single sign-on
 * authorization flow.
 */
export const provideGetSSOUserUrl = (
    access_token: string
): CustomRequestConfig => {
    return {
        headers: getRestrictHeadersAuthServer(true, access_token),
        method: "GET",
        url: `${baseUrl}/user/`,
    }
}


// *******************
// Projects utilities.
// *******************


/**
 * @description Interface for not also created projects. It would be used in
 * creation forms.
 */
export interface BaseProject {
    title?: string,
    description?: string,
}


/**
 * @description Interface for also created projects. It would be used in
 * projects lists, updates and delete.
 */
export interface CreatedProject extends BaseProject, CreatedRecords {
    user?: User,
}


/**
 * @description Interface for Projects list.
 */
export interface ProjectsListObjects extends ListResponseInterface {
    results: Array<CreatedProject>
    [key: string]: any,
}


/**
 * @description Return an appropriated http config object of CustomRequestConfig
 * type to be used in axios requests. See example below.
 * 
 * @example axios(provideProjectsUrl("GET", { id: id }))
 * @see `getCommonHeaders` method.
 * @see `buildParamsForLists` method.
 * @see `Method` from axios package.
 * @see `CustomRequestConfig` interface.
 * @param method A valid http verb of class Method from axios package.
 * @param args An Object containing specific params as 
 */
export const provideProjectsUrl = (
    method: Method, accession_token: string, args: HttpQueryParams
): CustomRequestConfig => {//, access_token: string

    let request: CustomRequestConfig = {
        headers: getRestrictHeadersAuthServer(true, accession_token),//, access_token
    };

    switch (method) {
        case "GET":
            if (args.id && !args.query_params) {
                return request = {
                    ...request, ...{
                        method: method,
                        url: `${baseUrl}/projs/${args.id}`,
                    }
                };
            } else {
                return request = {
                    ...request, ...{
                        method: method,
                        url: `${baseUrl}/projs/`,
                        params: buildParamsForLists(args.query_params),
                    }
                };
            };

        case "POST":
            return request = {
                ...request, ...{
                    method: method,
                    url: `${baseUrl}/projs/new`,
                    data: args.data,
                }
            };

        case "PUT":
            return request = {
                ...request, ...{
                    method: method,
                    url: `${baseUrl}/projs/${args.data.uuid}/edit`,
                    data: args.data,
                }
            };

        case "DELETE":
            return request = {
                ...request, ...{
                    method: method,
                    url: `${baseUrl}/projs/${args.id}/delete`,
                }
            };

        default:
            return request;
    }
}


// *******************
// Trees utilities.
// *******************


/**
 * @description Interface for genes.
 */
export interface Gene {
    readonly id: uuid,
    readonly name: string,
    readonly name_slug: string,
    readonly meta: {
        terms: Array<string>
    }
}


/**
 * @description Interface for list of Gene objects.
 */
export interface GeneListObjects extends ListResponseInterface {
    results: Array<Gene>
}


export interface TreesValidationSteps {
    readonly map_clade_status?: boolean,
    readonly upload_sequences_status?: boolean,
    readonly map_features_status?: boolean,
}


/**
 * @description Interface for not also created trees. It would be used in
 * creation forms.
 */
export interface BaseTrees {
    title?: string,
    description?: string,
    gene?: Gene | undefined,
    tree?: string,
    related_tree?: any,
    tree_utils?: TreesValidationSteps,
    [key: string]: any,
}


/**
 * @description Interface for also created trees. It would be used in tree
 * lists, updates and delete.
 */
export interface CreatedTrees extends BaseTrees, CreatedRecords {
    is_active?: boolean,
    readonly feature_set?: CreatedRecords,
}


/**
 * @description Interface for Trees list.
 */
export interface TreesListObjects extends ListResponseInterface {
    results: Array<CreatedTrees>,
    [key: string]: any,
}


/**
 * @description Return an appropriated http config object of CustomRequestConfig
 * type to be used in axios requests. See example below.
 * 
 * @example axios(provideTreesUrl("GET", { id: id }))
 * @see `getCommonHeaders` method.
 * @see `buildParamsForLists` method.
 * @see `Method` from axios package.
 * @see `CustomRequestConfig` interface.
 * @see `HttpQueryParams` interface.
 * @param method A valid http verb of class Method from axios package.
 * @param project_pk A project primary key.
 * @param args An Object containing specific params as HttpQueryParams interface.
 */
export const provideTreesUrl = (
    method: Method, accession_token: string, project_pk: uuid, args: HttpQueryParams
): CustomRequestConfig => {

    let request: CustomRequestConfig = {
        headers: getRestrictHeadersAuthServer(true, accession_token),
    };

    switch (method) {
        case "GET":
            if (args.id && !args.query_params) {
                return request = {
                    ...request, ...{
                        method: method,
                        url: `${baseUrl}/${project_pk}/trees/${args.id}`,
                    }
                };
            } else {
                return request = {
                    ...request, ...{
                        method: method,
                        url: `${baseUrl}/${project_pk}/trees/`,
                        params: buildParamsForLists(args.query_params),
                    }
                };
            };

        case "POST":
            return request = {
                ...request, ...{
                    method: method,
                    url: `${baseUrl}/${project_pk}/trees/new`,
                    data: args.data,
                }
            };

        case "PUT":
            return request = {
                ...request, ...{
                    method: method,
                    url: `${baseUrl}/${project_pk}/trees/${args.data.uuid}/edit`,
                    data: args.data,
                }
            };

        case "DELETE":
            return request = {
                ...request, ...{
                    method: method,
                    url: `${baseUrl}/${project_pk}/trees/${args.id}/delete`,
                }
            };

        default:
            return request;
    }
}


/**
 * @description Provide a basic url to perform a request to Gene-Connector gene
 * public API.
 * 
 * @param term A string containing a term to filter records.
 */
export const provideGeneSearchUrl = (term: string): CustomRequestConfig => {
    return {
        headers: getCommonHeadersResourceServer(),
        method: "GET",
        url: `${geneConnectorBaseUrl}/public/gene/`,
        params: { q: term }
    };
}


/**
 * @description Get all clades of a specific phylogenetic tree.
 * 
 * @see `CustomRequestConfig` interface.
 * @see `HttpQueryParams` interface.
 * @param project_pk A project primary key.
 * @param args An Object containing specific params as HttpQueryParams interface.
 */
export const provideGetLeavesUrl = (
    project_pk: uuid, args: HttpQueryParams
): CustomRequestConfig => {
    return {
        headers: getCommonHeadersResourceServer(true),
        method: "GET",
        url: `${baseUrl}/${project_pk}/trees/${args.id}/get-leaves`,
    }
}


/**
 * @description Map clades of tree.
 * 
 * @see `CustomRequestConfig` interface.
 * @see `HttpQueryParams` interface.
 * @param project_pk A project primary key.
 * @param args An Object containing specific params as HttpQueryParams interface.
 */
export const provideMapCladesUrl = (
    access_token: string, project_pk: uuid, args: HttpQueryParams
): CustomRequestConfig => {
    return {
        headers: getRestrictHeadersAuthServer(true, access_token),
        method: "PATCH",
        url: `${baseUrl}/${project_pk}/trees/${args.id}/map-clades`,
        data: args.data
    }
}


/**
 * @description Provide url for test if outgroups are monophyletic.
 * 
 * @see `CustomRequestConfig` interface.
 * @see `HttpQueryParams` interface.
 * @param project_pk A project primary key.
 * @param args An Object containing specific params as HttpQueryParams interface.
 */
export const provideTestCladesUrl = (
    access_token: string, project_pk: uuid, args: HttpQueryParams
): CustomRequestConfig => {
    return {
        headers: getRestrictHeadersAuthServer(true, access_token),
        method: "PATCH",
        url: `${baseUrl}/${project_pk}/trees/${args.id}/test-clade`,
        data: args.data
    }
}


/**
 * @description Provide a url to send fasta file to be uploaded.
 * 
 * @see `CustomRequestConfig` interface.
 * @see `HttpQueryParams` interface.
 * @param args An Object containing specific params as HttpQueryParams interface.
 */
export const provideUploadAlignmentUrl = (
    access_token: string, args: HttpQueryParams
): CustomRequestConfig => {
    return {
        headers: getRestrictHeadersAuthServer(true, access_token),
        method: "POST",
        url: `${baseUrl}/${args.id}/seq/map-fasta`,
        data: args.data
    }
}


/**
 * @description Provide a url to start sequence features mapping.
 * 
 * @see `CustomRequestConfig` interface.
 * @see `HttpQueryParams` interface.
 * @param args An Object containing specific params as HttpQueryParams interface.
 */
export const provideSequenceFeatureGenerationUrl = (
    access_token: string, tree_pk: uuid
): CustomRequestConfig => {
    return {
        headers: getRestrictHeadersAuthServer(true, access_token),
        method: "PATCH",
        url: `${baseUrl}/${tree_pk}/seq-features/map-features`
    }
}


/**
 * @description Provide `axios` configuration object to request a list of
 * sequence features to backend.
 * 
 * @param project_pk The project UUID. Each sequence feature have a relationship
 * to projects. Thus, the project UUID is a requested parameter to validate if
 * the feature set really belongs to a given project.
 */
export const provideSequenceFeatureListUrl = (
    access_token: string, project_pk: uuid
): CustomRequestConfig => {
    return {
        headers: getRestrictHeadersAuthServer(true, access_token),
        method: "GET",
        url: `${baseUrl}/${project_pk}/seq-features/`
    }
};


// *******************
// Clades utilities.
// *******************


/**
 * @description Interface for created sequences.
 */
export interface CreatedSequence {
    readonly created: Date,
    readonly updated: Date,
    readonly fasta_head: string,
    readonly fasta_sequence: string,
    readonly length: number,
    readonly sequence_clade: uuid,
}


declare type ServerTrainStatusType =
    | "unapplicable"
    | "started"
    | "finished"
    | "undefined";


/**
 * @description Interface for created machine learning models.
 */
export interface CreatedModel {
    readonly created: Date,
    readonly updated: Date,
    readonly feature_set: uuid,
    readonly model_clade: uuid,
    readonly test_score: Array<any>,
    readonly ml_model: string,
    readonly train_status?: ServerTrainStatusType,
}


/**
 * @description Interface to specify the i4Life API response.
 */
export interface i4lifeRecord {
    readonly id: number, //346690,
    readonly identifier?: string, //"b2470ac3416863e7d4ce5976811edbd6",
    readonly taxonID?: number, //42160514,
    readonly datasetID?: number, //"28",
    readonly datasetName?: string, //"Species Fungorum in Species 2000 & ITIS Catalogue of Life: 2019",
    readonly scientificNameID?: string, //"SF-159197",
    readonly parentNameUsageID?: number, //54881956,
    readonly modified?: Date, //"27-Oct-2017",

    // Taxonomy
    readonly kingdom?: string, //"Fungi",
    readonly phylum?: string, //"Ascomycota",
    readonly class?: string, //"Sordariomycetes",
    readonly order?: string, //"Hypocreales",
    readonly family?: string, //"Nectriaceae",
    readonly genus?: string, //"Fusarium",
    readonly genericName?: string, //"Fusarium",
    readonly scientificName?: string, //"Fusarium anguioides Sherb., 1915",
    readonly specificEpithet?: string, //"anguioides",
    readonly scientificNameAuthorship?: string, //"Sherb., 1915",

    // Taxonomic metadata
    readonly nameAccordingTo?: string, //"Kew Mycology",
    readonly taxonRank?: string, //"species",
    readonly taxonomicStatus?: string, //"accepted name",
    readonly isExtinct?: boolean, //false,
    readonly references?: string, //"http://www.catalogueoflife.org/col/details/species/id/b2470ac3416863e7d4ce5976811edbd6",

    [key: string]: any
}


/**
 * @description Specify the basic parameters needed to perform graph annotation.
 */
export interface BasicGraphAnnotation {
    id: number,
    created: Date,
    user_id: number,
    user_name: string,
    project_id: uuid,
    tree_id: uuid,
    clade_id: uuid,

    [key: string]: any
}


export interface GraphAnnotation {
    target: i4lifeRecord,
    parent: BasicGraphAnnotation,
    child: Array<i4lifeRecord>,

    [key: string]: any
}


/**
 * @description Interface for base Node descriptions.
 */
export interface BaseNodeDescription {
    description: string,
    node_type: string,
    external_links: {
        annotation: BasicGraphAnnotation,
        node: i4lifeRecord,

        [key: string]: any
    },
    is_active: boolean,
}


/**
 * @description Interface for created Node descriptions.
 */
export interface CreatedNodeDescrription extends BaseNodeDescription {
    readonly clade: uuid,
    readonly created: Date,
    readonly updated: Date,
}


/**
 * @description Interface for created clades.
 */
export interface CreatedClades extends CreatedRecords {
    tree?: uuid,
    parent?: uuid,
    branch_type?: string,
    name?: string,
    branch_length?: number,
    confidence?: number,
    child?: Array<uuid>,
    is_valid?: boolean,
    is_active?: boolean,
    /* Fasta fields */
    sequence?: CreatedSequence,

    /* Node description fields */
    annotation?: CreatedNodeDescrription,

    /* Node classifier fields */
    model?: CreatedModel,

    /* Allow custom field */
    [key: string]: any,
}


/**
 * @description Interface for Clades list.
 */
export interface CladesListObjects extends ListResponseInterface {
    results: Array<CreatedClades>,
    [key: string]: any,
}


/**
 * @description Return an appropriated http config object of CustomRequestConfig
 * type to be used in axios requests. See example below.
 * 
 * @example axios(provideProjectsUrl("GET", { id: id }))
 * @see `buildParamsForLists` method.
 * @see `CustomRequestConfig` interface.
 * @see `HttpQueryParams`
 * @see `getCommonHeaders` method.
 * @see `Method` from axios package.
 * @param method A valid http verb of class Method from axios package.
 * @param tree_pk A tree primary key.
 * @param args An Object containing specific params as 
 */
export const provideCladesUrl = (
    method: Method, access_token: string, tree_pk: uuid, args: HttpQueryParams
): CustomRequestConfig => {

    let request: CustomRequestConfig = {
        headers: getRestrictHeadersAuthServer(true, access_token),
    };

    switch (method) {
        case "GET":
            if (args.id && !args.query_params) {
                return request = {
                    ...request, ...{
                        method: method,
                        url: `${baseUrl}/${tree_pk}/clades/${args.id}`,
                    }
                };
            } else {
                return request = {
                    ...request, ...{
                        method: method,
                        url: `${baseUrl}/${tree_pk}/clades/`,
                        params: buildParamsForLists(args.query_params),
                    }
                };
            };

        default:
            return request;
    }
}


/**
 * @description Return an appropriated http config object of CustomRequestConfig
 * type to be used in axios requests. See example below.
 * 
 * @example axios(provideProjectsUrl("GET", { id: id }))
 * @see `buildParamsForLists` method.
 * @see `CustomRequestConfig` interface.
 * @see `HttpQueryParams`
 * @see `getCommonHeaders` method.
 * @see `Method` from axios package.
 * @param method A valid http verb of class Method from axios package.
 * @param clade A clade primary key.
 * @param args An Object containing specific params as 
 */
export const provideNodesDescriptionUrl = (
    method: Method, access_token: string, clade: uuid, args?: HttpQueryParams
): CustomRequestConfig => {

    let request: CustomRequestConfig = {
        headers: getRestrictHeadersAuthServer(true, access_token),
    };

    switch (method) {
        case "GET":
            if (!args?.query_params) {
                return request = {
                    ...request, ...{
                        method: method,
                        url: `${baseUrl}/${clade}/nodes/`,
                    }
                };
            } else {
                return request = {
                    ...request, ...{
                        method: method,
                        url: `${baseUrl}/${clade}/nodes/`,
                        params: buildParamsForLists(args.query_params),
                    }
                };
            };

        case "POST":
            return request = {
                ...request, ...{
                    method: method,
                    url: `${baseUrl}/${clade}/nodes/annotate-clade/`,
                    data: args?.data,
                }
            };

        default:
            return request;
    }
}


/**
 * @description Return an appropriated http config object of CustomRequestConfig
 * type to be used in axios requests. See example below.
 * 
 * @example axios(provideProjectsUrl("GET", { id: id }))
 * @see `buildParamsForLists` method.
 * @see `CustomRequestConfig` interface.
 * @see `HttpQueryParams`
 * @see `getCommonHeaders` method.
 * @see `Method` from axios package.
 * @param method A valid http verb of class Method from axios package.
 * @param tree A tree primary key.
 * @param args An Object containing specific params as 
 */
export const provideNodeClassifierDescriptionUrl = (
    method: Method, access_token: string, tree: uuid, args?: HttpQueryParams
): CustomRequestConfig => {

    let request: CustomRequestConfig = {
        headers: getRestrictHeadersAuthServer(true, access_token),
    };

    switch (method) {
        case "GET":
            if (args?.id) {
                return request = {
                    ...request, ...{
                        method: method,
                        url: `${baseUrl}/${tree}/models/`,
                    }
                };
            } else {
                return request = {
                    ...request, ...{
                        method: method,
                        url: `${baseUrl}/${tree}/models/`,
                        params: buildParamsForLists(args?.query_params),
                    }
                };
            };

        default:
            return request;
    }
}


/**
 * @description Train a clade representative machine learning model.
 * 
 * @param source_clade The source clade UUID. Each model train have a one-to-one
 * relationship with clades. Thus, the source clade UUID have been provided to
 * create and validate such relationship.
 * @param feature_set The feature set UUID. Each model have a one-to-many
 * relationship with feature sets. Thus, the feature set UUID have been provided
 * to create and validate such relationship.
 */
export const provideSingleCladeTrainUrl = (
    access_token: string, source_clade: uuid, feature_set: uuid
): CustomRequestConfig => {
    return {
        headers: getRestrictHeadersAuthServer(true, access_token),
        method: "PATCH",
        url: `${baseUrl}/${source_clade}/models/${feature_set}/train`,
    }
};


/**
 * @deprecated This url was not implemented and will be removed.
 * 
 * @description Models are trained asynchronously. Thus when the train process
 * is started this url is used to verify if the train process was finished.
 * 
 * @param task_id Verify if the model 
 */
export const provideSingleCladeTrainStatusUrl = (
    access_token: string, task_id: uuid
): CustomRequestConfig => {
    return {
        headers: getRestrictHeadersAuthServer(true, access_token),
        method: "GET",
        url: `${baseUrl}/${task_id}/models/get-status`
    }
};


export const provideGetNodeListUrl = (
    access_token: string, term: string
): CustomRequestConfig => {
    return {
        headers: getRestrictHeadersAuthServer(true, access_token),
        method: "GET",
        url: `${baseUrl}/nodes/`,
        params: { q: term, t: "full" },
    }
};


export const provideGetNodeByIdUrl = (
    access_token: string, node: number
): CustomRequestConfig => {
    return {
        headers: getRestrictHeadersAuthServer(true, access_token),
        method: "GET",
        url: `${baseUrl}/nodes/${node}`,
    }
};


export const provideNodeAnnotationCreateUrl = (
    access_token: string, graph_node: number, clade_pk: uuid, tree_pk: uuid, 
    project_pk: uuid
): CustomRequestConfig => {
    return {
        headers: getRestrictHeadersAuthServer(true, access_token),
        method: "PATCH",
        url: `${baseUrl}/nodes/${graph_node}/annotate-node`,
        params: {
            clade_id: clade_pk,
            tree_id: tree_pk,
            project_id: project_pk,
        }
    }
};


export const provideNodeAnnotationDeleteUrl = (
    access_token: string, graph_node: number, clade_pk: uuid
): CustomRequestConfig => {
    return {
        headers: getRestrictHeadersAuthServer(true, access_token),
        method: "DELETE",
        url: `${baseUrl}/nodes/${graph_node}/${clade_pk}/delete`,
    }
};
