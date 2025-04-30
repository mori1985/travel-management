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
const create_pack_dto_1 = require("./dto/create-pack.dto");
const update_pack_dto_1 = require("./dto/update-pack.dto");
let PacksController = class PacksController {
    packsService;
    constructor(packsService) {
        this.packsService = packsService;
    }
    create(createPackDto, req) {
        return this.packsService.create(createPackDto, req.user.role);
    }
    findAll(type, startDate, endDate) {
        return this.packsService.findAll({ type, startDate, endDate });
    }
    findOne(id) {
        return this.packsService.findOne(+id);
    }
    findPassengers(id) {
        return this.packsService.findPassengers(+id);
    }
    update(id, updatePackDto, req) {
        return this.packsService.update(+id, updatePackDto, req.user.role);
    }
    remove(id, req) {
        return this.packsService.remove(+id, req.user.role);
    }
};
exports.PacksController = PacksController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pack_dto_1.CreatePackDto, Object]),
    __metadata("design:returntype", void 0)
], PacksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PacksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PacksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/passengers'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PacksController.prototype, "findPassengers", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pack_dto_1.UpdatePackDto, Object]),
    __metadata("design:returntype", void 0)
], PacksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PacksController.prototype, "remove", null);
exports.PacksController = PacksController = __decorate([
    (0, common_1.Controller)('packs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [packs_service_1.PacksService])
], PacksController);
//# sourceMappingURL=packs.controller.js.map