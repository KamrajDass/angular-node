import { InjectionToken } from '@angular/core';
import { baseUrl } from '../environment/environment';
export const API_BASE_URL = new InjectionToken<string>('apiBaseUrl');
export const API_URL = baseUrl