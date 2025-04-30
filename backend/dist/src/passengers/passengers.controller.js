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
exports.PassengersController = void 0;
const common_1 = require("@nestjs/common");
const passengers_service_1 = require("./passengers.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_passenger_dto_1 = require("./dto/create-passenger.dto");
const client_1 = require("@prisma/client");
let PassengersController = class PassengersController {
    passengersService;
    constructor(passengersService) {
        this.passengersService = passengersService;
    }
    create(createPassengerDto, req) {
        return this.passengersService.create(createPassengerDto, req.user.role, req.user.userId);
    }
    findAll(travelType, startDate, endDate) {
        return this.passengersService.findAll({ travelType, startDate, endDate });
    }
    findOne(id) {
        return this.passengersService.findOne(+id);
    }
    update(id, data, req) {
        return this.passengersService.update(+id, data, req.user.role);
    }
    remove(id, req) {
        return this.passengersService.remove(+id, req.user.role);
    }
};
exports.PassengersController = PassengersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_passenger_dto_1.CreatePassengerDto, Object]),
    __metadata("design:returntype", void 0)
], PassengersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('travelType')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PassengersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PassengersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], PassengersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PassengersController.prototype, "remove", null);
exports.PassengersController = PassengersController = __decorate([
    (0, common_1.Controller)('passengers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [passengers_service_1.PassengersService])
], PassengersController);
//# sourceMappingURL=passengers.controller.js.map