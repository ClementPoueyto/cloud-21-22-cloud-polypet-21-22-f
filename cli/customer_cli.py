import os
import sys
import requests
import time
from datetime import date
from tabulate import tabulate
import json

def _print(product):
    product = item["product"]
    print(" ----------- ")
    print(" id : "+product["id"])
    print(" name : "+product["name"])
    if "description" in item:
        print(" description : "+product["description"])
    if "quantity" in item:
        print(" quantity : "+str(item["quantity"]))
    print(" unit price : "+str(product["price"]))
    if "type" in item:
        print(" type : "+product["type"])
    if "discount" in item:
        print(" discont : "+str(product["discount"]))
    print(" ----------- ")

def __print(item):
    print(" ----------- ")
    print(" id : "+item["id"])
    print(" name : "+item["name"])
    if "description" in item:
        print(" description : "+str(item["description"]))
    if "quantity" in item:
        print(" quantity : "+str(item["quantity"]))
    print(" unit price : "+str(item["price"]))
    if "informations" in item:
        print(" informations : "+str(item["informations"]))
    if "discount" in item:
        print(" discont : "+str(item["discount"]))
    print(" ----------- ")

COMMAND = ['add','remove','cart','search','validate','exit']
connect_string= "enter your user id:"
print("Welcome to polypet")
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
        idProduct = input("enter id item to add: ")
        if idProduct:
            quantity = input("enter quantity: ")
            request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/cart/update?id='+str(id)
            res = requests.post(request_url,json=[{'itemId': str(idProduct), 'quantity': int(quantity)}])
            print(res.text)
    elif 'remove' == command.rstrip():
        idProduct = input("enter id item to remove: ")
        if idProduct:
            quantity = input("enter quantity: ")
            request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/cart/update?id='+str(id)
            res = requests.post(request_url,json=[{'itemId': str(idProduct), 'quantity': -1*int(quantity)}])
            print(res.text)
    elif 'search' == command.rstrip():
        choice = input("search product by name(1) or by labels(2) or discount(3) or all(4):")
        if int(choice)==1 or int(choice)==2 or int(choice)==3 or int(choice)==4:
            if int(choice) ==1:
                param = input("enter name: ")
                request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/catalog/itemsFilters?name='+param
            if int(choice) ==2:
                param = input("enter labels: \nex : food,dog,cat :")
                request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/catalog/itemsFilters?labels='+param
            if int(choice) ==4:
                request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/catalog/itemsFilters'
            if int(choice) ==3:
                request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/catalog/discount'
            res = requests.get(request_url)
            
            for item in res.json():
                if int(choice)==3: 
                    _print(item)
                else:
                    print(" ----------- ")
                    print(" id : "+item["id"])
                    print(" name : "+item["name"])
                    if "description" in item:
                        print(" description : "+str(item["description"]))
                    if "quantity" in item:
                        print(" quantity : "+str(item["quantity"]))
                    print(" unit price : "+str(item["price"]))
                    if "informations" in item:
                        print(" informations : "+str(item["informations"]))
                    if "discount" in item:
                        print(" discont : "+str(item["discount"]))
                    print(" ----------- ")
        else:
            print("choice error")
        
    elif 'cart' == command.rstrip():
        request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/cart/items?id='+str(id)
        res = requests.get(request_url)
        i=0
        if res.json()["items"]!=[]:
            for item in res.json()["items"]:
                i=i+1
                __print(item)
            print("\ntotal price : "+str(res.json()["totalPrice"]))
        else:
            print("empty cart")
    elif 'validate' == command.rstrip():
        request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/cart/validation?id='+str(id)
        name = input("enter name: ")
        firstname = input("enter firstname: ")
        adress = input("enter adress: ")
        email = input("enter email: ")
        creditcard = input("enter creditcard: ")
        if name==''or firstname=='' or adress=='' or creditcard=='' or email=='':
            print("missing informations")
        else : 
            request_url2 = 'https://cloud-polypet-team-f.oa.r.appspot.com/notification/'+str(email)
            res = requests.post(request_url,json={'name': str(name), 'firstName': str(firstname),'address': str(adress),'email':str(email),'creditCard': str(creditcard)})
            print(res.text)
            res2 = requests.get(request_url2)
            print("Notification:\n\n"+res2.text+"\n")
    elif 'scenar' == command.rstrip():
        request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/cart/update?id='+'clement1'
        res = requests.post(request_url,json=[{'itemId': str('pqt7mvt19n6r9cc1dwMG'), 'quantity': int(10)}])
        time.sleep(1)
        request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/cart/validation?id='+str('clement1')
        res = requests.post(request_url,json={'name': str('clement'), 'firstName': str('poueyto'),'address': str('409 chemin du fort rouge'),'email':str('clement.poueyto@mail.com'),'creditCard': str('1234')})
        print(res.text)
        time.sleep(3)
        request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/analytics/aggregate-dayli-order?date=2021-11-19'
        res = requests.post(request_url)
        print(res)
        
    else :
        print("command does not exist type \"command\" to see existing command")
        