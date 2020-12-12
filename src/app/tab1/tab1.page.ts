import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {WordpressService} from '../services/wordpress.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers:[WordpressService]
})
export class Tab1Page implements OnInit {
  items: any[];
  attachs: any[];
  thumbs =  new Map();
  thumbsArr: any[];
  categoryName: string;
  page: number;
  loaded: boolean;
  loading: boolean;

  constructor(public navCtrl: NavController,public wordpressService: WordpressService, private route: ActivatedRoute, private router: Router, public toastCtrl: ToastController) {
  }

  getKeys(map){
    return Array.from(map.keys());
  }

goTo(str: string){
    this.router.navigate([ '/tabs/post/'+ str ]);
  }

  loadPosts(){
    this.loading = true; 

    if(this.wordpressService.wp_org){
      this.wordpressService.getPosts(this.page).subscribe(data => {
        this.items = data;
        for (let res of data) {
          if(!this.thumbs.has(res.id)){
            this.thumbs.set(res.id, {id: res.id, title: res.title.rendered, excerpt: res.excerpt.rendered});
          }        
        }
        this.loading = false;
          document.getElementById("initoast").click();
        this.loaded = true;
      }); 
 }
    else {
      this.wordpressService.getPosts(
      this.page).subscribe(data => {
        this.items = data.posts;
        for (let res of data.posts) {
          if(!this.thumbs.has(res.ID)){
            this.thumbs.set(res.ID, {id: res.ID, title: res.title, content: res.content.replace('<li class="jetpack-recipe-print"><a href="#">Print</a></li>','')});
          }        
        }
        this.loading = false;
        this.loaded = true;
      });
    }
  }

  async openToast() {  
 const toast = await this.toastCtrl.create({  
      message: 'Berhasil memuat konten',  
      duration: 2000  
    });  
    toast.present();  
  }    
  

  next() {
    this.page++;
    this.loadPosts(); 
  } 

  ngOnInit() {
    this.loading = false;
    this.page = 1;
    this.loadPosts();
  }   
 }
