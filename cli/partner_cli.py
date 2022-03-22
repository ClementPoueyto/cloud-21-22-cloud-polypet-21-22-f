import os
import sys
import requests
from datetime import date
from tabulate import tabulate
import json

COMMAND = ['signup','signin','addProduct','soldProduct','exit']
connect_string= "enter your company name:"
print("Welcome to the polypetPartner program")
#id = input(connect_string)
id=-1
name = ""
while True :
    command =input("type next command: ('command' to see the list of commands) : ") 
    if 'exit' == command.rstrip():
        break
    elif 'command' == command.rstrip():
        print("see the list of command:")
        for c in COMMAND :
            print(c)
            
    elif 'signin' == command.rstrip():
        name = input(connect_string)
        id = input('enter your company id : ')
        
    elif 'signup' == command.rstrip():
        request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/partner/add'
        partnername = input("enter name: ")
        password = input("enter password: ")
        print('choose a partner type beetween:')
        print("-\"BIG\" partner you manage the storage and delivery, small commision")
        print("-\"SMALL\" partner we manage the storage and delivery, average commission")
        type = input("enter your type: ")
        res = requests.post(request_url,json={'name':str(partnername),'password':str(password),'type':str(type)})
        id = res.text
        name = partnername
        print("id partner : ",res.text)
    elif id == -1:
        print("You need to be connect for accessing polypet")
    elif 'addProduct' == command.rstrip():
        request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/partner/addProduct'
        product_name = input("enter product name: ")
        labels = input("enter labels: ")
        use_description = input("enter use description: ")
        technical_description = input("enter technical description: ")
        price = input("enter price: ")
        if name==''or price=='' or labels=='' or use_description=='':
            print("missing informations")
        else:
            res = requests.post(request_url,json={'name': str(name), 'namePartner': str(name),'price': float(price),'quantity': 0,'lables': list(str(labels).split(",")),'use_description': str(use_description),'technical_description': str(technical_description)})
            print("product partner id : ",res.text)
    elif 'soldProduct' ==command.rstrip():
        request_url = 'https://cloud-polypet-team-f.oa.r.appspot.com/partner/sold'
        res = requests.get(request_url+'?partnerId='+str(id))
        print(res.text)
    else :
        print("command does not exist type \"command\" to see existing command")