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
const packs_service_1 = require("../packs/packs.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let FinalConfirmationController = class FinalConfirmationController {
    packsService;
    constructor(packsService) {
        this.packsService = packsService;
    }
    async findAllConfirmedPacks() {
        return this.packsService.findAllConfirmedPacks();
    }
    async revertToAssigned(packId) {
        return this.packsService.moveToNextStage(packId, 'assigned');
    }
    async sendSMS(packId) {
        return { message: `پیامک برای پک ${packId} ارسال شد` };
    }
};
exports.FinalConfirmationController = FinalConfirmationController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinalConfirmationController.prototype, "findAllConfirmedPacks", null);
__decorate([
    (0, common_1.Post)('revert/:packId'),
    __param(0, (0, common_1.Param)('packId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FinalConfirmationController.prototype, "revertToAssigned", null);
__decorate([
    (0, common_1.Post)('send-sms/:packId'),
    __param(0, (0, common_1.Param)('packId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FinalConfirmationController.prototype, "sendSMS", null);
exports.FinalConfirmationController = FinalConfirmationController = __decorate([
    (0, common_1.Controller)('final-confirmation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [packs_service_1.PacksService])
], FinalConfirmationController);
//# sourceMappingURL=FinalConfirmationController.js.map