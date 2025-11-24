import { Injectable, inject } from "@angular/core"
import { type ActivatedRouteSnapshot, type CanActivateFn, Router, type RouterStateSnapshot } from "@angular/router"

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  private readonly router = inject(Router)

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem("token")

    if (token) {
      return true
    }

    this.router.navigate(["/login"])
    return false
  }
}

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(AuthGuard).canActivate(route, state)
}
