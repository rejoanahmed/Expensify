import type {OnyxUpdate} from 'react-native-onyx';
import type {OnyxCollectionKey, OnyxPagesKey, OnyxValues} from '@src/ONYXKEYS';
import type Response from './Response';

type OnyxData = {
    successData?: OnyxUpdate[];
    failureData?: OnyxUpdate[];
    finallyData?: OnyxUpdate[];
    optimisticData?: OnyxUpdate[];
};

type RequestType = 'get' | 'post';

type RequestData = {
    command: string;
    commandName?: string;
    data?: Record<string, unknown>;
    type?: RequestType;
    shouldUseSecure?: boolean;
    successData?: OnyxUpdate[];
    failureData?: OnyxUpdate[];
    finallyData?: OnyxUpdate[];
    resolve?: (value: Response) => void;
    reject?: (value?: unknown) => void;
    shouldSkipWebProxy?: boolean;
};

type Request = RequestData & OnyxData;
type PaginatedRequest<TResourceKey extends OnyxCollectionKey, TPageKey extends OnyxPagesKey> = Request & {
    isPaginated: true;
    resourceKey: TResourceKey;
    pageKey: TPageKey;
    getItemsFromResponse: (response: Response) => OnyxValues[TResourceKey];
    sortItems: (items: OnyxValues[TResourceKey]) => Array<OnyxValues[TResourceKey]>;
    getItemID: (item: OnyxValues[TResourceKey]) => string;
    isInitialRequest: boolean;
};

export default Request;
export type {OnyxData, RequestType, PaginatedRequest};
