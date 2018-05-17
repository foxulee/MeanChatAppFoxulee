import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NewsService {

  constructor(private http: HttpClient) { }

  getNews(page: number) {
    return this.http.get(`https://content.guardianapis.com/football?order-by=newest&show-fields=all&page=${page}&api-key=aeaa2d7f-f449-4b25-8904-8909cbedfc97`)
      .map(data => {
        // console.log('data', data)
        return data['response']['results'];
      });
  }

}
