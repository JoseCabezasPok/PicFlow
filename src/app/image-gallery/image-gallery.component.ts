import { Component, OnInit } from '@angular/core';
import {DataService} from '../services/data.service';
import {UnsplashItem} from './types';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css']
})
export class ImageGalleryComponent implements OnInit {

  public unsplashItemList = [];
  public thisPage = 1;
  public numberPages: number;
  public detail = false;
  public zoomed = false;
  public detailId: string;
  public detailUrl: string;
  public showPagination = false;
  public zoomedUrl;
  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['q'] != null){
        this.getDogs(params.q);
      }
      else {
        this.getRandom();
      }
    });
  }
  getDogs(query: string){
    this.showPagination = true;
    this.unsplashItemList = [];
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
        unsplashItem.imgFull = e.urls.raw;
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
      this.ngOnInit();
    }
  }
  showDetail(item: UnsplashItem){
    this.detail = true;
    this.detailId = item.id;
    this.detailUrl = item.imgRegular + '&h=250&dpr=2';
    this.zoomedUrl = item.imgFull;
  }
  hideDetail(){
    this.detail = false;
    this.zoomed = false;
  }
  enlarge(){
   this.zoomed = true;
  }
  collapse(){
    this.zoomed = false;
  }

}
