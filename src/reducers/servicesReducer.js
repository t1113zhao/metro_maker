import { filterById, filterDeleted, genericMultiDelete, genericMultiRestore, genericSingleDelete, genericSingleRestore, nextIDForArray } from '../utils/utils'
import { lineIDsGivenAgencyId } from './linesReducer.js'
import {
    ADD_SERVICE,
    EDIT_SERVICE,
    REMOVE_SERVICE,
    RESTORE_SERVICE,
    REMOVE_LINE,
    RESTORE_LINE,
    REMOVE_AGENCY,
    RESTORE_AGENCY
} from '../actions/actionTypes'

const initialServicesState = []

export default function serviceReducer(state = initialServicesState, action) {
    switch (action.type) {
        case EDIT_SERVICE: {
            return doEditService(state, action);
        }
        case REMOVE_AGENCY:
        case REMOVE_LINE: {
            return genericMultiDelete(
                state,
                action.payload.serviceIDs,
                action.payload.deletedAt
            )
        }
        case REMOVE_SERVICE: {
            return genericSingleDelete(
                state,
                action.payload.id,
                action.payload.deletedAt
            )
        }
        case RESTORE_AGENCY:
        case RESTORE_LINE: {
            return genericMultiRestore(
                state,
                action.payload.serviceIDs
            )
        }

        case RESTORE_SERVICE: {
            return genericSingleRestore(
                state,
                action.payload.id
            )
        }
        default:
            return state;
    }
}

export function doAddService(state, action) {
    return [
        ...state,
        {
            id: nextIDForArray(state),
            lineID: action.payload.lineID,
            name: action.payload.name,
            servicePeriod: action.payload.servicePeriod,
            frequency: action.payload.frequency,
            deletedAt: null
        }
    ]
}

function doEditService(state, action) {
    return state.map((item, index) => {
        if (index !== action.payload.id) {
            return item
        }
        return {
            ...item,
            name: action.payload.name,
            servicePeriod: action.payload.servicePeriod,
            frequency: action.payload.frequency
        }
    })
}

export function selectAllServices(services, includeDeleted) {
    return filterDeleted(services, includeDeleted)
}

export function selectServiceGivenID(state, id, includeDeleted) {
    let output = filterById(state.services, id)
    return filterDeleted(output, includeDeleted)
}

export function selectServicesGivenLineID(state, lineID, includeDeleted) {
    let output = state.services.filter(service => {
        return service.lineID == lineID
    })
    return filterDeleted(output, includeDeleted)
}

export function serviceIDsGivenLineID(state, lineID, includeDeleted) {
    return selectServicesGivenLineID(state, lineID, includeDeleted).map(service => {
        return service.id
    })
}

export function selectServicesGivenAgencyID(state, agencyID, includeDeleted) {
    let lineIDs = new Set(lineIDsGivenAgencyId(state, agencyID, includeDeleted))

    let output = state.services.filter(service => {
        return lineIDs.has(service.lineID)
    })
    return filterDeleted(output, includeDeleted)
}

export function serviceIDsGivenAgencyID(state, agencyID, includeDeleted) {
    return selectServicesGivenAgencyID(state, agencyID, includeDeleted).map(service => {
        return service.id
    })
}
