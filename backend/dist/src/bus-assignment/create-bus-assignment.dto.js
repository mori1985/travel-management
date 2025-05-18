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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBusAssignmentDto = void 0;
const class_validator_1 = require("class-validator");
class CreateBusAssignmentDto {
    company;
    plate;
    driver;
    driverPhone;
}
exports.CreateBusAssignmentDto = CreateBusAssignmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'نام شرکت الزامی است' }),
    __metadata("design:type", String)
], CreateBusAssignmentDto.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'پلاک الزامی است' }),
    (0, class_validator_1.Matches)(/^\d{3}-[آ-یا-ی]{1}-\d{2}$/, {
        message: 'فرمت پلاک باید مثل ۱۲۳-ج-۴۵ باشد',
    }),
    __metadata("design:type", String)
], CreateBusAssignmentDto.prototype, "plate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'نام راننده الزامی است' }),
    __metadata("design:type", String)
], CreateBusAssignmentDto.prototype, "driver", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'شماره موبایل راننده الزامی است' }),
    (0, class_validator_1.Matches)(/^09\d{9}$/, {
        message: 'فرمت شماره موبایل باید مثل 09123456789 باشد',
    }),
    __metadata("design:type", String)
], CreateBusAssignmentDto.prototype, "driverPhone", void 0);
//# sourceMappingURL=create-bus-assignment.dto.js.map