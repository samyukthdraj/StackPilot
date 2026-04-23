import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpWrapperService {
  constructor(private readonly httpService: HttpService) {}

  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const observable = this.httpService.get<T>(url, config);
    return await firstValueFrom(observable);
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const observable = this.httpService.post<T>(url, data, config);
    return await firstValueFrom(observable);
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const observable = this.httpService.put<T>(url, data, config);
    return await firstValueFrom(observable);
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const observable = this.httpService.delete<T>(url, config);
    return await firstValueFrom(observable);
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const observable = this.httpService.patch<T>(url, data, config);
    return await firstValueFrom(observable);
  }
}
