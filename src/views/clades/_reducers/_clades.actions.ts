import { ModelsTrainQueue } from './_clades.reducers';
import { cladesConstants } from './_clades.constants';
import { CreatedClades } from '../../../_helpers/_url-providers';


const cladesListActions = {

    cladesListPending(pending: boolean) {
        return { type: cladesConstants.LIST_PENDING, pending: pending }
    },

    cladesListSuccess(results: Array<CreatedClades>) {
        return { type: cladesConstants.LIST_SUCCESS, results: results }
    },

    cladesListFail(error: any) {
        return { type: cladesConstants.LIST_FAIL, error: error }
    },
};


const cladesSingleActions = {

    cladesDetailsPending(pending: boolean) {
        return { type: cladesConstants.DETAILS_PENDING, pending: pending }
    },

    cladesDetailsSuccess(record: CreatedClades) {
        return { type: cladesConstants.DETAILS_SUCCESS, record: record }
    },

    cladesDetailsFail(error: any) {
        return { type: cladesConstants.DETAILS_FAIL, error: error }
    },
};


const modelsTrainActions = {
    includeItem(item: ModelsTrainQueue) {
        return { type: cladesConstants.MODELS_TRAIN_INCLUDE_ITEM, item: item }
    },

    removeItem(item: ModelsTrainQueue) {
        return { type: cladesConstants.MODELS_TRAIN_REMOVE_ITEM, item: item }
    },
};


export const cladesActions = {
    ...cladesListActions,
    ...cladesSingleActions,
    ...modelsTrainActions,
};