// request.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// @Injectable()


export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {

    const token = localStorage.getItem('token')
    if (token) {
        const cloned = req.clone({
            setHeaders: {
                authorization: token,
            },
        });
        return next(cloned);
    } else {
        return next(req);
    }
};


export const errorInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Handle server-side errors (5xx)
            if (error.status >= 500 && error.status < 600) {
                console.error('Server-side error occurred:', error);
                // Custom logic for server-side errors
                alert('A server error occurred. Please try again later.');
            }
            // Handle client-side errors (4xx)
            else if (error.status >= 400 && error.status < 500) {
                console.error('Client-side error occurred:', error);
                // Custom logic for client-side errors
                if (error.status === 401) {
                    alert('Unauthorized. Please log in.');
                } else if (error.status === 403) {
                    alert('Forbidden. You do not have permission to access this resource.');
                } else {
                    alert('A client error occurred. Please check your input.');
                }
            }
            // Handle other status codes if needed
            else {
                console.error('An unknown error occurred:', error);
                alert('An unknown error occurred. Please try again later.');
            }

            return throwError(() => error);
        })
    );
}



// private getAuthToken(): string | null {
//         return localStorage.getItem('authToken');
//     }

// export class RequestInterceptor implements HttpInterceptor  {

//     constructor() { }

//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         // Check if the request is for login
//         const isLoginRequest = req.url.includes('/login');

//         console.log("ddddd")
//         // Clone the request to add new headers or modify it
//         let modifiedReq = req.clone({
//             setHeaders: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (!isLoginRequest) {
//             // For non-login requests, add Authorization header if token exists
//             const token = this.getAuthToken();
//             if (token) {
//                 modifiedReq = modifiedReq.clone({
//                     setHeaders: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//             }
//         }

//         // Handle the request and catch any errors
//         return next.handle(modifiedReq).pipe(
//             catchError((error: HttpErrorResponse) => {
//                 // Handle errors here as needed
//                 if (error.status >= 500 && error.status < 600) {
//                     console.error('Server-side error occurred:', error);
//                     alert('A server error occurred. Please try again later.');
//                 } else if (error.status >= 400 && error.status < 500) {
//                     console.error('Client-side error occurred:', error);
//                     if (error.status === 401) {
//                         alert('Unauthorized. Please log in.');
//                     } else if (error.status === 403) {
//                         alert('Forbidden. You do not have permission to access this resource.');
//                     } else {
//                         alert('A client error occurred. Please check your input.');
//                     }
//                 } else {
//                     console.error('An unknown error occurred:', error);
//                     alert('An unknown error occurred. Please try again later.');
//                 }
//                 return throwError(() => error);
//             })
//         );
//     }

//     // Method to retrieve the auth token (if any)
//     private getAuthToken(): string | null {
//         return localStorage.getItem('authToken');
//     }
// }
