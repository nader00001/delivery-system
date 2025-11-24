import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const user = localStorage.getItem('user');
  
  if (user) {
    const userData = JSON.parse(user);
    const clonedReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${userData.token || ''}`,
        'Content-Type': 'application/json'
      }
    });
    return next(clonedReq);
  }

  return next(req);
};