import os
import sys
import requests
from datetime import date
from tabulate import tabulate
import json

def _print(item):
    product = item["product"]
    print(" ----------- ")
    print(" id : "+product["id"])
    print(" name : "+product["name"])
    print(" description : "+product["description"])
    print(" quantity : "+str(item["quantity"]))
    print(" unit price : "+str(product["price"]))
    print(" type : "+product["type"])
    if "discount" in item:
        print(" discont : "+str(product["discount"]))
    print(" ----------- ")

COMMAND = ['add', 'discount', 'update','analytics','accept','acceptProduct','addStock','exit']
connect_string= "enter your user id:"
print("Welcome to polypet as marketing service")
id = input(connect_string)
while True :
    command =input("type next command: ('command' to see the list of commands) : ") 
    if 'exit' == command.rstrip():
        break
    elif 'command' == command.rstrip():
        print("see the list of command:")
        for c in COMMAND :
            print(c)
    elif 'add' == command.rstrip():
        productName = input("enter product name to add to catalog: ")
        productDescription = input("enter product description : ")
        productPrice = input("enter product price : ")
        productLabels = input("enter product labels : ")
        listRes = list(productLabels.split(" "))

        if productName !='' or productDescription !='' or productPrice != '':
            request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/catalog'
            res = requests.post(request_url,json={"quantity":0,"product":{'name': str(productName), 'description': str(productDescription),'price': int(productPrice), "informations": {"labels":productLabels}}})
            print(res.text)
        else:
            print("error product informations")
    elif 'update' == command.rstrip():
        idProduct = input("enter id item to update from catalog: ")
        if idProduct:
            productName = input("enter product name to add to catalog: ")
            productPrice = input("enter product price : ")
            productLabels = input("enter product labels : ")
            listRes = list(productLabels.split(" "))
            request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/catalog/update-product?id='+str(idProduct)
            res = requests.put(request_url,json={'name': str(productName), 'price': int(productPrice),'informations': {"labels":listRes}})
            print(res.text)
    elif 'discount' == command.rstrip():
        idProduct = input("enter id item to add discount : ")
        if idProduct:
            choice = input("percentage(1) or price(2) : ")
            if choice =='2':
                price = input("enter new price : ")
                request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/catalog/discount?id='+str(idProduct)
                res = requests.put(request_url,json={'priceAfterReduction': str(price), "end": "2023-10-06"})
            if choice =='1':
                percentage = input("enter percentage : ")
                request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/catalog/discount?id='+str(idProduct)
                res = requests.put(request_url,json={'percentage': str(percentage), "end": "2023-10-06"})
            print(res.text)
    elif 'analytics' == command.rstrip():
        day = input("enter day to get visit on products (YYYY-MM-DD) : ")
        if day:
            choice = input("visits(1) sold(2) : ")
            if choice == '1':
                request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/analytics/products-visit?day='+str(day)
            if choice =='2':
                request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/analytics/products-sold?day='+str(day)
            res = requests.get(request_url)
            print(res.text)
    elif 'accept' == command.rstrip():
        name = input("enter name: ")
        request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/partner/accept?name='+str(name)
        res = requests.put(request_url)

    elif 'acceptProduct' == command.rstrip():
        product_id = input("enter product id : ")
        request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/partner/validateProduct?ProductId='+str(product_id)
        res = requests.put(request_url)
        print("productId:",res.text)
    elif 'addStock' == command.rstrip():
        product_id =input("enter product id : ")
        stock = input("quantity added : ")
        request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/catalog/add-to-stock?id='+str(product_id)+'&quantity='+str(stock)
        res = requests.put(request_url)
        print(res.text)
        