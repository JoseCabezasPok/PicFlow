import { Component, OnInit } from '@angular/core';
import {DataService} from '../services/data.service';
import {UnsplashItem} from './types';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css']
})
export class ImageGalleryComponent implements OnInit {
  public query = '';
  public unsplashItemList = [];
  public thisPage = 1;
  public numberPages: number;
  public detail = false;
  public zoomed = false;
  public detailTitle: string;
  public detailUrl: string;
  public showPagination = false;
  public zoomedUrl;
  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['q'] != null){
        if ( params['q'] !== this.query){
          this.query = params['q'];
          this.getTerm(this.query);
        }
      }
      else {
        this.getRandom();
      }
    });
  }
  getTerm(query: string){
    this.showPagination = true;
    this.unsplashItemList = [];
    this.dataService.getImgByTerm(query, this.thisPage.toString()).subscribe(response => {
      response.results.forEach(e => {
        this.numberPages = response.total_pages;
        const unsplashItem = {
          title : e.alt_description,
          creationDate:  e.created_at,
          description : e.description,
          imgFull : e.urls.full,
          imgRegular:  e.urls.regular,
          imgSmall : e.urls.small,
          imgThumb : e.urls.thumb,
          userName : e.user.username
        };

        this.unsplashItemList.push(unsplashItem);
      });
    });
  }
  getRandom(){
    this.unsplashItemList = [];
    this.showPagination = false;
    this.dataService.getRandomPictures().subscribe(response => {
      response.forEach(e => {
        const unsplashItem = {
          title : e.alt_description,
          creationDate:  e.created_at,
          description : e.description,
          imgFull : e.urls.full,
          imgRegular:  e.urls.regular,
          imgSmall : e.urls.small,
          imgThumb : e.urls.thumb,
          userName : e.user.username
        };
        this.unsplashItemList.push(unsplashItem);
      });
    });
  }
  left(){
    if (this.thisPage > 1){
      this.query = '';
      this.thisPage--;
      this.ngOnInit();
    }
  }
  right(){
    if (this.thisPage < this.numberPages){
      this.query = '';
      this.thisPage++;
      this.ngOnInit();
    }
  }
  showDetail(item: UnsplashItem){
    this.detail = true;
    this.detailTitle = item.title;
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
  search(term: string){
    this.thisPage = 1;
    this.router.navigate([term]);
  }
}
