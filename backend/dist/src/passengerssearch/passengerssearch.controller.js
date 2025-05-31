"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassengersSearchController = void 0;
const common_1 = require("@nestjs/common");
const passengerssearch_service_1 = require("./passengerssearch.service");
let PassengersSearchController = class PassengersSearchController {
    passengersSearchService;
    constructor(passengersSearchService) {
        this.passengersSearchService = passengersSearchService;
    }
    async searchPassengerByNationalCode(nationalCode) {
        if (!nationalCode ||
            nationalCode.length !== 10 ||
            isNaN(Number(nationalCode))) {
            throw new common_1.HttpException('کد ملی باید ۱۰ رقم باشد', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.passengersSearchService.searchPassengerByNationalCode(nationalCode);
    }
};
exports.PassengersSearchController = PassengersSearchController;
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('nationalCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PassengersSearchController.prototype, "searchPassengerByNationalCode", null);
exports.PassengersSearchController = PassengersSearchController = __decorate([
    (0, common_1.Controller)('passengers'),
    __metadata("design:paramtypes", [passengerssearch_service_1.PassengersSearchService])
], PassengersSearchController);
//# sourceMappingURL=passengerssearch.controller.js.map