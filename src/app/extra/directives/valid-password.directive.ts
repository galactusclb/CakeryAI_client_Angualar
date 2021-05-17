import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[appValidPassword]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ValidPasswordDirective,
      multi: true,
    },
  ],
})
export class ValidPasswordDirective implements Validator {
  // @Input() appConfirmEqualValidator: string;
  validate(control: AbstractControl): { [key: string]: any } | null {
    // const controlToCompare = control.parent.get(this.appConfirmEqualValidator);

    var decimal =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

    console.log(control.value);
    if (!control.value.match(decimal)) {
      return { notValidPassword: true };
    }
    return null;
  }
}
