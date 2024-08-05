import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export function usernameValidator(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) {
            return of(null);
        }
        return control.valueChanges.pipe(
            debounceTime(300), // Optional: debounce to avoid too many requests
            switchMap(value =>
                authService.checkUsername(value).pipe(
                    map(isAvailable => {
                        console.log("isAvailable", isAvailable)
                        return (isAvailable ? null : { usernameTaken: true })
                    }),
                    catchError(() => of({ serverError: true })) // Handle server errors
                )
            )
        );
    };
}  