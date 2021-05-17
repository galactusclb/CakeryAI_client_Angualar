import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[appReportUploadingFormValidation]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ReportUploadingFormValidationDirective,
      multi: true,
    },
  ],
})
export class ReportUploadingFormValidationDirective implements Validator {
  @Input() appReportUploadingFormValidation: number;
  validate(control: AbstractControl): { [key: string]: any } | null {
    if (
      this.appReportUploadingFormValidation == null ||
      (this.appReportUploadingFormValidation == 1 &&
        control.value == 'Month') ||
      control.value == 'month'
    ) {
      return null;
    } else return { notMonthSelected: true };
  }
}
