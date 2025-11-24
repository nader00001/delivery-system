import { bootstrapApplication } from "@angular/platform-browser"
import { provideRouter } from "@angular/router"
import { provideHttpClient, HTTP_INTERCEPTORS } from "@angular/common/http"
import { provideAnimations } from "@angular/platform-browser/animations"
import { AppComponent } from "./app/app.component"
import { routes } from "./app/app.routes"
import { HttpConfigInterceptor } from "./app/core/interceptors/http.interceptor"

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    provideAnimations(),
  ],
}).catch((err) => console.error(err))
