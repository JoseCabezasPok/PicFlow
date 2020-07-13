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
  // Array of elements used to render the page
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
  // This method has control over search form actions.
  search(term: string){
    this.thisPage = 1;
    this.router.navigate([term]);
  }
  // This method will return 10 pictures related to the search term, also has control over pagination queries
  getTerm(query: string){
    this.showPagination = true;
    this.unsplashItemList = [];
    this.dataService.getImgByTerm(query, this.thisPage.toString()).subscribe(response => {
      response.results.forEach(e => {
        this.numberPages = response.total_pages;
        const unsplashItem: UnsplashItem = {
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
      if ( this.unsplashItemList.length === 0 ){
        this.showPagination = false;
      }
    });
  }
  // This method will return 10 random pictures to show on home page
  getRandom(){
    this.unsplashItemList = [];
    this.showPagination = false;
    this.dataService.getRandomPictures().subscribe(response => {
      response.forEach(e => {
        const unsplashItem: UnsplashItem = {
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
  // This method controls the prev page in pagination
  left(){
    if (this.thisPage > 1){
      this.query = '';
      this.thisPage--;
      this.ngOnInit();
    }
  }
  // This method controls the next page in pagination
  right(){
    if (this.thisPage < this.numberPages){
      this.query = '';
      this.thisPage++;
      this.ngOnInit();
    }
  }
  // This method shows the modal when clicking on an element
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
  // Switch to zoomed state wich will render a larger image inside the modal
  enlarge(){
   this.zoomed = true;
  }
  collapse(){
    this.zoomed = false;
  }
}
