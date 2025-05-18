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
        return this.packsService.findAllWithPassengers(type);
    }
    async nextStage(id, status) {
        return this.packsService.nextStage(+id, status);
    }
    async assignPassengerToPack(passengerData, req) {
        return this.packsService.assignPassengerToPack(passengerData, req);
    }
    async addPassengerToPack(packId, passengerData, req) {
        const userId = req.user?.['sub'];
        if (!userId) {
            throw new Error('کاربر معتبر نیست');
        }
        return this.packsService.addPassengerToPack(packId, { ...passengerData, createdById: userId });
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
    (0, common_1.Post)('next-stage/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], PacksController.prototype, "nextStage", null);
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
exports.PacksController = PacksController = __decorate([
    (0, common_1.Controller)('packs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [packs_service_1.PacksService])
], PacksController);
//# sourceMappingURL=packs.controller.js.map