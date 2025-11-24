import { Injectable } from "@angular/core"
import type { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from "@angular/common/http"
import { type Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem("token")

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
    } else {
      request = request.clone({
        setHeaders: {
          "Content-Type": "application/json",
        },
      })
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem("token")
          window.location.href = "/login"
        }
        return throwError(() => error)
      }),
    )
  }
}
