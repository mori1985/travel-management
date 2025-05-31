import { PassengersSearchService } from './passengerssearch.service';
import { PassengerResponse } from '../common/types';
export declare class PassengersSearchController {
    private readonly passengersSearchService;
    constructor(passengersSearchService: PassengersSearchService);
    searchPassengerByNationalCode(nationalCode: string): Promise<PassengerResponse>;
}
