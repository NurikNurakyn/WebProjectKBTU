import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

const TOKEN_STORAGE_KEY = 'mountup_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'mountup_refresh_token';
const USER_STORAGE_KEY = 'mountup_user';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (!token) {
    return next(req);
  }

  const authRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authRequest).pipe(
    catchError((error) => {
      const detail = error?.error?.detail;
      const hasInvalidTokenError =
        error?.status === 401 &&
        typeof detail === 'string' &&
        detail.includes('Given token not valid for any token type');

      if (!hasInvalidTokenError) {
        return throwError(() => error);
      }

      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);

      return next(req);
    }),
  );
};
