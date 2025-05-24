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
const packs_service_1 = require("../packs/packs.service");
let BusAssignmentController = class BusAssignmentController {
    busAssignmentService;
    packsService;
    constructor(busAssignmentService, packsService) {
        this.busAssignmentService = busAssignmentService;
        this.packsService = packsService;
    }
    async findAllWithPassengers() {
        console.log('Received request to fetch packs for bus assignment');
        const packs = await this.busAssignmentService.findAllWithPassengers();
        console.log('Fetched packs:', packs);
        return packs;
    }
    async createBusAssignment(packId, busAssignmentData) {
        console.log(`Received request to create bus assignment for pack ${packId}:`, busAssignmentData);
        const result = await this.busAssignmentService.createBusAssignment(packId, busAssignmentData);
        console.log('Bus assignment created:', result);
        return result;
    }
    async moveToNextStage(packId, status) {
        console.log(`Received request to move pack ${packId} to status ${status}`);
        const result = await this.packsService.moveToNextStage(packId, status);
        console.log(`Pack ${packId} moved to next stage:`, result);
        return result;
    }
    async moveToPreviousStage(packId) {
        console.log(`Received request to move pack ${packId} to previous stage`);
        const result = await this.packsService.moveToPreviousStage(packId);
        console.log(`Pack ${packId} moved to previous stage:`, result);
        return result;
    }
};
exports.BusAssignmentController = BusAssignmentController;
__decorate([
    (0, common_1.Get)('packs/bus-assignment'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BusAssignmentController.prototype, "findAllWithPassengers", null);
__decorate([
    (0, common_1.Post)(':packId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('packId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_bus_assignment_dto_1.CreateBusAssignmentDto]),
    __metadata("design:returntype", Promise)
], BusAssignmentController.prototype, "createBusAssignment", null);
__decorate([
    (0, common_1.Post)(':packId/move-to-next-stage'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('packId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], BusAssignmentController.prototype, "moveToNextStage", null);
__decorate([
    (0, common_1.Post)(':packId/previous-stage'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('packId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BusAssignmentController.prototype, "moveToPreviousStage", null);
exports.BusAssignmentController = BusAssignmentController = __decorate([
    (0, common_1.Controller)('bus-assignment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [bus_assignment_service_1.BusAssignmentService,
        packs_service_1.PacksService])
], BusAssignmentController);
//# sourceMappingURL=bus-assignment.controller.js.map