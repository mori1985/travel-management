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
exports.PacksController = void 0;
const common_1 = require("@nestjs/common");
const packs_service_1 = require("./packs.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PacksController = class PacksController {
    packsService;
    constructor(packsService) {
        this.packsService = packsService;
    }
    async findAllWithPassengers(type) {
        console.log('Fetching packs with passengers, type:', type);
        return this.packsService.findAllWithPassengers(type);
    }
    async findAllAssignedPacks() {
        console.log('Fetching assigned packs...');
        return this.packsService.findAllAssignedPacks();
    }
    async moveToNextStage(packId, status) {
        console.log(`Received request to move pack ${packId} to status ${status}`);
        return this.packsService.moveToNextStage(packId, status);
    }
    async moveToPreviousStage(packId) {
        console.log(`Received request to move pack ${packId} to previous stage`);
        return this.packsService.moveToPreviousStage(packId);
    }
    async moveToAssigned(packId) {
        console.log(`Received request to move pack ${packId} to assigned`);
        return this.packsService.moveToNextStage(packId, 'assigned');
    }
    async assignPassengerToPack(passengerData, req) {
        console.log('Received request to assign passenger to pack:', passengerData);
        return this.packsService.assignPassengerToPack(passengerData, req);
    }
    async addPassengerToPack(packId, passengerData, req) {
        console.log(`Received request to add passenger to pack ${packId}:`, passengerData);
        const userId = req.user?.['sub'];
        if (!userId) {
            throw new Error('کاربر معتبر نیست');
        }
        const updatedPassengerData = { ...passengerData, packId };
        return this.packsService.assignPassengerToPack(updatedPassengerData, req);
    }
    async archiveOldPacks() {
        console.log('Received request to archive old packs');
        await this.packsService.archiveOldPacks();
        return { message: 'پک‌های قدیمی با موفقیت آرشیو شدند' };
    }
    async saveBusAssignment(packId, busAssignmentData, req) {
        console.log('Received request to saveBusAssignment for packId:', packId);
        console.log('BusAssignment data received in controller:', busAssignmentData);
        if (!busAssignmentData.company ||
            !busAssignmentData.plate ||
            !busAssignmentData.driver ||
            !busAssignmentData.driverPhone) {
            console.log('Validation failed: Missing required fields in busAssignmentData');
            throw new Error('لطفاً همه فیلدهای اطلاعات اتوبوس را پر کنید');
        }
        const userId = req.user?.['sub'];
        if (!userId) {
            throw new Error('کاربر معتبر نیست');
        }
        const result = await this.packsService.saveBusAssignment(packId, busAssignmentData);
        console.log('Save bus assignment result:', result);
        return result;
    }
};
exports.PacksController = PacksController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "findAllWithPassengers", null);
__decorate([
    (0, common_1.Get)('bus-assignment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "findAllAssignedPacks", null);
__decorate([
    (0, common_1.Post)('move-to-next-stage/:packId/:status'),
    __param(0, (0, common_1.Param)('packId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "moveToNextStage", null);
__decorate([
    (0, common_1.Post)('previous-stage/:packId'),
    __param(0, (0, common_1.Param)('packId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "moveToPreviousStage", null);
__decorate([
    (0, common_1.Post)('to-assigned/:packId'),
    __param(0, (0, common_1.Param)('packId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "moveToAssigned", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "assignPassengerToPack", null);
__decorate([
    (0, common_1.Post)(':packId/passengers'),
    __param(0, (0, common_1.Param)('packId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "addPassengerToPack", null);
__decorate([
    (0, common_1.Post)('archive-old'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "archiveOldPacks", null);
__decorate([
    (0, common_1.Post)('bus-assignment/:packId'),
    __param(0, (0, common_1.Param)('packId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "saveBusAssignment", null);
exports.PacksController = PacksController = __decorate([
    (0, common_1.Controller)('packs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [packs_service_1.PacksService])
], PacksController);
//# sourceMappingURL=packs.controller.js.map