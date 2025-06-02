"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_service_1 = require("./prisma.service");
const auth_module_1 = require("./auth/auth.module");
const passengers_module_1 = require("./passengers/passengers.module");
const packs_module_1 = require("./packs/packs.module");
const bus_assignment_module_1 = require("./bus-assignment/bus-assignment.module");
const final_confirmation_module_1 = require("./final-confirmation/final-confirmation.module");
const passengerssearch_module_1 = require("./passengerssearch/passengerssearch.module");
const report_module_1 = require("./report/report.module");
const sms_module_1 = require("./sms/sms.module");
const sms_report_module_1 = require("./sms-report/sms-report.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            passengers_module_1.PassengersModule,
            packs_module_1.PacksModule,
            bus_assignment_module_1.BusAssignmentModule,
            final_confirmation_module_1.FinalConfirmationModule,
            passengerssearch_module_1.PassengersSearchModule,
            report_module_1.ReportModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            sms_module_1.SmsModule,
            sms_report_module_1.SmsReportModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map