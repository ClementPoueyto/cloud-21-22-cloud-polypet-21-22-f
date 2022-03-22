import { CatalogItemDto } from './dto/catalog-item.dto';
import { CartItemDto } from './dto/cart-item.dto';
import { CollectionReference } from '@google-cloud/firestore';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BankService } from './bank/bank.service';
import { CartValidationDto } from './dto/cart-validation.dto';
import { CartDocument } from './models/cart.document';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { OrderDto } from './dto/order.dto';
import {StockDto} from "./dto/stock.dto";
import { CartDto } from './dto/cart.dto';

@Injectable()
export class AppService {
  readonly ORDERS_SERVICE_URL: string = "https://cloud-polypet-team-f.oa.r.appspot.com/order";
  readonly CATALOG_SERVICE_URL: string = "https://cloud-polypet-team-f.oa.r.appspot.com/catalog"
  readonly PARTNER_SERVICE_URL: string = "https://cloud-polypet-team-f.oa.r.appspot.com/partner"
  constructor(
    @Inject(CartDocument.collectionName)
    private cartCollection: CollectionReference<CartDocument>,
    @Inject(ConfigService)
    private configService: ConfigService,
    private readonly httpService: HttpService,

    @Inject(BankService)
    private bankService: BankService
  ) { }

  getHello(): string {
    return 'Hello World Cart!';
  }

  async updateStock(cart: CartDocument) {
    const param = cart.items.map(function (e) { return { id: e.itemId, quantity: -e.quantity } });
    try {
      const response$ = await this.httpService.put(this.CATALOG_SERVICE_URL + "/add-to-stocks",
        param).pipe(
          map(response => response.data)
        )
      const res = await firstValueFrom(response$);

    }
    catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async validateCart(id: string, infos: CartValidationDto) {
    let items: StockDto[] = [];
    // on récupère le panier
    if (infos.address == null || infos.creditCard == null || infos.name == null) {
      throw new HttpException("informations client non valables", HttpStatus.BAD_REQUEST)
    }
    let cart = await this.getCartByClientId(id);
    if (cart.items.length === 0)
      throw new HttpException("panier vide", HttpStatus.BAD_REQUEST)
    items = await this.getItemsDetails(cart)
    const stockError = await this.checkStock(items, cart)
    if (stockError.length > 0) {
      throw new HttpException("quantités non disponible pour les produits :" + stockError, HttpStatus.BAD_REQUEST)
    }
    // on vérifie le paiment avec la banque
    if (await this.bankService.verifyPaiment(infos.creditCard, cart)) {
      // on envoie la requête au service de commande
      let order = new OrderDto();
      order.informations = infos;
      order.cart = cart;
      order.cart.totalPrice = this.calculPrice(items, cart)
      console.log("request to order: \n"+JSON.stringify(order))
      await firstValueFrom(this.httpService.post(this.ORDERS_SERVICE_URL, order)); // manque le gestion de l'erreur mais pour un mvp / poc flemme
      // on ajoute les infos des produits des partenaire sur la bd
      const prods=await this.getProductsById(id);
      console.log("cart")
      console.log(JSON.stringify(cart))
      console.log("prods")
      console.log(JSON.stringify(prods))
/*
      const response$ = await this.httpService.get(this.CATALOG_SERVICE_URL + "/items?ids="+ids.join()).pipe(
          map(response => response.data)
      )
      items = await firstValueFrom(response$);*/

      Array.prototype.forEach.call(prods,async item=>
      {await firstValueFrom(this.httpService.post(this.PARTNER_SERVICE_URL+"/Sold",item));
      console.log("item"+JSON.stringify(item))})
      //prods.foreach(item=>this.httpService.post(this.PARTNER_SERVICE_URL+"/Sold",item))
      // et on supprime le panier 
      this.removeCartByClientId(id);
      // on met à jour le stock
      for (let i = 0; i < cart.items.length; i++){
        await firstValueFrom(this.httpService.put(this.CATALOG_SERVICE_URL + "/product-purchased?id=" + cart.items[i].itemId + "&quantity=" + cart.items[i].quantity))
      }
      return order
    }
  }

  async checkStock(items : StockDto[], cart : CartDocument): Promise<Array<string>> {
    let quantityError = []
    items.forEach((item) => {
      cart.items.forEach((cartItem) => {
        if (item.product.id === cartItem.itemId && item.quantity < cartItem.quantity) {
          quantityError.push(item.product.id);
        }
      })
    })
    return quantityError;
  }

  async getItemsDetails(cart: CartDocument){
    //l'ensemble des informations de chaque produit ainsi que la description
    let items = [];
    let ids = [];
    //recupere la liste des id d'objet
    ids = cart.items.map(function (e) { return e.itemId; })
    //si le panier du client n'est pas vide
    if (cart.items.length != 0) {
      try {


        const response$ = await this.httpService.get(this.CATALOG_SERVICE_URL + "/items?ids="+ids.join()).pipe(
          map(response => response.data)
        )
        items = await firstValueFrom(response$);
        return items;

      }
      catch (e) {
      }
    }
  }

  async removeCartByClientId(id: string) {
    const docRef = this.cartCollection.doc(id);
    docRef.delete();
  }

  async getCartByClientId(id: string) {
    const docRef = this.cartCollection.doc(id);
    // on récupère le panier
    let cartRes = await docRef.get();
    //Si pas de panier alors on en crée un
    if (!cartRes.data()) {
      await docRef.set({totalPrice:0,items: [] })
      cartRes = await this.cartCollection.doc(id).get()
    }

    return cartRes.data();
  }

  calculPrice(list, cart){
    console.log(list)
    for(let item of list){
      for(let cartItem of cart.items){
        if (item.product.id === cartItem.itemId){
          item.quantity = cartItem.quantity
        }
      }
    }
    let totalPrice = 0;
    console.log("PRICE")
    for(const item of list){
      console.log(item)
      if(item.product.discount!=null){
        totalPrice += item.product.discount.priceAfterReduction*item.quantity
      }
      else{
        totalPrice+= item.product.price*item.quantity
      }
    }
    return totalPrice;
  }

  async getItemCatalogInCart(id: string) {
    //on recupere le panier du client
    const cart = await this.getCartByClientId(id)
    //l'ensemble des informations de chaque produit ainsi que la description
    let items = [];
    let ids = [];
    //recupere la liste des id d'objet
    ids = cart.items.map(function (e) { return e.itemId; })
    //si le panier du client n'est pas vide
    if (cart.items.length != 0) {
      try {
        const response$ = await this.httpService.get(this.CATALOG_SERVICE_URL + "/items?ids="+ids.join()).pipe(
          map(response => response.data)
        )
        items = await firstValueFrom(response$);
        console.log(items)
        //ajoute la quantite demandee par le client pour chaque objet
        let n=0;
        for(const catalogItem of items){
          for(const cartItem of cart.items){
            if (catalogItem.product.id == cartItem.itemId) {
              items[n].quantity= cartItem.quantity
            }
          }
          n++;
        }
        
      }
      catch (e) {
        throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
    let resCart = new CartDto();
    resCart.items = items.map(function (e) { 
      let it = new CatalogItemDto();
      it.discount=e.product.discount
      it.id = e.product.id
      it.name = e.product.name
      it.price = e.product.price
      it.quantity = e.quantity
      return it;

    });
    resCart.totalPrice = this.calculPrice(resCart.items.map(function (e) { return {product : e, quantity : e.quantity}; }), cart);
    return resCart
  }

  async updateCartByClientId(id: string, CartDocument: CartDocument) {
    const docRef = this.cartCollection.doc(id);
    docRef.set(CartDocument)
  }

  async updateItemToCart(id: string, items: Array<CartItemDto>) {
    // on récupère le panier du client
    let cart = await this.getCartByClientId(id);
    console.log(cart)
    //pour chaque objet on l'ajoute à la liste ou on incrémente la quantité s'il est deja présent
    for (const item of items) {
      try {
        //recupere l'index dans le tableau
        const itemIndex = cart.items.map(function (e) { return e.itemId; }).indexOf(item.itemId)
        if (itemIndex === -1) {
          //si l'objet est nouveau et que la quantité est positive on l'ajoute
          if (item.quantity > 0) {
            //verifie si le stock disponible est suffisant pour la quantité demandée
            const res = await this.checkProductAvailable(item.itemId, item.quantity);
            console.log(res)
            if (res) {
              cart.items.push(item)
            }
            else {
              throw new HttpException("quantité non disponible pour le produit: " + item.itemId, HttpStatus.BAD_REQUEST)
            }
          }
        }
        else {
          const newQuantity = cart.items[itemIndex].quantity + item.quantity;
          let res=false;
          //si la quantité est negative on souhaite retirer des objets du panier
          if(item.quantity<0){
            res=true;
          }
          else{
            //verifie si le stock disponible est suffisant pour la quantité demandée
            res = await this.checkProductAvailable(item.itemId, newQuantity);
          }
          if (res) {
            cart.items[itemIndex].quantity = newQuantity
          }
          else {
            throw new HttpException("quantité non disponible pour le produit: " + item.itemId, HttpStatus.BAD_REQUEST)
          }
          //lorsque l'objet a une quantite de 0 ou moins il est retiré de la liste
          if (cart.items[itemIndex].quantity <= 0) {
            cart.items.splice(itemIndex, 1);
          }
        }
      }
      catch (e) {
        throw new HttpException("quantité non disponible pour le produit: " + item.itemId, HttpStatus.BAD_REQUEST)
      }
    }
    this.updateCartByClientId(id, cart)
    return cart.items;

  }

  async checkProductAvailable(id: string, quantity: number) {
    try {
      const response$ = await this.httpService.get(this.CATALOG_SERVICE_URL + "/can-be-added?id=" + id + "&quantity=" + quantity).pipe(
        map(response => response.data)
      )
      const res = await firstValueFrom(response$);
      //ajoute la quantite demandee par le client pour chaque objet
      return res;
    }
    catch (e) {
    }
    return false;
  }

  async getAllItemIds(idClient:string)
  {
    const cart=await this.getCartByClientId(idClient);
    const itemIds: string[]=[]
    cart.items.forEach(item=>itemIds.push(item.itemId));
    return itemIds;
  }

  async getProductsById(idClient:string)
  {
    const ids=await this.getAllItemIds(idClient);
    console.log(JSON.stringify(ids))
    var items;
      try {
        const response$ = await this.httpService.get( this.CATALOG_SERVICE_URL+"/items?ids="+ids.join()).pipe(
            map(response => response.data)
        )
        items = await firstValueFrom(response$);
        console.log(items)

      }
      catch (e) {
        throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
      }
      return items;
  }
}
