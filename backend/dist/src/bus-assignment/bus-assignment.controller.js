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
exports.BusAssignmentController = void 0;
const common_1 = require("@nestjs/common");
const bus_assignment_service_1 = require("./bus-assignment.service");
const create_bus_assignment_dto_1 = require("./create-bus-assignment.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let BusAssignmentController = class BusAssignmentController {
    busAssignmentService;
    constructor(busAssignmentService) {
        this.busAssignmentService = busAssignmentService;
    }
    async findAllWithPassengers() {
        return this.busAssignmentService.findAllWithPassengers();
    }
    async assignBus(packId, busAssignmentData) {
        return this.busAssignmentService.assignBus(+packId, busAssignmentData);
    }
};
exports.BusAssignmentController = BusAssignmentController;
__decorate([
    (0, common_1.Get)('/packs/bus-assignment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BusAssignmentController.prototype, "findAllWithPassengers", null);
__decorate([
    (0, common_1.Post)(':packId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('packId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_bus_assignment_dto_1.CreateBusAssignmentDto]),
    __metadata("design:returntype", Promise)
], BusAssignmentController.prototype, "assignBus", null);
exports.BusAssignmentController = BusAssignmentController = __decorate([
    (0, common_1.Controller)('bus-assignment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [bus_assignment_service_1.BusAssignmentService])
], BusAssignmentController);
//# sourceMappingURL=bus-assignment.controller.js.map