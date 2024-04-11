import * as PersistedRequests from '@userActions/PersistedRequests';
import * as SequentialQueue from '../../src/libs/Network/SequentialQueue';
import type Request from '../../src/types/onyx/Request';
import * as TestHelper from '../utils/TestHelper';

const request: Request = {
    command: 'OpenReport',
    successData: [{key: 'reportMetadata_1', onyxMethod: 'merge', value: {}}],
    failureData: [{key: 'reportMetadata_2', onyxMethod: 'merge', value: {}}],
};

describe('SequentialQueue', () => {
    beforeEach(() => {
        PersistedRequests.save(request);

        // @ts-expect-error TODO: Remove this once TestHelper (https://github.com/Expensify/App/issues/25318) is migrated to TypeScript.
        global.fetch = TestHelper.getGlobalFetchMock();
    });

    afterEach(() => {
        PersistedRequests.clear();
    });

    it('saves a request without conflicts', () => {
        SequentialQueue.push(request);
        expect(PersistedRequests.getAll().length).toBe(2);
    });

    it('save a new request with conflict resolution', () => {
        expect(PersistedRequests.getAll().length).toBe(1);
        const handleConflictingRequest = jest.fn();
        const newRequest = {
            command: 'ThingA',
            getConflictingRequests: (requests: Request[]) => requests,
            handleConflictingRequest,
        };
        SequentialQueue.push(newRequest);
        expect(PersistedRequests.getAll().length).toBe(1);
        expect(handleConflictingRequest).toHaveBeenCalledWith(request);
        expect(handleConflictingRequest).toHaveBeenCalledTimes(1);
    });

    it('save a new request with conflict resolution and cancelling out new request', () => {
        expect(PersistedRequests.getAll().length).toBe(1);
        const newRequest = {
            command: 'ThingA',
            getConflictingRequests: (requests: Request[]) => requests,
            shouldIncludeCurrentRequest: true,
        };
        SequentialQueue.push(newRequest);
        expect(PersistedRequests.getAll().length).toBe(0);
    });

    it('a request should never conflict with itself if there are no other queued requests', () => {
        PersistedRequests.remove(request);
        expect(PersistedRequests.getAll().length).toBe(0);

        let newRequest: Request = {...request, getConflictingRequests: (requests: Request[]) => requests};
        SequentialQueue.push(newRequest);
        expect(PersistedRequests.getAll().length).toBe(1);

        PersistedRequests.remove(newRequest);
        expect(PersistedRequests.getAll().length).toBe(0);

        SequentialQueue.push({...request, getConflictingRequests: (requests: Request[]) => requests, shouldIncludeCurrentRequest: true});
        expect(PersistedRequests.getAll().length).toBe(1);
    });

    it('should always ignore any requests that have already been sent', () => {
        expect(PersistedRequests.getAll().length).toBe(1);
        SequentialQueue.flush();
        const newRequest = {
            command: 'ThingA',
            getConflictingRequests: (requests: Request[]) => requests,
            shouldIncludeCurrentRequest: true,
        };
        SequentialQueue.push(newRequest);
        expect(PersistedRequests.getAll().length).toBe(2);
    });
});
