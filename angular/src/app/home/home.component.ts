import { Component } from '@angular/core';
import { CategoryComponent } from "../category/category.component";
import { SliderComponent } from "../slider/slider.component";
import { OffersComponent } from "../offers/offers.component";
import { SaleComponent } from "../sale/sale.component";
import { BestDealsComponent } from "../best-deals/best-deals.component";
import { CategoryCardsComponent } from "../category-cards/category-cards.component";
import { FeaturedProductsComponent } from "../featured-products/featured-products.component";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CategoryComponent, SliderComponent, OffersComponent, SaleComponent, BestDealsComponent, CategoryCardsComponent, FeaturedProductsComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {



}
