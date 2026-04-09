declare namespace google {
  namespace maps {
    namespace places {
      class PlacesService {
        constructor(attrContainer: HTMLDivElement | HTMLElement);
        getDetails(
          request: { placeId: string; fields?: string[] },
          callback: (place: any, status: string) => void
        ): void;
      }
      enum PlacesServiceStatus {
        OK = 'OK',
        ZERO_RESULTS = 'ZERO_RESULTS',
        OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
        REQUEST_DENIED = 'REQUEST_DENIED',
        INVALID_REQUEST = 'INVALID_REQUEST',
        UNKNOWN_ERROR = 'UNKNOWN_ERROR',
      }
    }
  }
}
