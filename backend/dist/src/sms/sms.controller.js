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
exports.SmsController = void 0;
const common_1 = require("@nestjs/common");
const sms_service_1 = require("./sms.service");
const send_sms_dto_1 = require("./send-sms.dto");
let SmsController = class SmsController {
    smsService;
    constructor(smsService) {
        this.smsService = smsService;
    }
    async sendSms(packId, sendSmsDto) {
        console.log('Received sendSms request:', { packId, sendSmsDto });
        const adminId = 1;
        return this.smsService.sendSms(packId, sendSmsDto, adminId);
    }
    async getSmsReport(packId) {
        return this.smsService.getSmsReport(packId);
    }
    getCompaniesAndResponsibles() {
        return this.smsService.getCompaniesAndResponsibles();
    }
    async getDefaultMessage(packId) {
        const messageText = await this.smsService.generateMessageText(packId);
        return { messageText };
    }
};
exports.SmsController = SmsController;
__decorate([
    (0, common_1.Post)('send/:packId'),
    __param(0, (0, common_1.Param)('packId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, send_sms_dto_1.SendSmsDto]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "sendSms", null);
__decorate([
    (0, common_1.Get)('report/:packId'),
    __param(0, (0, common_1.Param)('packId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "getSmsReport", null);
__decorate([
    (0, common_1.Get)('options'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SmsController.prototype, "getCompaniesAndResponsibles", null);
__decorate([
    (0, common_1.Get)('default-message/:packId'),
    __param(0, (0, common_1.Param)('packId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SmsController.prototype, "getDefaultMessage", null);
exports.SmsController = SmsController = __decorate([
    (0, common_1.Controller)('sms'),
    __metadata("design:paramtypes", [sms_service_1.SmsService])
], SmsController);
//# sourceMappingURL=sms.controller.js.map