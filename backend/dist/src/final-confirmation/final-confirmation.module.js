"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalConfirmationModule = void 0;
const common_1 = require("@nestjs/common");
const final_confirmation_service_1 = require("./final-confirmation.service");
const final_confirmation_controller_1 = require("./final-confirmation.controller");
const prisma_service_1 = require("../prisma.service");
let FinalConfirmationModule = class FinalConfirmationModule {
};
exports.FinalConfirmationModule = FinalConfirmationModule;
exports.FinalConfirmationModule = FinalConfirmationModule = __decorate([
    (0, common_1.Module)({
        controllers: [final_confirmation_controller_1.FinalConfirmationController],
        providers: [final_confirmation_service_1.FinalConfirmationService, prisma_service_1.PrismaService],
    })
], FinalConfirmationModule);
//# sourceMappingURL=final-confirmation.module.js.map