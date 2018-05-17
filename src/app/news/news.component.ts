import { Component, OnInit } from '@angular/core';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  newsList: any[] = [];
  page = 1;

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.newsService.getNews(this.page).subscribe(newsList => {
      for (let news of newsList) {
        this.newsList.push(news);
      }
    });
  }

  loadMore() {
    this.page++;
    this.newsService.getNews(this.page).subscribe(newsList => {
      for (let news of newsList) {
        this.newsList.push(news);
      }
    });
  }

  scrollToTop() {
    // window.scrollTo(0,0)
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }

}
