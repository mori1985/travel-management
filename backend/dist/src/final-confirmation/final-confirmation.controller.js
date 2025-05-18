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
exports.FinalConfirmationController = void 0;
const common_1 = require("@nestjs/common");
const final_confirmation_service_1 = require("./final-confirmation.service");
let FinalConfirmationController = class FinalConfirmationController {
    finalConfirmationService;
    constructor(finalConfirmationService) {
        this.finalConfirmationService = finalConfirmationService;
    }
    async findAllWithPassengers() {
        return this.finalConfirmationService.findAllWithPassengers();
    }
    async revertToPreviousStage(packId) {
        return this.finalConfirmationService.revertToPreviousStage(packId);
    }
};
exports.FinalConfirmationController = FinalConfirmationController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinalConfirmationController.prototype, "findAllWithPassengers", null);
__decorate([
    (0, common_1.Post)('revert/:packId'),
    __param(0, (0, common_1.Param)('packId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FinalConfirmationController.prototype, "revertToPreviousStage", null);
exports.FinalConfirmationController = FinalConfirmationController = __decorate([
    (0, common_1.Controller)('final-confirmation'),
    __metadata("design:paramtypes", [final_confirmation_service_1.FinalConfirmationService])
], FinalConfirmationController);
//# sourceMappingURL=final-confirmation.controller.js.map