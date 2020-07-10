import { Component, OnInit } from '@angular/core';
import {DataService} from '../services/data.service';
import {UnsplashItem} from './types';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css']
})
export class ImageGalleryComponent implements OnInit {

  public unsplashItemList = [];
  public thisPage = 1;
  public numberPages: number;
  public zoom = false;
  public zoomedId: string;
  public zoomedUrl: string;
  public showPagination = false;
  constructor(private dataService: DataService) {

  }

  ngOnInit(): void {
    this.getRandom();
  }
  getDogs(){
    this.showPagination = true;
    this.unsplashItemList = [];
    const query = 'dog';
    this.dataService.getImgByTerm(query, this.thisPage.toString()).subscribe(response => {
      response.results.forEach(e => {
        this.numberPages = response.total_pages;
        const unsplashItem = new UnsplashItem() ;
        unsplashItem.id = e.id;
        unsplashItem.creationDate = e.created_at;
        unsplashItem.description = e.description;
        unsplashItem.imgFull = e.urls.full;
        unsplashItem.imgRegular = e.urls.regular;
        unsplashItem.imgSmall = e.urls.small;
        unsplashItem.imgThumb = e.urls.thumb;
        unsplashItem.userName = e.user.username;
        this.unsplashItemList.push(unsplashItem);
      });
    });
  }
  getRandom(){
    this.unsplashItemList = [];
    this.showPagination = false;
    this.dataService.getRandomPictures().subscribe(response => {
      response.forEach(e => {
        const unsplashItem = new UnsplashItem() ;
        unsplashItem.id = e.id;
        unsplashItem.creationDate = e.created_at;
        unsplashItem.description = e.description;
        unsplashItem.imgFull = e.urls.full;
        unsplashItem.imgRegular = e.urls.regular;
        unsplashItem.imgSmall = e.urls.small;
        unsplashItem.imgThumb = e.urls.thumb;
        unsplashItem.userName = e.user.username;
        this.unsplashItemList.push(unsplashItem);
      });
    });
  }
  left(){
    if (this.thisPage > 1){
      this.thisPage--;
      this.ngOnInit();
    }
  }
  right(){
    if (this.thisPage < this.numberPages){
      this.thisPage++;
      this.getDogs();
    }
  }
  showZoom(item: UnsplashItem){
    this.zoom = true;
    this.zoomedId = item.id;
    this.zoomedUrl = item.imgRegular + '&h=250&dpr=2';
  }
  hideZoom(){
    this.zoom = false;
  }

}
